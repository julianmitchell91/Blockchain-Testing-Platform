import mongoose from "mongoose";
import Problem from "../models/Problem.js";

const problems = [
  // ==================== EASY 1 ====================
  {
    stepInLevel: 1,
    difficulty: "easy",
    estimatedMinutes: 5,
    title: "Simple Storage",
    description: `# Simple Storage

Implement a smart contract that can **store** and **retrieve** a single unsigned integer.

## Requirements

1. Create a function \`store(uint256 _value)\` that saves a number to the contract's state.
2. Create a function \`retrieve()\` that returns the stored number.
3. The stored value should persist between calls.

## Hints

- Use a state variable to hold the value.
- \`retrieve\` should be a \`view\` function since it doesn't modify state.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    // TODO: Declare a state variable to store the value
    
    // TODO: Implement the store function
    function store(uint256 _value) public {
        // Your code here
    }

    // TODO: Implement the retrieve function
    function retrieve() public view returns (uint256) {
        // Your code here
    }
}`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedValue;

    function store(uint256 _value) public {
        storedValue = _value;
    }

    function retrieve() public view returns (uint256) {
        return storedValue;
    }
}`,
    testCases: [
      {
        name: "Should store and retrieve a value",
        testCode: `
const tx = await contract.store(42);
await tx.wait();
const value = await contract.retrieve();
if (value !== 42n) throw new Error("Expected 42, got " + value);`,
      },
      {
        name: "Should update the stored value",
        testCode: `
await (await contract.store(100)).wait();
let value = await contract.retrieve();
if (value !== 100n) throw new Error("Expected 100, got " + value);
await (await contract.store(999)).wait();
value = await contract.retrieve();
if (value !== 999n) throw new Error("Expected 999, got " + value);`,
      },
      {
        name: "Should start with default value of 0",
        testCode: `
const value = await contract.retrieve();
if (value !== 0n) throw new Error("Expected initial value 0, got " + value);`,
      },
    ],
    hints: [
      "Declare a uint256 state variable at the contract level.",
      "In store(), assign the parameter to the state variable.",
      "In retrieve(), return the state variable.",
    ],
  },

  // ==================== EASY 2 ====================
  {
    stepInLevel: 2,
    difficulty: "easy",
    estimatedMinutes: 10,
    title: "Ether Wallet",
    description: `# Ether Wallet

Build a simple wallet contract that can **receive**, **hold**, and **withdraw** Ether. Only the contract owner should be able to withdraw funds.

## Requirements

1. The contract deployer becomes the **owner**.
2. Implement a \`deposit()\` function that accepts Ether (\`payable\`).
3. Implement a \`getBalance()\` function that returns the contract's Ether balance.
4. Implement a \`withdraw(uint256 _amount)\` function that:
   - Only allows the **owner** to withdraw.
   - Reverts if the requested amount exceeds the balance.
   - Sends Ether to the owner.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EtherWallet {
    // TODO: Declare an owner state variable

    // TODO: Set the owner in the constructor
    constructor() {
        // Your code here
    }

    // TODO: Implement deposit (must be payable)
    function deposit() public payable {
        // Your code here
    }

    // TODO: Return the contract balance
    function getBalance() public view returns (uint256) {
        // Your code here
    }

    // TODO: Allow only owner to withdraw
    function withdraw(uint256 _amount) public {
        // Your code here
    }
}`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EtherWallet {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function deposit() public payable {}

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdraw(uint256 _amount) public {
        require(msg.sender == owner, "Not the owner");
        require(_amount <= address(this).balance, "Insufficient balance");
        payable(owner).transfer(_amount);
    }
}`,
    testCases: [
      {
        name: "Should accept deposits",
        testCode: `
const depositAmount = ethers.parseEther("1.0");
await (await contract.deposit({ value: depositAmount })).wait();
const balance = await contract.getBalance();
if (balance !== depositAmount) throw new Error("Expected 1 ETH, got " + ethers.formatEther(balance));`,
      },
      {
        name: "Should allow owner to withdraw",
        testCode: `
const depositAmount = ethers.parseEther("2.0");
await (await contract.deposit({ value: depositAmount })).wait();
const withdrawAmount = ethers.parseEther("1.0");
await (await contract.withdraw(withdrawAmount)).wait();
const balance = await contract.getBalance();
const expected = ethers.parseEther("1.0");
if (balance !== expected) throw new Error("Expected 1 ETH remaining, got " + ethers.formatEther(balance));`,
      },
      {
        name: "Should reject withdrawal from non-owner",
        testCode: `
const depositAmount = ethers.parseEther("1.0");
await (await contract.deposit({ value: depositAmount })).wait();
const nonOwner = signers[1];
const attackerContract = contract.connect(nonOwner);
try {
  await attackerContract.withdraw(depositAmount);
  throw new Error("Should have reverted");
} catch (e) {
  if (e.message === "Should have reverted") throw e;
}`,
      },
      {
        name: "Should reject withdrawal exceeding balance",
        testCode: `
const tooMuch = ethers.parseEther("100.0");
try {
  await contract.withdraw(tooMuch);
  throw new Error("Should have reverted");
} catch (e) {
  if (e.message === "Should have reverted") throw e;
}`,
      },
    ],
    hints: [
      "Use address public owner; and set it in the constructor with msg.sender.",
      "deposit() doesn't need a body — the payable modifier handles receiving Ether.",
      "getBalance() should return address(this).balance.",
      "In withdraw(), check msg.sender == owner and _amount <= balance before transferring.",
    ],
  },

  // ==================== EASY 3 ====================
  {
    stepInLevel: 3,
    difficulty: "easy",
    estimatedMinutes: 10,
    title: "Event Logger",
    description: `# Event Logger

Build a contract that emits events when values are stored. Events are crucial in Solidity for off-chain tracking.

## Requirements

1. Declare an event \`ValueStored(address indexed sender, uint256 value)\`.
2. Declare an event \`ValueReset(address indexed sender)\`.
3. Implement \`storeValue(uint256 _value)\` that saves the value and emits \`ValueStored\`.
4. Implement \`resetValue()\` that sets the stored value to 0 and emits \`ValueReset\`.
5. Implement \`getValue()\` that returns the current stored value.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventLogger {
    // TODO: Declare a state variable for the stored value

    // TODO: Declare event ValueStored(address indexed sender, uint256 value)

    // TODO: Declare event ValueReset(address indexed sender)

    function storeValue(uint256 _value) public {
        // TODO: Store the value and emit ValueStored
    }

    function resetValue() public {
        // TODO: Reset to 0 and emit ValueReset
    }

    function getValue() public view returns (uint256) {
        // TODO: Return the stored value
    }
}`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventLogger {
    uint256 private storedValue;

    event ValueStored(address indexed sender, uint256 value);
    event ValueReset(address indexed sender);

    function storeValue(uint256 _value) public {
        storedValue = _value;
        emit ValueStored(msg.sender, _value);
    }

    function resetValue() public {
        storedValue = 0;
        emit ValueReset(msg.sender);
    }

    function getValue() public view returns (uint256) {
        return storedValue;
    }
}`,
    testCases: [
      {
        name: "Should store value and emit event",
        testCode: `
const tx = await contract.storeValue(42);
const receipt = await tx.wait();
const event = receipt.logs[0];
if (!event) throw new Error("No event emitted");
const val = await contract.getValue();
if (val !== 42n) throw new Error("Expected 42, got " + val);`,
      },
      {
        name: "Should reset value and emit event",
        testCode: `
await (await contract.storeValue(99)).wait();
const tx = await contract.resetValue();
const receipt = await tx.wait();
if (!receipt.logs[0]) throw new Error("No event emitted on reset");
const val = await contract.getValue();
if (val !== 0n) throw new Error("Expected 0 after reset, got " + val);`,
      },
      {
        name: "Should start with value 0",
        testCode: `
const val = await contract.getValue();
if (val !== 0n) throw new Error("Expected initial value 0, got " + val);`,
      },
    ],
    hints: [
      "Use 'event ValueStored(address indexed sender, uint256 value);' to declare the event.",
      "Use 'emit ValueStored(msg.sender, _value);' inside the function.",
      "The indexed keyword allows filtering events by that parameter off-chain.",
    ],
  },

  // ==================== EASY 4 ====================
  {
    stepInLevel: 4,
    difficulty: "easy",
    estimatedMinutes: 15,
    title: "Time Lock",
    description: `# Time Lock

Build a contract where withdrawals are only allowed after a time delay has passed since deposit.

## Requirements

1. The deployer is the **owner**.
2. \`deposit()\` accepts Ether and records \`block.timestamp\` as the deposit time.
3. \`withdraw()\` sends the entire balance to the owner, but **only if** at least \`lockDuration\` seconds have passed since the last deposit.
4. \`getUnlockTime()\` returns the timestamp when funds become withdrawable.
5. The lock duration is **60 seconds**, set in the constructor.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TimeLock {
    // TODO: Declare state variables for owner, depositTime, and lockDuration

    constructor() {
        // TODO: Set owner and lockDuration (60 seconds)
    }

    function deposit() public payable {
        // TODO: Record deposit time
    }

    function withdraw() public {
        // TODO: Only owner, only after lock expires, send balance
    }

    function getUnlockTime() public view returns (uint256) {
        // TODO: Return depositTime + lockDuration
    }
}`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TimeLock {
    address public owner;
    uint256 public depositTime;
    uint256 public lockDuration;

    constructor() {
        owner = msg.sender;
        lockDuration = 60;
    }

    function deposit() public payable {
        depositTime = block.timestamp;
    }

    function withdraw() public {
        require(msg.sender == owner, "Not owner");
        require(block.timestamp >= depositTime + lockDuration, "Still locked");
        require(address(this).balance > 0, "No balance");
        payable(owner).transfer(address(this).balance);
    }

    function getUnlockTime() public view returns (uint256) {
        return depositTime + lockDuration;
    }
}`,
    testCases: [
      {
        name: "Should accept deposits",
        testCode: `
await (await contract.deposit({ value: ethers.parseEther("1.0") })).wait();
const bal = await provider.getBalance(await contract.getAddress());
if (bal !== ethers.parseEther("1.0")) throw new Error("Expected 1 ETH");`,
      },
      {
        name: "Should reject early withdrawal",
        testCode: `
await (await contract.deposit({ value: ethers.parseEther("1.0") })).wait();
try {
  await contract.withdraw();
  throw new Error("Should have reverted");
} catch (e) {
  if (e.message === "Should have reverted") throw e;
}`,
      },
      {
        name: "Should allow withdrawal after lock expires",
        testCode: `
await (await contract.deposit({ value: ethers.parseEther("1.0") })).wait();
await provider.send("evm_increaseTime", [61]);
await provider.send("evm_mine", []);
await (await contract.withdraw()).wait();
const bal = await provider.getBalance(await contract.getAddress());
if (bal !== 0n) throw new Error("Expected 0 balance after withdrawal");`,
      },
      {
        name: "Should return correct unlock time",
        testCode: `
await (await contract.deposit({ value: ethers.parseEther("1.0") })).wait();
const unlockTime = await contract.getUnlockTime();
const depositTime = unlockTime - 60n;
if (depositTime <= 0n) throw new Error("Invalid unlock time");`,
      },
    ],
    hints: [
      "Use block.timestamp to record when a deposit happens.",
      "In withdraw(), require(block.timestamp >= depositTime + lockDuration).",
      "Remember to check msg.sender == owner in withdraw().",
    ],
  },

  // ==================== EASY 5 ====================
  {
    stepInLevel: 5,
    difficulty: "easy",
    estimatedMinutes: 15,
    title: "Multi-Send",
    description: `# Multi-Send

Build a contract that distributes Ether to multiple recipients in a single transaction.

## Requirements

1. Implement \`multiSend(address[] calldata _recipients, uint256[] calldata _amounts)\` that:
   - Sends the specified amount of Ether to each recipient.
   - Reverts if the arrays have different lengths.
   - Reverts if the total sent exceeds \`msg.value\`.
2. The function must be \`payable\`.
3. Any leftover Ether (msg.value minus total sent) stays in the contract.
4. Implement \`getBalance()\` to return the contract balance.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MultiSend {
    function multiSend(
        address[] calldata _recipients,
        uint256[] calldata _amounts
    ) public payable {
        // TODO: Validate arrays, send Ether to each recipient
    }

    function getBalance() public view returns (uint256) {
        // TODO: Return contract balance
    }
}`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MultiSend {
    function multiSend(
        address[] calldata _recipients,
        uint256[] calldata _amounts
    ) public payable {
        require(_recipients.length == _amounts.length, "Length mismatch");
        uint256 total = 0;
        for (uint256 i = 0; i < _recipients.length; i++) {
            total += _amounts[i];
            payable(_recipients[i]).transfer(_amounts[i]);
        }
        require(total <= msg.value, "Insufficient value");
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}`,
    testCases: [
      {
        name: "Should send to multiple recipients",
        testCode: `
const addr1 = signers[1].address;
const addr2 = signers[2].address;
const bal1Before = await provider.getBalance(addr1);
const bal2Before = await provider.getBalance(addr2);
const amt = ethers.parseEther("1.0");
await (await contract.multiSend([addr1, addr2], [amt, amt], { value: ethers.parseEther("2.0") })).wait();
const bal1After = await provider.getBalance(addr1);
const bal2After = await provider.getBalance(addr2);
if (bal1After - bal1Before !== amt) throw new Error("Recipient 1 didn't receive correct amount");
if (bal2After - bal2Before !== amt) throw new Error("Recipient 2 didn't receive correct amount");`,
      },
      {
        name: "Should revert on length mismatch",
        testCode: `
try {
  await contract.multiSend([signers[1].address], [ethers.parseEther("1.0"), ethers.parseEther("1.0")], { value: ethers.parseEther("2.0") });
  throw new Error("Should have reverted");
} catch (e) {
  if (e.message === "Should have reverted") throw e;
}`,
      },
      {
        name: "Should keep leftover in contract",
        testCode: `
const amt = ethers.parseEther("0.5");
await (await contract.multiSend([signers[1].address], [amt], { value: ethers.parseEther("1.0") })).wait();
const bal = await contract.getBalance();
if (bal !== ethers.parseEther("0.5")) throw new Error("Expected 0.5 ETH leftover, got " + ethers.formatEther(bal));`,
      },
    ],
    hints: [
      "Use require(_recipients.length == _amounts.length) to validate.",
      "Loop through arrays and use payable(_recipients[i]).transfer(_amounts[i]).",
      "Track the total sent and ensure total <= msg.value.",
    ],
  },

  // ==================== MEDIUM 1 ====================
  {
    stepInLevel: 1,
    difficulty: "medium",
    estimatedMinutes: 20,
    title: "Basic ERC-20 Token",
    constructorArgs: ["1000000"],
    description: `# Basic ERC-20 Token

Implement a simplified ERC-20 token from scratch. The deployer receives the entire initial supply.

## Requirements

1. **State**: Track balances and allowances using mappings.
2. \`constructor(uint256 _totalSupply)\` — Mint the total supply to the deployer.
3. \`balanceOf(address _owner)\` — Return the balance of an address.
4. \`transfer(address _to, uint256 _amount)\` — Transfer tokens from the caller to \`_to\`.
5. \`approve(address _spender, uint256 _amount)\` — Allow \`_spender\` to spend up to \`_amount\` of your tokens.
6. \`allowance(address _owner, address _spender)\` — Return the remaining allowance.
7. \`transferFrom(address _from, address _to, uint256 _amount)\` — Transfer tokens on behalf of \`_from\` (requires sufficient allowance).

## Rules

- \`transfer\` and \`transferFrom\` must revert if the sender has insufficient balance.
- \`transferFrom\` must revert if the caller's allowance is insufficient.
- Deduct the transferred amount from the allowance in \`transferFrom\`.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BasicToken {
    string public name = "BasicToken";
    string public symbol = "BTK";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    // TODO: Declare a mapping for balances
    
    // TODO: Declare a nested mapping for allowances

    constructor(uint256 _totalSupply) {
        // TODO: Mint total supply to msg.sender
    }

    function balanceOf(address _owner) public view returns (uint256) {
        // TODO: Return the balance
    }

    function transfer(address _to, uint256 _amount) public returns (bool) {
        // TODO: Implement transfer
    }

    function approve(address _spender, uint256 _amount) public returns (bool) {
        // TODO: Set allowance
    }

    function allowance(address _owner, address _spender) public view returns (uint256) {
        // TODO: Return allowance
    }

    function transferFrom(address _from, address _to, uint256 _amount) public returns (bool) {
        // TODO: Implement delegated transfer
    }
}`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BasicToken {
    string public name = "BasicToken";
    string public symbol = "BTK";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowances;

    constructor(uint256 _totalSupply) {
        totalSupply = _totalSupply;
        balances[msg.sender] = _totalSupply;
    }

    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }

    function transfer(address _to, uint256 _amount) public returns (bool) {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
        return true;
    }

    function approve(address _spender, uint256 _amount) public returns (bool) {
        allowances[msg.sender][_spender] = _amount;
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256) {
        return allowances[_owner][_spender];
    }

    function transferFrom(address _from, address _to, uint256 _amount) public returns (bool) {
        require(balances[_from] >= _amount, "Insufficient balance");
        require(allowances[_from][msg.sender] >= _amount, "Insufficient allowance");
        balances[_from] -= _amount;
        balances[_to] += _amount;
        allowances[_from][msg.sender] -= _amount;
        return true;
    }
}`,
    testCases: [
      {
        name: "Should assign total supply to deployer",
        testCode: `
const supply = await contract.totalSupply();
const ownerBalance = await contract.balanceOf(signers[0].address);
if (ownerBalance !== supply) throw new Error("Deployer should have total supply");`,
      },
      {
        name: "Should transfer tokens between accounts",
        testCode: `
const amount = 1000n;
await (await contract.transfer(signers[1].address, amount)).wait();
const bal = await contract.balanceOf(signers[1].address);
if (bal !== amount) throw new Error("Expected " + amount + ", got " + bal);`,
      },
      {
        name: "Should fail transfer with insufficient balance",
        testCode: `
const other = contract.connect(signers[2]);
try {
  await other.transfer(signers[0].address, 1n);
  throw new Error("Should have reverted");
} catch (e) {
  if (e.message === "Should have reverted") throw e;
}`,
      },
      {
        name: "Should approve and transferFrom correctly",
        testCode: `
const amount = 500n;
await (await contract.approve(signers[1].address, amount)).wait();
const a = await contract.allowance(signers[0].address, signers[1].address);
if (a !== amount) throw new Error("Allowance should be " + amount);
const spender = contract.connect(signers[1]);
await (await spender.transferFrom(signers[0].address, signers[2].address, amount)).wait();
const bal = await contract.balanceOf(signers[2].address);
if (bal !== amount) throw new Error("Recipient should have " + amount);`,
      },
      {
        name: "Should fail transferFrom with insufficient allowance",
        testCode: `
const spender = contract.connect(signers[1]);
try {
  await spender.transferFrom(signers[0].address, signers[1].address, 1n);
  throw new Error("Should have reverted");
} catch (e) {
  if (e.message === "Should have reverted") throw e;
}`,
      },
    ],
    hints: [
      "Use mapping(address => uint256) for balances.",
      "Use mapping(address => mapping(address => uint256)) for allowances.",
      "In the constructor, set totalSupply and assign all tokens to msg.sender.",
      "In transferFrom, deduct from both balances[_from] and allowances[_from][msg.sender].",
    ],
  },

  // ==================== MEDIUM 2 ====================
  {
    stepInLevel: 2,
    difficulty: "medium",
    estimatedMinutes: 20,
    title: "Voting Contract",
    description: `# Voting Contract

Build a contract that allows an admin to create proposals and lets any address cast one vote per proposal.

## Requirements

1. The deployer is the **admin**.
2. \`createProposal(string memory _description)\` — Only the admin can create proposals. Each proposal gets an auto-incremented ID starting from 0.
3. \`vote(uint256 _proposalId)\` — Any address can vote once per proposal. Increment the proposal's vote count.
4. \`getProposal(uint256 _proposalId)\` — Returns the description and vote count.
5. \`getProposalCount()\` — Returns the total number of proposals.

## Rules

- Revert if a non-admin tries to create a proposal.
- Revert if an address votes on the same proposal twice.
- Revert if the proposal ID doesn't exist.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Proposal {
        string description;
        uint256 voteCount;
    }

    // TODO: Declare state variables
    //   - admin address
    //   - array of proposals
    //   - mapping to track who voted on which proposal

    constructor() {
        // TODO: Set admin
    }

    function createProposal(string memory _description) public {
        // TODO: Only admin can create, push new proposal
    }

    function vote(uint256 _proposalId) public {
        // TODO: Check proposal exists, check not voted, record vote
    }

    function getProposal(uint256 _proposalId) public view returns (string memory description, uint256 voteCount) {
        // TODO: Return proposal info
    }

    function getProposalCount() public view returns (uint256) {
        // TODO: Return length of proposals array
    }
}`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Proposal {
        string description;
        uint256 voteCount;
    }

    address public admin;
    Proposal[] public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    constructor() {
        admin = msg.sender;
    }

    function createProposal(string memory _description) public {
        require(msg.sender == admin, "Only admin");
        proposals.push(Proposal(_description, 0));
    }

    function vote(uint256 _proposalId) public {
        require(_proposalId < proposals.length, "Invalid proposal");
        require(!hasVoted[_proposalId][msg.sender], "Already voted");
        hasVoted[_proposalId][msg.sender] = true;
        proposals[_proposalId].voteCount++;
    }

    function getProposal(uint256 _proposalId) public view returns (string memory description, uint256 voteCount) {
        require(_proposalId < proposals.length, "Invalid proposal");
        Proposal storage p = proposals[_proposalId];
        return (p.description, p.voteCount);
    }

    function getProposalCount() public view returns (uint256) {
        return proposals.length;
    }
}`,
    testCases: [
      {
        name: "Admin should create proposals",
        testCode: `
