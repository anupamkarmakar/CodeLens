import { useState, useEffect } from 'react'
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import LandingPage from './LandingPage'
import './App.css'

const getUserFromStorage = () => {
  try {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      return null
    }
    
    const parsedUser = JSON.parse(userData)
    console.log('Getting user from storage:', parsedUser)
    return parsedUser
  } catch (error) {
    console.error('Error getting user from storage:', error)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return null
  }
}

function App() {
  const [currentView, setCurrentView] = useState('landing')
  const [user, setUser] = useState(null)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const [autoSaveStatus, setAutoSaveStatus] = useState('')
  const [ code, setCode ] = useState(` function sum() {
  return 1 + 1
}`)

  const [ review, setReview ] = useState(``)
  const [ loading, setLoading ] = useState(false)
  const [ error, setError ] = useState('')

  useEffect(() => {
    const currentUser = getUserFromStorage()
    console.log('Initial load - User:', currentUser)
    
    if (currentUser) {
      setUser(currentUser)
      if (currentUser.lastCode && currentUser.lastCode.trim()) {
        setCode(currentUser.lastCode)
      } else {
        setCode(` function sum() {
  return 1 + 1
}`)
      }
    } else {
      setCode(` function sum() {
  return 1 + 1
}`)
    }
    

    setIsLoadingAuth(false)
  }, [])


  useEffect(() => {
    const handleStorageChange = () => {
      const currentUser = getUserFromStorage()
      console.log('Storage changed - User:', currentUser)
      
      if (currentUser && (!user || currentUser._id !== user._id)) {
        console.log('User changed, loading their code:', currentUser._id)
        setUser(currentUser)
        if (currentUser.lastCode && currentUser.lastCode.trim()) {
          setCode(currentUser.lastCode)
        } else {
          setCode(` function sum() {
  return 1 + 1
}`)
        }
        setReview('')
        setError('')
      } else if (!currentUser && user) {
        console.log('User logged out')
        setUser(null)
        setCode(` function sum() {
  return 1 + 1
}`)
        setReview('')
        setError('')
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [user])

  useEffect(() => {
    if (user && user.lastCode && user.lastCode.trim() && user.lastCode !== code) {
      console.log('User data updated, syncing code for user:', user._id)
      setCode(user.lastCode)
      setReview('')
      setError('')
    }
  }, [user]) 

  const handleGetStarted = () => {
    setCurrentView('editor')
  }

  const handleBackToLanding = () => {
    setCurrentView('landing')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setCode(` function sum() {
  return 1 + 1
}`)
    setReview('')
    setError('')
    setCurrentView('landing')
  }

  useEffect(() => {
    if (user && code.trim() && code !== ' function sum() {\n  return 1 + 1\n}') {
      const saveCode = async () => {
        try {
          setAutoSaveStatus('Saving...')
          const token = localStorage.getItem('token')
          
          await axios.post('http://localhost:3000/auth/save-code', 
            { code, review },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          )
          
          const updatedUser = { ...user, lastCode: code }
          localStorage.setItem('user', JSON.stringify(updatedUser))
          setUser(updatedUser)
          
          setAutoSaveStatus('Saved ✓')
          setTimeout(() => setAutoSaveStatus(''), 2000)
        } catch (error) {
          console.error('Auto-save error:', error)
          setAutoSaveStatus('Save failed ✗')
          setTimeout(() => setAutoSaveStatus(''), 2000)
        }
      }

      const timeoutId = setTimeout(saveCode, 2000)
      return () => clearTimeout(timeoutId)
    }
  }, [code, review, user])

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

  if (currentView === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} />
  }

  console.log('Rendering dashboard - User:', user, 'CurrentView:', currentView, 'IsLoadingAuth:', isLoadingAuth)

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo" onClick={handleBackToLanding}>
            <span className="logo-icon">🔍</span>
            <span className="logo-text">CodeLens</span>
          </div>
          <div className="header-right">
            {user && (
              <div>
                <span className="user-greeting">Welcome, {user.name}</span>
                {autoSaveStatus && (
                  <span className={`auto-save-status ${autoSaveStatus.toLowerCase().replace(' ', '-').replace('✓', '').replace('✗', '').trim()}`}>
                    {autoSaveStatus}
                  </span>
                )}
              </div>
            )}
            <button className="back-btn" onClick={handleBackToLanding}>
              ← Back to Home
            </button>
            {user && (
              <button className='btn' onClick={handleLogout}>
                Logout 
              </button>
            )}
          </div>
        </div>
      </header>
      
      <main className="editor-main">
        {isLoadingAuth ? (
          <div className="loading-auth">
            <div className="loading-message">
              <h2>Loading...</h2>
              <p>Checking authentication status...</p>
            </div>
          </div>
        ) : !user ? (
          <div className="auth-required">
            <div className="auth-message">
              <h2>Authentication Required</h2>
              <p>Please log in to use the code review feature.</p>
              <button className="login-required-btn" onClick={handleBackToLanding}>
                Go Back to Login
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="left">
              <div className="section-header">
                <h3>📝 Your Code</h3>
              </div>
              <div className="code-container">
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <textarea
                    value={code}
                    onChange={(e) => {
                      console.log('Textarea onChange triggered:', e.target.value);
                      setCode(e.target.value);
                    }}
                    onInput={(e) => {
                      console.log('Textarea onInput triggered:', e.target.value);
                    }}
                    onKeyDown={(e) => {
                      console.log('Key pressed:', e.key);
                    }}
                    onFocus={() => console.log('Textarea focused')}
                    onBlur={() => console.log('Textarea blurred')}
                    placeholder="Write your code here..."
                    className="code-editor"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    tabIndex={0}
                  />
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
                <h3>🤖 AI Review</h3>
              </div>
              <div className="review-container">
                {loading ? (
                  <div className="loading-state">
                    <div className="spinner"></div>
                    <h4>AI is analyzing your code...</h4>
                    <p>Please wait while we generate insights and suggestions</p>
                  </div>
                ) : review ? (
                  <div className="review-content">
                    <Markdown rehypePlugins={[rehypeHighlight]}>
                      {review}
                    </Markdown>
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">🎯</div>
                    <h4>Ready for Review</h4>
                    <p>Click &quot;Review Code&quot; to get AI-powered suggestions and improvements for your code.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}



export default App
