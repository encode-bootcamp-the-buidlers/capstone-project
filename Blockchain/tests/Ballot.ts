import { expect } from "chai"
import { Signer, utils } from "ethers"
import { deployments, ethers, getNamedAccounts } from "hardhat"
import { ballotConfig } from "../hardhat-helper-config"
import { Ballot } from "../typechain-types/contracts/Ballot.sol"
import { GovernanceToken } from "../typechain-types/contracts/GovernanceToken"
import { increaseTime } from "../utils/test"

let ballot: any // Ballot
let tokenContract: any // GovernanceToken
let accounts: any[]

beforeEach(async () => {
  await deployments.fixture(["all"])
  accounts = await ethers.getSigners()

  const ballotContractFactory = await ethers.getContractFactory("Ballot")
  const tokenContractFactory = await ethers.getContractFactory("GovernanceToken")
  tokenContract = await tokenContractFactory.deploy("DAOs got talent", "DAOGT")
  ballot = await ballotContractFactory.deploy(
    tokenContract.address,
    ballotConfig.ipfsFolderCIDs,
    ballotConfig.collectionsSize,
    ballotConfig.quorum
  )
  await tokenContract.deployed()
  await ballot.deployed()
})

async function vote(ballot: Ballot, signer: Signer, proposal: number, amount?: number) {
  const tx = await ballot.connect(signer).vote(proposal, amount || 1)
  await tx.wait()
}

async function winningProposal(ballot: Ballot) {
  return await ballot.getWinningProposal()
}

async function reachMinimumQuorum() {
  await tokenContract.connect(accounts[1]).mint(accounts[1].address, utils.parseEther("10"))
  await tokenContract.connect(accounts[2]).mint(accounts[2].address, utils.parseEther("10"))

  await vote(ballot, accounts[0], 2)
  await vote(ballot, accounts[1], 2)
  await vote(ballot, accounts[2], 2)
}

describe("Ballot", async () => {
  describe("basic functionality", () => {
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
          ballotConfig.quorum,
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
          ballotConfig.quorum,
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
          await tokenContract.connect(accounts[1]).mint(accounts[1].address, utils.parseEther("10"))
          await tokenContract.connect(accounts[2]).mint(accounts[2].address, utils.parseEther("10"))
          await tokenContract.connect(accounts[3]).mint(accounts[3].address, utils.parseEther("10"))
          await tokenContract.connect(accounts[4]).mint(accounts[4].address, utils.parseEther("10"))

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

      it("doesn't trigger checkUpkeep when quorum not reached yet", async () => {
        await increaseTime((await ballot.interval()).toNumber())

        const [upkeepNeeded] = await ballot.checkUpkeep([])
        expect(upkeepNeeded).to.equal(false)
      })

      it("triggers checkUpkeep when interval time is reached and quorum is met", async () => {
        await reachMinimumQuorum()

        await increaseTime((await ballot.interval()).toNumber())

        const [upkeepNeeded] = await ballot.checkUpkeep([])
        expect(upkeepNeeded).to.equal(true)
      })

      it("should not be able to call performUpkeep if not in keeper registry", async () => {
        await expect(ballot.performUpkeep([])).to.be.revertedWithCustomError(
          ballot,
          "OnlyKeeperRegistry"
        )
      })

      it("should not be able to call performUpkeep and mint if time constraint is not met", async () => {
        await ballot.setKeeperRegistryAddress(accounts[0].address)
        await expect(ballot.performUpkeep([])).to.be.revertedWith(
          "The time to elapse and/or quorum hasn't been met."
        )
      })

      it("can performUpkeep and mint", async () => {
        let balance = (await ballot.balanceOf(accounts[0].address)).toString()
        expect(balance).to.equal("0")
        await expect(ballot.ownerOf(0)).to.be.revertedWith("ERC721: invalid token ID")

        // All these indexes start from 0 and the first proposal with most votes is the winning proposal
        // so, if vote counts is 0 for all proposals, still the first proposal is the winning one
        const winnerIndex = await winningProposal(ballot)
        expect(winnerIndex.toString()).to.equal("0")

        await reachMinimumQuorum()
        await increaseTime()

        const proposalToVote = 2
        const proposalVoteCount = 3
        const totalVotes = 3
        const proposalFolderCid = ballotConfig.ipfsFolderCIDs[proposalToVote]
        const collectionSize = ballotConfig.collectionsSize[proposalToVote].toString()

        await ballot.setKeeperRegistryAddress(accounts[0].address)

        const tx = await ballot.performUpkeep([])
        await tx.wait()
        await expect(tx)
          .to.emit(ballot, "UpkeepPerformed")
          .withArgs(
            proposalToVote,
            proposalVoteCount,
            totalVotes,
            collectionSize,
            proposalFolderCid
          )

        const totalSupply = (await ballot.totalSupply()).toString()
        expect(totalSupply).to.equal(`${3 * +collectionSize}`)

        expect(await ballot.ownerOf(0)).to.be.equal(accounts[0].address)

        const tokenURI = (await ballot.tokenURI(0)).toString()
        expect(tokenURI).to.equal(`ipfs://${proposalFolderCid}0.json`)

        expect((await ballot.getTotalVotes()).toString()).to.equal(`${totalVotes}`)
      })
    })

    it("should mint the tokens to addresses that voted for the winning proposal", async () => {
      await tokenContract.connect(accounts[1]).mint(accounts[1].address, utils.parseEther("10"))
      await tokenContract.connect(accounts[2]).mint(accounts[2].address, utils.parseEther("10"))
      await tokenContract.connect(accounts[3]).mint(accounts[3].address, utils.parseEther("10"))
      await tokenContract.connect(accounts[4]).mint(accounts[4].address, utils.parseEther("10"))

      await vote(ballot, accounts[0], 1)
      await vote(ballot, accounts[1], 1)
      await vote(ballot, accounts[2], 1)
      await vote(ballot, accounts[3], 2)
      await vote(ballot, accounts[4], 2)

      await increaseTime()

      await ballot.setKeeperRegistryAddress(accounts[0].address)

      const winningProposal = 1

      const tx = await ballot.performUpkeep([])
      await tx.wait()
      await expect(tx)
        .to.emit(ballot, "UpkeepPerformed")
        .withArgs(winningProposal, 3, 5, 6, ballotConfig.ipfsFolderCIDs[1])

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
})
