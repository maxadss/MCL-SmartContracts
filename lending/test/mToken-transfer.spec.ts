import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import {
  APPROVAL_AMOUNT_LENDING_POOL_CORE,
  ETHEREUM_ADDRESS,
  MAX_UINT_AMOUNT,
  NIL_ADDRESS,
  oneEther,
  RATEMODE_VARIABLE,
} from "../helpers/constants";
import {
  getLendingPoolCoreProxy,
  getLendingPoolImpl,
  getLendingPoolProxy,
} from "../helpers/contracts-getters";
import { convertToCurrencyDecimals } from "../helpers/contracts-helpers";
import { waitForTx } from "../helpers/misc-utils";
import {
  LendingPool,
  LendingPoolCore,
  MintableERC20,
  MockDAI,
  MockDAIFactory,
  MToken,
} from "../types";
import { makeSuite, TestEnv } from "./helpers/make-suite";

const expectRevert = require("@openzeppelin/test-helpers").expectRevert;

makeSuite("mToken: Transfer", (testEnv: TestEnv) => {
  //contract("mToken: Transfer", async ([deployer, ...users]) => {
  let _testEnvProvider: TestEnv;
  let _aDAI: MToken;
  let _DAI: MintableERC20;
  let _lendingPoolInstance: LendingPool;
  let _lendingPoolCoreInstance: LendingPoolCore;

  before("Initializing test variables", async () => {
    _testEnvProvider = testEnv;

    const { mDAI, dai, pool, core } = _testEnvProvider;

    _lendingPoolInstance = pool;
    _lendingPoolCoreInstance = core;

    _aDAI = mDAI;
    _DAI = dai;
    console.log("_DAI: ", _DAI.address);
  });

  it("User 0 deposits 1000 DAI, transfers to user 1", async () => {
    const { users } = _testEnvProvider;
    await _DAI
      .connect(users[0].signer)
      .mint(await convertToCurrencyDecimals(_DAI.address, "1000"));

    await _DAI
      .connect(users[0].signer)
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
      .connect(users[0].signer)
      .deposit(_DAI.address, amountDAItoDeposit, "0", {
        // from: users[0],
      });

    await _aDAI
      .connect(users[0].signer)
      .transfer(users[1].address, amountDAItoDeposit, {
        // from: users[0]
      });

    const fromBalance = await _aDAI.balanceOf(users[0].address);
    const toBalance = await _aDAI.balanceOf(users[1].address);

    expect(fromBalance.toString()).to.be.equal(
      "0",
      "Invalid from balance after transfer"
    );
    expect(toBalance.toString()).to.be.equal(
      amountDAItoDeposit.toString(),
      "Invalid to balance after transfer"
    );
  });

  it("User 1 redirects interest to user 2, transfers 500 DAI back to user 0", async () => {
    const { users } = _testEnvProvider;

    await _aDAI
      .connect(users[1].signer)
      .redirectInterestStream(users[2].address, {
        //  from: users[1]
      });

    const aDAIRedirected = await convertToCurrencyDecimals(
      _DAI.address,
      "1000"
    );

    const aDAItoTransfer = await convertToCurrencyDecimals(_DAI.address, "500");

    const user2RedirectedBalanceBefore = await _aDAI.getRedirectedBalance(
      users[2].address
    );
    expect(user2RedirectedBalanceBefore.toString()).to.be.equal(
      aDAIRedirected,
      "Invalid redirected balance for user 2 before transfer"
    );

    await _aDAI
      .connect(users[1].signer)
      .transfer(users[0].address, aDAItoTransfer, {
        //from: users[1]
      });

    const user2RedirectedBalanceAfter = await _aDAI.getRedirectedBalance(
      users[2].address
    );
    const user1RedirectionAddress = await _aDAI.getInterestRedirectionAddress(
      users[1].address
    );

    expect(user2RedirectedBalanceAfter.toString()).to.be.equal(
      aDAItoTransfer,
      "Invalid redirected balance for user 2 after transfer"
    );
    expect(user1RedirectionAddress.toString()).to.be.equal(
      users[2].address,
      "Invalid redirection address for user 1"
    );
  });

  it("User 0 transfers back to user 1", async () => {
    const { users } = _testEnvProvider;

    const aDAItoTransfer = await convertToCurrencyDecimals(_DAI.address, "500");

    await _aDAI
      .connect(users[0].signer)
      .transfer(users[1].address, aDAItoTransfer, {
        //  from: users[0].address
      });

    const user2RedirectedBalanceAfter = await _aDAI.getRedirectedBalance(
      users[2].address
    );

    const user1BalanceAfter = await _aDAI.balanceOf(users[1].address);

    expect(user2RedirectedBalanceAfter.toString()).to.be.equal(
      user1BalanceAfter.toString(),
      "Invalid redirected balance for user 2 after transfer"
    );
  });

  // it("User 0 deposits 1 ETH and user tries to borrow, but the mTokens received as a transfer are not available as collateral (revert expected)", async () => {
  //   const { users } = _testEnvProvider;

  //   await _lendingPoolInstance.connect(users[0].signer).deposit(ETHEREUM_ADDRESS, oneEther.toString(), "0", {
  //     // from: users[0].address,
  //     value: oneEther.toFixed(0),
  //   });
  //   await expectRevert(

  //     _lendingPoolInstance.connect(users[1].signer).borrow(
  //       ETHEREUM_ADDRESS,
  //       "100000000000000000",
  //       RATEMODE_VARIABLE,
  //       "0",
  //       {
  //         //  from: users[1].address
  //       }
  //     ),
  //     "The collateral balance is 0"
  //   );
  // });

  // it("User 1 sets the DAI as collateral and borrows, tries to transfer everything back to user 0 (revert expected)", async () => {
  //   const { users } = _testEnvProvider;
  //   //await _DAI.connect(users[1].signer).mint(await convertToCurrencyDecimals(_DAI.address, "1000"));
  //   //user 1 deposits 1000 DAI
  //   // const amountDAItoDeposit = await convertToCurrencyDecimals(
  //   //   _DAI.address,
  //   //   "1000"
  //   // );
  //   // await _DAI.connect(users[1].signer).approve(
  //   //   _lendingPoolCoreInstance.address,
  //   //   APPROVAL_AMOUNT_LENDING_POOL_CORE,
  //   //   {
  //   //     // from: users[1].address,
  //   //   }
  //   // );
  //   // await waitForTx(
  //   //   await _lendingPoolInstance.connect(users[1].signer).deposit(_DAI.address, amountDAItoDeposit, "0", {
  //   //     // from: users[1],
  //   //   })
  //   // );
  //   await waitForTx(
  //     await _lendingPoolInstance.connect(users[1].signer).setUserUseReserveAsCollateral(
  //       _DAI.address,
  //       true,
  //       {
  //         // from: users[1]
  //       })
  //   );

  //   const aDAItoTransfer = await convertToCurrencyDecimals(
  //     _DAI.address,
  //     "1000"
  //   );
  //   await waitForTx(
  //     await _lendingPoolInstance.connect(users[1].signer).borrow(
  //       ETHEREUM_ADDRESS,
  //       "100000000000000000",
  //       RATEMODE_VARIABLE,
  //       "0",
  //       {
  //         // from: users[1]
  //       }
  //     )
  //   );

  //   await expectRevert(
  //     _aDAI.connect(users[1].signer).transfer(users[0].address, aDAItoTransfer, {
  //       //  from: users[1]
  //     }),
  //     "Transfer cannot be allowed."
  //   );
  // });

  it("User 0 tries to transfer 0 balance (revert expected)", async () => {
    const { users } = _testEnvProvider;
    await expectRevert(
      _aDAI.connect(users[0].signer).transfer(users[1].address, "0", {
        //  from: users[0]
      }),
      "Transferred amount needs to be greater than zero"
    );
  });

  // it("User 1 repays the borrow, transfers aDAI back to user 0", async () => {
  //   const { users } = _testEnvProvider;
  //   await _lendingPoolInstance.connect(users[1].signer).repay(
  //     ETHEREUM_ADDRESS,
  //     MAX_UINT_AMOUNT,
  //     users[1].address,
  //     { //from: users[1]
  //       value: oneEther.toFixed(0)
  //     }
  //   );

  //   const aDAItoTransfer = await convertToCurrencyDecimals(
  //     _DAI.address,
  //     "1000"
  //   );

  //   await _aDAI.connect(users[1].signer).transfer(users[0].address, aDAItoTransfer, {
  //     //from: users[1]
  //   });

  //   const user2RedirectedBalanceAfter = await _aDAI.getRedirectedBalance(
  //     users[2].address
  //   );

  //   const user1RedirectionAddress = await _aDAI.getInterestRedirectionAddress(
  //     users[1].address
  //   );

  //   expect(user2RedirectedBalanceAfter.toString()).to.be.equal(
  //     "0",
  //     "Invalid redirected balance for user 2 after transfer"
  //   );

  //   expect(user1RedirectionAddress.toString()).to.be.equal(
  //     NIL_ADDRESS,
  //     "Invalid redirected address for user 1"
  //   );
  // });

  // it("User 0 redirects interest to user 2, transfers 500 aDAI to user 1. User 1 redirects to user 3. User 0 transfers another 100 aDAI", async () => {
  //   const { users } = _testEnvProvider;
  //   let aDAItoTransfer = await convertToCurrencyDecimals(_DAI.address, "500");

  //   await _aDAI.connect(users[0].signer).redirectInterestStream(users[2].address, { //from: users[0]
  //   });

  //   await _aDAI.connect(users[0].signer).transfer(users[1].address, aDAItoTransfer, { //from: users[0]
  //   });

  //   await _aDAI.connect(users[1].signer).redirectInterestStream(users[3].address, { //from: users[1]
  //   });

  //   aDAItoTransfer = await convertToCurrencyDecimals(_DAI.address, "100");

  //   await _aDAI.connect(users[0].signer).transfer(users[1].address, aDAItoTransfer, { //from: users[0]
  //   });

  //   const user2RedirectedBalanceAfter = await _aDAI.getRedirectedBalance(
  //     users[2].address
  //   );
  //   const user3RedirectedBalanceAfter = await _aDAI.getRedirectedBalance(
  //     users[3].address
  //   );

  //   const expectedUser2Redirected = await convertToCurrencyDecimals(
  //     _DAI.address,
  //     "400"
  //   );
  //   const expectedUser3Redirected = await convertToCurrencyDecimals(
  //     _DAI.address,
  //     "600"
  //   );

  //   expect(user2RedirectedBalanceAfter.toString()).to.be.equal(
  //     expectedUser2Redirected,
  //     "Invalid redirected balance for user 2 after transfer"
  //   );
  //   expect(user3RedirectedBalanceAfter.toString()).to.be.equal(
  //     expectedUser3Redirected,
  //     "Invalid redirected balance for user 3 after transfer"
  //   );
  // });
});
