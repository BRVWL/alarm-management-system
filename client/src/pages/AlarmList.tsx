import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid, 
  Pagination, 
  CircularProgress, 
  Alert, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  SelectChangeEvent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAlarms } from '../hooks/useAlarms';
import { useSensors } from '../hooks/useSensors';
import { AlarmsControllerGetAlarmsTypeEnum } from '../api';
import CreateAlarmForm from '../components/alarms/CreateAlarmForm';
import { Plus } from 'lucide-react';

const AlarmList: React.FC = () => {
  const navigate = useNavigate();
  const { 
    alarms, 
    totalAlarms, 
    loading, 
    error, 
    page, 
    setPage, 
    limit, 
    setLimit, 
    sensorId, 
    setSensorId, 
    type, 
    setType,
    refetch 
  } = useAlarms();
  
  const { sensors, loading: sensorsLoading } = useSensors();
  const [createAlarmDialogOpen, setCreateAlarmDialogOpen] = useState(false);
  
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  
  const handleLimitChange = (event: SelectChangeEvent<number>) => {
    setLimit(event.target.value as number);
    setPage(1); // Reset to first page when changing limit
  };
  
  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setType(value ? value as AlarmsControllerGetAlarmsTypeEnum : undefined);
    setPage(1);
  };
  
  const handleSensorChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSensorId(value || undefined);
    setPage(1);
  };
  
  const handleViewAlarm = (alarmId: string) => {
    navigate(`/alarms/${alarmId}`);
  };

  const handleOpenCreateDialog = () => {
    setCreateAlarmDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateAlarmDialogOpen(false);
  };

  const handleAlarmCreated = () => {
    refetch();
  };
  
  const totalPages = Math.max(1, Math.ceil(totalAlarms / limit));
  
  // Reset to page 1 if current page is higher than total pages
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [totalPages, page, setPage]);
  
  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Alarms
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Plus size={18} />}
          onClick={handleOpenCreateDialog}
        >
          Create Alarm
        </Button>
      </Box>
      
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="type-select-label">Alarm Type</InputLabel>
              <Select
                labelId="type-select-label"
                id="type-select"
                value={type || ''}
                label="Alarm Type"
                onChange={handleTypeChange}
              >
                <MenuItem value="">All Types</MenuItem>
                {Object.values(AlarmsControllerGetAlarmsTypeEnum).map((alarmType) => (
                  <MenuItem key={alarmType} value={alarmType}>
                    {alarmType.charAt(0).toUpperCase() + alarmType.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="sensor-select-label">Sensor</InputLabel>
              <Select
                labelId="sensor-select-label"
                id="sensor-select"
                value={sensorId || ''}
                label="Sensor"
                onChange={handleSensorChange}
                disabled={sensorsLoading}
              >
                <MenuItem value="">All Sensors</MenuItem>
                {sensors.map((sensor) => (
                  <MenuItem key={sensor.id} value={sensor.id}>
                    {sensor.name} ({sensor.location})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="limit-select-label">Items Per Page</InputLabel>
              <Select
                labelId="limit-select-label"
                id="limit-select"
                value={limit}
                label="Items Per Page"
                onChange={handleLimitChange}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading alarms: {error.message}
        </Alert>
      ) : alarms.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No alarms found. Try adjusting your filters.
        </Alert>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Sensor</TableCell>
                  <TableCell>Visualizations</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alarms.map((alarm) => (
                  <TableRow key={alarm.id} hover>
                    <TableCell>{alarm.id}</TableCell>
                    <TableCell>{new Date(alarm.timestamp).toLocaleString()}</TableCell>
                    <TableCell>
                      {alarm.type.charAt(0).toUpperCase() + alarm.type.slice(1)}
                    </TableCell>
                    <TableCell>
                      {alarm.sensor.name} ({alarm.sensor.location})
                    </TableCell>
                    <TableCell>{alarm.visualizations?.length || 0}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => handleViewAlarm(alarm.id)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
            <Typography variant="body2" color="text.secondary">
              Showing {alarms.length} of {totalAlarms} alarms
            </Typography>
            
            {totalPages > 0 && (
              <Pagination 
                count={totalPages} 
                page={Math.min(page, totalPages)}
                onChange={handlePageChange} 
                color="primary" 
                showFirstButton
                showLastButton
              />
            )}
          </Box>
        </>
      )}

      <CreateAlarmForm 
        open={createAlarmDialogOpen}
        onClose={handleCloseCreateDialog}
        onSuccess={handleAlarmCreated}
      />
    </div>
  );
};

export default AlarmList; 