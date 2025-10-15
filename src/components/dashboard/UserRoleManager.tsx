import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getAllUserProfiles, makeUserAdmin, makeUserRegular, UserProfile } from "@/utils/adminUtils";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Shield, User, RefreshCw } from "lucide-react";

export const UserRoleManager: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user: currentUser, refetchProfile } = useAuth();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setLoading(false);
      setError("Timeout: Gagal memuat data user. Silakan coba lagi.");
      toast({
        title: "Timeout",
        description: "Gagal memuat data user. Silakan coba lagi.",
        variant: "destructive",
      });
    }, 10000); // 10 second timeout
    
    try {
      console.log("[UserRoleManager] Fetching user profiles...");
      const userProfiles = await getAllUserProfiles();
      console.log("[UserRoleManager] Fetched profiles:", userProfiles);
      setUsers(userProfiles);
      clearTimeout(timeout);
    } catch (error: any) {
      console.error("[UserRoleManager] Error fetching users:", error);
      setError(error.message || "Unknown error");
      toast({
        title: "Error",
        description: "Gagal memuat data user: " + (error.message || "Unknown error"),
        variant: "destructive",
      });
      clearTimeout(timeout);
    } finally {
      setLoading(false);
    }
  }, []); // toast from useToast should be stable

  const handleRoleChange = useCallback(async (userId: string, currentRole: string) => {
    setRefreshing(true);
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      
      if (newRole === 'admin') {
        await makeUserAdmin(userId);
        toast({
          title: "Berhasil",
          description: "User berhasil diubah menjadi admin.",
        });
      } else {
        await makeUserRegular(userId);
        toast({
          title: "Berhasil",
          description: "User berhasil diubah menjadi regular user.",
        });
      }

      // Refresh the list
      await fetchUsers();
      
      // If this is the current user, refetch their profile
      if (userId === currentUser?.id) {
        await refetchProfile();
        toast({
          title: "Role Diperbarui",
          description: "Role Anda telah diperbarui. Silakan refresh halaman untuk melihat perubahan.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Gagal mengubah role user: " + error.message,
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  }, [toast, currentUser, refetchProfile]); // fetchUsers is stable

  useEffect(() => {
    fetchUsers();
  }, []); // Empty dependency array - only run once on mount

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Role Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Memuat data user...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Role Manager
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Perhatian:</strong> Komponen ini hanya untuk development/testing. 
              Mengubah role user akan mempengaruhi akses ke fitur admin.
            </p>
          </div>

          {error ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-red-400 mx-auto mb-2" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchUsers} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Coba Lagi
              </Button>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Tidak ada user ditemukan</p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                        {user.role === 'admin' ? (
                          <Shield className="h-4 w-4 text-blue-600" />
                        ) : (
                          <User className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.email}</p>
                        <p className="text-sm text-gray-500">
                          ID: {user.id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={user.role === 'admin' ? 'default' : 'outline'}
                      className={user.role === 'admin' ? 'bg-blue-100 text-blue-800' : ''}
                    >
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </Badge>
                    
                    {user.id === currentUser?.id && (
                      <Badge variant="outline" className="text-xs">
                        Anda
                      </Badge>
                    )}
                    
                    <Button
                      size="sm"
                      variant={user.role === 'admin' ? 'outline' : 'default'}
                      onClick={() => handleRoleChange(user.id, user.role)}
                      disabled={refreshing}
                    >
                      {user.role === 'admin' ? 'Jadikan User' : 'Jadikan Admin'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserRoleManager;
