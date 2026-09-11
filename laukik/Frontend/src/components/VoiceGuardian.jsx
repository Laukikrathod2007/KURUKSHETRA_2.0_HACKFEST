import { useState, useEffect } from 'react'
import { Mic, MicOff, Phone, Volume2, X, MessageCircle } from 'lucide-react'

export default function VoiceGuardian({ onClose }) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      text: "Hello! I'm your Voice Guardian assistant. I can help guide you through this payment decision. What would you like to know?"
    }
  ])

  const startListening = () => {
    setIsListening(true)
    // Simulate voice recognition
    setTimeout(() => {
      setTranscript("Is this payment safe?")
      setIsListening(false)
      handleUserQuery("Is this payment safe?")
    }, 2000)
  }

  const stopListening = () => {
    setIsListening(false)
  }

  const handleUserQuery = (query) => {
    setMessages(prev => [...prev, { type: 'user', text: query }])
    
    // Simulate assistant response
    setTimeout(() => {
      setIsSpeaking(true)
      const response = getAssistantResponse(query)
      setMessages(prev => [...prev, { type: 'assistant', text: response }])
      
      // Simulate speech duration
      setTimeout(() => {
        setIsSpeaking(false)
      }, 3000)
    }, 1000)
  }

  const getAssistantResponse = (query) => {
    const lowerQuery = query.toLowerCase()
    
    if (lowerQuery.includes('safe') || lowerQuery.includes('trust')) {
      return "Based on our analysis, this transaction has been flagged with a high risk score. Several warning signs suggest this could be a scam. I recommend not proceeding with this payment."
    }
    
    if (lowerQuery.includes('why') || lowerQuery.includes('reason')) {
      return "The system detected unusual patterns: this is a first-time recipient, the amount is much larger than your usual payments, and the payment note contains urgency language commonly used in scams."
    }
    
    if (lowerQuery.includes('what') || lowerQuery.includes('do')) {
      return "I recommend verifying this payment through a different channel. Call the recipient directly using a phone number you already have - not one they provided. If they're pressuring you to pay immediately, that's a major red flag."
    }
    
    return "I'm here to help you make a safe decision. The AI system has analyzed multiple risk factors. Would you like me to explain any specific concern?"
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full h-[600px] flex flex-col shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-gradient-to-r from-primary-500/10 to-purple-500/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-500/20 rounded-lg">
              <Phone className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Voice Guardian</h2>
              <p className="text-sm text-slate-400">AI-Powered Voice Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-800 text-slate-200 border border-slate-700'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.type === 'assistant' && (
                    <MessageCircle className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            </div>
          ))}
          
          {isSpeaking && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl flex items-center space-x-3">
                <Volume2 className="w-5 h-5 text-primary-400 animate-pulse" />
                <span className="text-sm text-slate-400">Speaking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Voice Input Controls */}
        <div className="p-6 border-t border-slate-700 bg-slate-900/50">
          <div className="flex items-center space-x-4">
            {/* Voice Button */}
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isSpeaking}
              className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-danger-500 hover:bg-danger-600 animate-pulse'
                  : 'bg-primary-600 hover:bg-primary-700'
              } ${isSpeaking ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isListening ? (
                <MicOff className="w-7 h-7 text-white" />
              ) : (
                <Mic className="w-7 h-7 text-white" />
              )}
            </button>

            {/* Status Text */}
            <div className="flex-1">
              {isListening ? (
                <div className="space-y-1">
                  <p className="text-white font-semibold">Listening...</p>
                  <p className="text-sm text-slate-400">Speak your question</p>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-danger-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-danger-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-danger-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              ) : isSpeaking ? (
                <div className="space-y-1">
                  <p className="text-white font-semibold">Voice Guardian Speaking</p>
                  <p className="text-sm text-slate-400">Please listen...</p>
                </div>
              ) : transcript ? (
                <div className="space-y-1">
                  <p className="text-white font-semibold">You said:</p>
                  <p className="text-sm text-slate-400 italic">"{transcript}"</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-white font-semibold">Tap to speak</p>
                  <p className="text-sm text-slate-400">Ask me about this payment</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => handleUserQuery("Is this payment safe?")}
              className="btn btn-outline text-sm py-2"
            >
              Is this safe?
            </button>
            <button
              onClick={() => handleUserQuery("Why is this risky?")}
              className="btn btn-outline text-sm py-2"
            >
              Why risky?
            </button>
          </div>

          {/* Info Banner */}
          <div className="mt-4 p-3 bg-primary-500/10 border border-primary-500/30 rounded-lg">
            <p className="text-xs text-slate-300 text-center">
              🔒 Voice Guardian has full context about your payment and security analysis
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
