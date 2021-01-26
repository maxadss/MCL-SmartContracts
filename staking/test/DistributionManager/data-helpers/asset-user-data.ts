import {BigNumber} from 'ethers';
import {BMXXDistributionManager} from '../../../types/BMxxDistributionManager';
import {StakedbMXX} from '../../../types/StakedbMXX';
import {BMXXIncentivesController} from '../../../types/BMxxIncentivesController';

export type UserStakeInput = {
  underlyingAsset: string;
  stakedByUser: string;
  totalStaked: string;
};

export type UserPositionUpdate = UserStakeInput & {
  user: string;
};
export async function getUserIndex(
  distributionManager: BMXXDistributionManager | BMXXIncentivesController | StakedbMXX,
  user: string,
  asset: string
): Promise<BigNumber> {
  return await distributionManager.getUserAssetData(user, asset);
}
