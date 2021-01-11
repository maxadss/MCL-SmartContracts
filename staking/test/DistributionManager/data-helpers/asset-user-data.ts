import {BigNumber} from 'ethers';
import {DistributionManager} from '../../../types/DistributionManager';
import {StakedbMXX} from '../../../types/StakedbMXX';
import {bMXXIncentivesController} from '../../../types/bMXXIncentivesController';

export type UserStakeInput = {
  underlyingAsset: string;
  stakedByUser: string;
  totalStaked: string;
};

export type UserPositionUpdate = UserStakeInput & {
  user: string;
};
export async function getUserIndex(
  distributionManager: DistributionManager | bMXXIncentivesController | StakedbMXX,
  user: string,
  asset: string
): Promise<BigNumber> {
  return await distributionManager.getUserAssetData(user, asset);
}
