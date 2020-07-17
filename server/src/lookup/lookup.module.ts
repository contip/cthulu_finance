import { Module } from '@nestjs/common';
import { LookupService } from './lookup.service';
import { LookupController } from './lookup.controller';

@Module({})
export class LookupModule {
    imports: [];
    exports: [LookupService];
    providers: [LookupService];
    controllers: [LookupController]; 
}
