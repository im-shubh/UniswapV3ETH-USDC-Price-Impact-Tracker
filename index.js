const { ethers } = require("ethers");

// Ethereum WebSocket Providers (Fallback)
const provider = new ethers.WebSocketProvider("wss://mainnet.infura.io/ws/v3/<your-infura-project-id>");

// Uniswap v3 Pool Address for ETH/USDC
const ETH_USDC_POOL_ADDRESS = "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640";

// Uniswap v3 Pool ABI (minimal for events and state reading)
const POOL_ABI = [
  "event Mint(address sender, address indexed owner, int24 tickLower, int24 tickUpper, uint128 amount, uint256 amount0, uint256 amount1)",
  "event Burn(address indexed owner, int24 tickLower, int24 tickUpper, uint128 amount, uint256 amount0, uint256 amount1)",
  "event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)",
  "function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)",
];

// Instantiate the Uniswap v3 Pool contract
const pool = new ethers.Contract(ETH_USDC_POOL_ADDRESS, POOL_ABI, provider);

// Utility function to calculate price from sqrtPriceX96
function getPriceFromSqrtPriceX96(sqrtPriceX96) {
  const price = (sqrtPriceX96 / 2 ** 96) ** 2;
  return price;
}

// Utility function to calculate price impact
function calculatePriceImpact(oldPrice, newPrice) {
  return ((newPrice - oldPrice) / oldPrice) * 100;
}

// Function to listen to events and calculate price impact
async function listenToTransactions() {
  let lastPrice;

  // Fetch the initial price
  const { sqrtPriceX96 } = await pool.slot0();
  lastPrice = getPriceFromSqrtPriceX96(Number(sqrtPriceX96));
  console.log(`Initial ETH/USDC Price: $${lastPrice.toFixed(6)} (1 ETH = ${lastPrice.toFixed(6)} USDC)`);

  // Event Listener for Mint (Add Liquidity)
  pool.on("Mint", async (sender, owner, tickLower, tickUpper, amount, amount0, amount1) => {
    console.log(`\n[Add Liquidity]`);
    console.log(`Sender: ${sender}`);
    console.log(`Owner: ${owner}`);
    console.log(`Amount0 (USDC): ${ethers.formatUnits(amount0, 6)}`);
    console.log(`Amount1 (ETH): ${ethers.formatUnits(amount1, 18)}`);
    
    const { sqrtPriceX96 } = await pool.slot0();
    const newPrice = getPriceFromSqrtPriceX96(Number(sqrtPriceX96));
    const priceImpact = calculatePriceImpact(lastPrice, newPrice);
    
    console.log(`Previous Price: $${lastPrice.toFixed(6)} (1 ETH = ${lastPrice.toFixed(6)} USDC)`);
    console.log(`Current Price: $${newPrice.toFixed(6)} (1 ETH = ${newPrice.toFixed(6)} USDC)`);
    console.log(`Price Impact: ${priceImpact.toFixed(6)}%`);
    
    lastPrice = newPrice;
  });

  // Event Listener for Burn (Remove Liquidity)
  pool.on("Burn", async (owner, tickLower, tickUpper, amount, amount0, amount1) => {
    console.log(`\n[Remove Liquidity]`);
    console.log(`Owner: ${owner}`);
    console.log(`Amount0 (USDC): ${ethers.formatUnits(amount0, 6)}`);
    console.log(`Amount1 (ETH): ${ethers.formatUnits(amount1, 18)}`);
    
    const { sqrtPriceX96 } = await pool.slot0();
    const newPrice = getPriceFromSqrtPriceX96(Number(sqrtPriceX96));
    const priceImpact = calculatePriceImpact(lastPrice, newPrice);
    
    console.log(`Previous Price: $${lastPrice.toFixed(6)} (1 ETH = ${lastPrice.toFixed(6)} USDC)`);
    console.log(`Current Price: $${newPrice.toFixed(6)} (1 ETH = ${newPrice.toFixed(6)} USDC)`);
    console.log(`Price Impact: ${priceImpact.toFixed(6)}%`);
    
    lastPrice = newPrice;
  });

  // Event Listener for Swap (Token Swaps)
  pool.on("Swap", async (sender, recipient, amount0, amount1, sqrtPriceX96, liquidity, tick, tx) => {
    console.log(`\n[Swap Transaction]`);
    console.log(`Sender: ${sender}`);
    console.log(`Recipient: ${recipient}`);
    console.log(`Amount0 (USDC): ${ethers.formatUnits(amount0, 6)}`);
    console.log(`Amount1 (ETH): ${ethers.formatUnits(amount1, 18)}`);
    
    const newPrice = getPriceFromSqrtPriceX96(Number(sqrtPriceX96));
    const priceImpact = calculatePriceImpact(lastPrice, newPrice);
    
    console.log(`Previous Price: $${lastPrice.toFixed(6)} (1 ETH = ${lastPrice.toFixed(6)} USDC)`);
    console.log(`Current Price: $${newPrice.toFixed(6)} (1 ETH = ${newPrice.toFixed(6)} USDC)`);
    console.log(`Price Impact: ${priceImpact.toFixed(6)}%`);
    
    lastPrice = newPrice;
  });
}

// Start listening
listenToTransactions().catch(console.error);


