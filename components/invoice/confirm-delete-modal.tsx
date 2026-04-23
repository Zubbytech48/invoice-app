'use client';

import { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  invoiceId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  invoiceId,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Focus the cancel button when modal opens for accessibility
  useEffect(() => {
    if (isOpen && cancelButtonRef.current) {
      setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent 
        className="sm:max-w-md"
        onEscapeKeyDown={onCancel}
        aria-describedby="delete-description"
      >
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground">Confirm Deletion</DialogTitle>
          <DialogDescription id="delete-description" className="text-muted-foreground pt-2">
            Are you sure you want to delete invoice #{invoiceId}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button
            ref={cancelButtonRef}
            variant="secondary"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="w-full sm:w-auto"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
