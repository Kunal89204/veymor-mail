// app.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHealthStatus() {
    const uptimeSeconds = process.uptime();

    return {
      service: 'Veymor Mail API',
      status: 'healthy',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: Math.floor(uptimeSeconds),
        human: this.formatUptime(uptimeSeconds),
      },
      server: {
        platform: process.platform,
        nodeVersion: process.version,
        memoryUsage: this.getMemoryUsage(),
      },
      checks: {
        api: 'ok',
        process: 'running',
      },
      version: '1.0.0',
    };
  }

  private formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  }

  private getMemoryUsage() {
    const used = process.memoryUsage();

    const toMb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

    return {
      rss: toMb(used.rss),
      heapTotal: toMb(used.heapTotal),
      heapUsed: toMb(used.heapUsed),
      external: toMb(used.external),
    };
  }
}
