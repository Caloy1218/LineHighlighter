import React, { useState } from 'react';
import { Container, Typography, Box, Input, LinearProgress, Button, Paper, Divider } from '@mui/material';
import { SaveAlt as SaveAltIcon } from '@mui/icons-material';
import './App.css';

const App = () => {
  const [deletedCounts, setDeletedCounts] = useState({ excess: 0, lacking: 0 });
  const [deletedLines, setDeletedLines] = useState({ excess: [], lacking: [] });
  const [fileName, setFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadEnabled, setDownloadEnabled] = useState(false);
  const [processedContent, setProcessedContent] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    setFileName(file.name);
    setUploadProgress(0);
    setDownloadEnabled(false);

    reader.onloadstart = () => {
      setUploadProgress(10);
    };

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      }
    };

    reader.onloadend = (event) => {
      setUploadProgress(100);
      setDownloadEnabled(true);
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
    setProcessedContent(newContent);
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
    <Container maxWidth="lg" className="App">
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
      <Box mt={4} display="flex" justifyContent="space-between">
        <Box width="48%">
          <Typography variant="h6">Deleted Line Counts:</Typography>
          <Typography variant="body1">Excess Lines: {deletedCounts.excess}</Typography>
          <Typography variant="body1">Lacking Lines: {deletedCounts.lacking}</Typography>
        </Box>
        {downloadEnabled && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveAltIcon />}
            onClick={createNewFile}
          >
            Download File
          </Button>
        )}
      </Box>
      <Box mt={4} display="flex" flexDirection="column" alignItems="center">
        <Paper className="paper" style={{ width: '90%' }}>
          <Typography variant="h6" gutterBottom>Deleted Excess Lines:</Typography>
          <Divider />
          {deletedLines.excess.map((line, index) => (
            <Typography key={index} variant="body2" className="line">
              <b>Line {line.line}:</b> {line.content}
            </Typography>
          ))}
        </Paper>
        <Paper className="paper" style={{ width: '90%', marginTop: '20px' }}>
          <Typography variant="h6" gutterBottom>Deleted Lacking Lines:</Typography>
          <Divider />
          {deletedLines.lacking.map((line, index) => (
            <Typography key={index} variant="body2" className="line">
              <b>Line {line.line}:</b> {line.content}
            </Typography>
          ))}
        </Paper>
      </Box>
    </Container>
  );
};

export default App;
