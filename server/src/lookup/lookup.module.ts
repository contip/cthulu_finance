import { Module, HttpModule } from '@nestjs/common';
import { LookupService } from './lookup.service';
import { LookupController } from './lookup.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule, HttpModule],
    exports: [LookupService],
    providers: [LookupService],
    controllers: [LookupController], 
})
export class LookupModule {}
