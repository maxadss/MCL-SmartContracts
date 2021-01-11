pragma solidity ^0.5.0;

import "../libraries/openzeppelin-upgradeability/VersionedInitializable.sol";
import "../interfaces/IFeeProvider.sol";
import "../libraries/WadRayMath.sol";

/**
 * @title FeeProvider contract
 * @notice Implements calculation for the fees applied by the protocol
 * @author Multiplier Finance
 **/
contract FeeProvider is IFeeProvider, VersionedInitializable {
    using SafeMath for uint256;
    using WadRayMath for uint256;

    // percentage of the fee to be calculated on the loan amount
    uint256 private originationFeeRate;
    uint256 private flashloanFeeRate;
    
    // 70/20/10% reward rates //
    uint256 private supplierRewardRate;
    uint256 private governanceRewardRate;
    // uint256 private safetyModuleRewardRate; // Thr remaining of 1 - supplierRewardRate - governanceRewardRate
    

    uint256 public constant FEE_PROVIDER_REVISION = 0x1;

    function getRevision() internal pure returns (uint256) {
        return FEE_PROVIDER_REVISION;
    }


    /**
     * @dev initializes the FeeProvider after it's added to the proxy
     * @param _addressesProvider the address of the LendingPoolAddressesProvider
     */
    function initialize(address _addressesProvider) public initializer {
        /// @notice origination fee is set as default as 10 basis points of the loan amount (0.001%)
        originationFeeRate = 0.00001 * 1e18; // 100% = 1e18
        flashloanFeeRate = 0.0006 * 1e18;
        supplierRewardRate = 0.7 * 1e18;
        governanceRewardRate = 0.2 * 1e18;
    }

    /**
     * @dev calculates the origination fee for every loan executed on the
     * platform.
     * @param _amount the amount of the loan
     **/
    function calculateLoanOriginationFee(uint256 _amount)
        external
        view
        returns (uint256)
    {
        return _amount.wadMul(originationFeeRate);
    }

    /**
     * @dev returns the origination fee percentage
     **/
    function calculateRewards(uint256 _originationFee) external view returns (uint256, uint256, uint256) {
        
        // Checks to prevent improper percentages
        require (supplierRewardRate.add(governanceRewardRate) <= 1e18, "Invalid Fees configurations");

        uint256 supplierReward = _originationFee.wadMul(supplierRewardRate);
        uint256 govtReward = _originationFee.wadMul(governanceRewardRate);
        
        return (supplierReward, govtReward, _originationFee.sub(supplierReward).sub(govtReward));
        
    }
  
    function getFeeRates() external view returns (uint256, uint256) {
        return (originationFeeRate, flashloanFeeRate);
    }

    function getFlashLoanFee() external view returns (uint256) {
        return flashloanFeeRate;
    }
    
    function getRewardRates() external view returns (uint256, uint256, uint256) {
        uint256 safetyModuleRate = 1e18;
        safetyModuleRate = safetyModuleRate.sub(supplierRewardRate).sub(governanceRewardRate);
        return (supplierRewardRate, governanceRewardRate, safetyModuleRate);
    }
    
}
