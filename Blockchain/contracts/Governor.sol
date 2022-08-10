// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import {NFTContract} from "./NFTContract.sol";
import {Ballot} from "./Ballot.sol";
import {GovernanceToken} from "./GovernanceToken.sol";

error Governor__CurrentBallotNotFinished();
error Governor__OnlyTokenHolder();

contract Governor is NFTContract, Ownable {
  using Counters for Counters.Counter;

  Counters.Counter private currentBallotId;
  GovernanceToken public voteToken;
  Ballot private ballot;
  address[] public pastBallots;

  constructor(address _voteToken) {
    voteToken = GovernanceToken(_voteToken);
  }

  function createNewBallot(
    string[] memory _ipfsFolderCIDs,
    uint256[] memory _collectionsSize,
    uint256 _quorum
  ) public onlyOwner {
    bool hasBallot = address(ballot) != address(0);

    if (hasBallot && !ballot.hasVotingFinished()) {
      revert Governor__CurrentBallotNotFinished();
    }

    if (hasBallot) {
      pastBallots.push(address(ballot));
    }

    currentBallotId.increment(); // start at 1

    ballot = new Ballot(address(voteToken), _ipfsFolderCIDs, _collectionsSize, _quorum);
  }

  function getCurrentBallotId() public view returns (uint256) {
    return currentBallotId.current();
  }

  function getCurrentBallotAddress() public view returns (address) {
    return address(ballot);
  }
}
