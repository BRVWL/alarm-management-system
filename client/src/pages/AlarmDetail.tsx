import React from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  Grid, 
  CircularProgress, 
  Alert, 
  Button,
  Divider,
  Chip
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAlarmDetail } from '../hooks/useAlarmDetail';
import VisualizationGallery from '../components/visualizations/VisualizationGallery';
import VisualizationUploader from '../components/visualizations/VisualizationUploader';

const AlarmDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { alarm, loading, error, refetch } = useAlarmDetail(id || '');

  const handleBack = () => {
    navigate('/alarms');
  };

  const handleUploadSuccess = () => {
    refetch();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box my={4}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading alarm details: {error.message}
        </Alert>
        <Button variant="outlined" onClick={handleBack}>
          Back to Alarms
        </Button>
      </Box>
    );
  }

  if (!alarm) {
    return (
      <Box my={4}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Alarm not found
        </Alert>
        <Button variant="outlined" onClick={handleBack}>
          Back to Alarms
        </Button>
      </Box>
    );
  }

  return (
    <div>
      <Box display="flex" alignItems="center" mb={3}>
        <Button variant="outlined" onClick={handleBack} sx={{ mr: 2 }}>
          Back to Alarms
        </Button>
        <Typography variant="h4" component="h1">
          Alarm Details
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Alarm ID
            </Typography>
            <Typography variant="body1" gutterBottom>
              {alarm.id}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Timestamp
            </Typography>
            <Typography variant="body1" gutterBottom>
              {new Date(alarm.timestamp).toLocaleString()}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Type
            </Typography>
            <Chip 
              label={alarm.type.charAt(0).toUpperCase() + alarm.type.slice(1)} 
              color="primary" 
              size="small" 
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Sensor
            </Typography>
            <Typography variant="body1" gutterBottom>
              {alarm.sensor.name} ({alarm.sensor.location})
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Visualizations
      </Typography>
      
      <Box mb={4}>
        <VisualizationGallery visualizations={alarm.visualizations || []} />
      </Box>
      
      <Divider sx={{ my: 4 }} />
      
      <VisualizationUploader 
        alarmId={alarm.id} 
        onUploadSuccess={handleUploadSuccess} 
      />
    </div>
  );
};

export default AlarmDetail; 