import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { NatsModule } from '../transports/nats.module';

@Module({
	imports: [NatsModule],
	controllers: [ProductsController],
	providers: [ProductsService],
})
export class ProductsModule {}
