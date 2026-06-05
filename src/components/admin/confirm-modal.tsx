import AdminModal from './admin-modal';
import Button from '@/components/ui/button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', isDestructive = true, isLoading = false
}: ConfirmModalProps) {
  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={title} className="md:w-[400px]">
      <p className="font-inter text-sm text-espresso-300 mb-6">{message}</p>
      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button 
          onClick={onConfirm} 
          isLoading={isLoading}
          className={isDestructive ? 'bg-red-600 hover:bg-red-700 text-white border-none' : ''}
        >
          {confirmText}
        </Button>
      </div>
    </AdminModal>
  );
}
