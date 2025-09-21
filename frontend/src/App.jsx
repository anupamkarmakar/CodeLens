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
    
    // Ensure the user object has all required fields
    if (!parsedUser._id || !parsedUser.name || !parsedUser.email) {
      console.error('Invalid user data in storage:', parsedUser)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return null
    }
    
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
    
    // Force immediate sync to handle page transitions
    const handleImmediateSync = () => {
      const latestUser = getUserFromStorage()
      if (latestUser && (!currentUser || latestUser._id !== currentUser._id)) {
        setUser(latestUser)
        if (latestUser.lastCode && latestUser.lastCode.trim()) {
          setCode(latestUser.lastCode)
        }
      }
    }
    
    // Run immediate sync after a short delay to catch any race conditions
    const timeoutId = setTimeout(handleImmediateSync, 100)
    
    return () => clearTimeout(timeoutId)
  }, [])


  useEffect(() => {
    const handleStorageChange = () => {
      const currentUser = getUserFromStorage()
      
      if (currentUser && (!user || currentUser._id !== user._id)) {
        setUser(currentUser)
        if (currentUser.lastCode && currentUser.lastCode.trim()) {
          setCode(currentUser.lastCode)
        } else {
          setCode(` function sum() { return 1 + 1 }`)
        }
        setReview('')
        setError('')
      } else if (!currentUser && user) {
        setUser(null)
        setCode(` function sum() { return 1 + 1 }`)
        setReview('')
        setError('')
      }
    }
    
    // Listen for localStorage changes from other tabs/windows
    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for custom events for same-tab updates
    window.addEventListener('userAuthenticated', handleStorageChange)
    window.addEventListener('userLoggedOut', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userAuthenticated', handleStorageChange)
      window.removeEventListener('userLoggedOut', handleStorageChange)
    }
  }, [user])

  useEffect(() => {
    if (user && user.lastCode && user.lastCode.trim() && user.lastCode !== code) {
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
    
    // Trigger custom event for same-tab synchronization
    window.dispatchEvent(new CustomEvent('userLoggedOut'))
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
                    onChange={(e) => setCode(e.target.value)}
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
