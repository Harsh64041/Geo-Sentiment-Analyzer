import React, { useState } from 'react';

// This component receives all its logic from App.js
function SearchBar({ onSearch, isLoading, message }) { 
  const [term, setTerm] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!term) return;
    onSearch(term); // Just call the onSearch function from App.js
    setTerm(''); // Clear the input after searching
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Enter a topic (e.g., Tesla)"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Analyze & View'}
        </button>
      </form>
      {/* The message (like "Analyzing...") is passed down from App.js */}
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default SearchBar;