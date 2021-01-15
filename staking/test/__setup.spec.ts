import rawBRE from 'hardhat';
import {Signer, ethers} from 'ethers';

import {getEthersSigners, insertContractAddressInDb} from '../helpers/contracts-helpers';

import {initializeMakeSuite} from './helpers/make-suite';
import {
  deploybMXXIncentivesController,
  deployStakedbMXX,
  deployMintableErc20,
  deployInitializableAdminUpgradeabilityProxy,
  deployMockTransferHook,
  deployBTokenMock,
  deployLendingPool,
} from '../helpers/contracts-accessors';
import {
  PSM_STAKER_PREMIUM,
  COOLDOWN_SECONDS,
  UNSTAKE_WINDOW,
  MAX_UINT_AMOUNT,
  STAKED_BMXX_NAME,
  STAKED_BMXX_SYMBOL,
  STAKED_BMXX_DECIMALS,
} from '../helpers/constants';
import {waitForTx} from '../helpers/misc-utils';
import {eContractid} from '../helpers/types';
import {MintableErc20} from '../types/MintableErc20';

const topUpWalletsWithbMXX = async (
  wallets: Signer[],
  mToken: MintableErc20,
  amount: string
) => {
  for (const wallet of wallets) {
    await waitForTx(await mToken.connect(wallet).mint(amount));
  }
};

const buildTestEnv = async (deployer: Signer, vaultOfRewards: Signer, restWallets: Signer[]) => {
  console.time('setup');
  const proxyAdmin = await restWallets[0].getAddress();
  const emissionManager = await deployer.getAddress();

  const mToken = await deployMintableErc20(['bMXX', 'bMXX', 18]);

  await waitForTx(await mToken.connect(vaultOfRewards).mint(ethers.utils.parseEther('1000000')));
  await topUpWalletsWithbMXX(
    [
      restWallets[0],
      restWallets[1],
      restWallets[2],
      restWallets[3],
      restWallets[4],
      restWallets[5],
    ],
    mToken,
    ethers.utils.parseEther('100').toString()
  );

  const stakedToken = mToken.address;
  const rewardsToken = mToken.address;

  const vaultOfRewardsAddress = await vaultOfRewards.getAddress();

  const bMXXIncentivesControllerProxy = await deployInitializableAdminUpgradeabilityProxy();
  const stakedbMXXProxy = await deployInitializableAdminUpgradeabilityProxy();

  const bMXXIncentivesControllerImplementation = await deploybMXXIncentivesController([
    mToken.address,
    vaultOfRewardsAddress,
    stakedbMXXProxy.address,
    PSM_STAKER_PREMIUM,
    emissionManager,
    (1000 * 60 * 60).toString(),
  ]);

  const lp = await deployLendingPool();

  const stakedbMXXImpl = await deployStakedbMXX([
    stakedToken,
    rewardsToken,
    COOLDOWN_SECONDS,
    UNSTAKE_WINDOW,
    vaultOfRewardsAddress,
    emissionManager,
    (1000 * 60 * 60).toString(),
    lp.address,
  ]);

  const mockTransferHook = await deployMockTransferHook();

  const stakedbMXXEncodedInitialize = stakedbMXXImpl.interface.encodeFunctionData('initialize', [
    mockTransferHook.address,
    STAKED_BMXX_NAME,
    STAKED_BMXX_SYMBOL,
    STAKED_BMXX_DECIMALS,
  ]);
  await stakedbMXXProxy['initialize(address,address,bytes)'](
    stakedbMXXImpl.address,
    proxyAdmin,
    stakedbMXXEncodedInitialize
  );
  await waitForTx(
    await mToken.connect(vaultOfRewards).approve(stakedbMXXProxy.address, MAX_UINT_AMOUNT)
  );
  await insertContractAddressInDb(eContractid.StakedbMXX, stakedbMXXProxy.address);

  const peiEncodedInitialize = bMXXIncentivesControllerImplementation.interface.encodeFunctionData(
    'initialize'
  );
  await bMXXIncentivesControllerProxy['initialize(address,address,bytes)'](
    bMXXIncentivesControllerImplementation.address,
    proxyAdmin,
    peiEncodedInitialize
  );
  await waitForTx(
    await mToken
      .connect(vaultOfRewards)
      .approve(bMXXIncentivesControllerProxy.address, MAX_UINT_AMOUNT)
  );
  await insertContractAddressInDb(
    eContractid.bMXXIncentivesController,
    bMXXIncentivesControllerProxy.address
  );

  await deployBTokenMock(bMXXIncentivesControllerProxy.address, 'aDai');
  await deployBTokenMock(bMXXIncentivesControllerProxy.address, 'aWeth');

  console.timeEnd('setup');
};

before(async () => {
  await rawBRE.run('set-bre');
  const [deployer, rewardsVault, ...restWallets] = await getEthersSigners();
  console.log('-> Deploying test environment...');
  await buildTestEnv(deployer, rewardsVault, restWallets);
  await initializeMakeSuite();
  console.log('\n***************');
  console.log('Setup and snapshot finished');
  console.log('***************\n');
});
