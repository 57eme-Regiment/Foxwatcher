import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    KRANG_SERVICE_URL: z.url(),
  },
  clientPrefix: 'VITE_',
  client: {
    VITE_RENENUTET_SERVICE_URL: z.url(),
    VITE_KRANG_SERVICE_URL: z.url(),
    VITE_DISCORD_SERVER_ID: z.string(),
  },
  runtimeEnv: import.meta.env || process.env,
  emptyStringAsUndefined: true,
});
