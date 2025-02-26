import { useState } from 'react';
import { AlarmsApi, CreateAlarmDto, CreateAlarmDtoTypeEnum } from '../api';
import { createApiConfig } from '../utils/api';

interface UseAlarmMutationResult {
  createAlarm: (data: CreateAlarmDto) => Promise<boolean>;
  loading: boolean;
  error: Error | null;
}

export const useAlarmMutation = (): UseAlarmMutationResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const createAlarm = async (data: CreateAlarmDto): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const config = createApiConfig();
      const alarmsApi = new AlarmsApi(config);
      
      await alarmsApi.alarmsControllerCreateAlarm(data);
      return true;
    } catch (err) {
      console.error('Error creating alarm:', err);
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createAlarm,
    loading,
    error
  };
};

export { CreateAlarmDtoTypeEnum }; 