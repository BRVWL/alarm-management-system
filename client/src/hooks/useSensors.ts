import { useState, useEffect } from 'react';
import { SensorsApi, SensorResponseDto } from '../api';
import { createApiConfig } from '../utils/api';

interface UseSensorsResult {
  sensors: SensorResponseDto[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useSensors = (): UseSensorsResult => {
  const [sensors, setSensors] = useState<SensorResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const refetch = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchSensors = async () => {
      setLoading(true);
      setError(null);

      try {
        const config = createApiConfig();
        const sensorsApi = new SensorsApi(config);
        
        const response = await sensorsApi.sensorsControllerFindAll();

        if (response.data) {
          setSensors(response.data);
        }
      } catch (err) {
        console.error('Error fetching sensors:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchSensors();
  }, [refreshTrigger]);

  return {
    sensors,
    loading,
    error,
    refetch
  };
}; 