await (await contract.createProposal("Proposal A")).wait();
await (await contract.createProposal("Proposal B")).wait();
const count = await contract.getProposalCount();
if (count !== 2n) throw new Error("Expected 2 proposals, got " + count);`,
      },
      {
        name: "Non-admin should not create proposals",
        testCode: `
const nonAdmin = contract.connect(signers[1]);
try {
  await nonAdmin.createProposal("Evil proposal");
  throw new Error("Should have reverted");
} catch (e) {
  if (e.message === "Should have reverted") throw e;
}`,
      },
      {
        name: "Should allow voting and track count",
        testCode: `
await (await contract.createProposal("Test")).wait();
await (await contract.connect(signers[1]).vote(0)).wait();
await (await contract.connect(signers[2]).vote(0)).wait();
const [desc, votes] = await contract.getProposal(0);
if (votes !== 2n) throw new Error("Expected 2 votes, got " + votes);
if (desc !== "Test") throw new Error("Expected description 'Test', got " + desc);`,
      },
      {
        name: "Should prevent double voting",
        testCode: `
await (await contract.createProposal("Double vote test")).wait();
await (await contract.connect(signers[1]).vote(0)).wait();
try {
  await contract.connect(signers[1]).vote(0);
  throw new Error("Should have reverted");
} catch (e) {
  if (e.message === "Should have reverted") throw e;
}`,
      },
      {
        name: "Should revert on invalid proposal ID",
        testCode: `
