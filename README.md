# ChainCoder - Blockchain Developer Testing Platform

A step-based challenge platform where blockchain developers write Solidity smart contracts to solve problems of increasing difficulty. Each step must be completed before the next one unlocks.

## Tech Stack

- **Frontend**: React (Vite) + TailwindCSS + Monaco Editor
- **Backend**: Node.js + Express
- **Database**: MongoDB (in-memory, no installation required)
- **Blockchain**: solc (Solidity compiler) + Hardhat (in-memory EVM) + ethers.js

## Prerequisites

- Node.js 18+
- npm

## Getting Started

### 1. Install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Start the backend

This starts the Express API server, an in-memory MongoDB, and a Hardhat development node. Challenge data is seeded automatically on every startup.

```bash
cd server
npm run dev
```

### 3. Start the frontend

In a separate terminal:

```bash
cd client
npm run dev
```

Open `http://localhost:5173` in your browser.

## Project Structure

```
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   └── services/        # API client
│   └── ...
├── server/                  # Express backend
│   ├── config/              # Database config
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── services/            # Compiler & test runner
│   └── seed/                # Database seed data
└── README.md
```

## Challenges

### Easy

1. **Simple Storage** - Store and retrieve a value
2. **Ether Wallet** - Deposit, withdraw, and access control
3. **Event Logger** - Emit and track events
4. **Time Lock** - Time-delayed withdrawals
5. **Multi-Send** - Distribute Ether to multiple recipients

### Medium

6. **Basic ERC-20 Token** - Token transfers and allowances
7. **Voting Contract** - Proposals and voting system
8. **Staking Rewards** - Stake Ether and earn rewards over time
9. **Access Registry** - Role-based access control with keccak256
10. **Escrow** - Buyer/seller escrow with release and refund

### Hard

11. **Reentrancy Guard** - Fix a vulnerable contract
12. **Gas Optimizer** - Optimize a contract to reduce gas usage
13. **Multi-Sig Wallet** - Multi-owner transaction approval
14. **Proxy Upgrade** - Minimal proxy pattern with delegatecall
15. **Flash Loan Guard** - Prevent flash loan price manipulation

## How It Works

1. Select a challenge from the home page
2. Read the problem description and requirements
3. Write your Solidity code in the Monaco editor
4. Click **Submit** to compile and test your contract
5. All tests must pass to unlock the next challenge
6. Progress is saved in your browser's localStorage
