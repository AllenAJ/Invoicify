// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/InvoiceFactoring.sol";

contract DeployInvoiceFactoring is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        // PYUSD on ETH Sepolia: 0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9
        InvoiceFactoring invoiceFactoring = new InvoiceFactoring(0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9);
        
        console.log("InvoiceFactoring deployed at:", address(invoiceFactoring));
        console.log("PYUSD token address:", address(invoiceFactoring.PYUSD()));
        
        vm.stopBroadcast();
    }
}
