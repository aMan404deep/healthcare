import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

const ChatComponent = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'doctor', content: 'Hello! How are you feeling today?', time: '10:30 AM' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (newMessage.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');
    
    // Simulate doctor response after a short delay
    setTimeout(() => {
      const doctorResponse = {
        id: messages.length + 2,
        sender: 'doctor',
        content: "Thanks for your message. I'll review your information and get back to you soon.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prevMessages => [...prevMessages, doctorResponse]);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-100 flex flex-col h-64">
      <div className="flex items-center justify-between p-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-medium">Dr. Johnson</span>
        </div>
        <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded-full">Online</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[75%] p-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-br from-cyan-500 to-teal-500 text-white' 
                  : 'bg-slate-100 text-slate-800'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <span className={`text-xs ${message.sender === 'user' ? 'text-cyan-50' : 'text-slate-500'} mt-1 block text-right`}>
                {message.time}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex items-center gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        />
        <button 
          type="submit"
          className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatComponent;