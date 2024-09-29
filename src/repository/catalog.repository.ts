import { ICatalogRepository } from "../interfaces/ICatalogRepository";
import { Product } from "../entities/product.entities";
import { PrismaClient } from "@prisma/client";

export class CatalogRepository implements ICatalogRepository {
    prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(data: Product): Promise<Product> {
        return this.prisma.product.create({ data });
    }
    async update(data: Product): Promise<Product> {
        const { id, ...updateData } = data;
        return this.prisma.product.update({
            where: {
                id
            },
            data: updateData,
        })
    }
    async delete(id: string): Promise<string> {
        return (await this.prisma.product.delete({ where: { id } })).id;
    }
    async find(limit: number, offset: number): Promise<Product[]> {
        return this.prisma.product.findMany({
            take: limit,
            skip: offset,
        });
    }
    async findOne(id: string): Promise<Product> {
        const product = await this.prisma.product.findFirst({ where: { id } });
        if (!product) {
            throw new Error("product not found");
        }
        return product;
    }
}