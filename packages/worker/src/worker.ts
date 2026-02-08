import { Worker, Job } from 'bullmq';
import { VideoJobData } from '@smart-did/shared';
import { config } from './config';
import { logger } from './config/logger';
import { videoGeneratorService } from './services/video-generator.service';

/**
 * Video generation worker
 */
export function createWorker(): Worker {
  const worker = new Worker(
    'video-generation',
    async (job: Job<VideoJobData>) => {
      logger.info(`Processing job ${job.id} for book ${job.data.bookId}`);

      try {
        const result = await videoGeneratorService.generateVideo(job.data);

        if (!result.success) {
          throw new Error(result.error || 'Video generation failed');
        }

        logger.info(`Job ${job.id} completed successfully`);
        return result;
      } catch (error) {
        logger.error(`Job ${job.id} failed:`, error);
        throw error;
      }
    },
    {
      connection: {
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
      },
      concurrency: config.worker.concurrency,
      limiter: {
        max: 10,
        duration: 60000, // 10 jobs per minute
      },
    }
  );

  worker.on('completed', (job) => {
    logger.info(`Job ${job.id} completed for book ${job.data.bookId}`);
  });

  worker.on('failed', (job, err) => {
    if (job) {
      logger.error(`Job ${job.id} failed for book ${job.data.bookId}:`, err);
    }
  });

  worker.on('error', (err) => {
    logger.error('Worker error:', err);
  });

  return worker;
}
