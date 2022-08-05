// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
// local contracts
import {NFTContract} from "./NFTContract.sol";

interface IERC20Votes {
  function getPastVotes(address, uint256) external view returns (uint256);
}

contract Ballot is KeeperCompatibleInterface, NFTContract {
  // This declares a new complex type which will
  // be used for variables later.
  // It will represent a single voter.
  struct Voter {
    bool voted; // if true, that person already voted
    address delegate; // person delegated to
    uint256 weight; // weight is accumulated by delegation
    uint256 vote; // index of the voted proposal
  }

  // This is a type for a single proposal.
  struct Proposal {
    uint256 index; // index for the NFT collection
    uint256 voteCount; // number of accumulated votes
    bool active; // the proposal is still being voted on
    string ipfsFolderCID;
  }
  address public chairperson;

  mapping(address => Voter) public voters;
  mapping(address => uint256) public spentVotePower;

  Proposal[] public proposals;
  IERC20Votes public voteToken;
  uint256 public referenceBlock;
  /**
   * Use an interval in seconds and a timestamp to slow execution of Upkeep
   */
  uint256 public immutable interval;
  uint256 public lastTimeStamp;

  constructor(address _voteToken, string[] memory _ipfsFolderCIDs) {
    interval = 1 days; // 6575;
    chairperson = msg.sender;
    voters[chairperson].weight = 1;

    voteToken = IERC20Votes(_voteToken);
    referenceBlock = block.number;

    for (uint256 i = 0; i < _ipfsFolderCIDs.length; i++) {
      proposals.push(
        Proposal({index: i, voteCount: 0, active: true, ipfsFolderCID: _ipfsFolderCIDs[i]})
      );
    }
  }

  // Give `voter` the right to vote on this ballot.
  // May only be called by `chairperson`.
  function giveRightToVote(address voter) external {
    // If the first argument of `require` evaluates
    // to `false`, execution terminates and all
    // changes to the state and to Ether balances
    // are reverted.
    // This used to consume all gas in old EVM versions, but
    // not anymore.
    // It is often a good idea to use `require` to check if
    // functions are called correctly.
    // As a second argument, you can also provide an
    // explanation about what went wrong.
    require(msg.sender == chairperson, "Only chairperson can give right to vote.");
    require(!voters[voter].voted, "The voter already voted.");
    require(voters[voter].weight == 0);
    voters[voter].weight = 1;
  }

  /// Delegate your vote to the voter `to`.
  function delegate(address to) external {
    // assigns reference
    Voter storage sender = voters[msg.sender];
    require(!sender.voted, "You already voted.");

    require(to != msg.sender, "Self-delegation is disallowed.");

    // Forward the delegation as long as
    // `to` also delegated.
    // In general, such loops are very dangerous,
    // because if they run too long, they might
    // need more gas than is available in a block.
    // In this case, the delegation will not be executed,
    // but in other situations, such loops might
    // cause a contract to get "stuck" completely.
    while (voters[to].delegate != address(0)) {
      to = voters[to].delegate;

      // We found a loop in the delegation, not allowed.
      require(to != msg.sender, "Found loop in delegation.");
    }

    // Since `sender` is a reference, this
    // modifies `voters[msg.sender].voted`
    Voter storage delegate_ = voters[to];

    // Voters cannot delegate to wallets that cannot vote.
    require(delegate_.weight >= 1);
    sender.voted = true;
    sender.delegate = to;
    if (delegate_.voted) {
      // If the delegate already voted,
      // directly add to the number of votes
      proposals[delegate_.vote].voteCount += sender.weight;
    } else {
      // If the delegate did not vote yet,
      // add to her weight.
      delegate_.weight += sender.weight;
    }
  }

  /// Give your vote (including votes delegated to you)
  /// to proposal `proposals[proposal].index`.
  function vote(uint256 proposal) external {
    Voter storage sender = voters[msg.sender];
    require(proposals[proposal].active, "Proposal ended");
    require(!sender.voted, "Already voted.");
    require(sender.weight != 0, "Has no right to vote");
    spentVotePower[msg.sender] += voters[msg.sender].weight;
    sender.voted = true;
    sender.vote = proposal;

    // If `proposal` is out of the range of the array,
    // this will throw automatically and revert all
    // changes.
    proposals[proposal].voteCount += sender.weight;
    // TODO: we should burn the governance tokens once the participant has voted
    // For now, we simply set his weight/voting power to 0 (HACK)
    voters[msg.sender].weight = 0;
  }

  /// @dev Computes the winning proposal taking all
  /// previous votes into account.
  function winningProposal() public view returns (uint256 winningProposal_) {
    uint256 winningVoteCount = 0;
    // Gas optimization
    Proposal[] memory localProposals = proposals;
    for (uint256 p = 0; p < localProposals.length; p++) {
      if (localProposals[p].voteCount > winningVoteCount) {
        winningVoteCount = localProposals[p].voteCount;
        winningProposal_ = p;
      }
    }
  }

  // Calls winningProposal() function to get the index
  // of the winner contained in the proposals array and then
  // returns the index of the winner
  function winnerIndex() external view returns (uint256 winnerIndex_) {
    winnerIndex_ = proposals[winningProposal()].index;
  }

  function votingPower() public view returns (uint256 votingPower_) {
    votingPower_ = voteToken.getPastVotes(msg.sender, referenceBlock) - spentVotePower[msg.sender];
  }

  // TODO
  // Chainlink Keepers will check the winningProposal after the votingPeriod has passed
  /// @dev this method is called by the keepers to check if `performUpkeep` should be performed
  function checkUpkeep(
    bytes calldata /* checkData */
  )
    external
    view
    override
    returns (
      bool upkeepNeeded,
      bytes memory /* performData */
    )
  {
    upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
    // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
  }

  /// @dev this method is called by the keepers. It will mint the NFT collection (TODO)
  function performUpkeep(
    bytes calldata /* performData */
  ) external override {
    //We highly recommend revalidating the upkeep in the performUpkeep function
    if ((block.timestamp - lastTimeStamp) > interval) {
      lastTimeStamp = block.timestamp;
      // TODO. Mint 10 NFTs for the collection
      for (uint256 i = 0; i < 10; i++) {
        NFTContract.safeMint(chairperson, string(abi.encodePacked("ipfsurl", Strings.toString(i))));
      }
      // TODO. Need to pass the correct proposal index
      proposals[0].active = false;
    }
    // We don't use the performData in this example. The performData is generated by the Keeper's call to your checkUpkeep function
  }
}
