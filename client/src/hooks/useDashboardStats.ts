import { useState, useEffect } from 'react';
import { AlarmsApi, SensorsApi, VisualizationsApi } from '../api/api';
import { createApiConfig } from '../utils/api';

interface DashboardStats {
  alarmsCount: number;
  sensorsCount: number;
  visualizationsCount: number;
}

interface UseDashboardStatsResult {
  stats: DashboardStats;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useDashboardStats = (): UseDashboardStatsResult => {
  const [stats, setStats] = useState<DashboardStats>({
    alarmsCount: 0,
    sensorsCount: 0,
    visualizationsCount: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const refetch = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const config = createApiConfig();
        const alarmsApi = new AlarmsApi(config);
        const sensorsApi = new SensorsApi(config);
        const visualizationsApi = new VisualizationsApi(config);
        
        // Fetch all data in parallel
        const [alarmsResponse, sensorsResponse, visualizationsResponse] = await Promise.all([
          alarmsApi.alarmsControllerGetAlarms(undefined, undefined, 1, 1),
          sensorsApi.sensorsControllerFindAll(),
          visualizationsApi.visualizationsControllerFindAll()
        ]);

        setStats({
          alarmsCount: alarmsResponse.data?.total || 0,
          sensorsCount: sensorsResponse.data?.length || 0,
          visualizationsCount: visualizationsResponse.data?.length || 0,
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [refreshTrigger]);

  return {
    stats,
    loading,
    error,
    refetch
  };
}; 