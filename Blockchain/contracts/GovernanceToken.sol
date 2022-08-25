// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/// @title Governance token
/// @notice This token contract creates the governance token for the DAO
/// @dev ERC20 standard compliant
contract GovernanceToken is ERC20, ERC20Burnable, AccessControl, ERC20Permit, ERC20Votes {
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

  address private daoAddress;

  constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) ERC20Permit(_name) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(MINTER_ROLE, msg.sender);
    _grantRole(BURNER_ROLE, msg.sender);
  }

  function mint(address to, uint256 amount) public {
    _mint(to, amount);
  }

  function burn(address account, uint256 amount) public {
    _burn(account, amount);
  }

  function _afterTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal override(ERC20, ERC20Votes) {
    super._afterTokenTransfer(from, to, amount);
  }

  function _mint(address to, uint256 amount)
    internal
    override(ERC20, ERC20Votes)
    onlyRole(MINTER_ROLE)
  {
    super._mint(to, amount);
  }

  function _burn(address account, uint256 amount)
    internal
    override(ERC20, ERC20Votes)
    onlyRole(BURNER_ROLE)
  {
    super._burn(account, amount);
  }

  /// @dev The deployer of the contract chooses the minter and burner accounts
  /// In our deployment script, the deployer is the minter and the DAO contract the burner
  function setRoles(address _minter, address _daoAddress) public onlyRole(DEFAULT_ADMIN_ROLE) {
    require(_daoAddress != address(0));
    daoAddress = _daoAddress;
    _grantRole(MINTER_ROLE, _minter);
    _grantRole(BURNER_ROLE, _daoAddress);
  }
}
