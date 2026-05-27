import { contract } from '@57em-regiment/krang-api-contract';
import { initClient } from '@ts-rest/core';

export const KrangApi = initClient(contract, {
  baseUrl: 'http://localhost:3000',
  // baseUrl: env.KrangBaseApi,
  baseHeaders: {},
});
