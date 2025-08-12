/**
 * @fileoverview HistoricalPeriod management
 *
 * API endpoints for historicalPeriod management.
 */

import { HistoricalPeriod } from '@/types';
import { APIResponse, getHttpClient } from '@musetrip360/query-foundation';

export const historicalPeriodEndpoints = {
  getHistoricalPeriods: 'historical-periods',
};

export const getHistoricalPeriods = async () => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<HistoricalPeriod[]>>(
    historicalPeriodEndpoints.getHistoricalPeriods
  );

  return response.data;
};
