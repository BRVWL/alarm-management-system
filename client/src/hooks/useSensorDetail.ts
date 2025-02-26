import { useState, useEffect } from 'react';
import { SensorsApi, SensorResponseDto } from '../api';
import { createApiConfig } from '../utils/api';

interface UseSensorDetailResult {
  sensor: SensorResponseDto | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useSensorDetail = (sensorId: string): UseSensorDetailResult => {
  const [sensor, setSensor] = useState<SensorResponseDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const refetch = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    if (!sensorId) {
      setLoading(false);
      return;
    }

    const fetchSensorDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const config = createApiConfig();
        const sensorsApi = new SensorsApi(config);
        
        const response = await sensorsApi.sensorsControllerFindOne(sensorId);

        if (response.data) {
          setSensor(response.data);
        }
      } catch (err) {
        console.error(`Error fetching sensor with ID ${sensorId}:`, err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchSensorDetail();
  }, [sensorId, refreshTrigger]);

  return {
    sensor,
    loading,
    error,
    refetch
  };
}; 