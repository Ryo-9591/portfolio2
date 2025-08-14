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
    if (error.message.includes('Could not load') || error.message.includes('404')) {
      console.log('ℹ️ 3D Model not found, using fallback:', error.message)
    } else {
      console.warn('⚠️ 3D Model loading error:', error.message)
    }
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // エラーログ（詳細情報は開発時のみ）
    if (process.env.NODE_ENV === 'development') {
      console.warn('3D Model Error Boundary caught an error:', error, errorInfo)
    }
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
