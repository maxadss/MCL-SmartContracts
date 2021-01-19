import {evmRevert, evmSnapshot, BRE} from '../../helpers/misc-utils';
import {Signer} from 'ethers';
import {getEthersSigners} from '../../helpers/contracts-helpers';
import {tEthereumAddress} from '../../helpers/types';


export interface SignerWithAddress {
  signer: Signer;
  address: tEthereumAddress;
}
export interface ITestEnv {
  rewardsVault: SignerWithAddress;
  deployer: SignerWithAddress;
  users: SignerWithAddress[];
}

let buidlerevmSnapshotId: string = '0x1';
const setBuidlerevmSnapshotId = (id: string) => {
  if (BRE.network.name === 'buidlerevm') {
    buidlerevmSnapshotId = id;
  }
};

const testEnvProvider: ITestEnv = {
  deployer: {} as SignerWithAddress,
  users: [] as SignerWithAddress[],
} as ITestEnv;

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
    testEnvProvider.users.push({
      signer,
      address: await signer.getAddress(),
    });
  }
  testEnvProvider.deployer = deployer;
  testEnvProvider.rewardsVault = rewardsVault;
  // testEnv.stakedbMXX = await getStakedbMXX();
  // testEnv.bMXXIncentivesController = await getbMXXIncentivesController();
  // testEnv.mToken = await getMintableErc20();
  // testEnv.aDaiMock = await getBTokenMock({slug: 'aDai'});
  // testEnv.aWethMock = await getBTokenMock({slug: 'aWeth'});
}

export function makeSuite(name: string, tests: (testEnv: ITestEnv) => void) {
  describe(name, () => {
    before(async () => {
      setBuidlerevmSnapshotId(await evmSnapshot());
    });
    tests(testEnvProvider);
    after(async () => {
      await evmRevert(buidlerevmSnapshotId);
    });
  });
}
