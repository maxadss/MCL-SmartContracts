pragma solidity ^0.5.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.4.0/contracts/token/ERC20/ERC20Mintable.sol";

contract MockupMXX is ERC20Mintable {
    string public name = "Mockup Multiplier";
    string public symbol = "MMXX";
    uint8 public decimals = 2;
    uint256 public INITIAL_SUPPLY = 12000;
}
