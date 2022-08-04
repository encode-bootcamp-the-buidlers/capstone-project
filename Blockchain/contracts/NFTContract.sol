// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title Goat nft collection
/// @author The Buidlers
/// @notice This collection is part of a student homework project and must be treated as such.
/// @dev This smart contract was created with OpenZeppelin's wizard: https://docs.openzeppelin.com/contracts/4.x/wizard
contract NFTContract is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Ownable {
  /**
   * @dev The NFTContract inherits from multiple ERC interfaces
   * ERC721:           The ERC non-fungible token standard, https://eips.ethereum.org/EIPS/eip-721
   * ERC721Enumerable: Allows enumerating the tokens on chain
   * ERC721URIStorage: A more flexible but more expensive way of storing metadata
   * ERC721Burnable:   A way for token holders to burn their own tokens
   **/

  /// @dev Counters are used for keeping record of the Id of NFT minted
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;

  constructor() ERC721("NFTContract", "NFT") {}

  /// @dev safeMint mints an NFT token to the requesting user's address
  /// @param to mint to address, @param uri is the ipfs location of metadata of the minted NFT
  function safeMint(address to, string memory uri) public onlyOwner {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);
  }

  /// @dev The following functions are overrides required by Solidity.
  /// @param from address of the seller, @param to address of buyer or new owner, @param tokenId is the token id of the nft in transaction
  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  /// @notice burn = destroy the token
  /// @param tokenId is the token id of the nft in transaction
  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  /// @param tokenId is the token id of the nft in transaction
  /// @return returns the API endpoint to get NFT's metadata
  function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
  {
    return super.tokenURI(tokenId);
  }

  /// @return supportsInterface boolean to determine if it implements an interface you can use.
  /// @param interfaceId is the id of the interface to check against, example EIP165 is 0x01ffc9a7
  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
