import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TimeoutError } from 'rxjs';

@Injectable()
export class TimeoutMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const timeoutDuration = req.route?.data?.timeoutDuration || 30000; // Default timeout 30 seconds

    req.setTimeout(timeoutDuration, () => {
      throw new TimeoutError();
    });

    res.setTimeout(timeoutDuration, () => {
      throw new TimeoutError();
    });

    next();
  }
}
