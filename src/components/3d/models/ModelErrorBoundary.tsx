'use client'

import React from 'react'

interface ModelErrorBoundaryProps {
  children: React.ReactNode
  fallback: React.ComponentType<any>
  fallbackProps: any
}

interface ModelErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export default class ModelErrorBoundary extends React.Component<
  ModelErrorBoundaryProps,
  ModelErrorBoundaryState
> {
  constructor(props: ModelErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ModelErrorBoundaryState {
    // エラーが発生した場合の状態更新
    console.warn('3D Model loading error:', error.message)
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // エラーログ
    console.warn('3D Model Error Boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // フォールバックコンポーネントを表示
      const FallbackComponent = this.props.fallback
      return <FallbackComponent {...this.props.fallbackProps} />
    }

    return this.props.children
  }
}
