import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    public static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 m-4 text-center bg-red-50 border border-red-200 rounded-lg">
                    <h2 className="text-lg font-semibold text-red-800">დაფიქსირდა შეცდომა</h2>
                    <p className="mt-2 text-sm text-red-600">გთხოვთ გადატვირთოთ გვერდი ან სცადოთ მოგვიანებით.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                    >
                        ხელახლა ცდა
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}