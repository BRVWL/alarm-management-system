import React from 'react';
import { Typography, Paper, Grid, Box, CircularProgress } from '@mui/material';
import { useDashboardStats } from '../hooks/useDashboardStats';

const Dashboard: React.FC = () => {
  const { stats, loading, error } = useDashboardStats();
  
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              borderRadius: 2,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Alarms
            </Typography>
            <Typography component="p" variant="h4">
              {loading ? <CircularProgress size={24} /> : stats.alarmsCount}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              Total alarms in the system
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              borderRadius: 2,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Sensors
            </Typography>
            <Typography component="p" variant="h4">
              {loading ? <CircularProgress size={24} /> : stats.sensorsCount}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              Active sensors
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              borderRadius: 2,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Visualizations
            </Typography>
            <Typography component="p" variant="h4">
              {loading ? <CircularProgress size={24} /> : stats.visualizationsCount}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              Total visualizations
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper 
            elevation={2}
            sx={{ 
              p: 3, 
              mt: 3,
              borderRadius: 2,
            }}
          >
            <Box sx={{ my: 2 }}>
              <Typography variant="h6" gutterBottom>
                Welcome to Cogvis Alarm Management System
              </Typography>
              <Typography variant="body1">
                This dashboard will show statistics and recent activity once data is available.
                Use the sidebar to navigate to different sections of the application.
              </Typography>
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  Error loading dashboard data: {error.message}
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard; 