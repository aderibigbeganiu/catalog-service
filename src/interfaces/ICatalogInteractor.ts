import { Product } from "../entities/product.entities";

export interface ICatalogInteractor {
    createProduct(input: Product): Promise<Product>;
    updateProduct(input: Product): Promise<Product>;
    getProducts(limit: number, offset: number): Promise<Product[]>;
    getProduct(id: string): Promise<Product>;
    deleteProduct(id: string): Promise<string>;
}