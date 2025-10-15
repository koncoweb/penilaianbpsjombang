import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Settings, Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface WelcomeHeaderProps {
  onLogout?: () => void;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ onLogout }) => {
  const { user, isAdmin, logout } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 17) return "Selamat Siang";
    if (hour < 19) return "Selamat Sore";
    return "Selamat Malam";
  };

  const getCurrentTime = () => {
    return new Date().toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {getGreeting()}, {user?.email?.split('@')[0] || 'User'}!
          </h1>
          <p className="text-blue-100 text-sm sm:text-base mb-3">
            {getCurrentTime()}
          </p>
          <div className="flex items-center gap-2">
            <Badge 
              variant={isAdmin ? "default" : "secondary"} 
              className={`${isAdmin ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'} text-white`}
            >
              {isAdmin ? 'Administrator' : 'User'}
            </Badge>
            <span className="text-blue-200 text-sm">
              BPS Kabupaten Jombang
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-blue-500 hover:text-white"
          >
            <Bell className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-blue-500 hover:text-white"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-red-500 hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