try {
  await contract.vote(999);
  throw new Error("Should have reverted");
} catch (e) {
  if (e.message === "Should have reverted") throw e;
}`,
      },
    ],
    hints: [
      "Use a Proposal[] dynamic array to store proposals.",
      "Use mapping(uint256 => mapping(address => bool)) to track votes.",
      "In createProposal, use proposals.push(Proposal(_description, 0)).",
      "In vote, check _proposalId < proposals.length and !hasVoted[_proposalId][msg.sender].",
    ],
  },

  // ==================== MEDIUM 3 ====================
  {
    stepInLevel: 3,
    difficulty: "medium",
    estimatedMinutes: 25,
    title: "Staking Rewards",
    description: `# Staking Rewards

Build a contract where users can stake Ether and earn a fixed reward rate.

## Requirements

1. \`stake()\` — Accept Ether and record the staker's balance and staking timestamp.
2. \`getReward(address _staker)\` — Return the accumulated reward: \`stakedAmount * (currentTime - stakeTime)\` in wei (1 wei per second per wei staked — simplified).
3. \`withdraw()\` — Return the staked amount **plus** the accumulated reward. Reset the stake.
4. \`getStake(address _staker)\` — Return the staked amount.

## Rules

- Users can only stake once (staking again reverts if they already have a stake).
- Withdraw reverts if the user has no stake.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StakingRewards {
    // TODO: Declare mappings for staked amounts and stake times

    function stake() public payable {
        // TODO: Record stake amount and time
    }

    function getStake(address _staker) public view returns (uint256) {
        // TODO: Return staked amount
    }

    function getReward(address _staker) public view returns (uint256) {
        // TODO: Calculate reward based on time staked
    }

    function withdraw() public {
        // TODO: Send back stake + reward, reset state
    }
}`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StakingRewards {
    mapping(address => uint256) public stakedAmount;
    mapping(address => uint256) public stakeTime;

    function stake() public payable {
        require(stakedAmount[msg.sender] == 0, "Already staking");
        require(msg.value > 0, "Must stake > 0");
        stakedAmount[msg.sender] = msg.value;
        stakeTime[msg.sender] = block.timestamp;
    }

    function getStake(address _staker) public view returns (uint256) {
        return stakedAmount[_staker];
    }

    function getReward(address _staker) public view returns (uint256) {
        if (stakedAmount[_staker] == 0) return 0;
        uint256 duration = block.timestamp - stakeTime[_staker];
        return stakedAmount[_staker] * duration;
    }

    function withdraw() public {
        uint256 staked = stakedAmount[msg.sender];
        require(staked > 0, "No stake");
        uint256 reward = getReward(msg.sender);
        stakedAmount[msg.sender] = 0;
        stakeTime[msg.sender] = 0;
        payable(msg.sender).transfer(staked);
    }
}`,
    testCases: [
      {
        name: "Should accept stake",
        testCode: `
