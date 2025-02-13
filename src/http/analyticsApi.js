import { $authHost } from '.';

export const fetchBotAnalytics = async () => {
  const { data } = await $authHost.get('/api/analytics/bot');
  return data;
};