pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/utils/Address.sol";
import "../libraries/BscAddressLib.sol";
import "../interfaces/IRewardVault.sol";

contract RewardVault is IRewardVault, Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for ERC20;
    
    bool    public paused;
    address public rewardManager;
    uint256 public coolDownStart;
    uint256 public constant EMERGENCY_COOLDOWN_PERIOD = 1 days;
    uint256 public constant EMERGENCY_WITHDRAW_WINDOW_PERIOD = 1 days;

    /**
     * @dev event for the activation of cool-down for emergency withdraw
     * @param _vaultAddress the address of the vault activated
     * @param _timestampWithdrawable the timestamp where the emergency withdrawal will be enabled
     **/
    event EmergencyWithdrawlCooldown(
        address indexed _vaultAddress,
        uint256 _timestampWithdrawable
    );

    /**
     * @dev event for the execution of emergency withdraw
     * @param _vaultAddress the address of the vault
     * @param _reserve the address of the withdrawn asset
     * @param _amount the amount of asset withdrawed
     * @param _destination the destination of the withdrawal
     * @param _timestamp the timestamp where the emergency withdrawal is executed
     **/
    event EmergencyWithdrawlExecuted(
        address indexed _vaultAddress,
        address _reserve,
        uint256 _amount,
        address _destination,
        uint256 _timestamp
    );
/*
    constructor(address _rewardManager) public {
        rewardManager = _rewardManager;
    }
*/
    /// @notice In order to receive BNB transfers
    function() external payable {
        // Ensure the sender is a contract
        require(Address.isContract(msg.sender), "Reject accidental BNB transfer from EOA");
    }

    /**
     * @dev only Reward Manager can use functions affected by this modifier
     **/
    modifier onlyRewardManager() {
        require(msg.sender == rewardManager, "Must call from reward manager");
        _;
    }

    /**
     * @dev only when Not Paused, then this functions can be called.
     **/
    modifier onlyNotPaused() {
        require(!paused, "Must not be paused");
        _;
    }

    /**
     * @dev This function will set the Reward Manager.
     * @param _rewardManager - The reward manager to set.
     * Access Control: Owner Only.
     */
    function setRewardManager(address _rewardManager) external onlyOwner {
        rewardManager = _rewardManager;
    }

    /**
     * @dev This function will allow the Reward Manager to withdraw a token.
     * @param _token - The token to withdraw.
     * @param _to - The payee's address.
     * @param _amount - The amount to pay.
     * Access Control: Reward Manager Only.
     */
    function withdraw(
        address _token,
        address payable _to,
        uint256 _amount
    ) external onlyRewardManager {
        withdrawInternal(_token, _to, _amount);
    }

    /**
     * @dev This function will withdraw a token.
     * @param _token - The token to withdraw.
     * @param _to - The payee's address.
     * @param _amount - The amount to pay.
     * Access Control: Not Paused Only.
     */
    function withdrawInternal(
        address _token,
        address payable _to,
        uint256 _amount
    ) internal nonReentrant onlyNotPaused {
        if (BscAddressLib.bnbAddress() == _token) {
            _to.transfer(_amount);
        } else {
            ERC20(_token).safeTransfer(_to, _amount);
        }
    }

    /**
     * @dev This function will set emergency Pause.
     * @param _pause - Set Pause, Unpause.
     * Access Control: Only Owner
     */
    function setPaused(bool _pause) external onlyOwner {
        paused = _pause;
    }


    /**
     * @dev This function will activate the cool-down period for emergency withdrawal.
     * Access Control: Only Owner
     */
    function activateEmergencyCooldown() external onlyOwner {
        coolDownStart = block.timestamp;
        emit EmergencyWithdrawlCooldown(address(this), coolDownStart.add(EMERGENCY_COOLDOWN_PERIOD));
    }

    /**
     * @dev This function will allow admin owner to withdraw in case of emergency. The admin owner is a multi-Signature address.
     * @param _token - The token to withdraw.
     * @param _to - The payee's address.
     * @param _amount - The amount to pay.
     * Access Control: Only Owner
     */
    function emergencyWithdraw(
        address _token,
        address payable _to,
        uint256 _amount
    ) external onlyOwner {

        require(
            coolDownStart != 0, 
            "Cool-down not started"
        );
        require(
            block.timestamp > coolDownStart.add(EMERGENCY_COOLDOWN_PERIOD),
            "Insufficient cool-down"
        );
        require(
            block.timestamp.sub(coolDownStart.add(EMERGENCY_COOLDOWN_PERIOD)) <=
                EMERGENCY_WITHDRAW_WINDOW_PERIOD,
            "Emergency withdrawal window closed"
        );
        
        withdrawInternal(_token, _to, _amount);
        emit EmergencyWithdrawlExecuted(address(this), _token, _amount, _to, block.timestamp);
    }
}