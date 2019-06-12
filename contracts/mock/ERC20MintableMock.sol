pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "./MinterRoleMock.sol";

contract ERC20MintableMock is ERC20Mintable, MinterRoleMock {
}
