pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Pausable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title RakunCoin
 * @dev extends Pausable, Mintable, Ownable
 */
contract RakunCoin is ERC20, ERC20Detailed, ERC20Pausable, ERC20Mintable, Ownable {

  uint8 public constant DECIMALS = 18;
  // 0.5 billion
  uint256 public constant INITIAL_SUPPLY = 500000000 * (10 ** uint256(DECIMALS));

  /**
   * @dev Constructor that gives msg.sender all of existing tokens.
   */
  constructor() public ERC20Detailed("RAKUN", "RAKU", DECIMALS) {
    _mint(msg.sender, INITIAL_SUPPLY);
  }

  /**
   * @dev remove an account's access to Mint
   * @param account minter
   */
  function removeMinter(address account) public onlyOwner {
    _removeMinter(account);
  }

  /**
   * @dev remove an account's access to Pause
   * @param account pauser
   */
  function removePauser(address account) public onlyOwner {
    _removePauser(account);
  }
}
