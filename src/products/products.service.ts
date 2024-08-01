import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
	private readonly logger = new Logger(ProductsService.name);

	async onModuleInit() {
		await this.$connect().then(() => {
			this.logger.log('Connected to the database');
		});
	}

	async create(createProductDto: CreateProductDto) {
		return this.product.create({
			data: createProductDto,
		});
	}

	async findAll(paginationDto: PaginationDto) {
		const { page, limit } = paginationDto;

		const total = await this.product.count({
			where: {
				available: true,
			},
		});

		const lastPage = Math.ceil(total / limit);

		const products = await this.product.findMany({
			skip: (page - 1) * limit,
			take: limit,
			where: {
				available: true,
			},
		});

		return {
			meta: {
				total,
				page,
				limit,
				lastPage,
			},
			data: products,
		};
	}

	async findOne(id: number) {
		const product = await this.product.findFirst({
			where: {
				id,
				available: true,
			},
		});

		if (!product) {
			throw new RpcException({
				message: `Product with id: ${id} not found`,
				status: HttpStatus.NOT_FOUND,
			});
		}

		return product;
	}

	async update(updateProductDto: UpdateProductDto) {
		const { id, ...data } = updateProductDto;

		await this.findOne(id);

		return this.product.update({
			where: {
				id,
			},
			data,
		});
	}

	async remove(id: number) {
		await this.findOne(id);

		return this.product.update({
			where: {
				id,
			},
			data: {
				available: false,
			},
		});
	}

	async validateProducts(ids: number[]) {
		ids = Array.from(new Set(ids));

		const products = await this.product.findMany({
			where: {
				id: {
					in: ids,
				},
			},
		});

		const productsIds = products.map((product) => product.id);

		const invalidProducts = ids.filter((id) => !productsIds.includes(id));

		if (invalidProducts.length) {
			throw new RpcException({
				message: `Invalid products: ${invalidProducts.join(', ')}`,
				status: HttpStatus.BAD_REQUEST,
			});
		}

		return products;
	}
}
