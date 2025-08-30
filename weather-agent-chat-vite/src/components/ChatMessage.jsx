import React from 'react'

export default function ChatMessage({ role, text, time }){
  const right = role === 'user'
  return (
    <div className={['msg', right ? 'right' : 'left'].join(' ')}>
      <div className="avatar">{right ? 'U' : 'W'}</div>
      <div style={{maxWidth:'100%'}}>
        <div className={['bubble', right? 'user':'agent'].join(' ')}>{text}</div>
        <div className="meta">
          <span className="timestamp">{new Date(time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
          {' '}·{' '}
          <span>{right ? 'You' : 'Weather Agent'}</span>
        </div>
      </div>
    </div>
  )
}
