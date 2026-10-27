import { useEffect, type FC, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    children: ReactNode;
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, title, subtitle, children }) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop with clinical blur */}
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 z-10 overflow-hidden transform transition-all duration-200 ease-out">
                {/* Header */}
                <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight">{title}</h3>
                        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="დახურვა"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">{children}</div>
            </div>
        </div>,
        document.body
    );
};