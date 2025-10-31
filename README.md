# Archer for Colosseum Cypherpunk Hackathon - Toy Dual Flow Batch Auction (DFBA)

A minimal implementation of a dual flow batch auction mechanism on Solana, demonstrating time-based batch clearing with separate bid and ask auctions. This project includes a Solana program (smart contract), automated market making service, crank service for batch execution, and a real-time frontend interface.

> **⚠️ DEMONSTRATION PURPOSES ONLY**
>
> This implementation is a proof-of-concept for educational and demonstration purposes. It is **NOT production-ready** and should **NOT be used in production environments** without significant enhancements, security audits, and proper testing. The code lacks essential features such as token transfers, proper access controls, economic security mechanisms, and comprehensive error handling required for real-world trading systems.

## Table of Contents

- [What is Dual Flow Batch Auction?](#what-is-dual-flow-batch-auction)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Core Components](#core-components)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Technical Details](#technical-details)
- [Configuration](#configuration)

## What is Dual Flow Batch Auction?

A Dual Flow Batch Auction (DFBA) is a trading mechanism that processes orders in discrete batches at regular intervals, rather than continuously. This implementation features:

- **Two Separate Auctions**: Independent bid and ask auctions that clear simultaneously
- **Maker/Taker Orders**: Distinguishes between market makers (liquidity providers) and takers
- **Time-Based Batching**: Orders accumulate during a batch interval and execute atomically (every 100ms)
- **Uniform Clearing Price**: All matched orders execute at the same clearing price within each auction
- **MEV Resistance**: Batch processing reduces front-running opportunities compared to continuous order books
- **Ephemeral Rollups Integration**: Leverages ephemeral rollups for high-frequency batch execution with delegation support

### Bid vs Ask Auctions

- **Bid Auction**: Makers buy, Takers sell → Determines the price at which makers buy
- **Ask Auction**: Makers sell, Takers buy → Determines the price at which makers sell

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      SOLANA BLOCKCHAIN                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              TOY-DFBA PROGRAM (Rust/Anchor)                │ │
│  │                                                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │ │
│  │  │ Auction      │  │   Bid Queue  │  │   Ask Queue  │      │ │
│  │  │ State        │  │   (Orders)   │  │   (Orders)   │      │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘      │ │
│  │                                                            │ │
│  │  Instructions:                                             │ │
│  │  • initialize()        • place_order()                     │ │
│  │  • execute_batch()     • cancel_all_orders()               │ │
│  │  • place_multiple_orders()                                 │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ RPC Calls
                              │
┌─────────────────────────────┼────────────────────────────────────┐
│                      BACKEND SERVICES                            │
│                          (TypeScript)                            │
│  ┌──────────────────┐   ┌──────────────────┐   ┌──────────────┐  │
│  │  Maker Service   │   │  Crank Service   │   │ API Service  │  │
│  │                  │   │                  │   │              │  │
│  │ • Posts maker    │   │ • Monitors slots │   │ • REST API   │  │
│  │   orders (10)    │   │ • Executes batch │   │ • WebSocket  │  │
│  │ • Cancels old    │   │   every interval │   │ • Real-time  │  │
│  │   orders         │   │ • Fetches results│   │   updates    │  │
│  │ • Every 100ms    │   │ • Every 100ms    │   │              │  │
│  └──────────────────┘   └──────────────────┘   └──────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP + WebSocket
                              ▼
┌────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ Trading Panel    │  │   Order Book     │  │   Auction    │  │
│  │                  │  │                  │  │   Results    │  │
│  │ • Place orders   │  │ • Live bid/ask   │  │ • Clearing   │  │
│  │ • Buy/Sell       │  │ • Price levels   │  │   prices     │  │
│  │ • Maker/Taker    │  │ • Volumes        │  │ • Volumes    │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
1. ORDER PLACEMENT
   User/Maker → Frontend → Program → Bid/Ask Queue

2. BATCH EXECUTION (Every 100ms)
   Crank Service → execute_batch() → Auction Algorithm → Clear both auctions

3. AUCTION CLEARING
   ┌─────────────────┐
   │  Bid Auction    │  1. Separate maker/taker orders
   │  (Maker Buys)   │  2. Sort by price
   │                 │  3. Find price with max volume
   │  Ask Auction    │  4. Execute trades at clearing price
   │  (Maker Sells)  │  5. Update filled quantities
   └─────────────────┘

4. RESULT BROADCASTING
   Program Event → API Service → WebSocket → Frontend Update
```

## Project Structure

```
toy-dfba/
├── programs/
│   └── toy-dfba/
│       └── src/
│           ├── lib.rs                    # Program entry point, instruction definitions
│           ├── state.rs                  # Account structures (AuctionState, OrderQueue, Order, etc.)
│           ├── errors.rs                 # Custom error codes
│           ├── instructions/
│           │   ├── initialize.rs         # Initialize auction state and queues
│           │   ├── place_order.rs        # Single order placement
│           │   ├── place_multiple_orders.rs  # Batch order placement
│           │   ├── cancel_all_orders.rs  # Cancel user's orders
│           │   └── execute_batch.rs      # Crank: execute auction batch
│           └── processor/
│               └── auction.rs            # Core auction clearing algorithm
│
├── backend/
│   └── src/
│       ├── index.ts                      # Server entry point, service orchestration
│       ├── config/
│       │   ├── index.ts                  # Configuration (RPC, keypairs, intervals)
│       │   ├── maker-keypair.json        # Maker bot identity
│       │   └── crank-keypair.json        # Crank bot identity
│       ├── services/
│       │   ├── solana.service.ts         # Program connection, PDA derivation
│       │   ├── maker.service.ts          # Automated market maker (posts/cancels orders)
│       │   ├── crank.service.ts          # Batch executor (monitors & cranks auctions)
│       │   └── api.service.ts            # REST API + WebSocket for frontend
│       └── types/
│           └── toy_dfba.ts               # Generated IDL types
│
├── frontend/
│   └── src/
│       ├── App.tsx                       # Main application, Solana wallet integration
│       ├── idl.json                      # Program IDL for frontend interaction
│       └── components/
│           ├── TradingPanel.tsx          # Order placement UI (buy/sell, maker/taker)
│           ├── OrderBook.tsx             # Live order book display (bids/asks)
│           └── AuctionResults.tsx        # Historical clearing prices and volumes
│
├── scripts/
│   ├── initialize.ts                     # Initialize program accounts
│   └── demo.ts                           # Demo script for testing
│
├── tests/
│   └── toy-dfba.ts                       # Anchor test suite
│
├── Anchor.toml                           # Anchor project configuration
├── Cargo.toml                            # Rust workspace configuration
└── package.json                          # Root package scripts
```

### Key Files Explained

**Program (Solana Smart Contract)**
- `state.rs:4-17`: `OrderQueue` - Stores orders in bid/ask queues (max 85 orders each)
- `processor/auction.rs:4-60`: Core auction algorithm - finds clearing price maximizing volume
- `instructions/execute_batch.rs:6-48`: Batch execution logic, runs both auctions, stores results

**Backend Services**
- `maker.service.ts:55-102`: Posts 10 orders (5 buys, 5 sells) with spread around base price
- `crank.service.ts:31-72`: Monitors slot height, triggers `execute_batch` every interval
- `api.service.ts`: Exposes order book, results, and real-time updates via WebSocket

**Frontend**
- `TradingPanel.tsx`: Allows users to place maker/taker orders on either side
- `OrderBook.tsx`: Displays live aggregated order book from both queues
- `AuctionResults.tsx`: Shows historical clearing prices and volumes per batch

## How It Works

### 1. Initialization

```rust
// Creates three PDAs (Program Derived Addresses):
// - auction_state: Tracks batch interval, counter, last execution slot
// - bid_queue: Holds maker buy + taker sell orders
// - ask_queue: Holds maker sell + taker buy orders
initialize(batch_interval: u64)
```

### 2. Order Placement

Orders are routed to queues based on type and side:

| Order Type | Side | Queue     | Role in Auction |
|-----------|------|-----------|----------------|
| Maker     | Buy  | Bid Queue | Liquidity provider (willing to buy) |
| Taker     | Sell | Bid Queue | Liquidity taker (wants to sell) |
| Maker     | Sell | Ask Queue | Liquidity provider (willing to sell) |
| Taker     | Buy  | Ask Queue | Liquidity taker (wants to buy) |

```rust
place_order(order_type, side, price, quantity)
// Example: Maker Buy @ 100 → Bid Queue
//          Taker Buy @ 102 → Ask Queue
```

### 3. Automated Market Making

The `MakerService` continuously provides liquidity:

```typescript
// Every 100ms (batchInterval):
1. Cancel all existing maker orders
2. Calculate new mid-price (base ± random variation)
3. Post 5 buy orders at spread levels below mid
4. Post 5 sell orders at spread levels above mid
// Spread = 1%, Quantities = random(100-500)
```

### 4. Batch Execution (The Crank)

```typescript
// CrankService checks every 100ms:
if (currentSlot >= lastBatchSlot + batchInterval) {
    execute_batch(nextBatchId)
}
```

**Inside `execute_batch`:**

```rust
// For EACH auction (bid and ask):
1. Separate orders: makers vs takers
2. Sort orders:
   - Bid: Makers (high→low), Takers (low→high)
   - Ask: Makers (low→high), Takers (high→low)
3. Test all price points from both sides
4. Find price with maximum matchable volume
5. Execute trades at clearing price:
   - Fill takers first (FIFO)
   - Distribute remaining volume proportionally to makers
6. Update filled_quantity for each order
7. Emit BatchExecutedEvent with clearing prices/volumes
8. Remove fully filled orders
```

### 5. Auction Clearing Algorithm

The core algorithm (`processor/auction.rs`) finds the **uniform clearing price** that maximizes volume:

```
Example Bid Auction:
Makers (Buy):  [110@500, 105@300, 100@200]
Takers (Sell): [95@400, 100@300, 105@200]

Test prices: [95, 100, 105, 110]

Price 95:  Maker volume (all) = 1000, Taker volume (95) = 400  → Volume = 400
Price 100: Maker volume (≥100) = 1000, Taker volume (≤100) = 700 → Volume = 700 ✓
Price 105: Maker volume (≥105) = 800, Taker volume (≤105) = 900 → Volume = 800
Price 110: Maker volume (≥110) = 500, Taker volume (≤110) = 900 → Volume = 500

Clearing Price = 100, Volume = 700
```

### 6. Frontend Real-Time Updates

```
WebSocket Connection → Backend polls program every second →
Broadcasts: { bidQueue, askQueue, latestResult } →
Frontend renders live order book and clearing history
```

## Core Components

### Solana Program Instructions

1. **initialize**: Set up auction state and order queues (one-time)
2. **place_order**: Add single order to appropriate queue
3. **place_multiple_orders**: Batch place orders (used by maker)
4. **cancel_all_orders**: Remove all of user's active orders
5. **execute_batch**: Run auction clearing for current batch (permissionless crank)

### Backend Services

**SolanaService** (`solana.service.ts`)
- Manages Anchor program connection
- Derives PDAs for state accounts
- Provides program interface to other services

**MakerService** (`maker.service.ts`)
- Automated market maker bot
- Posts 10 maker orders (5 bids, 5 asks) every batch interval
- Maintains spread around dynamic mid-price
- Cancels stale orders before posting new ones

**CrankService** (`crank.service.ts`)
- Monitors Solana slot height
- Triggers `execute_batch` when interval elapsed
- Fetches and logs clearing results
- Permissionless (anyone can crank)

**ApiService** (`api.service.ts`)
- REST endpoints for order placement and data queries
- WebSocket server for real-time updates
- Broadcasts order book and auction results every second

### Frontend Components

**TradingPanel**
- Order type selector (Maker/Taker)
- Side selector (Buy/Sell)
- Price and quantity inputs
- Submit orders to program via wallet

**OrderBook**
- Real-time bid/ask order display
- Price level aggregation
- Volume visualization
- Updates via WebSocket

**AuctionResults**
- Historical batch results
- Clearing prices (bid/ask)
- Matched volumes
- Batch IDs and timestamps

## Setup & Installation

### Prerequisites

```bash
# Required
- Node.js 16+
- Rust 1.70+
- Solana CLI 1.17+
- Anchor 0.32.0+
- Yarn

# Install Solana
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install 0.32.0
avm use 0.32.0
```

### Installation

```bash
# Clone repository
git clone <repo-url>
cd toy-dfba

# Install dependencies
yarn install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Build program
anchor build

# Update program ID in Anchor.toml and lib.rs with:
solana address -k target/deploy/toy_dfba-keypair.json

# Start local validator (optional, or use devnet)
solana-test-validator

# Configure Solana CLI to devnet
solana config set --url devnet

# Airdrop SOL for testing
solana airdrop 2 <YOUR_WALLET_ADDRESS>

# Initialize program
npm run init
```

### Configuration

Create `.env` in project root:

```env
PROGRAM_ID=<your_program_id>
RPC_URL=https://api.devnet.solana.com
```

Update `backend/src/config/index.ts` if needed:

```typescript
batchInterval: 100  // 100ms for high-frequency execution
```

## Usage

### Start All Services

```bash
# Terminal 1: Backend services (maker + crank + API)
npm run start:backend

# Terminal 2: Frontend
npm run start:frontend

# Visit http://localhost:3000
```

### Manual Testing

```bash
# Run demo script
npm run demo

# Run Anchor tests
anchor test
```

## Technical Details

### Account Structure

**AuctionState** (PDA: `["auction_state"]`)
```rust
authority: Pubkey           // Program authority
batch_interval: u64         // Slots between batch executions
last_batch_slot: u64        // Last execution slot
batch_counter: u64          // Incremental batch ID
is_paused: bool             // Emergency pause flag
```

**OrderQueue** (PDAs: `["bid_queue"]`, `["ask_queue"]`)
```rust
auction_type: AuctionType   // Bid or Ask
orders: Vec<Order>          // Up to 85 orders
max_orders: u32             // Capacity (85)
```

**Order**
```rust
id: u64                     // Unique order ID
owner: Pubkey               // Order placer
order_type: OrderType       // Maker or Taker
side: Side                  // Buy or Sell
price: u64                  // Price in micro-units
quantity: u64               // Order size
timestamp: i64              // Placement time
is_active: bool             // Cancellation flag
filled_quantity: u64        // Amount matched
```

**AuctionResult** (PDA: `["result", batch_id]`)
```rust
batch_id: u64               // Batch identifier
bid_clearing_price: u64     // Bid auction clearing price
bid_volume: u64             // Bid auction matched volume
ask_clearing_price: u64     // Ask auction clearing price
ask_volume: u64             // Ask auction matched volume
timestamp: i64              // Execution time
```

### Price Representation

Prices are stored as `u64` in **micro-units** (6 decimal places):
```
On-chain: 100_000_000 = 100.00
Frontend: Input/display ÷ 1e6
```

### Slot vs Time

Solana slots (~400ms each) are used for scheduling:
```
batch_interval = 7500 slots ≈ 50 minutes
batchInterval = 100ms ≈ 0.25 slots
```

For this demo, backend uses **time-based intervals** (100ms) and checks slot progression.

### Batch Interval Configuration

The batch interval is set during initialization:
```rust
// In initialize instruction
initialize(ctx, batch_interval: 7500)  // ~50 min on mainnet
```

Backend services use a separate time-based interval:
```typescript
// backend/src/config/index.ts
batchInterval: 100  // 100ms for high-frequency execution
```

### Order Routing Logic

```typescript
Maker + Buy  → Bid Queue  (provides buy liquidity)
Taker + Sell → Bid Queue  (takes buy liquidity)
Maker + Sell → Ask Queue  (provides sell liquidity)
Taker + Buy  → Ask Queue  (takes sell liquidity)
```

### Clearing Price Selection

The algorithm maximizes **total matched volume**:

1. Collect all unique price points from both sides
2. For each price, calculate matchable volume:
   ```rust
   // Bid auction
   maker_vol = sum(makers where price >= test_price)
   taker_vol = sum(takers where price <= test_price)
   volume = min(maker_vol, taker_vol)
   ```
3. Select price with highest volume
4. If tied, uses first encountered price (implementation detail)

### Order Filling Priority

1. **Takers filled first** (FIFO by order placement)
2. **Makers filled proportionally** by their size:
   ```rust
   maker_fill = (maker_quantity / total_maker_quantity) * remaining_volume
   ```

## Configuration

### Program Configuration

Located in `programs/toy-dfba/src/instructions/initialize.rs:15-20`:
- `max_orders`: 85 per queue (bid/ask)
- Account space: Pre-allocated for max orders

### Backend Configuration

Located in `backend/src/config/index.ts`:
```typescript
{
  port: 3001,                                      // API server port
  rpcUrl: "https://api.devnet.solana.com",        // Solana RPC endpoint
  programId: "7bmPzyNe65Br7yR83KaewmatgrACQLwnaa4UzFjsVV3P",
  batchInterval: 100,                             // 100ms between batches
}
```

### Maker Bot Configuration

Located in `backend/src/services/maker.service.ts:8-9`:
```typescript
basePrice: 100          // Center price for market making
spread: 0.01           // 1% spread (0.5% each side)
```

Market maker posts:
- 5 buy orders: `[99.5, 99.3, 99.1, 98.9, 98.7]` (example with spread levels)
- 5 sell orders: `[100.5, 100.7, 100.9, 101.1, 101.3]`
- Quantities: Random between 100-500 units
- Refresh: Every batch interval (100ms)