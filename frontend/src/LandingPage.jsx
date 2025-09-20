import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import AuthModal from './AuthModal'
import UserProfile from './UserProfile'
import './LandingPage.css'

function LandingPage({ onGetStarted }) {
  const [email, setEmail] = useState('')
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' })
  const [user, setUser] = useState(null)
  const [showProfile, setShowProfile] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleEmailSubmit = (e) => {
    e.preventDefault()
    handleGetStartedClick()
  }

  const handleGetStartedClick = () => {
    if (user) {
      onGetStarted()
    } else {
      openAuthModal('login')
    }
  }

  const handleDashboardClick = () => {
    console.log('Dashboard clicked - User:', user)
    if (user) {
      console.log('User authenticated, going to dashboard')
      onGetStarted()
    } else {
      console.log('User not authenticated, showing login modal')
      openAuthModal('login')
    }
  }

  const handleAuthSuccess = (userData) => {
    setUser(userData)
    setAuthModal({ isOpen: false, mode: 'login' })
    if (userData) {
      setTimeout(() => {
        onGetStarted()
      }, 500) 
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const openAuthModal = (mode) => {
    setAuthModal({ isOpen: true, mode })
  }

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: authModal.mode })
  }

  const switchAuthMode = (mode) => {
    setAuthModal({ isOpen: true, mode })
  }

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">🔍</span>
            <span className="logo-text">CodeLens</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it Works</a>
            {user ? (
              <div className="user-menu">
                <span className="user-greeting" onClick={() => setShowProfile(true)}>
                  Hi, {user.name}
                </span>
                <button className="nav-cta" onClick={handleDashboardClick}>
                  Dashboard
                </button>
                <button className="btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <button className="login-btn" onClick={() => openAuthModal('login')}>
                  Login
                </button>
                <button className="nav-cta" onClick={() => openAuthModal('register')}>
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              AI-Powered Code Reviews
              <span className="hero-highlight"> That Actually Help</span>
            </h1>
            <p className="hero-subtitle">
              Get instant, intelligent feedback on your code. CodeLens analyzes your code 
              quality, suggests improvements, and helps you write better software faster.
            </p>
            <div className="hero-cta">
              <button className="cta-primary" onClick={handleGetStartedClick}>
                {user ? 'Go to Dashboard' : 'Start Reviewing Code'}
              </button>
              <button className="cta-secondary">
                Watch Demo
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Code Reviews</span>
              </div>
              <div className="stat">
                <span className="stat-number">99%</span>
                <span className="stat-label">Accuracy</span>
              </div>
              <div className="stat">
                <span className="stat-number">5min</span>
                <span className="stat-label">Average Review Time</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="code-preview">
              <div className="code-window">
                <div className="window-header">
                  <div className="window-controls">
                    <span className="control red"></span>
                    <span className="control yellow"></span>
                    <span className="control green"></span>
                  </div>
                  <span className="window-title">main.js</span>
                </div>
                <div className="code-content">
                  <pre className="code-block">
{`function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`}
                  </pre>
                  <div className="ai-suggestion">
                    <div className="suggestion-header">
                      <span className="ai-icon">🤖</span>
                      <span>AI Suggestion</span>
                    </div>
                    <p>Consider using reduce() for a more functional approach:</p>
                    <pre className="suggestion-code">
{`const total = items.reduce((sum, item) => 
  sum + item.price, 0);`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="features-container">
          <div className="section-header">
            <h2>Why Developers Love CodeLens</h2>
            <p>Powerful features that make code reviews faster, smarter, and more effective</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Analysis</h3>
              <p>Get immediate feedback on your code quality, performance issues, and potential bugs in seconds.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Smart Suggestions</h3>
              <p>AI-powered recommendations that understand context and provide actionable improvements.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔧</div>
              <h3>Multiple Languages</h3>
              <p>Support for JavaScript, Python, Java, C++, and many more programming languages.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Quality Metrics</h3>
              <p>Detailed analysis of code complexity, maintainability, and best practice adherence.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Performance Focus</h3>
              <p>Identify bottlenecks and optimization opportunities to make your code faster.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Security Insights</h3>
              <p>Detect potential security vulnerabilities and get recommendations for safer code.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <div className="how-container">
          <div className="section-header">
            <h2>How CodeLens Works</h2>
            <p>Simple, fast, and powerful code analysis in three easy steps</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Paste Your Code</h3>
                <p>Simply paste or type your code into our intelligent editor with syntax highlighting.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>AI Analysis</h3>
                <p>Our advanced AI models analyze your code for quality, performance, and best practices.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Get Insights</h3>
                <p>Receive detailed feedback with specific suggestions and examples for improvement.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Improve Your Code?</h2>
          <p>Join thousands of developers who use CodeLens to write better code</p>
          <form className="email-signup" onSubmit={handleEmailSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input"
            />
            <button type="submit" className="signup-btn">
              Get Started Free
            </button>
          </form>
          <p className="cta-note">No credit card required • Free forever for personal use</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <span className="logo-icon">🔍</span>
                <span className="logo-text">CodeLens</span>
              </div>
              <p>AI-powered code reviews that help developers write better software.</p>
            </div>
            <div className="footer-section">
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#docs">Documentation</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#blog">Blog</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><a href="#help">Help Center</a></li>
                <li><a href="#status">Status</a></li>
                <li><a href="#privacy">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 CodeLens. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={closeAuthModal}
        onSwitchMode={switchAuthMode}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* User Profile Modal */}
      {showProfile && user && (
        <UserProfile
          user={user}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  )
}

LandingPage.propTypes = {
  onGetStarted: PropTypes.func.isRequired
}

export default LandingPage