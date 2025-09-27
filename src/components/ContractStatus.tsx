import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { isContractDeployed, getContractAddress, CONTRACT_CONFIG } from "@/config/contract";

export default function ContractStatus() {
  const deployed = isContractDeployed();
  const contractAddress = getContractAddress();

  return (
    <Card>
      {/* <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {deployed ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-600" />
          )}
          Smart Contract Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <Badge variant={deployed ? "default" : "secondary"}>
            {deployed ? "Deployed" : "Not Deployed"}
          </Badge>
        </div>
        
        {deployed && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Contract Address:</span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {contractAddress}
              </code>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Network:</span>
              <Badge variant="outline">{CONTRACT_CONFIG.NETWORK.name}</Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">PYUSD Token:</span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {CONTRACT_CONFIG.PYUSD.address}
              </code>
            </div>
          </div>
        )}
        
        {!deployed && (
          <div className="space-y-3">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Smart contract is not deployed yet. Follow these steps:
              </p>
              <ol className="text-xs text-amber-600 dark:text-amber-400 mt-2 space-y-1 list-decimal list-inside">
                <li>Set up your .env file with API keys</li>
                <li>Run the deployment script</li>
                <li>Update the contract address in config</li>
              </ol>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => window.open('/contracts/DEPLOYMENT.md', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Deployment Guide
            </Button>
          </div>
        )}
      </CardContent> */}
    </Card>
  );
}
