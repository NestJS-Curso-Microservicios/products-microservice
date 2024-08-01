import { IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
	@IsString()
	name: string;

	@IsNumber({
		maxDecimalPlaces: 2,
	})
	@Min(0)
	@Type(() => Number)
	price: number;

	@IsString()
	description: string;
}