await (await contract.stake({ value: ethers.parseEther("1.0") })).wait();
const staked = await contract.getStake(signers[0].address);
if (staked !== ethers.parseEther("1.0")) throw new Error("Expected 1 ETH staked");`,
      },
      {
        name: "Should prevent double staking",
        testCode: `
await (await contract.stake({ value: ethers.parseEther("1.0") })).wait();
try {
  await contract.stake({ value: ethers.parseEther("1.0") });
  throw new Error("Should have reverted");
} catch (e) {
  if (e.message === "Should have reverted") throw e;
}`,
      },
      {
        name: "Should calculate reward over time",
        testCode: `
await (await contract.stake({ value: 1000n })).wait();
await provider.send("evm_increaseTime", [100]);
await provider.send("evm_mine", []);
const reward = await contract.getReward(signers[0].address);
if (reward < 100000n) throw new Error("Reward too low: " + reward);`,
      },
      {
        name: "Should allow withdrawal",
        testCode: `
await (await contract.stake({ value: ethers.parseEther("1.0") })).wait();
await provider.send("evm_increaseTime", [10]);
await provider.send("evm_mine", []);
await (await contract.withdraw()).wait();
const staked = await contract.getStake(signers[0].address);
if (staked !== 0n) throw new Error("Stake should be 0 after withdrawal");`,
      },
    ],
    hints: [
      "Use two mappings: one for staked amounts, one for stake timestamps.",
      "Reward = stakedAmount * (block.timestamp - stakeTime).",
      "Reset both mappings in withdraw() before transferring.",
    ],
  },

  // ==================== MEDIUM 4 ====================
  {
    stepInLevel: 4,
    difficulty: "medium",
    estimatedMinutes: 25,
    title: "Access Registry",
    description: `# Access Registry

Build a role-based access control system. The deployer is the admin who can grant and revoke roles.

## Requirements

