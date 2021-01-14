import {BigNumber} from 'ethers';
import {BMxxDistributionManager} from '../../../types/BMxxDistributionManager';
import {StakedbMxx} from '../../../types/StakedbMXX';
import {BMxxIncentivesController} from '../../../types/BMxxIncentivesController';

export type UserStakeInput = {
  underlyingAsset: string;
  stakedByUser: string;
  totalStaked: string;
};

export type UserPositionUpdate = UserStakeInput & {
  user: string;
};
export async function getUserIndex(
  distributionManager: BMxxDistributionManager | BMxxIncentivesController | StakedbMxx,
  user: string,
  asset: string
): Promise<BigNumber> {
  return await distributionManager.getUserAssetData(user, asset);
}
