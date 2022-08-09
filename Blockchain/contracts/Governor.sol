// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

import {NFTContract} from "./NFTContract.sol";
import {Ballot} from "./Ballot.sol";
import {GovernanceToken} from "./GovernanceToken.sol";

error Governor__CurrentBallotNotFinished();
error Governor__OnlyTokenHolder();

contract Governor is NFTContract {
  using Counters for Counters.Counter;

  Counters.Counter private currentBallotId;
  GovernanceToken public voteToken;
  Ballot private ballot;
  address[] public pastBallots;

  modifier onlyTokenHolder() {
    if (voteToken.balanceOf(msg.sender) == 0) {
      revert Governor__OnlyTokenHolder();
    }
    _;
  }

  constructor(address _voteToken) {
    voteToken = GovernanceToken(_voteToken);
  }

  function createNewBallot(string[] memory _ipfsFolderCIDs, uint256[] memory _collectionsSize)
    public
  {
    if (!ballot.hasVotingFinished()) {
      revert Governor__CurrentBallotNotFinished();
    }

    pastBallots.push(address(ballot));

    currentBallotId.increment(); // start at 1

    ballot = new Ballot(address(voteToken), _ipfsFolderCIDs, _collectionsSize);
  }
}
