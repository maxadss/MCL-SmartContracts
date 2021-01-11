// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import {DistributionTypes} from "../lib/DistributionTypes.sol";

interface IbMXXDistributionManager {
    function configureAssets(
        DistributionTypes.AssetConfigInput[] calldata assetsConfigInput
    ) external;
}
