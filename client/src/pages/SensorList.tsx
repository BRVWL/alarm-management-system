import React, { useState } from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  Button, 
  CircularProgress, 
  Alert, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSensors } from '../hooks/useSensors';
import { useSensorMutation } from '../hooks/useSensorMutation';
import { CreateSensorDto } from '../api';

const SensorList: React.FC = () => {
  const navigate = useNavigate();
  const { sensors, loading, error, refetch } = useSensors();
  const { createSensor, deleteSensor, loading: mutationLoading, error: mutationError } = useSensorMutation();
  
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [sensorToDelete, setSensorToDelete] = useState<string | null>(null);
  const [newSensorName, setNewSensorName] = useState('');
  const [newSensorLocation, setNewSensorLocation] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleViewSensor = (sensorId: string) => {
    navigate(`/sensors/${sensorId}`);
  };

  const handleOpenCreateDialog = () => {
    setNewSensorName('');
    setNewSensorLocation('');
    setFormError(null);
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleOpenDeleteDialog = (sensorId: string) => {
    setSensorToDelete(sensorId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSensorToDelete(null);
  };

  const handleCreateSensor = async () => {
    if (!newSensorName.trim() || !newSensorLocation.trim()) {
      setFormError('Name and location are required');
      return;
    }

    const sensorData: CreateSensorDto = {
      name: newSensorName.trim(),
      location: newSensorLocation.trim()
    };

    const sensorId = await createSensor(sensorData);
    
    if (sensorId) {
      handleCloseCreateDialog();
      refetch();
    }
  };

  const handleDeleteSensor = async () => {
    if (!sensorToDelete) return;

    const success = await deleteSensor(sensorToDelete);
    
    if (success) {
      handleCloseDeleteDialog();
      refetch();
    }
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Sensors
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleOpenCreateDialog}
          disabled={loading || mutationLoading}
        >
          Add New Sensor
        </Button>
      </Box>

      {(error || mutationError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error?.message || mutationError?.message}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : sensors.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No sensors found. Create your first sensor to get started.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sensors.map((sensor) => (
                <TableRow key={sensor.id} hover>
                  <TableCell>{sensor.id}</TableCell>
                  <TableCell>{sensor.name}</TableCell>
                  <TableCell>{sensor.location}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button 
                        variant="outlined" 
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleViewSensor(sensor.id)}
                      >
                        View
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="error" 
                        size="small"
                        onClick={() => handleOpenDeleteDialog(sensor.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Sensor Dialog */}
      <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
        <DialogTitle>Add New Sensor</DialogTitle>
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
            value={newSensorName}
            onChange={(e) => setNewSensorName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="location"
            label="Sensor Location"
            type="text"
            fullWidth
            variant="outlined"
            value={newSensorLocation}
            onChange={(e) => setNewSensorLocation(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Cancel</Button>
          <Button 
            onClick={handleCreateSensor} 
            variant="contained"
            disabled={mutationLoading}
          >
            {mutationLoading ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this sensor? This action cannot be undone.
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Note: Deleting a sensor will also delete all associated alarms and visualizations.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button 
            onClick={handleDeleteSensor} 
            color="error"
            variant="contained"
            disabled={mutationLoading}
          >
            {mutationLoading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SensorList; 