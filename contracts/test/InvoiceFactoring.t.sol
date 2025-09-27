// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/InvoiceFactoring.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MockPYUSD.sol";

contract InvoiceFactoringTest is Test {
    InvoiceFactoring public invoiceFactoring;
    MockPYUSD public mockPYUSD;
    
    address public business = address(0x1);
    address public customer = address(0x2);
    address public investor = address(0x3);
    
    function setUp() public {
        // Deploy mock PYUSD token
        mockPYUSD = new MockPYUSD();
        
        // Deploy the contract with mock token address
        invoiceFactoring = new InvoiceFactoring(address(mockPYUSD));
        
        // Setup test accounts with PYUSD (smaller amounts for testing)
        mockPYUSD.mint(business, 100 * 10**6); // 100 PYUSD
        mockPYUSD.mint(customer, 100 * 10**6); // 100 PYUSD
        mockPYUSD.mint(investor, 90 * 10**6); // 90 PYUSD (your current balance)
        
        // Approve contract to spend PYUSD
        vm.prank(business);
        mockPYUSD.approve(address(invoiceFactoring), type(uint256).max);
        
        vm.prank(customer);
        mockPYUSD.approve(address(invoiceFactoring), type(uint256).max);
        
        vm.prank(investor);
        mockPYUSD.approve(address(invoiceFactoring), type(uint256).max);
    }
    
    function testCreateInvoiceFromData() public {
        vm.prank(business);
        uint256 invoiceId = invoiceFactoring.createInvoiceFromData(
            customer,
            100 * 10**6, // 100 PYUSD
            block.timestamp + 30 days,
            "Test invoice"
        );
        
        assertEq(invoiceId, 1);
        
        InvoiceFactoring.Invoice memory invoice = invoiceFactoring.getInvoice(invoiceId);
        assertEq(invoice.business, business);
        assertEq(invoice.customer, customer);
        assertEq(invoice.amount, 100 * 10**6);
        assertFalse(invoice.isFactored);
        assertFalse(invoice.isPaid);
    }
    
    function testDepositLiquidity() public {
        vm.prank(investor);
        invoiceFactoring.depositLiquidity(90 * 10**6); // 90 PYUSD
        
        assertEq(invoiceFactoring.getAvailableLiquidity(), 90 * 10**6);
        
        InvoiceFactoring.Investor memory investorData = invoiceFactoring.getInvestor(investor);
        assertEq(investorData.totalDeposited, 90 * 10**6);
        assertTrue(investorData.isActive);
    }
    
    function testFactorInvoice() public {
        // Create invoice first
        vm.prank(business);
        uint256 invoiceId = invoiceFactoring.createInvoiceFromData(
            customer,
            100 * 10**6,
            block.timestamp + 30 days,
            "Test invoice"
        );
        
        // Deposit liquidity
        vm.prank(investor);
        invoiceFactoring.depositLiquidity(90 * 10**6);
        
        // Factor invoice
        vm.prank(investor);
        invoiceFactoring.factorInvoice(invoiceId);
        
        InvoiceFactoring.Invoice memory invoice = invoiceFactoring.getInvoice(invoiceId);
        assertTrue(invoice.isFactored);
        assertEq(invoice.factor, investor);
        assertEq(invoice.factorAmount, 80 * 10**6); // 80% of 100
        
        // Check business received PYUSD
        assertEq(mockPYUSD.balanceOf(business), 100 * 10**6 + 80 * 10**6);
    }
    
    function testPayInvoice() public {
        // Create invoice first
        vm.prank(business);
        uint256 invoiceId = invoiceFactoring.createInvoiceFromData(
            customer,
            100 * 10**6,
            block.timestamp + 30 days,
            "Test invoice"
        );
        
        // Deposit liquidity
        vm.prank(investor);
        invoiceFactoring.depositLiquidity(90 * 10**6);
        
        // Factor invoice
        vm.prank(investor);
        invoiceFactoring.factorInvoice(invoiceId);
        
        // Pay invoice
        vm.prank(customer);
        invoiceFactoring.payInvoice(invoiceId);
        
        InvoiceFactoring.Invoice memory invoice = invoiceFactoring.getInvoice(invoiceId);
        assertTrue(invoice.isPaid);
        
        // Check investor earned profit
        InvoiceFactoring.Investor memory investorData = invoiceFactoring.getInvestor(investor);
        assertEq(investorData.totalEarned, 20 * 10**6); // 20% profit
    }
    
    function testWithdrawLiquidity() public {
        // Deposit liquidity
        vm.prank(investor);
        invoiceFactoring.depositLiquidity(90 * 10**6);
        
        // Withdraw liquidity
        vm.prank(investor);
        invoiceFactoring.withdrawLiquidity(40 * 10**6);
        
        assertEq(invoiceFactoring.getAvailableLiquidity(), 50 * 10**6);
        
        InvoiceFactoring.Investor memory investorData = invoiceFactoring.getInvestor(investor);
        assertEq(investorData.totalDeposited, 50 * 10**6);
    }
    
    function testCollectReturns() public {
        // Create invoice first
        vm.prank(business);
        uint256 invoiceId = invoiceFactoring.createInvoiceFromData(
            customer,
            100 * 10**6,
            block.timestamp + 30 days,
            "Test invoice"
        );
        
        // Deposit liquidity
        vm.prank(investor);
        invoiceFactoring.depositLiquidity(90 * 10**6);
        
        // Factor invoice
        vm.prank(investor);
        invoiceFactoring.factorInvoice(invoiceId);
        
        vm.prank(customer);
        invoiceFactoring.payInvoice(invoiceId);
        
        // Collect returns
        uint256 balanceBefore = mockPYUSD.balanceOf(investor);
        vm.prank(investor);
        invoiceFactoring.collectReturns();
        uint256 balanceAfter = mockPYUSD.balanceOf(investor);
        
        assertEq(balanceAfter - balanceBefore, 20 * 10**6); // 20% profit
        
        InvoiceFactoring.Investor memory investorData = invoiceFactoring.getInvestor(investor);
        assertEq(investorData.totalEarned, 0);
    }
}
