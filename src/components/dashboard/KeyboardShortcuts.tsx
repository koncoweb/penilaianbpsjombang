import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useDashboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { HelpCircle, Keyboard } from "lucide-react";

export const KeyboardShortcuts: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const shortcuts = useDashboardShortcuts();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900"
          title="Keyboard Shortcuts (Ctrl+/)"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          Shortcuts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Navigation</h3>
            <div className="grid gap-3">
              {shortcuts.slice(0, 4).map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{shortcut.description}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {shortcut.ctrlKey && <Badge variant="outline">Ctrl</Badge>}
                    <Badge variant="secondary">{shortcut.key.toUpperCase()}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Actions</h3>
            <div className="grid gap-3">
              {shortcuts.slice(4).map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{shortcut.description}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {shortcut.ctrlKey && <Badge variant="outline">Ctrl</Badge>}
                    <Badge variant="secondary">{shortcut.key.toUpperCase()}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Gunakan Ctrl + / untuk membuka dialog ini kapan saja.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcuts;
