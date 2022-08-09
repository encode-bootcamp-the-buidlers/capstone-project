import { expect } from "chai"
import { Signer } from "ethers"
import { deployments, ethers, getNamedAccounts } from "hardhat"
import { ballotConfig } from "../hardhat-helper-config"
import { Ballot } from "../typechain-types/contracts/Ballot.sol"
import { GovernanceToken } from "../typechain-types/contracts/GovernanceToken"
import { increaseTime } from "../utils/test"

let ballot: Ballot
let tokenContract: any
let accounts: any[]

beforeEach(async () => {
  await deployments.fixture(["all"])
  accounts = await ethers.getSigners()

  ballot = await ethers.getContract("Ballot")
  const tokenContractFactory = await ethers.getContractFactory("GovernanceToken")
  tokenContract = await tokenContractFactory.deploy("DAO got talent", "DAOGT")
  await tokenContract.deployed()
  await tokenContract.connect(accounts[0]).mint(accounts[0].address, 1000)
})

async function vote(ballot: Ballot, signer: Signer, proposal: number, amount?: number) {
  const tx = await ballot.connect(signer).vote(proposal, amount || 10)
  await tx.wait()
}

async function winningProposal(ballot: Ballot) {
  return await ballot.getWinningProposal()
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

  describe("when the voter interacts with the vote function in the contract", function () {
    it("shouldn't vote due to lack of tokens", async function () {
      await expect(vote(ballot, accounts[1], 0)).to.be.revertedWith("Has not enough voting power")
    })

    it("should not have voted already", async function () {
      await vote(ballot, accounts[0], 0)
      await expect(vote(ballot, accounts[0], 1)).to.be.revertedWith("Already voted.")
    })

    it("should increase the proposal voters for the voted proposal", async () => {
      const proposalVotersBefore = await ballot.getVotersForProposal(0)
      expect(proposalVotersBefore.length).to.eq(0)

      await vote(ballot, accounts[0], 0)

      const proposalVotersAfter = await ballot.getVotersForProposal(0)
      expect(proposalVotersAfter.length).to.eq(1)
    })

    describe("when an attacker interacts with the vote function in the contract", function () {
      describe("and the proposal does not exist", function () {
        it("should revert all the state changes", async function () {
          await expect(vote(ballot, accounts[0], 1337)).to.be.reverted
        })
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
        await tokenContract.connect(accounts[1]).mint(accounts[1].address, 100)
        await tokenContract.connect(accounts[2]).mint(accounts[2].address, 100)
        await tokenContract.connect(accounts[3]).mint(accounts[3].address, 100)
        await tokenContract.connect(accounts[4]).mint(accounts[4].address, 100)

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

    it("doesn't trigger checkUpkeefp when interval time not reached yet 2", async () => {
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

  it("should mint the tokens to addresses that voted for the winning proposal", async () => {
    await tokenContract.connect(accounts[1]).mint(accounts[1].address, 100)
    await tokenContract.connect(accounts[2]).mint(accounts[2].address, 100)
    await tokenContract.connect(accounts[3]).mint(accounts[3].address, 100)
    await tokenContract.connect(accounts[4]).mint(accounts[4].address, 100)

    await vote(ballot, accounts[0], 1)
    await vote(ballot, accounts[1], 1)
    await vote(ballot, accounts[2], 1)
    await vote(ballot, accounts[3], 2)
    await vote(ballot, accounts[4], 2)

    await increaseTime()

    const tx = await ballot.performUpkeep([])
    await tx.wait()
    await expect(tx)
      .to.emit(ballot, "UpkeepPerformed")
      .withArgs(1, 3, 6, ballotConfig.ipfsFolderCIDs[1])

    const balanceAccountZero = await ballot.balanceOf(accounts[0].address)
    expect(balanceAccountZero).to.eq(6)
    const balanceAccountOne = await ballot.balanceOf(accounts[1].address)
    expect(balanceAccountOne).to.eq(6)
    const balanceAccountTwo = await ballot.balanceOf(accounts[2].address)
    expect(balanceAccountTwo).to.eq(6)
    const balanceAccountThree = await ballot.balanceOf(accounts[3].address)
    expect(balanceAccountThree).to.eq(0)
    const balanceAccountFour = await ballot.balanceOf(accounts[4].address)
    expect(balanceAccountFour).to.eq(0)
  })
})
