import { useState, useEffect } from 'react';
import { AlarmsApi, AlarmResponseDto, AlarmsControllerGetAlarmsTypeEnum } from '../api';
import { createApiConfig } from '../utils/api';

interface UseAlarmsResult {
  alarms: AlarmResponseDto[];
  totalAlarms: number;
  loading: boolean;
  error: Error | null;
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  sensorId: string | undefined;
  setSensorId: (sensorId: string | undefined) => void;
  type: AlarmsControllerGetAlarmsTypeEnum | undefined;
  setType: (type: AlarmsControllerGetAlarmsTypeEnum | undefined) => void;
  refetch: () => void;
}

export const useAlarms = (): UseAlarmsResult => {
  const [alarms, setAlarms] = useState<AlarmResponseDto[]>([]);
  const [totalAlarms, setTotalAlarms] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [sensorId, setSensorId] = useState<string | undefined>(undefined);
  const [type, setType] = useState<AlarmsControllerGetAlarmsTypeEnum | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const refetch = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchAlarms = async () => {
      setLoading(true);
      setError(null);

      try {
        const config = createApiConfig();
        const alarmsApi = new AlarmsApi(config);
        
        // Ensure page is a valid number and at least 1
        const currentPage = Math.max(1, page);
        
        const response = await alarmsApi.alarmsControllerGetAlarms(
          type,
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
        console.error('Error fetching alarms:', err);
        setError(err as Error);
        // Reset data on error
        setAlarms([]);
        setTotalAlarms(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAlarms();
  }, [page, limit, sensorId, type, refreshTrigger]);

  return {
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
  };
}; 