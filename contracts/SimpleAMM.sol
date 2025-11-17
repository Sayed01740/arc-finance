// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title SimpleAMM
 * @dev Simple Automated Market Maker similar to Uniswap V2
 * @notice Constant product formula: x * y = k
 */
contract SimpleAMM {
    using SafeERC20 for IERC20;

    IERC20 public tokenA;
    IERC20 public tokenB;
    
    uint256 public reserveA;
    uint256 public reserveB;
    
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    uint256 public constant MINIMUM_LIQUIDITY = 10**3;
    
    // Events
    event Mint(address indexed sender, uint256 amount);
    event Burn(address indexed sender, uint256 amountA, uint256 amountB, address indexed to);
    event Swap(
        address indexed sender,
        uint256 amountInA,
        uint256 amountInB,
        uint256 amountOutA,
        uint256 amountOutB,
        address indexed to
    );
    event Sync(uint256 reserveA, uint256 reserveB);

    constructor(address _tokenA, address _tokenB) {
        require(_tokenA != address(0) && _tokenB != address(0), "Invalid token address");
        require(_tokenA != _tokenB, "Tokens must be different");
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    /**
     * @dev Internal function to update reserves
     */
    function _update(uint256 _reserveA, uint256 _reserveB) private {
        reserveA = _reserveA;
        reserveB = _reserveB;
        emit Sync(reserveA, reserveB);
    }

    /**
     * @dev Internal function to mint LP tokens
     */
    function _mint(address to, uint256 amount) private {
        balanceOf[to] += amount;
        totalSupply += amount;
        emit Mint(to, amount);
    }

    /**
     * @dev Internal function to burn LP tokens
     */
    function _burn(address from, uint256 amount) private {
        balanceOf[from] -= amount;
        totalSupply -= amount;
        // Burn event is emitted in removeLiquidity with proper parameters
    }

    /**
     * @notice Add liquidity to the pool
     * @param amountA Amount of token A to add
     * @param amountB Amount of token B to add
     * @param to Address to receive LP tokens
     * @return liquidity Amount of LP tokens minted
     */
    function addLiquidity(
        uint256 amountA,
        uint256 amountB,
        address to
    ) external returns (uint256 liquidity) {
        uint256 _reserveA = reserveA;
        uint256 _reserveB = reserveB;
        
        if (_reserveA == 0 && _reserveB == 0) {
            // First liquidity provision
            liquidity = sqrt(amountA * amountB) - MINIMUM_LIQUIDITY;
            _mint(address(0), MINIMUM_LIQUIDITY); // Lock minimum liquidity
        } else {
            uint256 liquidityA = (amountA * totalSupply) / _reserveA;
            uint256 liquidityB = (amountB * totalSupply) / _reserveB;
            liquidity = liquidityA < liquidityB ? liquidityA : liquidityB;
        }
        
        require(liquidity > 0, "Insufficient liquidity");
        
        tokenA.safeTransferFrom(msg.sender, address(this), amountA);
        tokenB.safeTransferFrom(msg.sender, address(this), amountB);
        
        _mint(to, liquidity);
        _update(tokenA.balanceOf(address(this)), tokenB.balanceOf(address(this)));
        
        return liquidity;
    }

    /**
     * @notice Remove liquidity from the pool
     * @param liquidity Amount of LP tokens to burn
     * @param to Address to receive tokens
     * @return amountA Amount of token A returned
     * @return amountB Amount of token B returned
     */
    function removeLiquidity(
        uint256 liquidity,
        address to
    ) external returns (uint256 amountA, uint256 amountB) {
        uint256 _reserveA = reserveA;
        uint256 _reserveB = reserveB;
        
        uint256 _totalSupply = totalSupply;
        amountA = (liquidity * _reserveA) / _totalSupply;
        amountB = (liquidity * _reserveB) / _totalSupply;
        
        require(amountA > 0 && amountB > 0, "Insufficient liquidity burned");
        
        _burn(msg.sender, liquidity);
        
        tokenA.safeTransfer(to, amountA);
        tokenB.safeTransfer(to, amountB);
        
        _update(tokenA.balanceOf(address(this)), tokenB.balanceOf(address(this)));
        
        emit Burn(msg.sender, amountA, amountB, to);
        
        return (amountA, amountB);
    }

    /**
     * @notice Swap exact tokens for tokens
     * @param amountIn Exact amount of input tokens
     * @param tokenIn Address of input token (tokenA or tokenB)
     * @param to Address to receive output tokens
     * @return amountOut Amount of output tokens
     */
    function swapExactTokens(
        uint256 amountIn,
        address tokenIn,
        address to
    ) external returns (uint256 amountOut) {
        require(tokenIn == address(tokenA) || tokenIn == address(tokenB), "Invalid token");
        require(to != address(tokenA) && to != address(tokenB), "Invalid recipient");
        
        bool isTokenA = tokenIn == address(tokenA);
        (IERC20 tokenInContract, IERC20 tokenOutContract) = isTokenA
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
        
        uint256 _reserveIn = isTokenA ? reserveA : reserveB;
        uint256 _reserveOut = isTokenA ? reserveB : reserveA;
        
        tokenInContract.safeTransferFrom(msg.sender, address(this), amountIn);
        
        uint256 amountInWithFee = amountIn * 997; // 0.3% fee
        amountOut = (amountInWithFee * _reserveOut) / ((_reserveIn * 1000) + amountInWithFee);
        
        require(amountOut > 0, "Insufficient output amount");
        
        tokenOutContract.safeTransfer(to, amountOut);
        
        uint256 balanceA = tokenA.balanceOf(address(this));
        uint256 balanceB = tokenB.balanceOf(address(this));
        
        _update(balanceA, balanceB);
        
        emit Swap(
            msg.sender,
            isTokenA ? amountIn : 0,
            isTokenA ? 0 : amountIn,
            isTokenA ? 0 : amountOut,
            isTokenA ? amountOut : 0,
            to
        );
        
        return amountOut;
    }

    /**
     * @notice Get current reserves
     * @return _reserveA Reserve of token A
     * @return _reserveB Reserve of token B
     */
    function getReserves() external view returns (uint256 _reserveA, uint256 _reserveB) {
        return (reserveA, reserveB);
    }

    /**
     * @notice Calculate sqrt using Babylonian method
     */
    function sqrt(uint256 y) private pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    /**
     * @notice Get amount out for given amount in (view function)
     * @param amountIn Amount of input tokens
     * @param tokenIn Address of input token
     * @return amountOut Amount of output tokens
     */
    function getAmountOut(uint256 amountIn, address tokenIn) external view returns (uint256 amountOut) {
        require(tokenIn == address(tokenA) || tokenIn == address(tokenB), "Invalid token");
        
        bool isTokenA = tokenIn == address(tokenA);
        uint256 _reserveIn = isTokenA ? reserveA : reserveB;
        uint256 _reserveOut = isTokenA ? reserveB : reserveA;
        
        uint256 amountInWithFee = amountIn * 997;
        amountOut = (amountInWithFee * _reserveOut) / ((_reserveIn * 1000) + amountInWithFee);
        
        return amountOut;
    }
}
