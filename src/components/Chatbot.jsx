import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      handleBotResponse("Hello! Can you tell me more about your project?");
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(prevState => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const userMessage = { text: inputMessage, sender: 'user', timestamp: new Date().toISOString() };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInputMessage('');
      setIsTyping(true);

      try {
        // Replace this with your actual API call
        const response = await axios.post('YOUR_API_ENDPOINT', { message: inputMessage });
        handleBotResponse(response.data.message);
      } catch (error) {
        console.error('Error sending message:', error);
        handleBotResponse("Sorry, I encountered an error. Please try again.");
      }
    }
  };

  const handleBotResponse = (text) => {
    setIsTyping(false);
    const botMessage = { text, sender: 'bot', timestamp: new Date().toISOString() };
    setMessages(prevMessages => [...prevMessages, botMessage]);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message, index) => (
    <div key={index} className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
      <p>{message.text}</p>
      <span className="message-timestamp">{formatTimestamp(message.timestamp)}</span>
    </div>
  );

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      <button
        onClick={toggleChat}
        className="chat-toggle-btn"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <i className={`fas ${isOpen ? "fa-times" : "fa-comments"}`}></i>
      </button>
      {isOpen && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <span>Azam from OrbiFusion</span>
          </div>
          <div className="chatbot-messages">
            {messages.map(renderMessage)}
            {isTyping && (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                ref={inputRef}
              />
              <button type="submit" aria-label="Send message">
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;