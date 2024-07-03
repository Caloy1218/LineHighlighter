import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [fileContent, setFileContent] = useState('');
  const [lines, setLines] = useState([]);
  const [highlightedLines, setHighlightedLines] = useState([]);
  const [showOnlyHighlighted, setShowOnlyHighlighted] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target.result;
      setFileContent(content);
      processFileContent(content);
    };

    reader.readAsText(file);
  };

  const processFileContent = (content) => {
    const linesArray = content.split('\n');
    setLines(linesArray);

    const highlighted = linesArray.map((line, index) => {
      if (line.length > 80) {
        return { lineNumber: index + 1, line, type: 'excess' };
      } else if (line.length < 20) {
        return { lineNumber: index + 1, line, type: 'lacking' };
      } else {
        return { lineNumber: index + 1, line, type: 'normal' };
      }
    });

    setHighlightedLines(highlighted);
  };

  const toggleHighlightedView = () => {
    setShowOnlyHighlighted((prev) => !prev);
  };

  const linesToDisplay = showOnlyHighlighted
    ? highlightedLines.filter((line) => line.type !== 'normal')
    : highlightedLines;

  return (
    <div className="App">
      <h1>File Highlighter</h1>
      <input type="file" accept=".txt" onChange={handleFileChange} />
      <button onClick={toggleHighlightedView}>
        {showOnlyHighlighted ? 'Show All Lines' : 'Show Only Highlighted Lines'}
      </button>
      <div className="file-content">
        {linesToDisplay.map(({ lineNumber, line, type }) => (
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