1. The deployer is the **admin** (role: \`"admin"\`).
2. \`grantRole(address _account, string memory _role)\` — Only admin can grant roles.
3. \`revokeRole(address _account, string memory _role)\` — Only admin can revoke roles.
4. \`hasRole(address _account, string memory _role)\` — Returns true/false.
5. \`getRoleHash(string memory _role)\` — Returns \`keccak256(abi.encodePacked(_role))\` (used internally for storage).

## Rules

- Admin cannot revoke their own admin role.
- Granting an already-held role is a no-op (doesn't revert).`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AccessRegistry {
    // TODO: Declare mapping for roles: address => roleHash => bool
    // TODO: Declare admin address

    constructor() {
        // TODO: Set admin, grant admin role to deployer
    }

    function grantRole(address _account, string memory _role) public {
        // TODO: Only admin, set role
    }

    function revokeRole(address _account, string memory _role) public {
        // TODO: Only admin, can't revoke own admin, remove role
    }

    function hasRole(address _account, string memory _role) public view returns (bool) {
        // TODO: Check role
    }

    function getRoleHash(string memory _role) public pure returns (bytes32) {
        // TODO: Return keccak256 hash
    }
}`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AccessRegistry {
    mapping(address => mapping(bytes32 => bool)) private roles;
    address public admin;

    constructor() {
        admin = msg.sender;
        roles[msg.sender][keccak256(abi.encodePacked("admin"))] = true;
    }

    function grantRole(address _account, string memory _role) public {
        require(msg.sender == admin, "Not admin");
        roles[_account][keccak256(abi.encodePacked(_role))] = true;
    }

    function revokeRole(address _account, string memory _role) public {
        require(msg.sender == admin, "Not admin");
        bytes32 roleHash = keccak256(abi.encodePacked(_role));
        bytes32 adminHash = keccak256(abi.encodePacked("admin"));
        require(!(_account == admin && roleHash == adminHash), "Cannot revoke own admin");
        roles[_account][roleHash] = false;
    }

    function hasRole(address _account, string memory _role) public view returns (bool) {
        return roles[_account][keccak256(abi.encodePacked(_role))];
    }

    function getRoleHash(string memory _role) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_role));
    }
}`,
    testCases: [
      {
        name: "Admin should have admin role",
        testCode: `
const has = await contract.hasRole(signers[0].address, "admin");
if (!has) throw new Error("Admin should have admin role");`,
      },
      {
        name: "Should grant and check roles",
        testCode: `
await (await contract.grantRole(signers[1].address, "minter")).wait();
const has = await contract.hasRole(signers[1].address, "minter");
if (!has) throw new Error("Should have minter role");`,
      },
      {
        name: "Should revoke roles",
        testCode: `
await (await contract.grantRole(signers[1].address, "minter")).wait();
await (await contract.revokeRole(signers[1].address, "minter")).wait();
const has = await contract.hasRole(signers[1].address, "minter");
if (has) throw new Error("Role should be revoked");`,
      },
      {
        name: "Non-admin cannot grant roles",
        testCode: `
try {
  await contract.connect(signers[1]).grantRole(signers[2].address, "minter");
  throw new Error("Should have reverted");
} catch (e) {
  if (e.message === "Should have reverted") throw e;
}`,
      },
      {
        name: "Admin cannot revoke own admin role",
        testCode: `
try {
  await contract.revokeRole(signers[0].address, "admin");
  throw new Error("Should have reverted");
} catch (e) {
  if (e.message === "Should have reverted") throw e;
}`,
      },
    ],
    hints: [
      "Use mapping(address => mapping(bytes32 => bool)) for role storage.",
      "Hash role strings with keccak256(abi.encodePacked(_role)) for storage keys.",
      "Check that admin can't revoke their own admin role in revokeRole().",
    ],
  },

  // ==================== MEDIUM 5 ====================
  {
    stepInLevel: 5,
    difficulty: "medium",
    estimatedMinutes: 30,
    title: "Escrow",
    description: `# Escrow

Build an escrow contract where a buyer deposits funds, and either the buyer releases them to the seller, or the buyer requests a refund.

## Requirements

1. \`constructor(address _seller)\` — Set the deployer as the buyer and the parameter as the seller.
2. \`deposit()\` — Only the buyer can deposit Ether. Can deposit multiple times.
3. \`release()\` — Only the buyer can release all funds to the seller.
4. \`refund()\` — Only the buyer can refund all funds back to themselves.
5. \`getBalance()\` — Returns the contract balance.

## Rules

- Only the buyer can call deposit, release, and refund.
- Release and refund should send the entire contract balance.
- Release and refund should revert if the balance is zero.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Escrow {
    // TODO: Declare buyer and seller addresses

    constructor(address _seller) {
        // TODO: Set buyer (msg.sender) and seller
    }

    function deposit() public payable {
        // TODO: Only buyer can deposit
    }

    function release() public {
        // TODO: Only buyer, send all funds to seller
    }

    function refund() public {
        // TODO: Only buyer, send all funds back to buyer
    }

    function getBalance() public view returns (uint256) {
        // TODO: Return contract balance
    }
}`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Escrow {
    address public buyer;
    address public seller;

    constructor(address _seller) {
        buyer = msg.sender;
        seller = _seller;
    }

    function deposit() public payable {
        require(msg.sender == buyer, "Not buyer");
    }

    function release() public {
        require(msg.sender == buyer, "Not buyer");
        require(address(this).balance > 0, "No funds");
        payable(seller).transfer(address(this).balance);
    }

    function refund() public {
        require(msg.sender == buyer, "Not buyer");
        require(address(this).balance > 0, "No funds");
        payable(buyer).transfer(address(this).balance);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}`,
    constructorArgs: ["$SIGNER_1"],
    testCases: [
      {
        name: "Should accept deposits from buyer",
        testCode: `
await (await contract.deposit({ value: ethers.parseEther("1.0") })).wait();
const bal = await contract.getBalance();
if (bal !== ethers.parseEther("1.0")) throw new Error("Expected 1 ETH");`,
      },
      {
        name: "Should release funds to seller",
        testCode: `
await (await contract.deposit({ value: ethers.parseEther("2.0") })).wait();
const sellerBefore = await provider.getBalance(signers[1].address);
await (await contract.release()).wait();
const sellerAfter = await provider.getBalance(signers[1].address);
if (sellerAfter <= sellerBefore) throw new Error("Seller should have received funds");
const bal = await contract.getBalance();
if (bal !== 0n) throw new Error("Contract should be empty");`,
      },
      {
        name: "Should refund funds to buyer",
        testCode: `
await (await contract.deposit({ value: ethers.parseEther("1.0") })).wait();
await (await contract.refund()).wait();
const bal = await contract.getBalance();
if (bal !== 0n) throw new Error("Contract should be empty after refund");`,
      },
      {
        name: "Non-buyer cannot deposit or release",
        testCode: `
try {
  await contract.connect(signers[1]).deposit({ value: ethers.parseEther("1.0") });
  throw new Error("Should have reverted");
} catch (e) {
  if (e.message === "Should have reverted") throw e;
}`,
      },
    ],
    hints: [
      "Store buyer = msg.sender and seller = _seller in the constructor.",
      "Use require(msg.sender == buyer) for access control.",
      "payable(seller).transfer(address(this).balance) sends all funds to seller.",
    ],
  },

  // ==================== HARD 1 ====================
  {
    stepInLevel: 1,
    difficulty: "hard",
    estimatedMinutes: 30,
    title: "Reentrancy Guard",
    description: `# Reentrancy Guard

You are given a vulnerable vault contract that allows users to deposit and withdraw Ether. However, the \`withdraw\` function is **vulnerable to a reentrancy attack** because it sends Ether before updating the balance.

## Your Task

Fix the \`withdraw\` function so that a reentrancy attack **cannot** drain the contract.

## The Vulnerability

\`\`\`solidity
function withdraw() public {
    uint256 bal = balances[msg.sender];
    require(bal > 0, "No balance");
    (bool sent, ) = msg.sender.call{value: bal}("");
    require(sent, "Failed to send");
    balances[msg.sender] = 0;  // Updated AFTER sending!
}
\`\`\`

An attacker can re-enter \`withdraw\` via a \`receive()\` fallback before the balance is set to zero.

## Requirements

1. Users can \`deposit()\` Ether.
2. Users can \`withdraw()\` their full balance.
3. The contract must be **safe from reentrancy** — update state before making external calls.
4. The \`getBalance(address)\` function should return a user's balance.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SecureVault {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function getBalance(address _addr) public view returns (uint256) {
        return balances[_addr];
    }

    // TODO: Fix this function to prevent reentrancy
    function withdraw() public {
        uint256 bal = balances[msg.sender];
        require(bal > 0, "No balance");
        
        // WARNING: This is vulnerable! Fix the order of operations.
        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send");
        balances[msg.sender] = 0;
    }
}`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SecureVault {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function getBalance(address _addr) public view returns (uint256) {
        return balances[_addr];
    }

    function withdraw() public {
        uint256 bal = balances[msg.sender];
        require(bal > 0, "No balance");
        balances[msg.sender] = 0;
        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send");
    }
}`,
    testCases: [
      {
        name: "Should accept deposits and track balance",
        testCode: `
const amount = ethers.parseEther("1.0");
await (await contract.deposit({ value: amount })).wait();
const bal = await contract.getBalance(signers[0].address);
if (bal !== amount) throw new Error("Expected 1 ETH balance");`,
      },
      {
        name: "Should allow normal withdrawal",
        testCode: `
const amount = ethers.parseEther("1.0");
await (await contract.deposit({ value: amount })).wait();
await (await contract.withdraw()).wait();
const contractBal = await contract.getBalance(signers[0].address);
if (contractBal !== 0n) throw new Error("Balance should be 0 after withdrawal");`,
      },
      {
        name: "Should prevent reentrancy attack",
        testCode: `
const attackerCode = \`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IVault {
    function deposit() external payable;
    function withdraw() external;
}

contract Attacker {
    IVault public vault;
    uint256 public attackCount;

    constructor(address _vault) {
        vault = IVault(_vault);
    }

    function attack() external payable {
        vault.deposit{value: msg.value}();
        vault.withdraw();
    }

    receive() external payable {
        if (attackCount < 5) {
            attackCount++;
            try vault.withdraw() {} catch {}
        }
    }
}\`;

const attackResult = compileSolidity(attackerCode);
if (!attackResult.success) throw new Error("Attacker contract failed to compile");
const attackArtifact = attackResult.contracts["Attacker"];

const depositAmount = ethers.parseEther("5.0");
await (await contract.deposit({ value: depositAmount })).wait();

const contractAddress = await contract.getAddress();
const attackerFactory = new ethers.ContractFactory(
  attackArtifact.abi,
  attackArtifact.bytecode,
  signers[1]
);
const attacker = await attackerFactory.deploy(contractAddress);
await attacker.waitForDeployment();

const attackAmount = ethers.parseEther("1.0");
await (await attacker.attack({ value: attackAmount })).wait();

const vaultBalance = await provider.getBalance(contractAddress);
if (vaultBalance < depositAmount) {
  throw new Error("Reentrancy attack drained the vault! Vault balance: " + ethers.formatEther(vaultBalance) + " ETH");
}`,
      },
    ],
    hints: [
      "The key fix is to update balances[msg.sender] = 0 BEFORE the external call.",
      "This is called the Checks-Effects-Interactions pattern.",
      "You can also add a bool locked state variable as a reentrancy mutex.",
    ],
  },

  // ==================== HARD 2 ====================
  {
    stepInLevel: 2,
    difficulty: "hard",
    estimatedMinutes: 35,
    title: "Gas Optimizer",
    description: `# Gas Optimizer

You are given a working but gas-inefficient contract that sums an array of numbers. Optimize it so the \`sum()\` function uses **less than 30,000 gas** for an array of 10 elements.

## The Inefficient Version

\`\`\`solidity
function addNumbers(uint256[] memory _numbers) public {
    for (uint256 i = 0; i < _numbers.length; i++) {
        total = total + _numbers[i];  // SSTORE on every iteration!
    }
}
\`\`\`

## Requirements

1. \`addNumbers(uint256[] calldata _numbers)\` — Adds all numbers to the running total.
2. \`getTotal()\` — Returns the current total.
3. \`reset()\` — Sets total back to 0.
4. The \`addNumbers\` function must use **calldata** (not memory) for the array parameter.
5. Accumulate in a **local variable** and write to storage only once.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GasOptimizer {
    uint256 public total;

    // TODO: Optimize this function to minimize gas usage
    function addNumbers(uint256[] memory _numbers) public {
        for (uint256 i = 0; i < _numbers.length; i++) {
            total = total + _numbers[i];
        }
    }

    function getTotal() public view returns (uint256) {
        // TODO: Return total
    }

    function reset() public {
        // TODO: Reset total to 0
    }
}`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GasOptimizer {
    uint256 public total;

    function addNumbers(uint256[] calldata _numbers) public {
        uint256 localTotal = total;
        for (uint256 i = 0; i < _numbers.length; i++) {
            localTotal += _numbers[i];
        }
        total = localTotal;
    }

    function getTotal() public view returns (uint256) {
        return total;
    }

    function reset() public {
        total = 0;
    }
}`,
    testCases: [
      {
        name: "Should sum numbers correctly",
        testCode: `
await (await contract.addNumbers([1, 2, 3, 4, 5])).wait();
const total = await contract.getTotal();
if (total !== 15n) throw new Error("Expected 15, got " + total);`,
      },
      {
        name: "Should accumulate across calls",
        testCode: `
await (await contract.addNumbers([10, 20])).wait();
await (await contract.addNumbers([30])).wait();
const total = await contract.getTotal();
if (total !== 60n) throw new Error("Expected 60, got " + total);`,
      },
      {
        name: "Should reset total",
        testCode: `
await (await contract.addNumbers([100])).wait();
await (await contract.reset()).wait();
const total = await contract.getTotal();
if (total !== 0n) throw new Error("Expected 0 after reset, got " + total);`,
      },
      {
        name: "Should use calldata for gas efficiency",
        testCode: `
const nums = [1,2,3,4,5,6,7,8,9,10];
const tx = await contract.addNumbers(nums);
const receipt = await tx.wait();
if (receipt.gasUsed > 30000n) throw new Error("Gas too high: " + receipt.gasUsed + " (must be < 30000)");`,
      },
    ],
    hints: [
      "Use calldata instead of memory for the array parameter to avoid copying.",
      "Cache the storage variable (total) in a local variable before the loop.",
      "Write back to storage only once after the loop completes.",
    ],
  },

  // ==================== HARD 3 ====================
  {
    stepInLevel: 3,
    difficulty: "hard",
    estimatedMinutes: 45,
    title: "Multi-Sig Wallet",
    constructorArgs: [["$SIGNER_0", "$SIGNER_1", "$SIGNER_2"], 2],
    description: `# Multi-Sig Wallet

Build a wallet that requires multiple owners to approve a transaction before it executes.

## Requirements

1. \`constructor(address[] memory _owners, uint256 _required)\` — Set owners and the number of required confirmations.
2. \`submitTransaction(address _to, uint256 _value)\` — Any owner can submit a transaction. Returns the transaction index.
3. \`confirmTransaction(uint256 _txIndex)\` — An owner confirms a pending transaction.
4. \`executeTransaction(uint256 _txIndex)\` — Execute a transaction once it has enough confirmations.
5. \`getTransactionCount()\` — Returns total number of submitted transactions.
6. \`isConfirmed(uint256 _txIndex, address _owner)\` — Returns whether an owner confirmed a transaction.

## Rules

- Only owners can submit, confirm, and execute.
- An owner can only confirm once per transaction.
- Execution requires at least \`required\` confirmations.
- A transaction can only execute once.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MultiSigWallet {
    struct Transaction {
        address to;
        uint256 value;
        bool executed;
        uint256 confirmations;
    }

    // TODO: Declare state variables
    //   - owners array, required count
    //   - isOwner mapping
    //   - transactions array
    //   - confirmation tracking mapping

    constructor(address[] memory _owners, uint256 _required) {
        // TODO: Validate and store owners, required
    }

    receive() external payable {}

    function submitTransaction(address _to, uint256 _value) public returns (uint256) {
        // TODO: Only owner, create transaction, return index
    }

    function confirmTransaction(uint256 _txIndex) public {
        // TODO: Only owner, not already confirmed, increment
    }

    function executeTransaction(uint256 _txIndex) public {
        // TODO: Only owner, enough confirmations, not executed, send value
    }

    function getTransactionCount() public view returns (uint256) {
        // TODO: Return transactions length
    }

    function isConfirmed(uint256 _txIndex, address _owner) public view returns (bool) {
        // TODO: Return confirmation status
    }
}`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MultiSigWallet {
    struct Transaction {
        address to;
        uint256 value;
        bool executed;
        uint256 confirmations;
    }

    address[] public owners;
    uint256 public required;
    mapping(address => bool) public isOwner;
    Transaction[] public transactions;
    mapping(uint256 => mapping(address => bool)) public confirmed;

    constructor(address[] memory _owners, uint256 _required) {
        require(_owners.length > 0, "No owners");
        require(_required > 0 && _required <= _owners.length, "Invalid required");
        for (uint256 i = 0; i < _owners.length; i++) {
            require(_owners[i] != address(0), "Zero address");
            require(!isOwner[_owners[i]], "Duplicate owner");
            isOwner[_owners[i]] = true;
            owners.push(_owners[i]);
        }
        required = _required;
    }

    receive() external payable {}

    function submitTransaction(address _to, uint256 _value) public returns (uint256) {
        require(isOwner[msg.sender], "Not owner");
        transactions.push(Transaction(_to, _value, false, 0));
        return transactions.length - 1;
    }

    function confirmTransaction(uint256 _txIndex) public {
        require(isOwner[msg.sender], "Not owner");
        require(_txIndex < transactions.length, "Invalid index");
        require(!confirmed[_txIndex][msg.sender], "Already confirmed");
        confirmed[_txIndex][msg.sender] = true;
        transactions[_txIndex].confirmations++;
    }

    function executeTransaction(uint256 _txIndex) public {
        require(isOwner[msg.sender], "Not owner");
        require(_txIndex < transactions.length, "Invalid index");
        Transaction storage txn = transactions[_txIndex];
        require(!txn.executed, "Already executed");
        require(txn.confirmations >= required, "Not enough confirmations");
        txn.executed = true;
        (bool sent, ) = txn.to.call{value: txn.value}("");
        require(sent, "Transfer failed");
    }

    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }

    function isConfirmed(uint256 _txIndex, address _owner) public view returns (bool) {
        return confirmed[_txIndex][_owner];
    }
}`,
    testCases: [
      {
        name: "Should submit and confirm transactions",
        testCode: `
