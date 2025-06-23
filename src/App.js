import React, { useState, useEffect } from 'react';
import { encryptData, decryptData } from './utils/encryption';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [category, setCategory] = useState('General'); 
  const [darkMode, setDarkMode] = useState(false); 

  useEffect(() => {
    const savedNotes = localStorage.getItem('encryptedNotes');
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedDarkMode) setDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('encryptedNotes', JSON.stringify(notes));
    localStorage.setItem('darkMode', darkMode);
  }, [notes, darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const addNote = () => {
    if (newNote.trim() === '') return;
    const encryptedNote = encryptData(newNote);
    setNotes([...notes, { 
      id: Date.now(), 
      text: encryptedNote, 
      category 
    }]);
    setNewNote('');
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const filteredNotes = category === 'All' 
    ? notes 
    : notes.filter(note => note.category === category);

  const categories = ['General', 'Work', 'Personal', 'Ideas', 'All'];

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <div className="header">
        <h1>Secure Notes App</h1>
        <button onClick={toggleDarkMode}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <div className="note-form">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write your note..."
        />
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button onClick={addNote}>Add Note</button>
      </div>

      <div className="category-filter">
        <h3>Filter by Category:</h3>
        <div className="category-buttons">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={category === cat ? 'active' : ''}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <ul className="notes-list">
        {filteredNotes.map((note) => (
          <li key={note.id}>
            <span className="note-category">{note.category}</span>
            <p>{decryptData(note.text)}</p>
            <button onClick={() => deleteNote(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;