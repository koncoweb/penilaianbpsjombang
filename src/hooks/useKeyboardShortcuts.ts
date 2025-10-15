import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const navigate = useNavigate();

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    const pressedKey = e.key.toLowerCase();
    const hasCtrl = e.ctrlKey;
    const hasShift = e.shiftKey;
    const hasAlt = e.altKey;
    const hasMeta = e.metaKey;

    // Find matching shortcut
    const shortcut = shortcuts.find(s => 
      s.key.toLowerCase() === pressedKey &&
      (s.ctrlKey ?? false) === hasCtrl &&
      (s.shiftKey ?? false) === hasShift &&
      (s.altKey ?? false) === hasAlt &&
      (s.metaKey ?? false) === hasMeta
    );

    if (shortcut) {
      e.preventDefault();
      shortcut.action();
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
};

// Predefined shortcuts for dashboard navigation
export const useDashboardShortcuts = () => {
  const navigate = useNavigate();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: '1',
      ctrlKey: true,
      action: () => navigate('/admin/employees'),
      description: 'Buka Data Pegawai'
    },
    {
      key: '2',
      ctrlKey: true,
      action: () => navigate('/admin/kipapp'),
      description: 'Buka Data KIPAPP'
    },
    {
      key: '3',
      ctrlKey: true,
      action: () => navigate('/admin/absen'),
      description: 'Buka Data Absen'
    },
    {
      key: '4',
      ctrlKey: true,
      action: () => navigate('/admin/quarterly-report'),
      description: 'Buka Laporan Triwulan'
    },
    {
      key: 'r',
      ctrlKey: true,
      action: () => window.location.reload(),
      description: 'Refresh Halaman'
    },
    {
      key: 'h',
      ctrlKey: true,
      action: () => navigate('/'),
      description: 'Kembali ke Dashboard'
    },
    {
      key: 'k',
      ctrlKey: true,
      action: () => {
        // Command palette will be triggered by CommandPalette component
        const event = new KeyboardEvent('keydown', {
          key: 'k',
          ctrlKey: true,
          bubbles: true
        });
        window.dispatchEvent(event);
      },
      description: 'Buka Command Palette'
    },
    {
      key: '/',
      ctrlKey: true,
      action: () => {
        // Will be implemented with shortcuts help
        console.log('Show shortcuts help');
      },
      description: 'Tampilkan Bantuan Keyboard'
    }
  ];

  useKeyboardShortcuts(shortcuts);

  return shortcuts;
};

export default useKeyboardShortcuts;
