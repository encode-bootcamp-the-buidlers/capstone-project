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
error OnlyKeeperRegistry();

contract Ballot is KeeperCompatibleInterface, NFTContract {
  using Strings for uint256;

  // This declares a new complex type which will
  // be used for variables later.
  // It will represent a single voter.
  struct Voter {
    bool voted; // if true, that person already voted
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

  uint256 private totalVotes = 0;
  mapping(address => Voter) public voters;
  // mapping to link the proposalIndex to its voters
  mapping(uint256 => address[]) public proposalVoters;

  Proposal[] public proposals;
  IERC20Votes public voteToken;
  string[] public collectionTokenUris;
  uint256 public referenceBlock;
  uint256 private quorum;
  uint256 public totalVoteCount;
  uint256[] public votePercentages;

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
    uint256 totalVotes,
    uint256 winningProposalCollectionSize,
    string winningProposalIPFSFolderCID
  );

  address private keeperRegistryAddress;

  modifier onlyKeeperRegistry() {
    if (msg.sender != keeperRegistryAddress) {
      revert OnlyKeeperRegistry();
    }
    _;
  }

  constructor(
    address _voteToken,
    string[] memory _ipfsFolderCIDs,
    uint256[] memory _collectionsSize,
    uint256 _quorum
  ) {
    if (_ipfsFolderCIDs.length != _collectionsSize.length)
      revert Ballot__Ipfs_CIDs_CollectionSize_Mismatch();

    interval = 1 minutes; // for testing purposes
    lastTimeStamp = block.timestamp;
    governanceTokenContract = GovernanceToken(_voteToken);
    voteToken = IERC20Votes(_voteToken);
    referenceBlock = block.number;

    quorum = _quorum;

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

  /// Give your vote to proposal `proposals[proposal].index`.
  function vote(uint256 proposal, uint256 amount) external {
    Voter storage sender = voters[msg.sender];
    require(proposals[proposal].active, "Proposal voting period ended");
    require(!sender.voted, "Already voted.");
    uint256 votingPowerAvailable = votingPower();
    uint256 votingPowerUsed = amount * ethereumBase;
    require(votingPowerAvailable >= votingPowerUsed, "Has not enough voting power");
    proposals[proposal].voteCount += amount;
    totalVoteCount += proposals[proposal].voteCount;
    sender.voted = true;
    sender.vote = proposal;
    totalVotes += amount;

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

  // Chainlink Keepers will check the winningProposal after the votingPeriod has passed
  /// @dev this method is called by the keepers to check if `performUpkeep` should be performed
  function checkUpkeep(bytes memory)
    public
    view
    override
    returns (bool upkeepNeeded, bytes memory)
  {
    bool timeReached = (block.timestamp - lastTimeStamp) > interval;
    bool quorumReached = totalVotes >= quorum;
    upkeepNeeded = timeReached && quorumReached;
  }

  function getVotersForProposal(uint256 index) public view returns (address[] memory) {
    return proposalVoters[index];
  }

  /// @dev this method is called by the keepers. It will mint the NFT collection
  function performUpkeep(bytes calldata) external override onlyKeeperRegistry {
    (bool upkeepNeeded, ) = checkUpkeep("");
    require(upkeepNeeded, "The time to elapse and/or quorum hasn't been met.");

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
        collectionTokenUris.push(finalTokenUri);
      }
    }

    emit UpkeepPerformed(
      winningProposalIndex,
      winningProposal.voteCount,
      totalVotes,
      collectionLength,
      winningProposal.ipfsFolderCID
    );
  }

  function setKeeperRegistryAddress(address _keeperRegistryAddress)
    public
    onlyRole(DEFAULT_ADMIN_ROLE)
  {
    require(_keeperRegistryAddress != address(0));
    keeperRegistryAddress = _keeperRegistryAddress;
    _grantRole(MINTER_ROLE, keeperRegistryAddress);
  }

  function getTotalVotes() public view returns (uint256) {
    return totalVotes;
  }

  function getQuorum() public view returns (uint256) {
    return quorum;
  }

  function getAllProposals() public view returns (Proposal[] memory) {
    return proposals;
  }

  /// @dev currently only one collection
  function getAccountCollections() public view returns (string[] memory) {
    Proposal storage winningProposal = proposals[getWinningProposal()];
    require(!winningProposal.active, "Voting is still ongoing");
    require(
      voters[msg.sender].vote == winningProposal.index,
      "Voter didn't vote for the winning proposal. Therefore, won nothing"
    );
    return collectionTokenUris;
  }

  /// @dev another FE helper function. Return vote percentage for each proposal
  function getVotePercentages() public returns (uint256[] memory) {
    for (uint256 i = 0; i < proposals.length; i++) {
      // HACK: Solidity doesn't support working with decimals. So we multiply by 10000
      votePercentages.push((proposals[i].voteCount * 10000) / totalVoteCount);
    }
    return votePercentages;
  }
}
