// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title Proposal contract for the DAO
/// @notice This stores a nft collection of an artist to be proposed and vote upon by the DAO
contract Proposal is Ownable {
    string private s_name; // collectionName
    string[] private collectionData; // ipfs metadata

    /// @dev emitted when collection data is added
    event DataAdded(string indexed name, string data);

    constructor(string memory _name) {
        s_name = _name;
    }

    /// @dev add new data to the collection
    function add(string memory _collectionMetadata) public onlyOwner {
        collectionData.push(_collectionMetadata);

        emit DataAdded(s_name, _collectionMetadata);
    }

    /// @dev set the name of the collection
    function setName(string memory _name) public onlyOwner {
        s_name = _name;
    }

    /// @dev fetch collection name
    function getName() public view returns (string memory) {
        return s_name;
    }

    /// @dev fetch all data from the collection
    function getCollectionData() public view returns (string[] memory) {
        return collectionData;
    }

    /// @dev fetch single data from the collection
    function getData(uint256 _index) public view returns (string memory) {
        return collectionData[_index];
    }
}
