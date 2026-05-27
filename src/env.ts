import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    KrangBaseApi: z.url(),
  },
  clientPrefix: 'VITE_',
  client: {},
  runtimeEnv: import.meta.env || process.env,
  emptyStringAsUndefined: true,
});
