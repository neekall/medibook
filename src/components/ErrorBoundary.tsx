import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[400px] flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-white border border-slate-200/90 rounded-2xl p-8 text-center shadow-xl shadow-slate-100">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mb-4">
                            <AlertTriangle size={24} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                            დაფიქსირდა შეცდომა
                        </h2>
                        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                            მონაცემების დამუშავებისას მოხდა გაუთვალისწინებელი შეცდომა. გთხოვთ განაახლოთ გვერდი ან სცადოთ მოგვიანებით.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm cursor-pointer"
                        >
                            <RotateCcw size={14} />
                            <span>გვერდის განახლება</span>
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}