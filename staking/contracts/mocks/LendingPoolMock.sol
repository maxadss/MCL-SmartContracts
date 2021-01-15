// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import {ILendingPool} from "../interfaces/ILendingPool.sol";

contract LendingPoolMock is ILendingPool {
 function updateGovernanceStakingRewards(address _user) override external{
     return;
 }
}
