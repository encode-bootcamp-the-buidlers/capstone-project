import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
// import with your contract names to test
// import {  } from "../typechain";

// Contract name to test
describe("", function () {
    let accounts: SignerWithAddress[];

    beforeEach(async () => {
        const accounts = ethers.getSigners();
        // Get all contracts factories you will need for this suite
        const [ contractFactory ] =  await Promise.all([
            ethers.getContractFactory(""),
        ]);
    });
    describe("When X does Y", function() {
        it("", async () => {
            // TODO
        });
    
        it("", async () => {
            // TODO
        });
    
        it("", async () => {
            // TODO
        });
    
    });
});