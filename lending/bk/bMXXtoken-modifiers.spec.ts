import {
  ITestEnv,
  ContractsInstancesOrigin,
  ImTokenInstances,
} from "../utils/types";
import { mTokenInstance } from "../utils/typechain-types/truffle-contracts";
import { testEnvProvider } from "../utils/truffle/dlp-tests-env";

const expectRevert = require("@openzeppelin/test-helpers").expectRevert;

contract("mToken: Modifiers", async ([deployer, ...users]) => {
  let _testEnvProvider: ITestEnv;
  let _aDAI: mTokenInstance;

  before("Initializing test variables", async () => {
    _testEnvProvider = await testEnvProvider(
      artifacts,
      [deployer, ...users],
      ContractsInstancesOrigin.TruffleArtifacts
    );

    const {
      deployedInstances: { mTokenInstances },
    } = _testEnvProvider;

    const { aDAI } = mTokenInstances;

    _aDAI = aDAI;
  });

  it("Tries to invoke mintOnDeposit", async () => {
    await expectRevert(
      _aDAI.mintOnDeposit(deployer, "1"),
      "The caller of this function must be a lending pool"
    );
  });

  it("Tries to invoke burnOnLiquidation", async () => {
    await expectRevert(
      _aDAI.burnOnLiquidation(deployer, "1"),
      "The caller of this function must be a lending pool"
    );
  });

  it("Tries to invoke transferOnLiquidation", async () => {
    await expectRevert(
      _aDAI.transferOnLiquidation(deployer, users[1], "1"),
      "The caller of this function must be a lending pool"
    );
  });
});
