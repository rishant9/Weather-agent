import React, { useEffect, useRef, useState } from 'react'
import ChatMessage from './components/ChatMessage.jsx'
import { useWeatherAgent } from './hooks/useWeatherAgent.js'

export default function App(){
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('What\'s the weather in London?')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [threadId] = useState('7')
  const { streamWeather } = useWeatherAgent()
  const endRef = useRef(null)
  const [dark, setDark] = useState(true)

  useEffect(()=>{
    endRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [messages, loading])

  useEffect(()=>{
    document.body.dataset.theme = dark ? 'dark' : 'light'
  }, [dark])

  async function handleSend(){
    const content = input.trim()
    if (!content) return
    setError('')
    setInput('')
    const userMsg = { id: crypto.randomUUID(), role:'user', content, time: Date.now() }
    setMessages(prev => [...prev, userMsg])

    const assistantId = crypto.randomUUID()
    setMessages(prev => [...prev, { id: assistantId, role:'assistant', content:'', time: Date.now() }])
    setLoading(true)

    try{
      for await (const chunk of streamWeather({ content, threadId })){
        setMessages(prev => prev.map(m => m.id === assistantId ? {...m, content: (m.content || '') + chunk } : m))
      }
    }catch(err){
      console.error(err)
      setError(err.message || 'Something went wrong.')
      setMessages(prev => prev.map(m => m.id === assistantId ? {...m, content: 'Sorry, I could not fetch the weather right now.'} : m))
    }finally{
      setLoading(false)
    }
  }

  function handleKeyDown(e){
    if (e.key === 'Enter' && !e.shiftKey){
      e.preventDefault()
      if(!loading) handleSend()
    }
  }

  function handleClear(){
    setMessages([])
    setError('')
  }

  return (
    <div className="container">
      <div className="header">
        <div className="brand">
          <div className="logo">WX</div>
          <div>
            <div className="h1">Weather Agent Chat</div>
            <div className="hint">Ask about current weather, rain chances, or forecasts.</div>
          </div>
        </div>
        <div className="toolbar">
          <button className="button ghost" onClick={()=>setDark(!dark)}>
            {dark ? '☀ Light' : '🌙 Dark'}
          </button>
          <button className="button ghost" onClick={handleClear} disabled={loading}>Clear Chat</button>
         
        </div>
      </div>

      {error && <div className="error card">{error}</div>}

      <div className="" role="log" aria-live="polite">
        {messages.length === 0 && (
          <div className="hint">Try: “Will it rain tomorrow in Mumbai?”</div>
        )}
        {messages.map(m => (
          <ChatMessage key={m.id} role={m.role === 'assistant' ? 'agent' : m.role} text={m.content} time={m.time} />
        ))}
        <div ref={endRef} />
      </div>

      
        <div className="inputRow">
  <div className="inputWrap">
    <textarea
      className="input"
      rows={1}
      placeholder="Type your message…"
      value={input}
      onChange={(e)=>setInput(e.target.value)}
      onKeyDown={handleKeyDown}
      disabled={loading}
      aria-label="Message input"
    />
    <button
      className="button send"
      onClick={handleSend}
      disabled={loading || !input.trim()}
      aria-label="Send"
    >⮕</button>
  </div>
</div>
      </div>
  )
}
