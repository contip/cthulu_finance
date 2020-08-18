import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trades } from './entities/trades.entity';
import { TradesService } from './trades.service';
import { AuthModule } from '../auth/auth.module';


@Module({
    imports: [TypeOrmModule.forFeature([Trades]), AuthModule],
    exports: [TradesService],
    providers: [TradesService],
    /* i might need a controller here to handle the post requests
        for buy / sell */
    controllers: []
})
export class TradesModule {}
