import { BMxxIncentivesController } from './../../types/BMxxIncentivesController.d';
import {evmRevert, evmSnapshot, BRE} from '../../helpers/misc-utils';
import {Signer} from 'ethers';
import {getEthersSigners} from '../../helpers/contracts-helpers';
import {tEthereumAddress} from '../../helpers/types';

import chai from 'chai';
// @ts-ignore
import bignumberChai from 'chai-bignumber';
import {StakedbMxx} from '../../types/StakedbMXX';
import {
  getbMXXIncentivesController,
  getBTokenMock,
  getMintableErc20,
  getStakedbMXX,
} from '../../helpers/contracts-accessors';
import {MintableErc20} from '../../types/MintableErc20';
import {BTokenMock} from '../../types/BTokenMock';

chai.use(bignumberChai());

export let stakedbMXXInitializeTimestamp = 0;
export const setStakedbMXXInitializeTimestamp = (timestamp: number) => {
  stakedbMXXInitializeTimestamp = timestamp;
};

export interface SignerWithAddress {
  signer: Signer;
  address: tEthereumAddress;
}
export interface TestEnv {
  rewardsVault: SignerWithAddress;
  deployer: SignerWithAddress;
  users: SignerWithAddress[];
  mToken: MintableErc20;
  bMXXIncentivesController: BMxxIncentivesController;
  stakedbMXX: StakedbMxx;
  aDaiMock: BTokenMock;
  aWethMock: BTokenMock;
}

let buidlerevmSnapshotId: string = '0x1';
const setBuidlerevmSnapshotId = (id: string) => {
  if (BRE.network.name === 'buidlerevm') {
    buidlerevmSnapshotId = id;
  }
};

const testEnv: TestEnv = {
  deployer: {} as SignerWithAddress,
  users: [] as SignerWithAddress[],
  mToken: {} as MintableErc20,
  stakedbMXX: {} as StakedbMxx,
  bMXXIncentivesController: {} as BMxxIncentivesController,
  aDaiMock: {} as BTokenMock,
  aWethMock: {} as BTokenMock,
} as TestEnv;

export async function initializeMakeSuite() {
  const [_deployer, _rewardsVault, ...restSigners] = await getEthersSigners();
  const deployer: SignerWithAddress = {
    address: await _deployer.getAddress(),
    signer: _deployer,
  };

  const rewardsVault: SignerWithAddress = {
    address: await _rewardsVault.getAddress(),
    signer: _rewardsVault,
  };

  for (const signer of restSigners) {
    testEnv.users.push({
      signer,
      address: await signer.getAddress(),
    });
  }
  testEnv.deployer = deployer;
  testEnv.rewardsVault = rewardsVault;
  testEnv.stakedbMXX = await getStakedbMXX();
  testEnv.bMXXIncentivesController = await getbMXXIncentivesController();
  testEnv.mToken = await getMintableErc20();
  testEnv.aDaiMock = await getBTokenMock({slug: 'aDai'});
  testEnv.aWethMock = await getBTokenMock({slug: 'aWeth'});
}

export function makeSuite(name: string, tests: (testEnv: TestEnv) => void) {
  describe(name, () => {
    before(async () => {
      setBuidlerevmSnapshotId(await evmSnapshot());
    });
    tests(testEnv);
    after(async () => {
      await evmRevert(buidlerevmSnapshotId);
    });
  });
}
