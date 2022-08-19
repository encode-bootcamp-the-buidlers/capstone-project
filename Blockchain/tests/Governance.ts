import { assert } from "chai"
import { deployments, ethers } from "hardhat"
import { ballotConfig } from "../hardhat-helper-config"
import { GovernanceToken } from "../typechain-types/contracts/GovernanceToken"

describe("GovernanceToken", async () => {
  let governanceToken: GovernanceToken

  beforeEach(async () => {
    await deployments.fixture(["token"])
    governanceToken = await ethers.getContract("GovernanceToken")
  })

  describe("When X does Y", function () {
    it("can do miracles", async () => {
      assert.equal(0, 0)
    })
  })
})
