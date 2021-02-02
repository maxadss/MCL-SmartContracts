pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "../configuration/LendingPoolAddressesProvider.sol";
import "../interfaces/IRewardVault.sol";

contract RewardsManager is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for ERC20;

    address public lendingPoolAddress;
    address public coreAddress;
    address public stakingToken;
    LendingPoolAddressesProvider public addressesProvider;

    /**
     * @dev - An enum for the types of rewards
     */
    enum RewardTypes {Depositor, Governance, Safety}

    /**
     * @dev - A struct to store a user's accumulated reward and the pointer to the next claimable reward.
     */
    struct UserClaim {
        uint256 nextClaimablePtr;
        uint256 accumReward;
    }

    /**
     * @dev - A struct to store the RewardItem.
     * @notice amount - The amount of reward.
     * @notice paidSoFar - The amount that a user has accumulated or claimed from this reward item.
     * @notice totalSharingBase - For Depositor reward, this represent the total liquidity. For Governance reward, this represent the total bMxx staked.
     */
    struct RewardItem {
        uint256 amount;
        uint256 paidSoFar;
        uint256 totalSharingBase; // Either total LP or total bMxx Staking amount //
    }

    /**
     * @dev - A struct to store the individual RewardPools.
     * @notice claims - A mapping of user address to UserClaims.
     * @notice rewards - A mapping of RewardItems, retrieved by index. The index starts from 0.
     * @notice nextRewardPtr - Stores the index to the next reward item.
     * @notice valid - Determines whether a pool is valid or not.
     */
    struct RewardPool {
        mapping(address => UserClaim[2]) claims;
        mapping(uint256 => RewardItem[2]) rewards;
        uint256 nextRewardPtr;
        bool valid;
    }

    mapping(address => RewardPool) public rewardPools;

    /**
     * @dev only LendingPool can use functions affected by this modifier
     **/
    modifier onlyLendingPool {
        require(
            lendingPoolAddress == msg.sender,
            "The caller must be a lending pool contract"
        );
        _;
    }

    /**
     * @dev only LendingPool or Core can use functions affected by this modifier
     **/
    modifier onlyLendingPoolOrCore {
        require(
            lendingPoolAddress == msg.sender || coreAddress == msg.sender,
            "The caller must be a lending pool or core contract"
        );
        _;
    }

    constructor(LendingPoolAddressesProvider _addressProvider)
        public
        Ownable()
    {
        addressesProvider = _addressProvider;
        lendingPoolAddress = addressesProvider.getLendingPool();
        coreAddress = addressesProvider.getLendingPoolCore();
        stakingToken = addressesProvider.getStakingToken();
    }

    /**
     * @dev This function will register the reward pools based on an array of reserves
     * @param _reserves - Array of addresses
     * Access Control: Only Lending Pools
     */
    function registerPools(address[] memory _reserves)
        public
        onlyLendingPool
        nonReentrant
    {
        uint256 len = _reserves.length;
        for (uint256 i = 0; i < len; i++) {
            RewardPool memory pool = rewardPools[_reserves[i]];
            if (!pool.valid) {
                rewardPools[_reserves[i]] = RewardPool({
                    nextRewardPtr: 0,
                    valid: true
                });
            }
        }
    }

    /**
     * @dev This function will add a new reward item.
     * @param _reserve - The reserve of the lending pool.
     * @param _lpRewardAmt - The amount of reward for depositors.
     * @param lpBase - The total amount of the mToken supplied.
     * @param govRewardAmt - The amount of reward for the governance stakers.
     * Access Control: Only Lending Pools or Core
     */
    function addRewardItem(
        address _reserve,
        uint256 _lpRewardAmt,
        uint256 lpBase,
        uint256 govRewardAmt
    ) public onlyLendingPoolOrCore nonReentrant {
        // Check for any zero inputs//
        if (_lpRewardAmt == 0 || govRewardAmt == 0 || lpBase == 0) {
            return;
        }

        RewardPool storage pool = rewardPools[_reserve];
        require(pool.valid, "Unknown reserve pool in Reward Manager");

        pool.rewards[pool.nextRewardPtr][
            uint256(RewardTypes.Depositor)
        ] = RewardItem(_lpRewardAmt, 0, lpBase);

        uint256 stakedTokenSupply = IERC20(stakingToken).totalSupply();
        if (stakedTokenSupply != 0) {
            pool.rewards[pool.nextRewardPtr][
                uint256(RewardTypes.Governance)
            ] = RewardItem(govRewardAmt, 0, stakedTokenSupply);
        }
        pool.nextRewardPtr = pool.nextRewardPtr.add(1);
    }

    /**
     * @dev This function will update both the Depositor and Governance reward of the user.
     * @param _reserve - The reserve of the lending pool.
     * @param _user - The user's address.
     * @param _sharesLp - The amount of the mToken the user has.
     * @param _sharesGov - The amount of stBMXX token the user has.
     * @param _num - The number of reward items to update. Input 0 to update all available reward items.
     * Access Control: Only Lending Pools
     */
    function updateRewards(
        address _reserve,
        address _user,
        uint256 _sharesLp,
        uint256 _sharesGov,
        uint256 _num
    ) public onlyLendingPool {
        updateReward(_reserve, _user, RewardTypes.Depositor, _sharesLp, _num);
        updateReward(_reserve, _user, RewardTypes.Governance, _sharesGov, _num);
    }

    /**
     * @dev Called by LendingPool to accumulate and update the reward for a user.
     * @param _reserve The lending pool reserver.
     * @param _user The address of the user.
     * @param _type The type of reward to update.
     * @param _type The amount of reward.
     * @param _num The number of reward items to update. Input 0 to update all available reward items.
     * Access Control: Only Lending Pools
     **/
    function updateReward(
        address _reserve,
        address _user,
        RewardTypes _type,
        uint256 _shares,
        uint256 _num
    ) public onlyLendingPool nonReentrant {
        RewardPool storage pool = rewardPools[_reserve];
        require(pool.valid, "Unknown reserve pool in Reward Manager");

        // Pool has no reward yet ?
        if (pool.nextRewardPtr == 0) {
            return;
        }

        // For optimization, if _shares is 0, then we just update the next claimable pointer
        if (_shares == 0) {
            updateRange(pool, _user, uint256(_type), 0, 0, 0, false);
            return;
        }

        (uint256 start, uint256 end, bool hasNewReward) =
            getValidRange(pool, _user, uint256(_type), _num);
        updateRange(
            pool,
            _user,
            uint256(_type),
            start,
            end,
            _shares,
            hasNewReward
        );
    }

    /**
     * @dev This function will read the available reward of the user.
     * @param _reserve - The reserve of the lending pool.
     * @param _user - The user's address.
     * @param _type - The type of reward.
     * @param _share - The amount of mToken or stBMXX token, depending on the _type specified.
     */
    function readRewards(
        address _reserve,
        address _user,
        RewardTypes _type,
        uint256 _share
    ) public view returns (uint256) {
        RewardPool storage pool = rewardPools[_reserve];
        require(pool.valid, "Unknown reserve pool in Reward Manager");

        // Pool has no reward yet ?
        if (pool.nextRewardPtr == 0) {
            return 0;
        }

        uint256 rewardAmt = pool.claims[_user][uint256(_type)].accumReward;
        if (_share == 0) {
            return rewardAmt;
        }

        (uint256 start, uint256 end, bool hasNewReward) =
            getValidRange(pool, _user, uint256(_type), 0);
        if (hasNewReward) {
            uint256 accum = readRange(pool, uint256(_type), start, end, _share);
            rewardAmt = rewardAmt.add(accum);
        }
        return rewardAmt;
    }

    /**
     * @dev This function will retriev the start and end index of the reward item.
     * @param _pool - The reward pool.
     * @param _user - The user's address.
     * @param _type - The type of reward.
     * @param _num - The number of reward items to update. Input 0 to update all available reward items.
     */
    function getValidRange(
        RewardPool storage _pool,
        address _user,
        uint256 _type,
        uint256 _num
    )
        private
        view
        returns (
            uint256,
            uint256,
            bool
        )
    {
        UserClaim memory claim = _pool.claims[_user][_type];
        if (claim.nextClaimablePtr >= _pool.nextRewardPtr) {
            return (0, 0, false);
        }

        // Find the start and end //
        uint256 end = _pool.nextRewardPtr.sub(1);
        if (_num != 0) {
            uint256 temp = claim.nextClaimablePtr.add(_num - 1);
            if (temp < end) {
                end = temp;
            }
        }
        return (claim.nextClaimablePtr, end, true);
    }

    /**
     * @dev This function will update the accumulated reward of the user based on the range.
     * @param _pool - The reward pool.
     * @param _user - The user's address.
     * @param _type - The type of reward.
     * @param _start - The start of the range.
     * @param _end - The end of the range.
     * @param _share - The amount of mToken or stBMXX token, depending on the _type specified.
     * @param _hasNewReward - Specify whether a new reward is available.
     */
    function updateRange(
        RewardPool storage _pool,
        address _user,
        uint256 _type,
        uint256 _start,
        uint256 _end,
        uint256 _share,
        bool _hasNewReward
    ) private {
        // If there is no new claim, just point the nextClaimPtr to the latest
        if (!_hasNewReward) {
            UserClaim storage claim = _pool.claims[_user][_type];
            claim.nextClaimablePtr = _pool.nextRewardPtr;
            return;
        }

        uint256 accum;
        for (uint256 n = _start; n <= _end; n++) {
            RewardItem memory r = _pool.rewards[n][_type];
            if (r.amount == 0) {
                continue;
            }

            // Enough in RewardItem to pay ?
            uint256 amountAvailable = r.amount.sub(r.paidSoFar);
            if (amountAvailable == 0) {
                continue;
            }

            uint256 rewardAmt = _share.mul(r.amount).div(r.totalSharingBase);

            if (amountAvailable < rewardAmt) {
                rewardAmt = amountAvailable;
            }

            accum = accum.add(rewardAmt);

            // Update
            r.paidSoFar = r.paidSoFar.add(rewardAmt);
            _pool.rewards[n][_type] = r;
        }

        // Update
        UserClaim storage claim = _pool.claims[_user][_type];
        claim.nextClaimablePtr = _end.add(1); // set pointer to next reward in future //
        claim.accumReward = claim.accumReward.add(accum);
    }

    /**
     * @dev This function will read the accumulated reward from a range.
     * @param _pool - The reward pool.
     * @param _type - The type of reward.
     * @param _start - The start of the range.
     * @param _end - The end of the range.
     * @param _share - The amount of mToken or stBMXX token, depending on the _type specified.
     */
    function readRange(
        RewardPool storage _pool,
        uint256 _type,
        uint256 _start,
        uint256 _end,
        uint256 _share
    ) private view returns (uint256) {
        uint256 accum;
        for (uint256 n = _start; n <= _end; n++) {
            RewardItem memory r = _pool.rewards[n][_type];
            if (r.amount == 0) {
                continue;
            }

            // Enough in RewardItem to pay ?
            uint256 amountAvailable = r.amount.sub(r.paidSoFar);
            if (amountAvailable == 0) {
                continue;
            }

            uint256 rewardAmt = _share.mul(r.amount).div(r.totalSharingBase);

            if (amountAvailable < rewardAmt) {
                rewardAmt = amountAvailable;
            }

            accum = accum.add(rewardAmt);
        }
        return accum;
    }

    /**
     * @dev This function will reset the user's accumulated reward to 0 and set the pointer to the pool's next reward.
     * @param _reserve - The reserve of the lending pool.
     * @param _user - The user's address.
     * @param _type - The type of reward.
     * Access Control: Only Lending Pools
     */
    function resetReward(
        address _reserve,
        address _user,
        RewardTypes _type
    ) public onlyLendingPool {
        RewardPool storage pool = rewardPools[_reserve];
        require(pool.valid, "Unknown reserve pool in Reward Manager");

        UserClaim storage claim = pool.claims[_user][uint256(_type)];
        claim.nextClaimablePtr = pool.nextRewardPtr;
        claim.accumReward = 0;
    }

    /**
     * @dev This function will withdraw the reward and send to the user.
     * @param _type - The type of reward.
     * @param _token - The token to withdraw.
     * @param _to - The payee's address.
     * @param _amount - The amount to pay.
     * Access Control: Only Lending Pools
     */
    function withdrawFromVault(
        RewardTypes _type,
        address _token,
        address payable _to,
        uint256 _amount
    ) external onlyLendingPool {
        IRewardVault vault;
        if (_type == RewardTypes.Depositor) {
            vault = IRewardVault(addressesProvider.getLpRewardVault());
        } else if (_type == RewardTypes.Governance) {
            vault = IRewardVault(addressesProvider.getGovRewardVault());
        } else {
            vault = IRewardVault(addressesProvider.getSafetyRewardVault());
        }
        vault.withdraw(_token, _to, _amount);
    }
}
