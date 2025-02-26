import { useState } from 'react';
import { SensorsApi, CreateSensorDto, UpdateSensorDto } from '../api';
import { createApiConfig } from '../utils/api';

interface UseSensorMutationResult {
  createSensor: (data: CreateSensorDto) => Promise<string | null>;
  updateSensor: (id: string, data: UpdateSensorDto) => Promise<boolean>;
  deleteSensor: (id: string) => Promise<boolean>;
  loading: boolean;
  error: Error | null;
}

export const useSensorMutation = (): UseSensorMutationResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const createSensor = async (data: CreateSensorDto): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const config = createApiConfig();
      const sensorsApi = new SensorsApi(config);
      
      const response = await sensorsApi.sensorsControllerCreate(data);
      
      return response.data.id;
    } catch (err) {
      console.error('Error creating sensor:', err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSensor = async (id: string, data: UpdateSensorDto): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const config = createApiConfig();
      const sensorsApi = new SensorsApi(config);
      
      await sensorsApi.sensorsControllerUpdate(id, data);
      
      return true;
    } catch (err) {
      console.error(`Error updating sensor with ID ${id}:`, err);
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSensor = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const config = createApiConfig();
      const sensorsApi = new SensorsApi(config);
      
      await sensorsApi.sensorsControllerRemove(id);
      
      return true;
    } catch (err) {
      console.error(`Error deleting sensor with ID ${id}:`, err);
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSensor,
    updateSensor,
    deleteSensor,
    loading,
    error
  };
}; 