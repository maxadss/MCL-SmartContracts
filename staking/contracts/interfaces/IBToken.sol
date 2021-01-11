pragma solidity ^0.6.12;

interface IBToken {
    function getScaledUserBalanceAndSupply(address user)
        external
        view
        returns (uint256, uint256);
}
