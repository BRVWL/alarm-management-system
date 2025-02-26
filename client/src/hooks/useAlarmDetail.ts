import { useState, useEffect } from 'react';
import { AlarmsApi, AlarmResponseDto } from '../api';
import { createApiConfig } from '../utils/api';

interface UseAlarmDetailResult {
  alarm: AlarmResponseDto | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useAlarmDetail = (alarmId: string): UseAlarmDetailResult => {
  const [alarm, setAlarm] = useState<AlarmResponseDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const refetch = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    if (!alarmId) {
      setLoading(false);
      return;
    }

    const fetchAlarmDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const config = createApiConfig();
        const alarmsApi = new AlarmsApi(config);
        
        const response = await alarmsApi.alarmsControllerGetAlarmById(alarmId);

        if (response.data) {
          setAlarm(response.data);
        }
      } catch (err) {
        console.error(`Error fetching alarm with ID ${alarmId}:`, err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlarmDetail();
  }, [alarmId, refreshTrigger]);

  return {
    alarm,
    loading,
    error,
    refetch
  };
}; 