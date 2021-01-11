// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import {
    IbMXXIncentivesController
} from "../interfaces/IbMXXIncentivesController.sol";
import {DistributionTypes} from "../lib/DistributionTypes.sol";
import {IBToken} from "../interfaces/IBToken.sol";

contract BTokenMock is IBToken {
    IbMXXIncentivesController public _bic;
    uint256 internal _userBalance;
    uint256 internal _totalSupply;

    event RewardsAccrued(address indexed user, uint256 amount);

    event AssetConfigUpdated(address indexed asset, uint256 emission);
    event AssetIndexUpdated(address indexed asset, uint256 index);
    event UserIndexUpdated(
        address indexed user,
        address indexed asset,
        uint256 index
    );

    constructor(IbMXXIncentivesController bic) public {
        _bic = bic;
    }

    function handleActionOnBic(
        address user,
        uint256 userBalance,
        uint256 totalSupply
    ) external {
        _bic.handleAction(user, userBalance, totalSupply);
    }

    function setUserBalanceAndSupply(uint256 userBalance, uint256 totalSupply)
        public
    {
        _userBalance = userBalance;
        _totalSupply = totalSupply;
    }

    function getScaledUserBalanceAndSupply(address user)
        external
        override
        view
        returns (uint256, uint256)
    {
        return (_userBalance, _totalSupply);
    }

    function cleanUserState() external {
        _userBalance = 0;
        _totalSupply = 0;
    }
}
