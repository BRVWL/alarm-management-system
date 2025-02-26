import { useState, useEffect } from 'react';
import { AlarmsApi, AlarmResponseDto } from '../api';
import { createApiConfig } from '../utils/api';

interface UseSensorAlarmsResult {
  alarms: AlarmResponseDto[];
  totalAlarms: number;
  loading: boolean;
  error: Error | null;
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  refetch: () => void;
}

export const useSensorAlarms = (sensorId: string): UseSensorAlarmsResult => {
  const [alarms, setAlarms] = useState<AlarmResponseDto[]>([]);
  const [totalAlarms, setTotalAlarms] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const refetch = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchAlarms = async () => {
      if (!sensorId) return;
      
      setLoading(true);
      setError(null);

      try {
        const config = createApiConfig();
        const alarmsApi = new AlarmsApi(config);
        
        // Ensure page is a valid number and at least 1
        const currentPage = Math.max(1, page);
        
        const response = await alarmsApi.alarmsControllerGetAlarms(
          undefined,
          sensorId,
          currentPage,
          limit
        );

        if (response.data && response.data.data) {
          setAlarms(response.data.data);
          setTotalAlarms(response.data.total || 0);
        } else {
          // Handle empty response
          setAlarms([]);
          setTotalAlarms(0);
        }
      } catch (err) {
        console.error('Error fetching alarms for sensor:', err);
        setError(err as Error);
        // Reset data on error
        setAlarms([]);
        setTotalAlarms(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAlarms();
  }, [sensorId, page, limit, refreshTrigger]);

  return {
    alarms,
    totalAlarms,
    loading,
    error,
    page,
    setPage,
    limit,
    setLimit,
    refetch
  };
}; 