import { ethers } from "ethers";
import { compileSolidity } from "./compiler.js";

const HARDHAT_URL = `http://127.0.0.1:${process.env.HARDHAT_PORT || 8545}`;
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

async function getProviderAndSigners() {
  const provider = new ethers.JsonRpcProvider(HARDHAT_URL);
  const signers = [];
  const accounts = await provider.send("eth_accounts", []);
  for (const addr of accounts.slice(0, 5)) {
    signers.push(await provider.getSigner(addr));
  }
  return { provider, signers };
}

function resolveConstructorArgs(args, signers) {
  return args.map((arg) => {
    if (Array.isArray(arg)) return resolveConstructorArgs(arg, signers);
    if (typeof arg === "string" && /^\$SIGNER_(\d+)$/.test(arg)) {
      const idx = parseInt(arg.match(/^\$SIGNER_(\d+)$/)[1], 10);
      return signers[idx].address;
    }
    return arg;
  });
}

export async function runTests(
  sourceCode,
  testCases,
  constructorArgs = []
) {
  const compilation = compileSolidity(sourceCode);
  if (!compilation.success) {
    return {
      compiled: false,
      errors: compilation.errors,
      testResults: [],
      allPassed: false,
    };
  }

  const contractNames = Object.keys(compilation.contracts);
  if (contractNames.length === 0) {
    return {
      compiled: false,
      errors: [{ message: "No contracts found in the source code." }],
      testResults: [],
      allPassed: false,
    };
  }

  const { provider, signers } = await getProviderAndSigners();

  const snapshotId = await provider.send("evm_snapshot", []);

  const testResults = [];
  let allPassed = true;

  try {
    const mainContractName = contractNames[0];
    const { abi, bytecode } = compilation.contracts[mainContractName];

    const resolvedArgs = resolveConstructorArgs(constructorArgs, signers);
    const factory = new ethers.ContractFactory(abi, bytecode, signers[0]);
    const contract = await factory.deploy(...resolvedArgs);
    await contract.waitForDeployment();

    for (const testCase of testCases) {
      try {
        const testFn = new AsyncFunction(
          "contract",
          "ethers",
          "provider",
          "signers",
          "compileSolidity",
          testCase.testCode
        );
        await testFn(contract, ethers, provider, signers, compileSolidity);
        testResults.push({ name: testCase.name, passed: true, error: null });
      } catch (error) {
        allPassed = false;
        testResults.push({
          name: testCase.name,
          passed: false,
          error: error.message || String(error),
        });
      }
    }
  } catch (deployError) {
    allPassed = false;
    testResults.push({
      name: "Contract Deployment",
      passed: false,
      error: deployError.message || String(deployError),
    });
  } finally {
    await provider.send("evm_revert", [snapshotId]);
  }

  return {
    compiled: true,
    warnings: compilation.warnings,
    testResults,
    allPassed,
  };
}
