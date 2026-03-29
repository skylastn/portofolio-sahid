import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body, query, params } = req;

    // 💡 Mengambil IP Klien
    // req.ip: Mendapatkan IP klien (atau IP proxy terdekat jika ada)
    // req.ips: Array IP jika 'trust proxy' diaktifkan (IP klien asli ada di req.ips[0])
    const clientIp = req.ips.length ? req.ips[0] : req.ip;

    // Log request termasuk IP
    this.logger.log(`[${clientIp}] ➡️ ${method} ${originalUrl}`);

    if (body && Object.keys(body).length)
      this.logger.debug(`Body: ${!body ? null : JSON.stringify(body)}`);
    if (query && Object.keys(query).length)
      this.logger.debug(`Query: ${!query ? null : JSON.stringify(query)}`);
    if (params && Object.keys(params).length)
      this.logger.debug(`Params: ${!params ? null : JSON.stringify(params)}`);

    // Anda juga dapat menambahkan log saat respons dikirim (opsional)
    res.on('finish', () => {
      this.logger.log(
        `[${clientIp}] ⬅️ ${method} ${originalUrl} ${res.statusCode}`,
      );
    });

    next();
  }
}
