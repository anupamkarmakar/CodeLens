import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './UserProfile.css'

function UserProfile({ user, onClose }) {
  const [reviewHistory, setReviewHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:3000/auth/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setReviewHistory(data.reviewHistory || [])
        }
      } catch (error) {
        console.error('Error fetching history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-header">
          <h2>Profile</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="profile-content">
          <div className="user-info">
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          </div>

          <div className="review-history">
            <h3>Review History ({reviewHistory.length})</h3>
            {loading ? (
              <div className="loading">Loading history...</div>
            ) : reviewHistory.length === 0 ? (
              <div className="no-history">
                <p>No reviews yet. Start by reviewing some code!</p>
              </div>
            ) : (
              <div className="history-list">
                {reviewHistory.slice(0, 5).map((review, index) => (
                  <div key={index} className="history-item">
                    <div className="history-date">
                      {formatDate(review.createdAt)}
                    </div>
                    <div className="history-preview">
                      <div className="code-preview">
                        <code>{review.code.substring(0, 100)}...</code>
                      </div>
                    </div>
                  </div>
                ))}
                {reviewHistory.length > 5 && (
                  <div className="more-history">
                    +{reviewHistory.length - 5} more reviews
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

UserProfile.propTypes = {
  user: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default UserProfile