import solc from "solc";

export function compileSolidity(sourceCode) {
  const input = {
    language: "Solidity",
    sources: {
      "Contract.sol": { content: sourceCode },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"],
        },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  if (output.errors) {
    const errors = output.errors.filter((e) => e.severity === "error");
    if (errors.length > 0) {
      return {
        success: false,
        errors: errors.map((e) => ({
          message: e.formattedMessage || e.message,
          severity: e.severity,
          type: e.type,
        })),
      };
    }
  }

  const contracts = {};
  for (const fileName in output.contracts) {
    for (const contractName in output.contracts[fileName]) {
      const contract = output.contracts[fileName][contractName];
      contracts[contractName] = {
        abi: contract.abi,
        bytecode: contract.evm.bytecode.object,
      };
    }
  }

  const warnings = output.errors
    ? output.errors
        .filter((e) => e.severity === "warning")
        .map((e) => e.formattedMessage || e.message)
    : [];

  return { success: true, contracts, warnings };
}
