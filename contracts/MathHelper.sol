// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MathHelper
 * @dev Helper functions for price calculations and math operations
 */
library MathHelper {
    /**
     * @notice Calculate price of token A in terms of token B
     */
    function getPrice(uint256 reserveA, uint256 reserveB) internal pure returns (uint256 price) {
        require(reserveB > 0, "Division by zero");
        // Price = reserveB / reserveA (how many B per A)
        return (reserveB * 1e18) / reserveA;
    }

    /**
     * @notice Calculate amount of tokens needed for liquidity
     */
    function calculateLiquidityAmount(
        uint256 amountA,
        uint256 reserveA,
        uint256 reserveB
    ) internal pure returns (uint256 amountB) {
        require(reserveA > 0, "Empty reserve");
        amountB = (amountA * reserveB) / reserveA;
    }
}
