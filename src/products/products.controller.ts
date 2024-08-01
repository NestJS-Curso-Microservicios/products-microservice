import { Controller } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@MessagePattern('create_product')
	async create(@Payload() createProductDto: CreateProductDto) {
		return await this.productsService.create(createProductDto);
	}

	@MessagePattern('find_all_products')
	async findAll(@Payload() paginationDto: PaginationDto) {
		return await this.productsService.findAll(paginationDto);
	}

	@MessagePattern('find_one_product')
	async findOne(@Payload('id') id: string) {
		return await this.productsService.findOne(+id);
	}

	@MessagePattern('update_product')
	async update(@Payload() updateProductDto: UpdateProductDto) {
		return await this.productsService.update(updateProductDto);
	}

	@MessagePattern('remove_product')
	async remove(@Payload('id') id: string) {
		return await this.productsService.remove(+id);
	}

	@MessagePattern('validate_products')
	async validateProducts(@Payload() ids: number[]) {
		return await this.productsService.validateProducts(ids);
	}
}
