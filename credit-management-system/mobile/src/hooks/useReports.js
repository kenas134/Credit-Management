// mobile/src/hooks/useReports.js
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '../api/report.api';

export const useDashboard = () =>
  useQuery({
    queryKey: ['dashboard'],
    queryFn: () => reportApi.getDashboard().then((r) => r.data.data),
    staleTime: 1000 * 60 * 5, // 5 min
  });

export const useOutstandingReport = () =>
  useQuery({
    queryKey: ['report', 'outstanding'],
    queryFn: () => reportApi.getOutstanding().then((r) => r.data.data),
  });

export const useAgingReport = () =>
  useQuery({
    queryKey: ['report', 'aging'],
    queryFn: () => reportApi.getAging().then((r) => r.data.data),
  });

export const usePaymentTrend = (months = 6) =>
  useQuery({
    queryKey: ['report', 'trend', months],
    queryFn: () => reportApi.getPaymentTrend(months).then((r) => r.data.data),
  });
