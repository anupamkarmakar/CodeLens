import PropTypes from 'prop-types'
import './LandingPage.css'

function SimpleLandingPage({ onGetStarted }) {
  const handleGetStartedClick = () => {
    // No authentication required in simple version
    onGetStarted()
  }

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">🔍</span>
            <span className="logo-text">CodeLens</span>
            <span className="version-tag">Simple</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it Works</a>
            <button className="nav-cta" onClick={handleGetStartedClick}>
              Try Now
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              AI-Powered Code Reviews
              <span className="hero-highlight"> Made Simple</span>
            </h1>
            <p className="hero-subtitle">
              Get instant, intelligent feedback on your code. No signup required - 
              just paste your code and get AI-powered suggestions immediately.
            </p>
            <div className="hero-cta">
              <button className="cta-primary" onClick={handleGetStartedClick}>
                Start Reviewing Code
              </button>
              <button className="cta-secondary">
                Watch Demo
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">Free</span>
                <span className="stat-label">No Signup</span>
              </div>
              <div className="stat">
                <span className="stat-number">Instant</span>
                <span className="stat-label">AI Analysis</span>
              </div>
              <div className="stat">
                <span className="stat-number">Simple</span>
                <span className="stat-label">Easy to Use</span>
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
            <h2>Simple, Fast, Effective</h2>
            <p>Everything you need for quick code analysis</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Analysis</h3>
              <p>Get immediate feedback on your code quality and potential improvements in seconds.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Smart Suggestions</h3>
              <p>AI-powered recommendations that understand your code and provide actionable advice.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔧</div>
              <h3>Multiple Languages</h3>
              <p>Support for JavaScript, Python, Java, and many other programming languages.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>No Setup Required</h3>
              <p>Start analyzing your code immediately - no account creation or installation needed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <div className="how-container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Simple code analysis in three easy steps</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Paste Your Code</h3>
                <p>Simply paste or type your code into our intelligent editor.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Click Review</h3>
                <p>Hit the review button and let our AI analyze your code instantly.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Get Insights</h3>
                <p>Receive detailed feedback with specific suggestions for improvement.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Improve Your Code?</h2>
          <p>No signup required - start analyzing your code right now</p>
          <div className="hero-cta">
            <button className="cta-primary" onClick={handleGetStartedClick}>
              Start Code Review
            </button>
          </div>
          <p className="cta-note">Free to use • No account required • Instant results</p>
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
                <span className="version-tag">Simple</span>
              </div>
              <p>Simple AI-powered code reviews for everyone.</p>
            </div>
            <div className="footer-section">
              <h4>Features</h4>
              <ul>
                <li><a href="#features">Instant Analysis</a></li>
                <li><a href="#features">Smart Suggestions</a></li>
                <li><a href="#features">Multiple Languages</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>How It Works</h4>
              <ul>
                <li><a href="#how-it-works">Paste Code</a></li>
                <li><a href="#how-it-works">Get Review</a></li>
                <li><a href="#how-it-works">Improve Code</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>About</h4>
              <ul>
                <li><a href="#about">About CodeLens</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#privacy">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 CodeLens Simple. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

SimpleLandingPage.propTypes = {
  onGetStarted: PropTypes.func.isRequired
}

export default SimpleLandingPage