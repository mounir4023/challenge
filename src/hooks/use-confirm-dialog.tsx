'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { createContext, useCallback, useContext, useRef, useState } from 'react';

type ConfirmOptions = {
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
};

type ConfirmDialogContextType = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmDialogContext = createContext<ConfirmDialogContextType | null>(null);

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const resolver = useRef<((result: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    setVisible(true);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const handleConfirm = () => {
    resolver.current?.(true);
    setVisible(false);
  };

  const handleCancel = () => {
    resolver.current?.(false);
    setVisible(false);
  };

  return (
    <ConfirmDialogContext.Provider value={confirm}>
      {children}

      <AlertDialog open={visible} onOpenChange={setVisible}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{options.title || 'Are you sure?'}</AlertDialogTitle>
            {options.description && (
              <AlertDialogDescription>{options.description}</AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel} className='cursor-pointer'>
              {options.cancelText || 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} className='cursor-pointer'>
              {options.confirmText || 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmDialogContext.Provider>
  );
}

export function useConfirmDialog() {
  const ctx = useContext(ConfirmDialogContext);
  if (!ctx) throw new Error('useConfirmDialog must be used within <ConfirmDialogProvider>');
  return ctx;
}