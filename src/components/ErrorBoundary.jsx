import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, info: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    this.setState({ info })
    try {
      console.error('[ErrorBoundary]', error, info?.componentStack)
      localStorage.setItem('last_crash', JSON.stringify({
        message: error.message,
        stack: error.stack?.slice(0, 500),
        componentStack: info?.componentStack?.slice(0, 1000),
        time: new Date().toISOString(),
        url: location.href,
      }))
    } catch {}
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFF8E7] p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold text-red-600 mb-2">حدث خطأ / Something went wrong</h1>
            <p className="text-gray-600 text-sm mb-4">{this.state.error.message}</p>
            <details className="text-left text-xs text-gray-400 mb-4 bg-gray-50 rounded p-3 max-h-40 overflow-auto">
              <summary className="cursor-pointer mb-1">تفاصيل الخطأ / Error Details</summary>
              <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
              {this.state.info?.componentStack && (
                <pre className="whitespace-pre-wrap mt-2 text-red-400">{this.state.info.componentStack}</pre>
              )}
            </details>
            <button
              onClick={() => { this.setState({ error: null, info: null }); location.reload() }}
              className="px-6 py-2 bg-nile text-white rounded-lg hover:bg-nile-light transition-colors font-medium"
            >
              إعادة تحميل / Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
