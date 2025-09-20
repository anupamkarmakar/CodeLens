import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import SimpleLandingPage from './SimpleLandingPage'
import './App.css'
import './App-old.css'

function App() {
  const [currentView, setCurrentView] = useState('landing') 
  const [useFallbackEditor, setUseFallbackEditor] = useState(false) // Toggle between editors
  const [ code, setCode ] = useState(` function sum() {
  return 1 + 1
}`)

  const [ review, setReview ] = useState(``)
  const [ loading, setLoading ] = useState(false)
  const [ error, setError ] = useState('')

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    setLoading(true)
    setError('')
    try {
      const response = await axios.post('http://localhost:3000/ai/get-response', { 
        prompt: code 
      }, {
        timeout: 30000 
      })
      setReview(response.data.review || response.data)
    } catch (error) {
      console.error('Error reviewing code:', error)
      if (error.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.')
      } else if (error.response) {
        setError(`Server error: ${error.response.status}`)
      } else if (error.request) {
        setError('Cannot connect to server. Please make sure the backend is running.')
      } else {
        setError('An unexpected error occurred.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGetStarted = () => {
    setCurrentView('editor')
  }

  const handleBackToLanding = () => {
    setCurrentView('landing')
  }

  if (currentView === 'landing') {
    return <SimpleLandingPage onGetStarted={handleGetStarted} />
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo" onClick={handleBackToLanding}>
            <span className="logo-icon">🔍</span>
            <span className="logo-text">CodeLens</span>
            <span className="version-tag">Simple</span>
          </div>
          <div className="header-right">
            <span className="header-subtitle">AI-Powered Code Review</span>
            <button className="back-btn" onClick={handleBackToLanding}>
              ← Back to Home
            </button>
          </div>
        </div>
      </header>
      
      <main className="editor-main">
        <div className="left">
          <div className="section-header">
            <h3>📝 Your Code</h3>
            <div className="code-actions">
              <span className="code-language">JavaScript</span>
              <button className="clear-btn" onClick={() => setCode(` function sum() {\n  return 1 + 1\n}`)}>
                🗑️ Clear
              </button>
              <button 
                className="toggle-editor-btn" 
                onClick={() => setUseFallbackEditor(!useFallbackEditor)}
                title={useFallbackEditor ? "Switch to Enhanced Editor" : "Switch to Simple Editor"}
              >
                {useFallbackEditor ? "🎨 Enhanced" : "📝 Simple"}
              </button>
            </div>
          </div>
          <div className="code-container">
            <div className="editor-wrapper">
              {!useFallbackEditor ? (
                <Editor
                  value={code}
                  onValueChange={(newCode) => {
                    console.log('Enhanced Editor value changing from:', code.substring(0, 50), 'to:', newCode.substring(0, 50));
                    setCode(newCode);
                  }}
                  highlight={code => {
                    try {
                      return prism.highlight(code, prism.languages.javascript, "javascript");
                    } catch (error) {
                      console.error('Syntax highlighting error:', error);
                      return code;
                    }
                  }}
                  padding={20}
                  readOnly={false}
                  disabled={false}
                  tabSize={2}
                  insertSpaces={true}
                  ignoreTabKey={false}
                  preClassName="code-editor-pre"
                  textareaClassName="code-editor-textarea"
                  style={{
                    fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
                    fontSize: 14,
                    lineHeight: 1.6,
                    border: "2px solid #e2e8f0",
                    borderRadius: "12px",
                    minHeight: "450px",
                    width: "100%",
                    background: "#ffffff",
                    overflow: "auto",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    outline: "none"
                  }}
                  textareaProps={{
                    autoComplete: "off",
                    autoCorrect: "off",
                    autoCapitalize: "off",
                    spellCheck: false,
                    placeholder: "Type your code here...",
                    'data-testid': 'enhanced-code-editor',
                    style: {
                      outline: "none",
                      resize: "none",
                      fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
                      fontSize: "14px",
                      lineHeight: "1.6",
                      background: "transparent",
                      border: "none",
                      color: "#1f2937"
                    }
                  }}
                />
              ) : (
                <div className="fallback-editor">
                  <textarea
                    value={code}
                    onChange={(e) => {
                      console.log('Fallback Editor value changing:', e.target.value.substring(0, 50));
                      setCode(e.target.value);
                    }}
                    placeholder="Simple text editor - Type your code here..."
                    data-testid="fallback-code-editor"
                    style={{
                      width: '100%',
                      minHeight: '450px',
                      fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      padding: '20px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      background: '#ffffff',
                      resize: 'vertical',
                      outline: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="action-bar">
            <button
              onClick={reviewCode}
              disabled={loading || !code.trim()}
              className={`review-btn ${loading ? 'loading' : ''} ${!code.trim() ? 'disabled' : ''}`}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Analyzing Code...
                </>
              ) : (
                <>
                  🔍 Review Code
                </>
              )}
            </button>
            <div className="code-stats">
              <span className="stat">Lines: {code.split('\n').length}</span>
              <span className="stat">Characters: {code.length}</span>
            </div>
          </div>
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <div>
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}
        </div>
        <div className="right">
          <div className="section-header">
            <h3>🤖 AI Code Review</h3>
            <div className="review-actions">
              {review && (
                <>
                  <button className="export-btn" onClick={() => navigator.clipboard.writeText(review)}>
                    📋 Copy Review
                  </button>
                  <button className="clear-review-btn" onClick={() => setReview('')}>
                    🗑️ Clear
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="review-container">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <h4>🔍 Analyzing Your Code...</h4>
                <p>Our AI is carefully reviewing your code for improvements, best practices, and potential issues. This usually takes a few seconds.</p>
                <div className="loading-progress">
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                </div>
              </div>
            ) : review ? (
              <div className="review-content">
                <div className="review-header">
                  <span className="review-badge">✨ Analysis Complete</span>
                  <span className="review-timestamp">Just now</span>
                </div>
                <Markdown rehypePlugins={[rehypeHighlight]}>
                  {review}
                </Markdown>
                <div className="review-footer">
                  <p className="review-tip">💡 <strong>Tip:</strong> Use the suggestions above to improve your code quality and performance.</p>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🎯</div>
                <h4>Ready for AI Review</h4>
                <p>Click <strong>&quot;Review Code&quot;</strong> to get intelligent analysis including:</p>
                <ul className="feature-list">
                  <li>🔍 Code quality assessment</li>
                  <li>🚀 Performance optimization tips</li>
                  <li>🛡️ Security vulnerability detection</li>
                  <li>📚 Best practice recommendations</li>
                  <li>🐛 Bug identification and fixes</li>
                </ul>
                <p className="empty-subtitle">Get started by writing some code and clicking the review button!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}



export default App
