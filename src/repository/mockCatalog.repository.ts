import { ICatalogRepository } from "../interface/catalogRepository";
import { Product } from "../models/product.model";

export class MockCatalogRepository implements ICatalogRepository {
    async create(data: Product): Promise<Product> {
        const mockProduct = {
            id: Math.floor(Math.random() * 1000000),
            ...data,
        }
        return Promise.resolve(mockProduct);
    }

    async update(data: Product): Promise<Product> {
        return Promise.resolve(data);
    }

    async delete(id: number): Promise<number> {
        return Promise.resolve(id);
    }

    async find(limit: number, offset: number): Promise<Product[]> {
        return Promise.resolve([]);
    }
    
    async findOne(id: number): Promise<Product> {
        const data = Promise.resolve({} as Product);
        return data;
    }
}