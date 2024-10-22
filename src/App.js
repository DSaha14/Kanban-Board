// App.js
import React from 'react';
import './App.css';
import KanbanBoard from './components/KanbanBoard'; // Assuming KanbanBoard.js is in the 'components' folder

const App = () => {
  return (
    <div className="App">
      <KanbanBoard />
    </div>
  );
};

export default App;
