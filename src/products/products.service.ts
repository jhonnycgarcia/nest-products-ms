import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from 'generated/prisma';
import { PaginationDto } from 'src/common/dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(ProductsService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to database');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const total = await this.product.count({ where: { available: true } });
    const lastPage = Math.ceil(total / limit!);
    const data = await this.product.findMany({
      skip: (page! - 1) * limit!,
      take: limit!,
      where: { available: true },
    });

    return {
      data,
      metadata: {
        page: page!,
        limit: limit!,
        total,
        lastPage,
      }
    }
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: { id, available: true },
    });

    if (!product) {
      // throw new NotFoundException(`Product with id ${id} not found`);
      throw new RpcException(`Product with id ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: productId, ...data } = updateProductDto;
    await this.findOne(productId);

    return this.product.update({
      where: { id: productId },
      data,
    });
  }

  async remove(id: number) {
    // hard delete
    // await this.findOne(id);
    // return this.product.delete({
    //   where: { id },
    // });

    // soft delete
    await this.findOne(id);
    return this.product.update({
      where: { id },
      data: { available: false },
    });
  }
}
