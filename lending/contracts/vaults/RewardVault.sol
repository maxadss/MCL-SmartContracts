pragma solidity ^0.5.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.4.0/contracts/utils/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.4.0/contracts/ownership/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.4.0/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.4.0/contracts/token/ERC20/SafeERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.4.0/contracts/math/SafeMath.sol";
import "../libraries/BscAddressLib.sol";
import "../interfaces/IRewardVault.sol";

contract RewardVault is IRewardVault, Ownable, ReentrancyGuard {
    using SafeERC20 for ERC20;
    bool public paused;
    address public rewardManager;

    constructor(address _rewardManager) public {
        rewardManager = _rewardManager;
    }

    /// @notice In order to receive BNB transfers
    function() external payable {
        // Ensure the sender is a contract
        require(msg.sender != tx.origin, "Reject accidental BNB transfer from EOA");
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
        withdrawInternal(_token, _to, _amount);
    }
}
