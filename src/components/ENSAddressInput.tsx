import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useENS, isValidENSName, getDisplayText } from '@/hooks/useENS';

interface ENSAddressInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onAddressResolved?: (address: string | null) => void;
  required?: boolean;
  className?: string;
}

export default function ENSAddressInput({
  label = "Customer Address or ENS Name",
  placeholder = "0x... or alice.eth",
  value,
  onChange,
  onAddressResolved,
  required = false,
  className = "",
}: ENSAddressInputProps) {
  const { address, name, isLoading, error, resolveENS, clearResult } = useENS();
  const [inputValue, setInputValue] = useState(value);
  const [hasResolved, setHasResolved] = useState(false);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Notify parent when address is resolved
  useEffect(() => {
    if (address && onAddressResolved) {
      onAddressResolved(address);
    }
  }, [address, onAddressResolved]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    
    // Clear previous results when input changes
    if (hasResolved) {
      clearResult();
      setHasResolved(false);
    }
  };

  const handleResolve = async () => {
    if (!inputValue.trim()) return;
    
    setHasResolved(true);
    await resolveENS(inputValue.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleResolve();
    }
  };

  const isENSName = isValidENSName(inputValue);
  const isAddress = inputValue.startsWith('0x') && inputValue.length === 42;

  return (
    <div className={`space-y-3 ${className}`}>
      <Label htmlFor="customer-address" className="text-base font-medium text-foreground">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            id="customer-address"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            required={required}
            className="minimal-input flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleResolve}
            disabled={isLoading || !inputValue.trim()}
            className="minimal-button"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Resolve"
            )}
          </Button>
        </div>

        {/* Input type indicator */}
        {inputValue && (
          <div className="flex items-center gap-2">
            {isENSName && (
              <Badge variant="secondary" className="text-xs">
                ENS Name
              </Badge>
            )}
            {isAddress && (
              <Badge variant="secondary" className="text-xs">
                Ethereum Address
              </Badge>
            )}
            {!isENSName && !isAddress && inputValue && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                Unknown Format
              </Badge>
            )}
          </div>
        )}

        {/* Resolution result */}
        {hasResolved && (
          <div className="space-y-2">
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Resolving...
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {address && !error && (
              <div className="space-y-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Resolved Successfully</span>
                </div>
                
                <div className="space-y-1 text-sm">
                  {name && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">ENS Name:</span>
                      <span className="font-mono text-foreground">{name}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Address:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-foreground">
                        {getDisplayText(address, name)}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const fullAddress = address;
                          navigator.clipboard.writeText(fullAddress);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help text */}
        <p className="text-xs text-muted-foreground">
          Enter an Ethereum address (0x...) or ENS name (alice.eth). Click "Resolve" to verify.
        </p>
      </div>
    </div>
  );
}
