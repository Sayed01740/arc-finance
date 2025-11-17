# ✅ NEW SMART CONTRACT DEPLOYED - FarmingRewards

## 🎉 FarmingRewards Contract Successfully Deployed!

---

## 📦 New Contract Details

### FarmingRewards Contract
- **Address**: `0x481398E68559dCC77E0860E21Bf4d687f6CB5738`
- **Type**: Staking & Rewards Contract
- **Purpose**: Users can stake LP tokens to earn reward tokens
- **Contract**: FarmingRewards.sol
- **Explorer**: https://testnet.arcscan.app/address/0x481398E68559dCC77E0860E21Bf4d687f6CB5738
- **Status**: ✅ Deployed & Ready

---

## 🔧 Contract Configuration

### Staking Token (LP Token)
- **Address**: `0xFb2ecDB978FE3c6597F44D3e0B3B5442a6F10aAf`
- **Type**: AMM LP Token (from SimpleAMM contract)
- **Purpose**: Users stake this to earn rewards

### Reward Token
- **Address**: `0xf8BF7E1938886b6d8D7e94A93FDd7d857E425496`
- **Type**: Token A (TKA)
- **Purpose**: Token distributed as rewards to stakers

### Reward Settings
- **Reward Rate**: 0.01 tokens per second
- **Rewards Duration**: 7 days
- **Total Reward Pool**: Configurable via `notifyRewardAmount()`

---

## 📜 Contract Functions

### Main Functions

#### `stake(uint256 amount)`
- **Description**: Stake LP tokens to earn rewards
- **Parameters**: `amount` - Amount of LP tokens to stake
- **Returns**: None
- **Events**: `Staked(address indexed user, uint256 amount)`

#### `withdraw(uint256 amount)`
- **Description**: Withdraw staked LP tokens
- **Parameters**: `amount` - Amount of LP tokens to withdraw
- **Returns**: None
- **Events**: `Withdrawn(address indexed user, uint256 amount)`

#### `getReward()`
- **Description**: Claim earned rewards
- **Returns**: None
- **Events**: `RewardPaid(address indexed user, uint256 reward)`

#### `exit()`
- **Description**: Withdraw all staked tokens and claim all rewards in one transaction
- **Returns**: None

### View Functions

#### `balanceOf(address account)`
- **Description**: Get staked balance of an account
- **Returns**: `uint256` - Amount of LP tokens staked

#### `earned(address account)`
- **Description**: Calculate total rewards earned by an account
- **Returns**: `uint256` - Total rewards earned (not yet claimed)

#### `rewardPerToken()`
- **Description**: Calculate current reward per token
- **Returns**: `uint256` - Reward per token ratio

#### `totalSupply()`
- **Description**: Get total LP tokens staked
- **Returns**: `uint256` - Total staked amount

### Owner Functions

#### `notifyRewardAmount(uint256 reward)`
- **Description**: Add rewards to the pool (owner only)
- **Parameters**: `reward` - Amount of reward tokens to add
- **Returns**: None
- **Events**: `RewardAdded(uint256 reward)`

#### `setRewardRate(uint256 _rewardRate)`
- **Description**: Update reward rate (owner only)
- **Parameters**: `_rewardRate` - New reward rate per second
- **Returns**: None
- **Events**: `RewardRateUpdated(uint256 newRate)`

#### `emergencyWithdraw()`
- **Description**: Emergency withdraw reward tokens (owner only)
- **Returns**: None

---

## 🌐 Network Configuration

- **Network**: Arc Testnet
- **Chain ID**: 5042002
- **RPC URL**: https://rpc.testnet.arc.network
- **Block Explorer**: https://testnet.arcscan.app

---

## 📋 Contract Addresses Summary

### New Contract
- **FarmingRewards**: `0x481398E68559dCC77E0860E21Bf4d687f6CB5738`

### Related Contracts
- **AMM (LP Token)**: `0xFb2ecDB978FE3c6597F44D3e0B3B5442a6F10aAf`
- **Reward Token (TKA)**: `0xf8BF7E1938886b6d8D7e94A93FDd7d857E425496`

---

## 🚀 How to Use

### 1. Add Rewards to Pool
```solidity
// Owner must call this to start rewards
// First approve reward tokens to farming contract
rewardToken.approve(farmingAddress, amount);
// Then notify rewards
farming.notifyRewardAmount(amount);
```

### 2. Stake LP Tokens
```solidity
// User approves LP tokens to farming contract
lpToken.approve(farmingAddress, amount);
// Then stake
farming.stake(amount);
```

### 3. Claim Rewards
```solidity
// User claims earned rewards
farming.getReward();
```

### 4. Unstake
```solidity
// User withdraws staked LP tokens
farming.withdraw(amount);
```

### 5. Exit (Unstake All + Claim)
```solidity
// User withdraws all and claims in one transaction
farming.exit();
```

---

## 📝 Environment Variables

Add to `.env`:
```env
FARMING_ADDRESS=0x481398E68559dCC77E0860E21Bf4d687f6CB5738
```

Add to `frontend/.env.local`:
```env
NEXT_PUBLIC_FARMING_ADDRESS=0x481398E68559dCC77E0860E21Bf4d687f6CB5738
```

---

## ✅ Deployment Status

- ✅ Contract Compiled
- ✅ Contract Deployed
- ✅ Configuration Complete
- ⏳ Rewards Pool: Needs to be funded (call `notifyRewardAmount()`)

---

## 🎯 Next Steps

1. **Fund Reward Pool**:
   - Approve reward tokens to farming contract
   - Call `notifyRewardAmount()` with desired reward amount

2. **Update Frontend**:
   - Add farming contract address to environment
   - Update farming page to connect to contract
   - Add staking/unstaking/claim functions

3. **Test Contract**:
   - Stake LP tokens
   - Verify rewards are accumulating
   - Claim rewards
   - Unstake tokens

---

**Status**: ✅ **NEW CONTRACT DEPLOYED SUCCESSFULLY**

**Contract**: FarmingRewards
**Address**: `0x481398E68559dCC77E0860E21Bf4d687f6CB5738`
**Network**: Arc Testnet (Chain ID: 5042002)

