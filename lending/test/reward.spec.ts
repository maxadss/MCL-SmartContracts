import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { FormatTypes } from "ethers/lib/utils";
import {
  APPROVAL_AMOUNT_LENDING_POOL_CORE,
  ETHEREUM_ADDRESS,
  MAX_UINT_AMOUNT,
  NIL_ADDRESS,
  oneEther,
  RATEMODE_STABLE,
  RATEMODE_VARIABLE,
} from "../helpers/constants";
import {
  getLendingPoolCoreProxy,
  getLendingPoolImpl,
  getLendingPoolProxy,
} from "../helpers/contracts-getters";
import { convertToCurrencyDecimals } from "../helpers/contracts-helpers";
import {
  LendingPool,
  LendingPoolCore,
  MintableERC20,
  MockDAI,
  MockDAIFactory,
  MToken,
  RewardsManager,
} from "../types";
import { makeSuite, TestEnv } from "./helpers/make-suite";

const expectRevert = require("@openzeppelin/test-helpers").expectRevert;

makeSuite("Reward - transfer", (testEnv: TestEnv) => {
  let _aDAI: MToken;
  let _DAI: MintableERC20;
  let _lendingPoolInstance: LendingPool;
  let _lendingPoolCoreInstance: LendingPoolCore;
  let _rewardManager: RewardsManager;

  before("Initializing test variables", async () => {
    const { mDAI, dai, pool, core, rewardMgr } = testEnv;

    _lendingPoolInstance = pool;
    _lendingPoolCoreInstance = core;
    _rewardManager = rewardMgr;

    _aDAI = mDAI;
    _DAI = dai;
    console.log("_DAI: ", _DAI.address);
  });

  it("User 0 deposits 1000 DAI, transfers to user 1", async () => {
    const { users } = testEnv;

    const user1 = users[2];
    const user2 = users[3];
    await _DAI
      .connect(user1.signer)
      .mint(await convertToCurrencyDecimals(_DAI.address, "1000"));

    await _DAI
      .connect(user1.signer)
      .approve(
        _lendingPoolCoreInstance.address,
        APPROVAL_AMOUNT_LENDING_POOL_CORE,
        {
          // from: users[0].address,
        }
      );

    //user 1 deposits 1000 DAI
    const amountDAItoDeposit = await convertToCurrencyDecimals(
      _DAI.address,
      "1000"
    );

    await _lendingPoolInstance
      .connect(user1.signer)
      .deposit(_DAI.address, amountDAItoDeposit, "0", {
        // from: users[0],
      });

    const fromBalance = await _aDAI.balanceOf(user1.address);

    const user0Reward = await _rewardManager.readRewards(
      _DAI.address,
      user1.address,
      "0",
      fromBalance
    );
    expect(user0Reward.toString()).to.be.equal("0", "Invalid reward");

    await _aDAI
      .connect(user1.signer)
      .transfer(user2.address, amountDAItoDeposit, {
        // from: users[0]
      });

    const fromBalanceAfter = await _aDAI.balanceOf(users[0].address);
    const toBalance = await _aDAI.balanceOf(user2.address);

    expect(fromBalanceAfter.toString()).to.be.equal(
      "0",
      "Invalid from balance after transfer"
    );
    expect(toBalance.toString()).to.be.equal(
      amountDAItoDeposit.toString(),
      "Invalid to balance after transfer"
    );

    const user1Reward = await _rewardManager.readRewards(
      _DAI.address,
      user2.address,
      "0",
      toBalance
    );
    expect(user1Reward.toString()).to.be.equal("0", "Invalid reward");
  });

  it("User 2 borrow and repay, user 1 earn reward", async () => {
    const { users } = testEnv;

    const user1 = users[2];
    const user2 = users[3];

    await _DAI
      .connect(user1.signer)
      .mint(await convertToCurrencyDecimals(_DAI.address, "1000"));

    await _DAI
      .connect(user1.signer)
      .approve(
        _lendingPoolCoreInstance.address,
        APPROVAL_AMOUNT_LENDING_POOL_CORE,
        {
          // from: users[0].address,
        }
      );

    //user 1 deposits 1000 DAI
    const amountDAItoDeposit = await convertToCurrencyDecimals(
      _DAI.address,
      "1000"
    );

    await _lendingPoolInstance
      .connect(user1.signer)
      .deposit(_DAI.address, amountDAItoDeposit, "0", {
        // from: users[0],
      });

    //user 1 borrow 500 DAI
    const amountDAIToBorrow = await convertToCurrencyDecimals(
      _DAI.address,
      "10"
    );

    await _lendingPoolInstance
      .connect(user1.signer)
      .borrow(_DAI.address, amountDAIToBorrow, RATEMODE_VARIABLE, "0", {
        // from: users[0],
      });

    const fromBalance = await _aDAI.balanceOf(user1.address);

    const user0Reward = await _rewardManager.readRewards(
      _DAI.address,
      user1.address,
      "0",
      fromBalance
    );
    expect(user0Reward.toString()).to.be.equal("0", "Invalid reward");

    await _DAI
      .connect(user1.signer)
      .approve(
        _lendingPoolCoreInstance.address,
        APPROVAL_AMOUNT_LENDING_POOL_CORE,
        {
          // from: users[0].address,
        }
      );

    //user 1 repay 500 DAI

    await _lendingPoolInstance
      .connect(user1.signer)
      .repay(_DAI.address, amountDAIToBorrow, user1.address, {
        // from: users[0],
      });

    const total = await _aDAI.totalSupply();
    console.log("totalSupply ", total.toString());

    //const  reward =

    const user0RewardAfter = await _rewardManager.readRewards(
      _DAI.address,
      user1.address,
      "0",
      fromBalance
    );

    console.log("user0RewardAfter ", user0RewardAfter.toString());
    // expect(user0Reward.toString()).to.be.equal(
    //     "0",
    //     "Invalid reward"
    //   );
  });

  // it("User 1 redirects interest to user 2, transfers 500 DAI back to user 0", async () => {
  //   const { users } = testEnv;

  //   await _aDAI
  //     .connect(users[1].signer)
  //     .redirectInterestStream(users[2].address, {
  //       //  from: users[1]
  //     });

  //   const aDAIRedirected = await convertToCurrencyDecimals(
  //     _DAI.address,
  //     "1000"
  //   );

  //   const aDAItoTransfer = await convertToCurrencyDecimals(_DAI.address, "500");

  //   const user2RedirectedBalanceBefore = await _aDAI.getRedirectedBalance(
  //     users[2].address
  //   );
  //   expect(user2RedirectedBalanceBefore.toString()).to.be.equal(
  //     aDAIRedirected,
  //     "Invalid redirected balance for user 2 before transfer"
  //   );

  //   await _aDAI
  //     .connect(users[1].signer)
  //     .transfer(users[0].address, aDAItoTransfer, {
  //       //from: users[1]
  //     });

  //   const user2RedirectedBalanceAfter = await _aDAI.getRedirectedBalance(
  //     users[2].address
  //   );
  //   const user1RedirectionAddress = await _aDAI.getInterestRedirectionAddress(
  //     users[1].address
  //   );

  //   expect(user2RedirectedBalanceAfter.toString()).to.be.equal(
  //     aDAItoTransfer,
  //     "Invalid redirected balance for user 2 after transfer"
  //   );
  //   expect(user1RedirectionAddress.toString()).to.be.equal(
  //     users[2].address,
  //     "Invalid redirection address for user 1"
  //   );
  // });

  // it("User 0 transfers back to user 1", async () => {
  //   const { users } = testEnv;

  //   const aDAItoTransfer = await convertToCurrencyDecimals(_DAI.address, "500");

  //   await _aDAI
  //     .connect(users[0].signer)
  //     .transfer(users[1].address, aDAItoTransfer, {
  //       //  from: users[0].address
  //     });

  //   const user2RedirectedBalanceAfter = await _aDAI.getRedirectedBalance(
  //     users[2].address
  //   );

  //   const user1BalanceAfter = await _aDAI.balanceOf(users[1].address);

  //   expect(user2RedirectedBalanceAfter.toString()).to.be.equal(
  //     user1BalanceAfter.toString(),
  //     "Invalid redirected balance for user 2 after transfer"
  //   );
  // });
});
