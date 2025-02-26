import React, { useState, ChangeEvent } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  CircularProgress, 
  Alert, 
  Paper,
  LinearProgress
} from '@mui/material';
import { VisualizationsApi } from '../../api';
import { createApiConfig } from '../../utils/api';

interface VisualizationUploaderProps {
  alarmId: string;
  onUploadSuccess: () => void;
}

const VisualizationUploader: React.FC<VisualizationUploaderProps> = ({ alarmId, onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      
      // Check if file is a JPEG or PNG
      if (selectedFile.type !== 'image/jpeg' && selectedFile.type !== 'image/png') {
        setError('Only JPEG and PNG images are allowed');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !alarmId) return;

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const config = createApiConfig();
      const visualizationsApi = new VisualizationsApi(config);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      await visualizationsApi.visualizationsControllerUploadFile(alarmId, file);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Reset form
      setFile(null);
      
      // Notify parent component
      onUploadSuccess();
    } catch (err) {
      console.error('Error uploading visualization:', err);
      setError('Failed to upload visualization. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Upload Visualization
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 2 }}>
        <input
          accept="image/jpeg,image/png"
          style={{ display: 'none' }}
          id="visualization-file-input"
          type="file"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <label htmlFor="visualization-file-input">
          <Button
            variant="outlined"
            component="span"
            disabled={uploading}
            fullWidth
          >
            Select Image (JPEG or PNG)
          </Button>
        </label>
      </Box>
      
      {file && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </Typography>
        </Box>
      )}
      
      {uploading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}
      
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!file || uploading}
        fullWidth
      >
        {uploading ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CircularProgress size={24} sx={{ mr: 1 }} />
            Uploading...
          </Box>
        ) : (
          'Upload Visualization'
        )}
      </Button>
    </Paper>
  );
};

export default VisualizationUploader; 