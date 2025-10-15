import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Wifi, WifiOff } from "lucide-react";

interface ConnectionTest {
  name: string;
  status: 'pending' | 'success' | 'error';
  duration?: number;
  error?: string;
}

export const ConnectionDiagnostic: React.FC = () => {
  const [tests, setTests] = useState<ConnectionTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const newTests: ConnectionTest[] = [
      { name: "Supabase Connection", status: 'pending' },
      { name: "Employees Table", status: 'pending' },
      { name: "KIPAPP Table", status: 'pending' },
      { name: "Absen Table", status: 'pending' },
    ];
    setTests(newTests);

    // Test 1: Basic Supabase connection
    try {
      const start = Date.now();
      const { data, error } = await supabase.from('employees').select('count').limit(1);
      const duration = Date.now() - start;
      
      newTests[0] = {
        name: "Supabase Connection",
        status: error ? 'error' : 'success',
        duration,
        error: error?.message
      };
      setTests([...newTests]);
    } catch (err: any) {
      newTests[0] = {
        name: "Supabase Connection",
        status: 'error',
        error: err.message
      };
      setTests([...newTests]);
    }

    // Test 2: Employees table
    try {
      const start = Date.now();
      const { data, error } = await supabase.from('employees').select('id').limit(1);
      const duration = Date.now() - start;
      
      newTests[1] = {
        name: "Employees Table",
        status: error ? 'error' : 'success',
        duration,
        error: error?.message
      };
      setTests([...newTests]);
    } catch (err: any) {
      newTests[1] = {
        name: "Employees Table",
        status: 'error',
        error: err.message
      };
      setTests([...newTests]);
    }

    // Test 3: KIPAPP table
    try {
      const start = Date.now();
      const { data, error } = await supabase.from('kipapp').select('id').limit(1);
      const duration = Date.now() - start;
      
      newTests[2] = {
        name: "KIPAPP Table",
        status: error ? 'error' : 'success',
        duration,
        error: error?.message
      };
      setTests([...newTests]);
    } catch (err: any) {
      newTests[2] = {
        name: "KIPAPP Table",
        status: 'error',
        error: err.message
      };
      setTests([...newTests]);
    }

    // Test 4: Absen table
    try {
      const start = Date.now();
      const { data, error } = await supabase.from('absen').select('id').limit(1);
      const duration = Date.now() - start;
      
      newTests[3] = {
        name: "Absen Table",
        status: error ? 'error' : 'success',
        duration,
        error: error?.message
      };
      setTests([...newTests]);
    } catch (err: any) {
      newTests[3] = {
        name: "Absen Table",
        status: 'error',
        error: err.message
      };
      setTests([...newTests]);
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: ConnectionTest['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: ConnectionTest['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const allTestsComplete = tests.length > 0 && tests.every(test => test.status !== 'pending');
  const hasErrors = tests.some(test => test.status === 'error');

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {hasErrors ? <WifiOff className="h-5 w-5 text-red-600" /> : <Wifi className="h-5 w-5 text-green-600" />}
          Database Connection Diagnostic
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runDiagnostics} 
          disabled={isRunning}
          className="w-full"
          variant={hasErrors ? "destructive" : "default"}
        >
          {isRunning ? "Running Diagnostics..." : "Test Database Connection"}
        </Button>

        {tests.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Test Results:</h4>
            {tests.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                <div className="flex items-center gap-2">
                  {getStatusIcon(test.status)}
                  <span className="text-sm font-medium">{test.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {test.duration && (
                    <span className="text-xs text-gray-500">{test.duration}ms</span>
                  )}
                  {getStatusBadge(test.status)}
                </div>
                {test.error && (
                  <div className="mt-1 text-xs text-red-600">
                    Error: {test.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {allTestsComplete && (
          <div className="mt-4 p-3 rounded-lg bg-white border">
            <h4 className="font-medium text-sm mb-2">Summary:</h4>
            <div className="text-sm">
              {hasErrors ? (
                <div className="text-red-600">
                  ❌ Database connection issues detected. Please check your network connection and Supabase configuration.
                </div>
              ) : (
                <div className="text-green-600">
                  ✅ All database connections are working properly.
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConnectionDiagnostic;
