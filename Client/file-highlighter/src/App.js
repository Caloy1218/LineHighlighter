import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [highlightedLines, setHighlightedLines] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target.result;
      processFileContent(content);
    };

    reader.readAsText(file);
  };

  const processFileContent = (content) => {
    const linesArray = content.split('\n');

    const highlighted = linesArray.map((line, index) => {
      if (line.length > 421) {
        return { lineNumber: index + 1, line, type: 'excess' };
      } else if (line.length < 421) {
        return { lineNumber: index + 1, line, type: 'lacking' };
      } else {
        return null; // Ignore normal lines
      }
    }).filter(line => line !== null);

    setHighlightedLines(highlighted);
  };

  return (
    <div className="App">
      <h1>File Highlighter</h1>
      <input type="file" accept=".txt" onChange={handleFileChange} />
      <div className="file-content">
        {highlightedLines.map(({ lineNumber, line, type }) => (
          <div
            key={lineNumber}
            className={`line ${type}`}
          >
            {lineNumber}: {line}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
