// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title FarmingRewards
 * @dev Staking contract for LP tokens to earn rewards
 * @notice Users can stake LP tokens and earn reward tokens
 */
contract FarmingRewards is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // The staking token (LP Token from AMM)
    IERC20 public stakingToken;
    
    // The reward token
    IERC20 public rewardToken;
    
    // Reward rate (tokens per second)
    uint256 public rewardRate;
    
    // Duration of rewards period (in seconds)
    uint256 public rewardsDuration;
    
    // Period finish timestamp
    uint256 public periodFinish;
    
    // Last update time
    uint256 public lastUpdateTime;
    
    // Reward per token stored
    uint256 public rewardPerTokenStored;
    
    // User's reward per token paid
    mapping(address => uint256) public userRewardPerTokenPaid;
    
    // User's rewards
    mapping(address => uint256) public rewards;
    
    // Total staked
    uint256 public totalSupply;
    
    // User's staked balance
    mapping(address => uint256) public balanceOf;

    // Events
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardAdded(uint256 reward);
    event RewardRateUpdated(uint256 newRate);

    constructor(
        address _stakingToken,
        address _rewardToken,
        uint256 _rewardRate,
        uint256 _rewardsDuration
    ) Ownable(msg.sender) {
        require(_stakingToken != address(0), "Invalid staking token");
        require(_rewardToken != address(0), "Invalid reward token");
        
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
        rewardRate = _rewardRate;
        rewardsDuration = _rewardsDuration;
    }

    /**
     * @notice Update reward for a given account
     */
    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    /**
     * @notice Calculate last time reward was applicable
     */
    function lastTimeRewardApplicable() public view returns (uint256) {
        return block.timestamp < periodFinish ? block.timestamp : periodFinish;
    }

    /**
     * @notice Calculate reward per token
     */
    function rewardPerToken() public view returns (uint256) {
        if (totalSupply == 0) {
            return rewardPerTokenStored;
        }
        return
            rewardPerTokenStored +
            (((lastTimeRewardApplicable() - lastUpdateTime) * rewardRate * 1e18) / totalSupply);
    }

    /**
     * @notice Calculate earned rewards for an account
     */
    function earned(address account) public view returns (uint256) {
        return
            ((balanceOf[account] * (rewardPerToken() - userRewardPerTokenPaid[account])) / 1e18) +
            rewards[account];
    }

    /**
     * @notice Stake LP tokens
     */
    function stake(uint256 amount) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        
        totalSupply += amount;
        balanceOf[msg.sender] += amount;
        
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        
        emit Staked(msg.sender, amount);
    }

    /**
     * @notice Withdraw staked LP tokens
     */
    function withdraw(uint256 amount) public nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        
        totalSupply -= amount;
        balanceOf[msg.sender] -= amount;
        
        stakingToken.safeTransfer(msg.sender, amount);
        
        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @notice Claim rewards
     */
    function getReward() public nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardToken.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }

    /**
     * @notice Withdraw all staked tokens and claim rewards
     */
    function exit() external {
        withdraw(balanceOf[msg.sender]);
        getReward();
    }

    /**
     * @notice Notify reward amount (owner only)
     */
    function notifyRewardAmount(uint256 reward) external onlyOwner updateReward(address(0)) {
        if (block.timestamp >= periodFinish) {
            rewardRate = reward / rewardsDuration;
        } else {
            uint256 remaining = periodFinish - block.timestamp;
            uint256 leftover = remaining * rewardRate;
            rewardRate = (reward + leftover) / rewardsDuration;
        }

        uint256 balance = rewardToken.balanceOf(address(this));
        require(rewardRate <= balance / rewardsDuration, "Provided reward too high");

        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp + rewardsDuration;
        
        emit RewardAdded(reward);
    }

    /**
     * @notice Set reward rate (owner only)
     */
    function setRewardRate(uint256 _rewardRate) external onlyOwner {
        rewardRate = _rewardRate;
        emit RewardRateUpdated(_rewardRate);
    }

    /**
     * @notice Emergency withdraw reward tokens (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = rewardToken.balanceOf(address(this));
        rewardToken.safeTransfer(owner(), balance);
    }
}

