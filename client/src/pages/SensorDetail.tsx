import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  Button, 
  CircularProgress, 
  Alert, 
  Grid, 
  Card, 
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSensorDetail } from '../hooks/useSensorDetail';
import { useSensorAlarms } from '../hooks/useSensorAlarms';
import { useSensorMutation } from '../hooks/useSensorMutation';
import { UpdateSensorDto } from '../api';
import { formatDate } from '../utils/formatters';
import { Plus } from 'lucide-react';
import CreateAlarmForm from '../components/alarms/CreateAlarmForm';

const SensorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { sensor, loading: sensorLoading, error: sensorError, refetch: refetchSensor } = useSensorDetail(id || '');
  const { 
    alarms, 
    loading: alarmsLoading, 
    error: alarmsError, 
    page, 
    setPage, 
    limit, 
    setLimit, 
    totalAlarms,
    refetch: refetchAlarms
  } = useSensorAlarms(id || '');
  
  const { updateSensor, loading: mutationLoading, error: mutationError } = useSensorMutation();
  
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editSensorName, setEditSensorName] = useState('');
  const [editSensorLocation, setEditSensorLocation] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [createAlarmDialogOpen, setCreateAlarmDialogOpen] = useState(false);

  // Calculate the 0-based page index for MUI TablePagination
  const muiPageIndex = page - 1;

  // Reset to page 1 if current page is higher than total pages
  useEffect(() => {
    const totalPages = Math.ceil(totalAlarms / limit);
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [totalAlarms, limit, page, setPage]);

  const handleOpenEditDialog = () => {
    if (sensor) {
      setEditSensorName(sensor.name);
      setEditSensorLocation(sensor.location);
      setFormError(null);
      setOpenEditDialog(true);
    }
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleUpdateSensor = async () => {
    if (!id) return;
    
    if (!editSensorName.trim() || !editSensorLocation.trim()) {
      setFormError('Name and location are required');
      return;
    }

    const sensorData: UpdateSensorDto = {
      name: editSensorName.trim(),
      location: editSensorLocation.trim()
    };

    const success = await updateSensor(id, sensorData);
    
    if (success) {
      handleCloseEditDialog();
      refetchSensor();
    }
  };

  const handleViewAlarm = (alarmId: string) => {
    navigate(`/alarms/${alarmId}`);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    // Convert from 0-based to 1-based indexing
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1); // Reset to first page when changing limit
  };

  const handleBackToSensors = () => {
    navigate('/sensors');
  };

  const handleOpenCreateAlarmDialog = () => {
    setCreateAlarmDialogOpen(true);
  };

  const handleCloseCreateAlarmDialog = () => {
    setCreateAlarmDialogOpen(false);
  };

  const handleAlarmCreated = () => {
    refetchAlarms();
  };

  const getAlarmTypeChip = (type: string) => {
    let color: 'error' | 'warning' | 'info' | 'success' = 'info';
    
    switch (type.toLowerCase()) {
      case 'critical':
        color = 'error';
        break;
      case 'warning':
        color = 'warning';
        break;
      case 'info':
        color = 'info';
        break;
      case 'resolved':
        color = 'success';
        break;
    }
    
    return <Chip label={type} color={color} size="small" />;
  };

  const isLoading = sensorLoading || alarmsLoading;
  const error = sensorError || alarmsError || mutationError;

  return (
    <div>
      <Box display="flex" alignItems="center" mb={3}>
        <Button 
          variant="outlined" 
          onClick={handleBackToSensors}
          sx={{ mr: 2 }}
        >
          Back to Sensors
        </Button>
        <Typography variant="h4" component="h1">
          Sensor Details
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}

      {isLoading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : !sensor ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Sensor not found.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="h6" component="h2" gutterBottom>
                    Sensor Information
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={handleOpenEditDialog}
                    disabled={mutationLoading}
                  >
                    Edit
                  </Button>
                </Box>
                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    ID
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {sensor.id}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" mt={2}>
                    Name
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {sensor.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" mt={2}>
                    Location
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {sensor.location}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" component="h2">
                    Associated Alarms
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="small"
                    startIcon={<Plus size={16} />}
                    onClick={handleOpenCreateAlarmDialog}
                  >
                    Create Alarm
                  </Button>
                </Box>
                
                {alarmsLoading ? (
                  <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                  </Box>
                ) : alarms.length === 0 ? (
                  <Typography variant="body1" color="text.secondary" textAlign="center" my={3}>
                    No alarms associated with this sensor.
                  </Typography>
                ) : (
                  <>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Timestamp</TableCell>
                            <TableCell align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {alarms.map((alarm) => (
                            <TableRow key={alarm.id} hover>
                              <TableCell>{alarm.id}</TableCell>
                              <TableCell>{getAlarmTypeChip(alarm.type)}</TableCell>
                              <TableCell>{formatDate(alarm.timestamp)}</TableCell>
                              <TableCell align="right">
                                <Button 
                                  variant="outlined" 
                                  size="small"
                                  onClick={() => handleViewAlarm(alarm.id)}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      component="div"
                      count={totalAlarms}
                      page={muiPageIndex}
                      onPageChange={handleChangePage}
                      rowsPerPage={limit}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      rowsPerPageOptions={[5, 10, 25]}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Edit Sensor Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Sensor</DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Sensor Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editSensorName}
            onChange={(e) => setEditSensorName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="location"
            label="Sensor Location"
            type="text"
            fullWidth
            variant="outlined"
            value={editSensorLocation}
            onChange={(e) => setEditSensorLocation(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button 
            onClick={handleUpdateSensor} 
            variant="contained"
            disabled={mutationLoading}
          >
            {mutationLoading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Alarm Dialog */}
      {id && (
        <CreateAlarmForm 
          open={createAlarmDialogOpen}
          onClose={handleCloseCreateAlarmDialog}
          onSuccess={handleAlarmCreated}
          sensorId={id}
        />
      )}
    </div>
  );
};

export default SensorDetail; 