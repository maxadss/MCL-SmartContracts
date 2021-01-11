pragma solidity ^0.5.0;

/************
@title IFeeProvider interface
@notice Interface for the Multiplier fee provider.
*/

interface IFeeProvider {
    function calculateLoanOriginationFee(uint256 _amount)
        external
        view
        returns (uint256);

    function calculateRewards(uint256 _originationFee) external view returns (uint256, uint256, uint256);

    function getFeeRates() external view returns (uint256, uint256);

    function getFlashLoanFee() external view returns (uint256);
    
    function getRewardRates() external view returns (uint256, uint256, uint256);
}
