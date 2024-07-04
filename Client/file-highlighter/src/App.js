import React, { useState } from 'react';
import { Container, Typography, Box, Input, LinearProgress, Button } from '@mui/material';
import { SaveAlt as SaveAltIcon } from '@mui/icons-material';
import './App.css';

const App = () => {
  const [deletedCounts, setDeletedCounts] = useState({ excess: 0, lacking: 0 });
  const [deletedLines, setDeletedLines] = useState({ excess: [], lacking: [] });
  const [fileName, setFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadEnabled, setDownloadEnabled] = useState(false); // State to manage download button enabled/disabled
  const [processedContent, setProcessedContent] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    setFileName(file.name);
    setUploadProgress(0); // Reset progress when a new file is selected
    setDownloadEnabled(false); // Disable download button until upload completes

    reader.onloadstart = () => {
      setUploadProgress(10); // Initial progress
    };

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      }
    };

    reader.onloadend = (event) => {
      setUploadProgress(100); // Complete progress
      setDownloadEnabled(true); // Enable download button when upload completes
      const content = event.target.result;
      processFileContent(content);
    };

    reader.readAsText(file);
  };

  const processFileContent = (content) => {
    const linesArray = content.split('\n');
    let excessCount = 0;
    let lackingCount = 0;
    const excessLines = [];
    const lackingLines = [];

    const filteredLines = linesArray.filter((line, index) => {
      if (line.length > 421) {
        excessCount++;
        excessLines.push({ line: index + 1, content: line });
        return false;
      } else if (line.length < 421) {
        lackingCount++;
        lackingLines.push({ line: index + 1, content: line });
        return false;
      }
      return true;
    });

    setDeletedCounts({ excess: excessCount, lacking: lackingCount });
    setDeletedLines({ excess: excessLines, lacking: lackingLines });

    const newContent = filteredLines.join('\n');
    setProcessedContent(newContent); // Store processed content
  };

  const createNewFile = () => {
    const parts = fileName.split('.');
    if (parts.length >= 4) {
      const newFileName = `${parts[0]}.${parts[1]}.${parts[2]}.000000`;
      const blob = new Blob([processedContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = newFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Container maxWidth="sm" className="App">
      <Typography variant="h4" component="h1" gutterBottom>
        File Highlighter
      </Typography>
      <Box mt={2}>
        <Input type="file" accept=".txt" onChange={handleFileChange} />
      </Box>
      {uploadProgress > 0 && (
        <Box mt={2}>
          <Typography variant="body2" color="textSecondary">Upload Progress: {uploadProgress}%</Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}
      <Box mt={4}>
        <Typography variant="h6">Deleted Line Counts:</Typography>
        <Typography variant="body1">Excess Lines: {deletedCounts.excess}</Typography>
        <Typography variant="body1">Lacking Lines: {deletedCounts.lacking}</Typography>
      </Box>
      <Box mt={4}>
        <Typography variant="h6">Deleted Excess Lines:</Typography>
        {deletedLines.excess.map((line, index) => (
          <Typography key={index} variant="body2">
            Line {line.line}: {line.content}
          </Typography>
        ))}
      </Box>
      <Box mt={4}>
        <Typography variant="h6">Deleted Lacking Lines:</Typography>
        {deletedLines.lacking.map((line, index) => (
          <Typography key={index} variant="body2">
            Line {line.line}: {line.content}
          </Typography>
        ))}
      </Box>
      {downloadEnabled && (
        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveAltIcon />}
            onClick={createNewFile} // Call createNewFile directly
          >
            Download File
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default App;
