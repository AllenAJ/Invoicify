import { useState } from "react";
import toast from "react-hot-toast";

interface RiskPreferences {
  riskLevel: 'low' | 'medium' | 'high';
  minReturn: number;
  maxInvoiceAmount: number;
  minInvoiceAmount: number;
  maxDueDate: number; // days
  autoReinvest: boolean;
}

export default function RiskPreferences() {
  const [preferences, setPreferences] = useState<RiskPreferences>({
    riskLevel: 'medium',
    minReturn: 10, // 10% APR
    maxInvoiceAmount: 50000,
    minInvoiceAmount: 1000,
    maxDueDate: 90, // 90 days
    autoReinvest: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate saving preferences
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setHasSaved(true);
      toast.success("Risk preferences saved successfully!");
    } catch (error) {
      toast.error("Failed to save preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setHasSaved(false);
    setPreferences({
      riskLevel: 'medium',
      minReturn: 10,
      maxInvoiceAmount: 50000,
      minInvoiceAmount: 1000,
      maxDueDate: 90,
      autoReinvest: true,
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getExpectedReturn = () => {
    switch (preferences.riskLevel) {
      case 'low': return '8-12%';
      case 'medium': return '10-15%';
      case 'high': return '12-20%';
      default: return '10-15%';
    }
  };

  if (hasSaved) {
    return (
      <div className='bg-white dark:bg-zinc-700 p-6 rounded-lg border-2 border-green-300 dark:border-green-600'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
            ✓
          </div>
          <h3 className='text-lg font-bold text-green-600 dark:text-green-400'>Preferences Saved!</h3>
        </div>
        
        <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6'>
          <div className='text-center'>
            <p className='text-lg font-bold text-green-600 dark:text-green-400 mb-2'>
              Risk Level: {preferences.riskLevel.charAt(0).toUpperCase() + preferences.riskLevel.slice(1)}
            </p>
            <p className='text-gray-600 dark:text-gray-400'>
              Expected Returns: {getExpectedReturn()} APR
            </p>
          </div>
        </div>
        
        <div className='space-y-4'>
          <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
            <h4 className='font-semibold text-blue-800 dark:text-blue-200 mb-2'>Your Settings:</h4>
            <ul className='text-sm text-blue-700 dark:text-blue-300 space-y-1'>
              <li>• Minimum Return: {preferences.minReturn}% APR</li>
              <li>• Invoice Range: ${preferences.minInvoiceAmount.toLocaleString()} - ${preferences.maxInvoiceAmount.toLocaleString()}</li>
              <li>• Max Due Date: {preferences.maxDueDate} days</li>
              <li>• Auto-reinvest: {preferences.autoReinvest ? 'Enabled' : 'Disabled'}</li>
            </ul>
          </div>
          
          <div className='text-center'>
            <button
              onClick={handleReset}
              className='bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-md transition-colors'
            >
              Update Preferences
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-zinc-700 p-6 rounded-lg border-2 border-zinc-300 dark:border-zinc-600'>
      <div className='flex items-center gap-3 mb-4'>
        <div className='w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
          2
        </div>
        <h3 className='text-lg font-bold'>Set Risk Preferences</h3>
      </div>
      
      <p className='text-gray-500 mb-6'>
        Configure your risk tolerance and return expectations for automatic invoice matching
      </p>
      
      <div className='space-y-6'>
        {/* Risk Level */}
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
            Risk Level
          </label>
          <div className='grid grid-cols-3 gap-3'>
            {(['low', 'medium', 'high'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setPreferences(prev => ({ ...prev, riskLevel: level }))}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  preferences.riskLevel === level
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <div className='text-center'>
                  <p className='font-semibold capitalize'>{level}</p>
                  <p className='text-xs text-gray-500 mt-1'>
                    {level === 'low' && '8-12% APR'}
                    {level === 'medium' && '10-15% APR'}
                    {level === 'high' && '12-20% APR'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Return Expectations */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label htmlFor='minReturn' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Minimum Return (% APR)
            </label>
            <input
              type='number'
              id='minReturn'
              value={preferences.minReturn}
              onChange={(e) => setPreferences(prev => ({ ...prev, minReturn: parseFloat(e.target.value) || 0 }))}
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100'
              min='5'
              max='25'
              step='0.5'
            />
          </div>
          
          <div>
            <label htmlFor='maxDueDate' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Max Due Date (days)
            </label>
            <input
              type='number'
              id='maxDueDate'
              value={preferences.maxDueDate}
              onChange={(e) => setPreferences(prev => ({ ...prev, maxDueDate: parseInt(e.target.value) || 0 }))}
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100'
              min='7'
              max='365'
            />
          </div>
        </div>
        
        {/* Invoice Amount Range */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label htmlFor='minInvoiceAmount' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Min Invoice Amount ($)
            </label>
            <input
              type='number'
              id='minInvoiceAmount'
              value={preferences.minInvoiceAmount}
              onChange={(e) => setPreferences(prev => ({ ...prev, minInvoiceAmount: parseInt(e.target.value) || 0 }))}
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100'
              min='100'
              step='100'
            />
          </div>
          
          <div>
            <label htmlFor='maxInvoiceAmount' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Max Invoice Amount ($)
            </label>
            <input
              type='number'
              id='maxInvoiceAmount'
              value={preferences.maxInvoiceAmount}
              onChange={(e) => setPreferences(prev => ({ ...prev, maxInvoiceAmount: parseInt(e.target.value) || 0 }))}
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100'
              min='1000'
              step='1000'
            />
          </div>
        </div>
        
        {/* Auto-reinvest */}
        <div className='flex items-center gap-3'>
          <input
            type='checkbox'
            id='autoReinvest'
            checked={preferences.autoReinvest}
            onChange={(e) => setPreferences(prev => ({ ...prev, autoReinvest: e.target.checked }))}
            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
          />
          <label htmlFor='autoReinvest' className='text-sm font-medium text-gray-700 dark:text-gray-300'>
            Auto-reinvest returns back into the liquidity pool
          </label>
        </div>
        
        {/* Summary */}
        <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
          <h4 className='font-semibold text-blue-800 dark:text-blue-200 mb-2'>Summary:</h4>
          <div className='text-sm text-blue-700 dark:text-blue-300 space-y-1'>
            <p>• Risk Level: <span className={`px-2 py-1 rounded text-xs ${getRiskColor(preferences.riskLevel)}`}>
              {preferences.riskLevel.charAt(0).toUpperCase() + preferences.riskLevel.slice(1)}
            </span></p>
            <p>• Expected Returns: {getExpectedReturn()} APR</p>
            <p>• Invoice Range: ${preferences.minInvoiceAmount.toLocaleString()} - ${preferences.maxInvoiceAmount.toLocaleString()}</p>
            <p>• Max Due Date: {preferences.maxDueDate} days</p>
          </div>
        </div>
        
        <div className='text-center'>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className='w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white font-medium py-3 px-6 rounded-md transition-colors'
          >
            {isSaving ? (
              <div className='flex items-center justify-center gap-2'>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                Saving...
              </div>
            ) : (
              'Save Risk Preferences'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
