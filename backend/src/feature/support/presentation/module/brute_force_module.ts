import { Global, Module } from '@nestjs/common';
import { BruteForceService } from '../../application/brute_force_service';

@Global()
@Module({
  providers: [BruteForceService],
  exports: [BruteForceService],
})
export class BruteForceModule {}
