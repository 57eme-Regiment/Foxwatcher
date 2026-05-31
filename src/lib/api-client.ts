import { contract } from '@57eme-regiment/krang-api-contract';
import { adminContract } from '@57eme-regiment/auth-contracts';
import { initClient } from '@ts-rest/core';

export const KrangApi = initClient(contract, {
  baseUrl: import.meta.env.VITE_KRANG_SERVICE_URL,
  credentials: 'include',
});
export const WanApi = initClient(adminContract, {
  baseUrl: import.meta.env.VITE_WANSHITONG_SERVICE_URL,
  credentials: 'include',
});
