import React from 'react';
import '../styles.css';
import Chatbot from './components/Chatbot';
import Header from './components/header';

function App() {
  return (
    <div className="App">
      <Header />
      <Chatbot />
    </div>
  );
}

export default App;