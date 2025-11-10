import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import Dashboard from './components/Dashboard';
import axios from 'axios'; 
import './App.css';

const API_URL = 'http://localhost:5000/api'; 

function App() {
  const [currentTopic, setCurrentTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [message, setMessage] = useState(''); 

  // This function now handles BOTH analyzing and setting the topic
  const handleSearch = async (topic) => {
    if (!topic) return;

    setIsLoading(true);
    setMessage('Analyzing... this may take a moment.');

    try {
      // 1. Call the backend to analyze and store data
      await axios.post(`${API_URL}/analyze`, { searchTerm: topic });
      setMessage('Analysis complete!');
      
      // 2. Tell the App to refresh the dashboard with the new topic
      setCurrentTopic(topic);
    } catch (err) {
      console.error(err);
      setMessage('Error analyzing topic. See console.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(''), 3000); // Clear message
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>NewsMood</h1>
      </header>
      <main>
        {/* Pass loading state and message down to SearchBar */}
        <SearchBar 
          onSearch={handleSearch} 
          isLoading={isLoading} 
          message={message} 
        />
        
        {/* When a new topic is searched, the 'key' changes, forcing the Dashboard to re-fetch data */}
        {currentTopic && (
          <Dashboard 
            key={currentTopic} 
            topic={currentTopic} 
            onSearch={handleSearch} 
          />
        )}
      </main>
    </div>
  );
}

export default App;