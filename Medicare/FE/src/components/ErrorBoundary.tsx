import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] Lỗi khi render trang:', error, info);
  }

  handleReset = (): void => {
    this.setState({ error: null });
  };

  render(): React.ReactNode {
    const { error } = this.state;
    if (error) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="max-w-lg w-full rounded-[20px] border border-rose-200 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-bold text-rose-600">Đã xảy ra lỗi khi hiển thị trang</h2>
            <p className="mt-2 text-sm text-slate-600">
              Vui lòng chụp lại nội dung lỗi bên dưới để được hỗ trợ khắc phục:
            </p>
            <pre className="mt-3 max-h-60 overflow-auto rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-rose-700 whitespace-pre-wrap break-words">
              {error.message}
              {error.stack ? `\n\n${error.stack}` : ''}
            </pre>
            <button
              type="button"
              onClick={this.handleReset}
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1d4ed8] transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
