import { ICatalogRepository } from "../interface/catalogRepository";
import { Product } from "../models/product.model";
// import { ProductFactory } from '../utils/Fixtures'

export class CatalogRepository implements ICatalogRepository {
    async create(data: Product): Promise<Product> {
        // const product = ProductFactory.build()
        const product = {
            id: 123,
            name: "Catalog name",
            description: "Catalog description",
            price: 123.45,
            stock: 123
        }
        return Promise.resolve(product);
    }
    async update(data: Product): Promise<Product> {
        // const product = ProductFactory.build()
        const product = {
            id: 123,
            name: "Catalog name",
            description: "Catalog description",
            price: 123.45,
            stock: 123
        }
        return Promise.resolve(product);
    }
    async delete(id: number): Promise<number> {
        // const product = ProductFactory.build()
        const product = {
            id: 123,
            name: "Catalog name",
            description: "Catalog description",
            price: 123.45,
            stock: 123
        }
        return Promise.resolve(product.id!);
    }
    async find(limit: number, offset: number): Promise<Product[]> {
        // const products = ProductFactory.buildList(limit)
        const products = [{
            id: 123,
            name: "Catalog name",
            description: "Catalog description",
            price: 123.45,
            stock: 123
        }]
        return Promise.resolve(products);
    }
    async findOne(id: number): Promise<Product> {
        // const product = ProductFactory.build()
        const product = {
            id: 123,
            name: "Catalog name",
            description: "Catalog description",
            price: 123.45,
            stock: 123
        }
        return Promise.resolve(product);
    }
}