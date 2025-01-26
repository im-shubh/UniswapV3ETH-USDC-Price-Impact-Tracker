# Uniswap v3 ETH/USDC Price Impact Tracker

This script listens for events on the Uniswap v3 ETH/USDC pool, such as liquidity addition, removal, and token swaps. It calculates the price impact based on price changes in the pool and logs the results.

## Features
- Listens to `Mint`, `Burn`, and `Swap` events on the Uniswap v3 ETH/USDC pool.
- Calculates the price impact of each event by comparing the price before and after the transaction.
- Logs transaction details and price changes in the pool.

## Prerequisites
- Node.js
- Infura project ID (or another WebSocket endpoint)

## Installation
1. Clone the repository or copy the script into a file, e.g., `index.js`.
2. Install dependencies using npm: 
   ```bash
   npm install ethers
    ```

# Uniswap v3 ETH/USDC Pool Script Overview

## Usage
1. Replace `<your-infura-project-id>` in the script with your Infura project ID:

```javascript
const provider = new ethers.WebSocketProvider("wss://mainnet.infura.io/ws/v3/<your-infura-project-id>");
```
2. Run the script:
   ```bash
   node index.js
   ```
## Script Overview

### Imports
- **Ethers.js**: Used for interacting with the Ethereum blockchain.
- **Uniswap v3 Pool Address**: `0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640`

### Pool ABI
The script uses a minimal ABI for interacting with the Uniswap v3 ETH/USDC pool, which includes event listeners for Mint, Burn, and Swap events, and a function `slot0()` to retrieve the current price.

### Main Functions

- **getPriceFromSqrtPriceX96(sqrtPriceX96)**:
    - Converts the `sqrtPriceX96` from the `slot0()` function into the ETH/USDC price.
    - This is done by dividing `sqrtPriceX96` by `2^96` and then squaring it.

- **calculatePriceImpact(oldPrice, newPrice)**:
    - Calculates the price impact as a percentage difference between the old and new price.

### Event Listeners

- **Mint**:
    - Listens for liquidity addition (minting).
    - Logs transaction details.
    - Calculates the price impact.

- **Burn**:
    - Listens for liquidity removal (burning).
    - Logs transaction details.
    - Calculates price impact.

- **Swap**:
    - Listens for token swaps.
    - Logs transaction details.
    - Calculates the price impact.

## Event Handling

### 1. Mint Event
- **Trigger**: When liquidity is added to the pool.
- **Action**:
  - Logs details about the sender and owner.
  - Logs amounts of ETH and USDC involved.
  - Calculates the price impact.

### 2. Burn Event
- **Trigger**: When liquidity is removed from the pool.
- **Action**:
  - Logs details about the sender and owner.
  - Logs amounts of ETH and USDC involved.
  - Calculates the price change and impact.

### 3. Swap Event
- **Trigger**: For every token swap.
- **Action**:
  - Logs transaction details such as sender, recipient, and amounts involved.
  - Calculates the price change and price impact.



## Logs
```
The script outputs the following details for each event:

Transaction hash
Sender address
Receiver address
Amount of tokens involved (ETH/USDC)
Previous and current price
Price impact (percentage change)
```

## Example Output
```
Initial ETH/USDC Price: $3000.000000 (1 ETH = 3000.000000 USDC)

[Add Liquidity]
Sender: 0xABC123...
Owner: 0xDEF456...
Amount0 (USDC): 500.000000
Amount1 (ETH): 0.100000

Previous Price: $3000.000000 (1 ETH = 3000.000000 USDC)
Current Price: $3050.000000 (1 ETH = 3050.000000 USDC)
Price Impact: 1.666667%

[Swap Transaction]
Sender: 0x123456...
Recipient: 0x789ABC...
Amount0 (USDC): 1000.000000
Amount1 (ETH): 0.200000

Previous Price: $3050.000000 (1 ETH = 3050.000000 USDC)
Current Price: $3100.000000 (1 ETH = 3100.000000 USDC)
Price Impact: 1.639344%
```

## Error Handling
The script handles the following errors:

- Invalid or null transactions.
- WebSocket connection issues.
- Incorrect price calculations (such as dividing by zero or invalid data).

## Notes
- Ensure your Infura project ID is valid and has sufficient throughput capacity.
- If you encounter rate limit errors, consider upgrading your Infura plan or further throttling requests.
