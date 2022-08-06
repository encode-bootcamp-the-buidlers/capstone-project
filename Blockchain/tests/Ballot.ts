import { expect } from "chai"
import { Signer } from "ethers"
import { deployments, ethers, getNamedAccounts } from "hardhat"
import { ballotConfig } from "../hardhat-helper-config"
import { Ballot } from "../typechain-types/contracts/Ballot.sol"
import { increaseTime } from "../utils/test"

let ballot: Ballot
let accounts: any[]

beforeEach(async () => {
  await deployments.fixture(["all"])
  accounts = await ethers.getSigners()

  ballot = await ethers.getContract("Ballot")
})

async function giveRightToVote(ballot: Ballot, voterAddress: any, signer?: Signer) {
  const tx = signer
    ? await ballot.connect(signer).giveRightToVote(voterAddress)
    : await ballot.giveRightToVote(voterAddress)
  await tx.wait()
}

async function vote(ballot: Ballot, signer: Signer, proposal: number) {
  const tx = await ballot.connect(signer).vote(proposal)
  await tx.wait()
}

async function delegate(ballot: Ballot, signer: Signer, to: string) {
  const tx = await ballot.connect(signer).delegate(to)
  await tx.wait()
}

async function winningProposal(ballot: Ballot) {
  return await ballot.winningProposal()
}

