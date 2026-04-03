import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">Something went wrong</h1>
            <p className="text-slate-500 mb-6">{this.state.error?.message || "An unexpected error occurred."}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#2563eb] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#1d4ed8] transition-colors"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
