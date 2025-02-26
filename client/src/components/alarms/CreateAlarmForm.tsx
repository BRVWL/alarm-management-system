import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  Alert
} from '@mui/material';
import { useAlarmMutation, CreateAlarmDtoTypeEnum } from '../../hooks/useAlarmMutation';
import { useSensors } from '../../hooks/useSensors';
import { CreateAlarmDto } from '../../api';

interface CreateAlarmFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sensorId?: string; // Optional sensorId to pre-select a sensor
}

const CreateAlarmForm: React.FC<CreateAlarmFormProps> = ({ 
  open, 
  onClose, 
  onSuccess, 
  sensorId: initialSensorId 
}) => {
  const [sensorId, setSensorId] = useState<string>('');
  const [alarmType, setAlarmType] = useState<string>('');
  const [formErrors, setFormErrors] = useState<{ sensorId?: string; alarmType?: string }>({});
  
  const { createAlarm, loading, error } = useAlarmMutation();
  const { sensors, loading: sensorsLoading } = useSensors();
  
  // Set the initial sensor ID when the component mounts or when initialSensorId changes
  useEffect(() => {
    if (initialSensorId) {
      setSensorId(initialSensorId);
    }
  }, [initialSensorId]);
  
  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setAlarmType('');
      setFormErrors({});
      // Only set sensorId if initialSensorId is provided, otherwise reset it
      if (initialSensorId) {
        setSensorId(initialSensorId);
      } else {
        setSensorId('');
      }
    }
  }, [open, initialSensorId]);
  
  const handleSensorChange = (event: SelectChangeEvent<string>) => {
    setSensorId(event.target.value);
    setFormErrors(prev => ({ ...prev, sensorId: undefined }));
  };
  
  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setAlarmType(event.target.value);
    setFormErrors(prev => ({ ...prev, alarmType: undefined }));
  };
  
  const validateForm = (): boolean => {
    const errors: { sensorId?: string; alarmType?: string } = {};
    
    if (!sensorId) {
      errors.sensorId = 'Please select a sensor';
    }
    
    if (!alarmType) {
      errors.alarmType = 'Please select an alarm type';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    const alarmData: CreateAlarmDto = {
      sensorId,
      type: alarmType as CreateAlarmDtoTypeEnum
    };
    
    const success = await createAlarm(alarmData);
    
    if (success) {
      resetForm();
      onSuccess();
      onClose();
    }
  };
  
  const resetForm = () => {
    if (!initialSensorId) {
      setSensorId('');
    }
    setAlarmType('');
    setFormErrors({});
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Alarm</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Create a new alarm by selecting a sensor and alarm type.
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth error={!!formErrors.sensorId} sx={{ mb: 3 }} disabled={!!initialSensorId}>
            <InputLabel id="sensor-select-label">Sensor</InputLabel>
            <Select
              labelId="sensor-select-label"
              id="sensor-select"
              value={sensorId}
              label="Sensor"
              onChange={handleSensorChange}
              disabled={sensorsLoading || loading || !!initialSensorId}
            >
              {sensors.map((sensor) => (
                <MenuItem key={sensor.id} value={sensor.id}>
                  {sensor.name} ({sensor.location})
                </MenuItem>
              ))}
            </Select>
            {formErrors.sensorId && (
              <FormHelperText>{formErrors.sensorId}</FormHelperText>
            )}
          </FormControl>
          
          <FormControl fullWidth error={!!formErrors.alarmType}>
            <InputLabel id="type-select-label">Alarm Type</InputLabel>
            <Select
              labelId="type-select-label"
              id="type-select"
              value={alarmType}
              label="Alarm Type"
              onChange={handleTypeChange}
              disabled={loading}
            >
              {Object.entries(CreateAlarmDtoTypeEnum).map(([key, value]) => (
                <MenuItem key={value} value={value}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </MenuItem>
              ))}
            </Select>
            {formErrors.alarmType && (
              <FormHelperText>{formErrors.alarmType}</FormHelperText>
            )}
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Alarm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateAlarmForm; 