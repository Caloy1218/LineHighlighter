import React, { useState } from 'react';
import { Container, Typography, Button, Box, Input } from '@mui/material';
import './App.css';

const App = () => {
  const [deletedCounts, setDeletedCounts] = useState({ excess: 0, lacking: 0 });
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    setFileName(file.name);

    reader.onload = (event) => {
      const content = event.target.result;
      processFileContent(content);
    };

    reader.readAsText(file);
  };

  const processFileContent = (content) => {
    const linesArray = content.split('\n');
    let excessCount = 0;
    let lackingCount = 0;

    const filteredLines = linesArray.filter((line) => {
      if (line.length > 421) {
        excessCount++;
        return false;
      } else if (line.length < 421) {
        lackingCount++;
        return false;
      }
      return true;
    });

    setDeletedCounts({ excess: excessCount, lacking: lackingCount });

    const newContent = filteredLines.join('\n');
    createNewFile(newContent);
  };

  const createNewFile = (content) => {
    const newFileName = fileName.slice(0, -6) + '000000' + fileName.slice(-4);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = newFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="sm" className="App">
      <Typography variant="h4" component="h1" gutterBottom>
        File Highlighter
      </Typography>
      <Box mt={2}>
        <Input type="file" accept=".txt" onChange={handleFileChange} />
      </Box>
      <Box mt={4}>
        <Typography variant="h6">Deleted Line Counts:</Typography>
        <Typography variant="body1">Excess Lines: {deletedCounts.excess}</Typography>
        <Typography variant="body1">Lacking Lines: {deletedCounts.lacking}</Typography>
      </Box>
    </Container>
  );
};

export default App;
