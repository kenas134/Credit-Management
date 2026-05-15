// mobile/src/hooks/useReports.js
// React Query hooks for reports and dashboard data

import { useQuery } from '@tanstack/react-query';
import { reportApi } from '../api/report.api';

export const useDashboard = () =>
  useQuery({
    queryKey: ['dashboard'],
    queryFn: () => reportApi.getDashboard().then((r) => r.data),
    staleTime: 1000 * 60, // 1 minute
  });

export const useOutstanding = () =>
  useQuery({
    queryKey: ['outstanding'],
    queryFn: () => reportApi.getOutstanding().then((r) => r.data),
  });

export const useAging = () =>
  useQuery({
    queryKey: ['aging'],
    queryFn: () => reportApi.getAging().then((r) => r.data),
  });

export const useKPIs = () =>
  useQuery({
    queryKey: ['kpis'],
    queryFn: () => reportApi.getKPIs().then((r) => r.data),
  });

export const usePaymentTrend = () =>
  useQuery({
    queryKey: ['paymentTrend'],
    queryFn: () => reportApi.getPaymentTrend().then((r) => r.data),
  });
