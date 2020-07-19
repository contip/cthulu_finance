import { Module } from '@nestjs/common';
import { LookupService } from './lookup.service';
import { LookupController } from './lookup.controller';
import { AuthModule } from '../auth/auth.module';

@Module({})
export class LookupModule {
    imports: [AuthModule];
    exports: [LookupService];
    providers: [LookupService];
    controllers: [LookupController]; 
}
