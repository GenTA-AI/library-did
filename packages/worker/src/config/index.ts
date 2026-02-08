import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },

  storage: {
    type: process.env.STORAGE_TYPE || 'local',
    path: process.env.STORAGE_PATH || './storage/videos',
  },

  veo: {
    apiKey: process.env.VEO_API_KEY || '',
    apiEndpoint: process.env.VEO_API_ENDPOINT || 'https://api.veo.example.com/v1',
  },

  video: {
    defaultExpiryDays: parseInt(process.env.VIDEO_DEFAULT_EXPIRY_DAYS || '90', 10),
    maxRetries: parseInt(process.env.VIDEO_MAX_RETRIES || '3', 10),
    sceneDuration: parseInt(process.env.VIDEO_SCENE_DURATION || '8', 10),
  },

  worker: {
    concurrency: parseInt(process.env.WORKER_CONCURRENCY || '2', 10),
  },
};