const owners = [signers[0].address, signers[1].address, signers[2].address];
const addr = await contract.getAddress();
await signers[0].sendTransaction({ to: addr, value: ethers.parseEther("5.0") });
await (await contract.submitTransaction(signers[3].address, ethers.parseEther("1.0"))).wait();
const count = await contract.getTransactionCount();
if (count !== 1n) throw new Error("Expected 1 transaction");`,
      },
      {
        name: "Should execute after enough confirmations",
        testCode: `
const addr = await contract.getAddress();
await signers[0].sendTransaction({ to: addr, value: ethers.parseEther("5.0") });
await (await contract.submitTransaction(signers[4].address, ethers.parseEther("1.0"))).wait();
await (await contract.confirmTransaction(0)).wait();
await (await contract.connect(signers[1]).confirmTransaction(0)).wait();
const balBefore = await provider.getBalance(signers[4].address);
await (await contract.executeTransaction(0)).wait();
const balAfter = await provider.getBalance(signers[4].address);
if (balAfter - balBefore !== ethers.parseEther("1.0")) throw new Error("Recipient didn't receive 1 ETH");`,
      },
      {
        name: "Should reject execution without enough confirmations",
        testCode: `
const addr = await contract.getAddress();
await signers[0].sendTransaction({ to: addr, value: ethers.parseEther("5.0") });
await (await contract.submitTransaction(signers[3].address, ethers.parseEther("1.0"))).wait();
await (await contract.confirmTransaction(0)).wait();
try {
  await contract.executeTransaction(0);
  throw new Error("Should have reverted");
} catch (e) {
  if (e.message === "Should have reverted") throw e;
}`,
      },
      {
        name: "Non-owner cannot submit",
        testCode: `
