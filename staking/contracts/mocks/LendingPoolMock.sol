// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import {ILendingPool} from "../interfaces/ILendingPool.sol";

contract LendingPoolMock is ILendingPool {
 event LendingPoolMockEvent();
 function updateGovernanceStakingRewards(address _user)
  external override{
     emit LendingPoolMockEvent();
 }
}
