'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}


/**
 * ErrorBoundary component to catch JavaScript errors in its child component tree.
 * It can be used to display a fallback UI when an error occurs.
 */


class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="text-center py-8">
          <h2 className="text-red-500">Something went wrong</h2>
          {process.env.NODE_ENV === 'development' && (
            <div className="text-sm mt-2">
              {this.state.error?.message}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;