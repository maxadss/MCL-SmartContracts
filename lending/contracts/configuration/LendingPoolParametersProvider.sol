pragma solidity ^0.5.0;

import "./UintStorage.sol";

/**
* @title LendingPoolParametersProvider
* @author Multiplier Finance
* @notice stores the configuration parameters of the Lending Pool contract
**/


contract LendingPoolParametersProvider {
    
    uint256 private constant MAX_STABLE_RATE_BORROW_SIZE_PERCENT = 25;
    uint256 private constant REBALANCE_DOWN_RATE_DELTA = (1e27)/5;
    
    /**
    * @dev returns the maximum stable rate borrow size, in percentage of the
    * available liquidity.
    **/
    function getMaxStableRateBorrowSizePercent() external pure returns (uint256)  {
        return (MAX_STABLE_RATE_BORROW_SIZE_PERCENT);
    }

    /**
    * @dev returns the delta between the current stable rate and the user
    * stable rate at which the borrow position of the user will be rebalanced
    * (scaled down)
    **/
    function getRebalanceDownRateDelta() external pure returns (uint256) {
        return (REBALANCE_DOWN_RATE_DELTA);
    }
  
}