try {
  await contract.connect(signers[4]).submitTransaction(signers[3].address, 100n);
  throw new Error("Should have reverted");
} catch (e) {
  if (e.message === "Should have reverted") throw e;
}`,
      },
    ],
    hints: [
      "Use a mapping(uint256 => mapping(address => bool)) to track confirmations.",
      "submitTransaction pushes to the array and returns transactions.length - 1.",
      "In executeTransaction, check confirmations >= required before executing.",
    ],
  },

  // ==================== HARD 4 ====================
  {
    stepInLevel: 4,
    difficulty: "hard",
    estimatedMinutes: 45,
    title: "Proxy Upgrade",
    constructorArgs: ["$SIGNER_3"],
    description: `# Proxy Upgrade

Implement a minimal proxy pattern using \`delegatecall\`. The proxy stores state but delegates logic execution to an implementation contract.

## Requirements

1. \`constructor(address _implementation)\` — Set the implementation address.
2. \`upgrade(address _newImplementation)\` — Only the admin (deployer) can change the implementation.
3. \`getImplementation()\` — Returns the current implementation address.
4. \`getAdmin()\` — Returns the admin address.
5. A \`fallback()\` function that delegates all calls to the implementation via \`delegatecall\`.

## Rules

- Only the admin can call \`upgrade\`.
- The fallback must forward the return data from delegatecall.
- The proxy stores all state; the implementation only provides logic.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Proxy {
    // TODO: Declare admin and implementation addresses

    constructor(address _implementation) {
        // TODO: Set admin and implementation
    }

    function upgrade(address _newImplementation) public {
        // TODO: Only admin, update implementation
    }

    function getImplementation() public view returns (address) {
        // TODO: Return implementation
    }

    function getAdmin() public view returns (address) {
        // TODO: Return admin
    }

    // TODO: Implement fallback that delegatecalls to implementation
    fallback() external payable {
        // Your code here
    }

    receive() external payable {}
}`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Proxy {
    address public admin;
    address public implementation;

    constructor(address _implementation) {
        admin = msg.sender;
        implementation = _implementation;
    }

    function upgrade(address _newImplementation) public {
        require(msg.sender == admin, "Not admin");
        implementation = _newImplementation;
    }

    function getImplementation() public view returns (address) {
        return implementation;
    }

    function getAdmin() public view returns (address) {
        return admin;
    }

    fallback() external payable {
        address impl = implementation;
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }

    receive() external payable {}
}`,
    testCases: [
      {
        name: "Should set implementation and admin",
        testCode: `
