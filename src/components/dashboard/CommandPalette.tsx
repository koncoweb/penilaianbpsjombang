import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Users, 
  FileText, 
  CalendarX, 
  BarChart3, 
  ArrowRight,
  Command,
  Clock,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'navigation' | 'actions' | 'recent';
  action: () => void;
  keywords: string[];
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Recent actions storage
  const [recentActions, setRecentActions] = useState<string[]>(() => {
    const saved = localStorage.getItem('dashboard-recent-actions');
    return saved ? JSON.parse(saved) : [];
  });

  const commands: CommandItem[] = [
    // Navigation commands
    {
      id: 'nav-employees',
      title: 'Data Pegawai',
      description: 'Kelola informasi pegawai',
      icon: <Users className="h-4 w-4" />,
      category: 'navigation',
      action: () => {
        navigate('/admin/employees');
        addToRecent('nav-employees');
        setIsOpen(false);
      },
      keywords: ['pegawai', 'karyawan', 'employees', 'data pegawai']
    },
    {
      id: 'nav-kipapp',
      title: 'Data KIPAPP',
      description: 'Kelola nilai kinerja pegawai',
      icon: <FileText className="h-4 w-4" />,
      category: 'navigation',
      action: () => {
        navigate('/admin/kipapp');
        addToRecent('nav-kipapp');
        setIsOpen(false);
      },
      keywords: ['kipapp', 'kinerja', 'performance', 'nilai']
    },
    {
      id: 'nav-absen',
      title: 'Data Absen',
      description: 'Kelola kehadiran pegawai',
      icon: <CalendarX className="h-4 w-4" />,
      category: 'navigation',
      action: () => {
        navigate('/admin/absen');
        addToRecent('nav-absen');
        setIsOpen(false);
      },
      keywords: ['absen', 'kehadiran', 'attendance', 'hadir']
    },
    {
      id: 'nav-report',
      title: 'Laporan Triwulan',
      description: 'Lihat laporan performa triwulan',
      icon: <BarChart3 className="h-4 w-4" />,
      category: 'navigation',
      action: () => {
        navigate('/admin/quarterly-report');
        addToRecent('nav-report');
        setIsOpen(false);
      },
      keywords: ['laporan', 'report', 'triwulan', 'quarterly']
    },
    // Action commands
    {
      id: 'refresh',
      title: 'Refresh Dashboard',
      description: 'Perbarui data dashboard',
      icon: <TrendingUp className="h-4 w-4" />,
      category: 'actions',
      action: () => {
        window.location.reload();
        addToRecent('refresh');
        setIsOpen(false);
      },
      keywords: ['refresh', 'reload', 'perbarui', 'update']
    }
  ];

  const addToRecent = (commandId: string) => {
    const newRecent = [commandId, ...recentActions.filter(id => id !== commandId)].slice(0, 5);
    setRecentActions(newRecent);
    localStorage.setItem('dashboard-recent-actions', JSON.stringify(newRecent));
  };

  // Filter commands based on query
  const filteredCommands = commands.filter(command => {
    if (!query) return true;
    
    const searchQuery = query.toLowerCase();
    return (
      command.title.toLowerCase().includes(searchQuery) ||
      command.description.toLowerCase().includes(searchQuery) ||
      command.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery))
    );
  });

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  const flatCommands = Object.values(groupedCommands).flat();

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      
      if (isOpen) {
        if (e.key === 'Escape') {
          setIsOpen(false);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, flatCommands.length - 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (flatCommands[selectedIndex]) {
            flatCommands[selectedIndex].action();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, flatCommands]);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'navigation':
        return <ArrowRight className="h-3 w-3" />;
      case 'actions':
        return <Command className="h-3 w-3" />;
      case 'recent':
        return <Clock className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'navigation':
        return 'Navigation';
      case 'actions':
        return 'Actions';
      case 'recent':
        return 'Recent';
      default:
        return category;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              ref={inputRef}
              placeholder="Cari halaman, aksi, atau ketik perintah..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Badge variant="outline" className="text-xs">
                ⌘K
              </Badge>
            </div>
          </div>

          {/* Command List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
              <div key={category}>
                <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {getCategoryIcon(category)}
                  {getCategoryLabel(category)}
                </div>
                <div className="space-y-1">
                  {categoryCommands.map((command, index) => {
                    const globalIndex = flatCommands.indexOf(command);
                    return (
                      <button
                        key={command.id}
                        onClick={command.action}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors",
                          "hover:bg-gray-100",
                          globalIndex === selectedIndex && "bg-blue-50 border border-blue-200"
                        )}
                      >
                        <div className="flex-shrink-0 text-gray-600">
                          {command.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900">
                            {command.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {command.description}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {filteredCommands.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Tidak ada hasil untuk "{query}"</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
            <div className="flex items-center gap-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>Esc Close</span>
            </div>
            <div>
              <span>⌘K untuk buka cepat</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommandPalette;