describe("Ballot", async () => {
  it("has the provided proposals setup correctly", async function () {
    for (let index = 0; index < ballotConfig.ipfsFolderCIDs.length; index++) {
      const proposal = await ballot.proposals(index)
      expect(proposal.index.toNumber()).to.eq(index)
      expect(proposal.voteCount.toNumber()).to.eq(0)
      expect(proposal.collectionSize.toNumber()).to.eq(ballotConfig.collectionsSize[index])
      expect(proposal.active).to.eq(true)
      expect(proposal.ipfsFolderCID).to.eq(ballotConfig.ipfsFolderCIDs[index])
    }
  })

  it("doesn't deploy if it has a cids and collection size mismatch", async () => {
    const { deployer } = await getNamedAccounts()

    const governanceTokenAddress = (await deployments.get("GovernanceToken")).address

    let tx = deployments.deploy("Ballot", {
      from: deployer,
      args: [
        governanceTokenAddress,
        ballotConfig.ipfsFolderCIDs,
        [...ballotConfig.collectionsSize, 5],
      ],
      log: true,
    })

    await expect(tx).to.be.reverted

    tx = deployments.deploy("Ballot", {
      from: deployer,
      args: [
        governanceTokenAddress,
        [...ballotConfig.ipfsFolderCIDs, "Qxxxxxx"],
        ballotConfig.collectionsSize,
      ],
      log: true,
    })
    await expect(tx).to.be.reverted
  })

  it("sets the deployer address as chairperson", async function () {
    const chairperson = await ballot.chairperson()
    const deployer = await ethers.getNamedSigner("deployer")
    expect(chairperson).to.eq(deployer.address)
  })

  it("sets the voting weight for the chairperson as 1", async function () {
    const chairpersonVoter = await ballot.voters(accounts[0].address)
    expect(chairpersonVoter.weight.toNumber()).to.eq(1)
  })

  describe("when the chairperson interacts with the giveRightToVote function in the contract", function () {
    it("gives right to vote for another address", async function () {
      const voterAddress = accounts[1].address
      const tx = await ballot.giveRightToVote(voterAddress)
      await tx.wait()
      const voter = await ballot.voters(voterAddress)
      expect(voter.weight.toNumber()).to.eq(1)
    })

    it("can not give right to vote for someone that has voted", async function () {
      const voterAddress = accounts[1].address
      await giveRightToVote(ballot, voterAddress)
      await ballot.connect(accounts[1]).vote(0)
      await expect(giveRightToVote(ballot, voterAddress)).to.be.revertedWith(
        "The voter already voted."
      )
    })

    it("can not give right to vote for someone that already has voting rights", async function () {
      const voterAddress = accounts[1].address
      await giveRightToVote(ballot, voterAddress)
      await expect(giveRightToVote(ballot, voterAddress)).to.be.reverted
    })
  })

  describe("when the voter interacts with the vote function in the contract", function () {
    it("should has the right to vote", async function () {
      await expect(vote(ballot, accounts[1], 0)).to.be.revertedWith("Has no right to vote")
    })

    it("should not have voted already", async function () {
      await vote(ballot, accounts[0], 0)
      await expect(vote(ballot, accounts[0], 1)).to.be.revertedWith("Already voted.")
    })

    describe("when the voter interacts with the delegate function in the contract", function () {
      it("should has not already voted", async function () {
        await vote(ballot, accounts[0], 0)
        await expect(delegate(ballot, accounts[0], accounts[1].address)).to.be.revertedWith(
          "You already voted."
        )
      })

      it("can not self-delegate", async function () {
        await expect(delegate(ballot, accounts[0], accounts[0].address)).to.be.revertedWith(
          "Self-delegation is disallowed."
        )
      })
    })

    describe("when an attacker interacts with the giveRightToVote function in the contract", function () {
      it("can not give voting rights", async function () {
        await expect(giveRightToVote(ballot, accounts[2].address, accounts[1])).to.be.revertedWith(
          "Only chairperson can give right to vote."
        )
      })
    })

    describe("when an attacker interacts with the vote function in the contract", function () {
      describe("and the proposal does not exist", function () {
        it("should revert all the state changes", async function () {
          await expect(vote(ballot, accounts[0], 1337)).to.be.reverted
        })
      })
    })

    describe("when an attacker interacts with the delegate function in the contract", function () {
      it("can not produce loop in delegation", async function () {
        await giveRightToVote(ballot, accounts[1].address)
        await delegate(ballot, accounts[0], accounts[1].address)
        await expect(delegate(ballot, accounts[1], accounts[0].address)).to.be.revertedWith(
          "Found loop in delegation."
        )
      })
    })

    describe("when someone interacts with the winnerIndex function before any votes are cast", function () {
      it("should return the index of the first proposal", async function () {
        const winnerIndex = await ballot.winnerIndex()
        expect(winnerIndex).to.eq(0)
      })
    })

    describe("when someone interacts with the winnerIndex function after one vote is cast for the first proposal", function () {
      it("should set the index of the first proposal as the winning proposal", async function () {
        const proposals = await ballot.proposals
        await vote(ballot, accounts[0], 0)
        const winnerIndex = await ballot.winnerIndex()
        expect(winnerIndex).to.eq(0)
      })
    })

    describe("when someone interacts with the winnerIndex function after 5 random votes are cast for the proposals", function () {
      it("should return the index of the proposal with highest votes count", async function () {
        await giveRightToVote(ballot, accounts[1].address)
        await giveRightToVote(ballot, accounts[2].address)
        await giveRightToVote(ballot, accounts[3].address)
        await giveRightToVote(ballot, accounts[4].address)

        // Proposal 2 should be the proposal with highest votes count
        await vote(ballot, accounts[0], 0)
        await vote(ballot, accounts[1], 1)
        await vote(ballot, accounts[2], 2)
        await vote(ballot, accounts[3], 2)
        await vote(ballot, accounts[4], 2)

        const winnerIndex = await ballot.winnerIndex()
        const indexWithHighestVotes = 2
        const proposal = await ballot.proposals(indexWithHighestVotes)

        expect(winnerIndex).to.eq(proposal.index)
        expect(proposal.voteCount).to.eq(3)
      })
    })
  })

  describe("keepers", () => {
    it("doesn't trigger checkUpkeep when interval time not reached yet", async () => {
      const [upkeepNeeded] = await ballot.checkUpkeep([])
      expect(upkeepNeeded).to.equal(false)
    })

    it("doesn't trigger checkUpkeep when interval time not reached yet 2", async () => {
      const seconds = (await ballot.interval()).toNumber() - 5 // 5 seconds before interval
      await increaseTime(seconds)

      const [upkeepNeeded] = await ballot.checkUpkeep([])
      expect(upkeepNeeded).to.equal(false)
    })

    it("triggers checkUpkeep when interval time is reached", async () => {
      await increaseTime((await ballot.interval()).toNumber())

      const [upkeepNeeded] = await ballot.checkUpkeep([])
      expect(upkeepNeeded).to.equal(true)
    })

    it("should not be able to call performUpkeep and mint if time constraint is not met", async () => {
      await expect(ballot.performUpkeep([])).to.be.revertedWith(
        "The time to elapse hasn't been met."
      )
    })

    it("can performUpkeep and mint", async () => {
      let balance = (await ballot.balanceOf(accounts[0].address)).toString()
      expect(balance).to.equal("0")
      await expect(ballot.ownerOf(0)).to.be.revertedWith("ERC721: invalid token ID")

      // All these indexes start from 0
      const proposalToVote = 1

      await vote(ballot, accounts[0], proposalToVote)
      const winnerIndex = await winningProposal(ballot)
      expect(winnerIndex.toString()).to.equal(proposalToVote.toString())

      await increaseTime()

      const proposalVoteCount = 1
      const proposalFolderCid = ballotConfig.ipfsFolderCIDs[proposalToVote]
      const collectionSize = ballotConfig.collectionsSize[proposalToVote].toString()

      const tx = await ballot.performUpkeep([])
      await tx.wait()
      await expect(tx)
        .to.emit(ballot, "UpkeepPerformed")
        .withArgs(proposalToVote, proposalVoteCount, collectionSize, proposalFolderCid)

      const totalSupply = (await ballot.totalSupply()).toString()
      expect(totalSupply).to.equal(collectionSize)

      balance = (await ballot.balanceOf(accounts[0].address)).toString()
      expect(balance).to.equal(collectionSize)
      expect(await ballot.ownerOf(0)).to.be.equal(accounts[0].address)

      const tokenURI = (await ballot.tokenURI(0)).toString()
      expect(tokenURI).to.equal(`ipfs://${proposalFolderCid}0.json`)
    })
  })
})