const impl = await contract.getImplementation();
const admin = await contract.getAdmin();
if (admin !== signers[0].address) throw new Error("Admin mismatch");
if (impl === ethers.ZeroAddress) throw new Error("Implementation not set");`,
      },
      {
        name: "Should allow admin to upgrade",
        testCode: `
const newAddr = signers[3].address;
await (await contract.upgrade(newAddr)).wait();
const impl = await contract.getImplementation();
if (impl !== newAddr) throw new Error("Implementation not updated");`,
      },
      {
        name: "Non-admin cannot upgrade",
        testCode: `
try {
  await contract.connect(signers[1]).upgrade(signers[2].address);
  throw new Error("Should have reverted");
} catch (e) {
  if (e.message === "Should have reverted") throw e;
}`,
      },
    ],
    hints: [
      "Use assembly with delegatecall in the fallback function.",
      "calldatacopy, delegatecall, returndatacopy is the standard pattern.",
      "Store admin and implementation as regular state variables.",
    ],
  },

  // ==================== HARD 5 ====================
  {
    stepInLevel: 5,
    difficulty: "hard",
    estimatedMinutes: 60,
    title: "Flash Loan Guard",
    description: `# Flash Loan Guard

You are given a simple token vault with a price oracle. The oracle is vulnerable to flash-loan manipulation because it uses the vault's **current** token balance to determine price. Fix it.

## The Vulnerability

The \`getPrice()\` function returns \`address(this).balance / totalShares\`, which can be manipulated by depositing a large amount in the same transaction (flash loan) to inflate the price.

## Requirements

1. \`deposit()\` — Accept Ether, mint shares proportional to the deposit.
2. \`withdraw(uint256 _shares)\` — Burn shares, return proportional Ether.
3. \`getShares(address _user)\` — Return user's share count.
4. \`getPrice()\` — Return the price per share, but **use a snapshot-based approach**: record the balance at the end of each transaction, and use the **previous** balance for price calculation to prevent same-block manipulation.

## Hint

- Store a \`lastRecordedBalance\` that updates at the end of deposit/withdraw.
- \`getPrice()\` reads from \`lastRecordedBalance\`, not \`address(this).balance\`.`,
    starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FlashLoanGuard {
    mapping(address => uint256) public shares;
    uint256 public totalShares;
    
    // TODO: Add a snapshot variable to prevent flash loan manipulation

    function deposit() public payable {
        // TODO: Mint shares based on value, update snapshot
    }

    function withdraw(uint256 _shares) public {
        // TODO: Burn shares, send proportional ETH, update snapshot
    }

    function getShares(address _user) public view returns (uint256) {
        // TODO: Return user shares
    }

    function getPrice() public view returns (uint256) {
        // TODO: Return price per share using snapshot (not current balance)
    }
}`,
    solutionCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FlashLoanGuard {
    mapping(address => uint256) public shares;
    uint256 public totalShares;
    uint256 public lastRecordedBalance;

    function deposit() public payable {
        uint256 sharesToMint;
        if (totalShares == 0) {
            sharesToMint = msg.value;
        } else {
            sharesToMint = (msg.value * totalShares) / lastRecordedBalance;
        }
        shares[msg.sender] += sharesToMint;
        totalShares += sharesToMint;
        lastRecordedBalance = address(this).balance;
    }

    function withdraw(uint256 _shares) public {
        require(shares[msg.sender] >= _shares, "Not enough shares");
        uint256 ethAmount = (_shares * lastRecordedBalance) / totalShares;
        shares[msg.sender] -= _shares;
        totalShares -= _shares;
        payable(msg.sender).transfer(ethAmount);
        lastRecordedBalance = address(this).balance;
    }

    function getShares(address _user) public view returns (uint256) {
        return shares[_user];
    }

    function getPrice() public view returns (uint256) {
        if (totalShares == 0) return 0;
        return lastRecordedBalance / totalShares;
    }
}`,
    testCases: [
      {
        name: "Should mint shares on deposit",
        testCode: `
await (await contract.deposit({ value: ethers.parseEther("1.0") })).wait();
const s = await contract.getShares(signers[0].address);
if (s === 0n) throw new Error("Should have shares");`,
      },
      {
        name: "Should withdraw proportionally",
        testCode: `
await (await contract.deposit({ value: ethers.parseEther("2.0") })).wait();
const s = await contract.getShares(signers[0].address);
await (await contract.withdraw(s / 2n)).wait();
const bal = await contract.getShares(signers[0].address);
if (bal !== s / 2n) throw new Error("Should have half shares left");`,
      },
      {
        name: "Price should use snapshot, not live balance",
        testCode: `
await (await contract.deposit({ value: ethers.parseEther("1.0") })).wait();
const priceBefore = await contract.getPrice();
await signers[1].sendTransaction({ to: await contract.getAddress(), value: ethers.parseEther("10.0") });
const priceAfter = await contract.getPrice();
if (priceAfter !== priceBefore) throw new Error("Price changed from direct transfer! Should use snapshot. Before: " + priceBefore + " After: " + priceAfter);`,
      },
      {
        name: "Should handle multiple depositors",
        testCode: `
await (await contract.deposit({ value: ethers.parseEther("1.0") })).wait();
await (await contract.connect(signers[1]).deposit({ value: ethers.parseEther("1.0") })).wait();
const s0 = await contract.getShares(signers[0].address);
const s1 = await contract.getShares(signers[1].address);
if (s0 === 0n || s1 === 0n) throw new Error("Both should have shares");
const total = await contract.totalShares();
if (total !== s0 + s1) throw new Error("Total mismatch");`,
      },
    ],
    hints: [
      "Add a uint256 lastRecordedBalance variable.",
      "Update lastRecordedBalance = address(this).balance at the END of deposit() and withdraw().",
      "getPrice() should return lastRecordedBalance / totalShares, not address(this).balance / totalShares.",
    ],
  },
];

// The Escrow contract needs the seller address as a constructor arg.
// We handle this by setting it dynamically in the test runner based on signers[1].
// For seed purposes, we leave constructorArgs empty and let the test runner handle default deployment.
// For Escrow specifically, we need a special constructorArgs approach.

export async function seedProblems() {
  await Problem.deleteMany({});
  await Problem.insertMany(problems);
  console.log(`Seeded ${problems.length} problems`);
}

const isMainModule =
  process.argv[1] &&
  import.meta.url === new URL(process.argv[1], "file://").href;

if (isMainModule) {
  (async () => {
    try {
      const { default: connectDB } = await import("../config/db.js");
      await connectDB();
      await seedProblems();
      await mongoose.disconnect();
      console.log("Done!");
      process.exit(0);
    } catch (error) {
      console.error("Seed error:", error);
      process.exit(1);
    }
  })();
}
