// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InvoiceFactoring is ReentrancyGuard, Ownable {
    // PYUSD token address on Sepolia
    IERC20 public immutable PYUSD;
    
    // Invoice structure
    struct Invoice {
        uint256 id;
        address business;
        address customer;
        uint256 amount;
        uint256 dueDate;
        string description;
        bool isFactored;
        bool isPaid;
        uint256 factorAmount;
        address factor;
    }
    
    // Investor structure
    struct Investor {
        uint256 totalDeposited;
        uint256 totalEarned;
        bool isActive;
    }
    
    // State variables
    uint256 public nextInvoiceId = 1;
    uint256 public totalLiquidity;
    uint256 public totalFactored;
    uint256 public constant FACTOR_FEE_PERCENT = 20; // 20% fee for factors
    uint256 public constant MIN_FACTOR_AMOUNT = 50 * 10**6; // 50 PYUSD minimum (for testing with 90 PYUSD)
    
    // Mappings
    mapping(uint256 => Invoice) public invoices;
    mapping(address => Investor) public investors;
    mapping(address => uint256[]) public businessInvoices;
    mapping(address => uint256[]) public factorInvoices;
    
    // Events
    event InvoiceCreated(uint256 indexed invoiceId, address indexed business, uint256 amount);
    event InvoiceFactored(uint256 indexed invoiceId, address indexed factor, uint256 factorAmount);
    event InvoicePaid(uint256 indexed invoiceId, uint256 amount);
    event LiquidityDeposited(address indexed investor, uint256 amount);
    event LiquidityWithdrawn(address indexed investor, uint256 amount);
    event ReturnsCollected(address indexed factor, uint256 amount);
    
    constructor(address _pyusd) Ownable(msg.sender) {
        PYUSD = IERC20(_pyusd);
    }
    
    // Business functions
    
    /**
     * @dev Create an invoice from uploaded PDF data
     * This function is called after PDF parsing extracts invoice data
     */
    function createInvoiceFromData(
        address _customer,
        uint256 _amount,
        uint256 _dueDate,
        string memory _description
    ) external returns (uint256) {
        require(_customer != address(0), "Invalid customer address");
        require(_amount > 0, "Amount must be greater than 0");
        require(_dueDate > block.timestamp, "Due date must be in the future");
        
        uint256 invoiceId = nextInvoiceId++;
        
        invoices[invoiceId] = Invoice({
            id: invoiceId,
            business: msg.sender,
            customer: _customer,
            amount: _amount,
            dueDate: _dueDate,
            description: _description,
            isFactored: false,
            isPaid: false,
            factorAmount: 0,
            factor: address(0)
        });
        
        businessInvoices[msg.sender].push(invoiceId);
        
        emit InvoiceCreated(invoiceId, msg.sender, _amount);
        return invoiceId;
    }

    /**
     * @dev Factor an invoice (investor provides liquidity)
     */
    function factorInvoice(uint256 _invoiceId) external nonReentrant {
        Invoice storage invoice = invoices[_invoiceId];
        require(invoice.id != 0, "Invoice does not exist");
        require(!invoice.isFactored, "Invoice already factored");
        require(!invoice.isPaid, "Invoice already paid");
        require(block.timestamp < invoice.dueDate, "Invoice is overdue");
        
        // Calculate factor amount (80% of invoice amount)
        uint256 factorAmount = (invoice.amount * 80) / 100;
        require(factorAmount >= MIN_FACTOR_AMOUNT, "Factor amount too small");
        require(totalLiquidity >= factorAmount, "Insufficient liquidity");
        
        // Update invoice
        invoice.isFactored = true;
        invoice.factorAmount = factorAmount;
        invoice.factor = msg.sender;
        
        // Update investor
        if (!investors[msg.sender].isActive) {
            investors[msg.sender].isActive = true;
        }
        investors[msg.sender].totalDeposited += factorAmount;
        
        // Update global state
        totalLiquidity -= factorAmount;
        totalFactored += factorAmount;
        
        // Transfer PYUSD to business
        require(PYUSD.transfer(invoice.business, factorAmount), "Transfer failed");
        
        factorInvoices[msg.sender].push(_invoiceId);
        
        emit InvoiceFactored(_invoiceId, msg.sender, factorAmount);
    }
    
    
    /**
     * @dev Pay an invoice (customer pays the full amount)
     */
    function payInvoice(uint256 _invoiceId) external nonReentrant {
        Invoice storage invoice = invoices[_invoiceId];
        require(invoice.id != 0, "Invoice does not exist");
        require(!invoice.isPaid, "Invoice already paid");
        require(invoice.isFactored, "Invoice must be factored first");
        require(msg.sender == invoice.customer, "Only customer can pay");
        
        // Transfer full amount from customer
        require(PYUSD.transferFrom(msg.sender, address(this), invoice.amount), "Payment failed");
        
        // Mark as paid
        invoice.isPaid = true;
        
        // Calculate returns
        uint256 factorReturn = invoice.amount; // Factor gets full amount back
        uint256 factorProfit = invoice.amount - invoice.factorAmount; // Profit is the difference
        
        // Update investor earnings
        investors[invoice.factor].totalEarned += factorProfit;
        
        // Add liquidity back to pool
        totalLiquidity += factorReturn;
        
        emit InvoicePaid(_invoiceId, invoice.amount);
    }
    
    // Investor functions
    
    /**
     * @dev Deposit PYUSD to provide liquidity
     */
    function depositLiquidity(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        
        // Transfer PYUSD from investor
        require(PYUSD.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        
        // Update investor
        if (!investors[msg.sender].isActive) {
            investors[msg.sender].isActive = true;
        }
        investors[msg.sender].totalDeposited += _amount;
        
        // Update total liquidity
        totalLiquidity += _amount;
        
        emit LiquidityDeposited(msg.sender, _amount);
    }
    
    /**
     * @dev Withdraw liquidity (only if not actively factoring)
     */
    function withdrawLiquidity(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(investors[msg.sender].totalDeposited >= _amount, "Insufficient balance");
        
        // Check if investor has any active factored invoices
        uint256[] memory factorInvoiceIds = factorInvoices[msg.sender];
        for (uint256 i = 0; i < factorInvoiceIds.length; i++) {
            require(invoices[factorInvoiceIds[i]].isPaid, "Cannot withdraw with active invoices");
        }
        
        // Update investor
        investors[msg.sender].totalDeposited -= _amount;
        
        // Update total liquidity
        totalLiquidity -= _amount;
        
        // Transfer PYUSD to investor
        require(PYUSD.transfer(msg.sender, _amount), "Transfer failed");
        
        emit LiquidityWithdrawn(msg.sender, _amount);
    }
    
    /**
     * @dev Collect earned returns
     */
    function collectReturns() external nonReentrant {
        uint256 earned = investors[msg.sender].totalEarned;
        require(earned > 0, "No returns to collect");
        
        // Reset earned amount
        investors[msg.sender].totalEarned = 0;
        
        // Transfer PYUSD to investor
        require(PYUSD.transfer(msg.sender, earned), "Transfer failed");
        
        emit ReturnsCollected(msg.sender, earned);
    }
    
    // View functions
    
    /**
     * @dev Get invoice details
     */
    function getInvoice(uint256 _invoiceId) external view returns (Invoice memory) {
        return invoices[_invoiceId];
    }
    
    /**
     * @dev Get investor details
     */
    function getInvestor(address _investor) external view returns (Investor memory) {
        return investors[_investor];
    }
    
    /**
     * @dev Get business invoices
     */
    function getBusinessInvoices(address _business) external view returns (uint256[] memory) {
        return businessInvoices[_business];
    }
    
    /**
     * @dev Get factor invoices
     */
    function getFactorInvoices(address _factor) external view returns (uint256[] memory) {
        return factorInvoices[_factor];
    }
    
    /**
     * @dev Get available liquidity
     */
    function getAvailableLiquidity() external view returns (uint256) {
        return totalLiquidity;
    }
    
    /**
     * @dev Calculate factor amount for an invoice
     */
    function calculateFactorAmount(uint256 _invoiceAmount) external pure returns (uint256) {
        return (_invoiceAmount * 80) / 100;
    }
}
