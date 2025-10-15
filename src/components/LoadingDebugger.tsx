import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Development-only component to help debug loading states
 * Shows which components are currently in loading state
 */
export const LoadingDebugger: React.FC = () => {
  const { loading, ready } = useAuth();

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development' || !import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 text-white p-3 rounded-lg text-xs font-mono">
      <div className="space-y-1">
        <div className="font-bold">Loading States Debug</div>
        <div className={`flex items-center gap-2`}>
          <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
          <span>Auth: {loading ? 'Loading' : 'Ready'}</span>
        </div>
        <div className={`flex items-center gap-2`}>
          <div className={`w-2 h-2 rounded-full ${ready ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span>Ready: {ready ? 'Yes' : 'No'}</span>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default LoadingDebugger;
