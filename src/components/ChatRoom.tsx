import { useState } from 'react'
import { useClassroom } from '../context/ClassroomContext'
import { Send, MessageCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const ChatRoom = () => {
  const [message, setMessage] = useState('')
  const { messages, addMessage } = useClassroom()
  const { user } = useAuth()

  const sendMessage = () => {
    if (message.trim() && user?.nickname) {
      addMessage({ author: user.nickname, content: message })
      setMessage('')
    }
  }

  if (!user) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100">
        <div className="text-center text-muted">Please log in to join the chat.</div>
      </div>
    )
  }

  return (
    <div className="d-flex flex-column" style={{height: '500px'}}>
      <div className="flex-grow-1 overflow-auto mb-3" style={{maxHeight: '400px'}}>
        {messages.length === 0 ? (
          <div className="text-center text-muted py-4">
            <MessageCircle size={40} className="mb-2" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg._id || msg.id} className="chat-message mb-3">
              <div className="d-flex align-items-start">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px', fontSize: '14px'}}>
                  {msg.author.charAt(0).toUpperCase()}
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <small className="fw-medium">{msg.author}</small>
                    <small className="text-muted">{msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ''}</small>
                  </div>
                  <div className="bg-light rounded-3 p-3">
                    {msg.content}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="d-flex gap-2">
        <input 
          className="form-control rounded-pill"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button 
          className="btn btn-primary rounded-circle"
          onClick={sendMessage}
          disabled={!message.trim()}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}

export default ChatRoom
 