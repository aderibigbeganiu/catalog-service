import { ICatalogRepository } from "../interface/catalogRepository";

export class CatalogService {
    private readonly _repository: ICatalogRepository;
    constructor(repository: ICatalogRepository) {
        this._repository = repository;
    }

    async createProduct(input: any) {
        const data = await this._repository.create(input);
        if (!data.id) {
            throw new Error("unable to create product");
        }
        return data;
    }

    async updateProduct(input: any) {
        const data = await this._repository.update(input);
        if (!data.id) {
            throw new Error("product does not exist");
        }
        return data;
        // Emit event to update record in elasticsearch
    }

    // Get products from elasticsearch
    async getProducts(limit: number, offset: number) {
        const data = await this._repository.find(limit, offset);
        return data;
    }

    async getProduct(id: number) {
        const data = await this._repository.findOne(id);
        if (!data) {
            throw new Error("product does not exist");
        }
        return data;
    }
    
    async deleteProduct(id: number) {
        const data = await this._repository.delete(id);
        if (!data) {
            throw new Error("product does not exist");
        }
        return data;
        // Emit event to delete record in elasticsearch
    }
}