import React from 'react';
import { Building2 } from 'lucide-react';

interface AppHeaderProps {
  title?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title = "PENILAIAN KINERJA BPS JOMBANG" }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <img 
                src="/logo bps.png" 
                alt="Logo BPS" 
                className="h-8 w-8 object-contain"
                onError={(e) => {
                  // Fallback jika logo tidak ditemukan
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              <Building2 
                className="h-8 w-8 text-blue-600 hidden" 
                style={{ display: 'none' }}
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                {title}
              </h1>
              <p className="text-xs text-gray-600 leading-tight">
                Badan Pusat Statistik Kabupaten Jombang
              </p>
            </div>
          </div>

          {/* Right side - can be used for user info or actions */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-xs text-gray-500">
                Sistem Penilaian Kinerja
              </p>
              <p className="text-xs text-gray-500">
                Pegawai
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
