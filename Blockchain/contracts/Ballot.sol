// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
/// @dev local contracts
import {GovernanceToken} from "./GovernanceToken.sol";
import {NFTContract} from "./NFTContract.sol";

interface IERC20Votes {
  function getPastVotes(address, uint256) external view returns (uint256);
}

/// @dev custom errors
error Ballot__Ipfs_CIDs_CollectionSize_Mismatch();

contract Ballot is KeeperCompatibleInterface, NFTContract {
  using Strings for uint256;

  // This declares a new complex type which will
  // be used for variables later.
  // It will represent a single voter.
  struct Voter {
    bool voted; // if true, that person already voted
    address delegate; // person delegated to
    uint256 vote; // index of the voted proposal
  }

  // This is a type for a single proposal.
  struct Proposal {
    uint256 index; // index for the NFT collection
    uint256 voteCount; // number of accumulated votes
    uint256 collectionSize; // number of items in collection starting from 0
    bool active; // the proposal is still being voted on
    string ipfsFolderCID;
  }

  mapping(address => Voter) public voters;
  // mapping to link the proposalIndex to its voters
  mapping(uint256 => address[]) public proposalVoters;

  Proposal[] public proposals;
  IERC20Votes public voteToken;
  uint256 public referenceBlock;
  /**
   * Use an interval in seconds and a timestamp to slow execution of Upkeep
   */
  uint256 public immutable interval;
  uint256 public immutable ethereumBase = 10**18;
  uint256 public lastTimeStamp;
  GovernanceToken public governanceTokenContract;

  event UpkeepPerformed(
    uint256 winningProposal,
    uint256 winningProposalVoteCount,
    uint256 winningProposalCollectionSize,
    string winningProposalIPFSFolderCID
  );

  constructor(
    address _voteToken,
    string[] memory _ipfsFolderCIDs,
    uint256[] memory _collectionsSize
  ) {
    if (_ipfsFolderCIDs.length != _collectionsSize.length)
      revert Ballot__Ipfs_CIDs_CollectionSize_Mismatch();

    interval = 1 minutes; // for testing purposes
    lastTimeStamp = block.timestamp;
    governanceTokenContract = GovernanceToken(_voteToken);
    // mint governance tokens for the chaiperson
    governanceTokenContract.mint(msg.sender, 1000 * ethereumBase);
    voteToken = IERC20Votes(_voteToken);
    referenceBlock = block.number;

    for (uint256 i = 0; i < _ipfsFolderCIDs.length; i++) {
      proposals.push(
        Proposal({
          index: i,
          voteCount: 0,
          active: true,
          ipfsFolderCID: _ipfsFolderCIDs[i],
          collectionSize: _collectionsSize[i]
        })
      );
    }
  }

  // Give `voter` the right to vote on this ballot by sending them governance tokens
  function giveRightToVote(address voter, uint256 amount) public {
    require(votingPower() > 0, "You need to have some governance tokens to send");
    governanceTokenContract.transfer(voter, amount);
  }

  /// Delegate your vote to the voter `to` in `amount` of tokens we delegate.
  function delegate(address to, uint256 amount) external {
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

    sender.voted = true;
    sender.delegate = to;
    if (delegate_.voted) {
      // If the delegate already voted,
      // directly add to the number of votes
      proposals[delegate_.vote].voteCount += votingPower();
    } else {
      // If the delegate did not vote yet,
      // add to her weight.
      giveRightToVote(to, amount);
    }
  }

  /// Give your vote (including votes delegated to you)
  /// to proposal `proposals[proposal].index`.
  function vote(uint256 proposal, uint256 amount) external {
    Voter storage sender = voters[msg.sender];
    require(proposals[proposal].active, "Proposal voting period ended");
    require(!sender.voted, "Already voted.");
    uint256 votingPowerAvailable = votingPower();
    uint256 votingPowerUsed = amount * ethereumBase;
    require(votingPowerAvailable >= votingPowerUsed, "Has not enough voting power");
    proposals[proposal].voteCount += amount;
    sender.voted = true;
    sender.vote = proposal;

    // Burn the governance tokens once the participant has voted
    governanceTokenContract.burn(msg.sender, votingPowerUsed);
    proposalVoters[proposal].push(msg.sender);
  }

  /// @dev Computes the winning proposal taking all
  /// previous votes into account.
  function getWinningProposal() public view returns (uint256 winningProposal_) {
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

  // Calls getWinningProposal() function to get the index
  // of the winner contained in the proposals array and then
  // returns the index of the winner
  function winnerIndex() external view returns (uint256 winnerIndex_) {
    winnerIndex_ = proposals[getWinningProposal()].index;
  }

  /// @dev the voting power has 18 decimal units
  function votingPower() public view returns (uint256 votingPower_) {
    votingPower_ = governanceTokenContract.balanceOf(msg.sender);
  }

  // TODO
  // Chainlink Keepers will check the winningProposal after the votingPeriod has passed
  /// @dev this method is called by the keepers to check if `performUpkeep` should be performed
  function checkUpkeep(bytes calldata)
    external
    view
    override
    returns (bool upkeepNeeded, bytes memory)
  {
    upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
  }

  function getVotersForProposal(uint256 index) public view returns (address[] memory) {
    return proposalVoters[index];
  }

  /// @dev this method is called by the keepers. It will mint the NFT collection (TODO)
  function performUpkeep(bytes calldata) external override {
    require((block.timestamp - lastTimeStamp) > interval, "The time to elapse hasn't been met.");

    lastTimeStamp = block.timestamp;
    Proposal storage winningProposal = proposals[getWinningProposal()];

    string memory prefix = string(abi.encodePacked("ipfs://", winningProposal.ipfsFolderCID));

    uint256 collectionLength = winningProposal.collectionSize;
    uint256 winningProposalIndex = winningProposal.index;
    // Close voting period for the winning proposal
    proposals[winningProposalIndex].active = false;

    for (uint256 i = 0; i < collectionLength; i++) {
      string memory suffix = string(abi.encodePacked(i.toString(), ".json"));
      string memory finalTokenUri = string(abi.encodePacked(prefix, suffix));
      for (uint256 j = 0; j < proposalVoters[winningProposalIndex].length; j++) {
        safeMint(proposalVoters[winningProposalIndex][j], finalTokenUri);
      }
    }

    emit UpkeepPerformed(
      winningProposalIndex,
      winningProposal.voteCount,
      collectionLength,
      winningProposal.ipfsFolderCID
    );
  }
}
