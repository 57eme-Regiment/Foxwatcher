import { contract } from '@57eme-regiment/krang-api-contract';
import { initClient } from '@ts-rest/core';

export const KrangApi = initClient(contract, {
  baseUrl: import.meta.env.VITE_KRANG_SERVICE_URL,
  credentials: 'include',
});
