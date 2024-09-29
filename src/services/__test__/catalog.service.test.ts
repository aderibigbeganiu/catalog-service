import { ICatalogRepository } from "../../interfaces/ICatalogRepository";
import { Product } from "../../entities/product.entities";
import { MockCatalogRepository } from "../../repository/mockCatalog.repository";
import { ProductFactory } from "../../utils/Fixtures";
import { CatalogService } from "../catalog.services";
import { faker } from '@faker-js/faker';


const mockProduct = (rest?: any) => {
    return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        stock: faker.number.int({ min: 10, max: 100 }),
        price: +faker.commerce.price(),
        ...rest
    }
}

describe("CatalogService", () => {
    let repository: ICatalogRepository;

    beforeEach(() => {
        repository = new MockCatalogRepository();
    });

    afterEach(() => {
        repository = {} as MockCatalogRepository;
    });

    describe("createProduct", () => {
        test("should create product", async () => {
            const service = new CatalogService(repository);
            const requestBody = mockProduct();
            const result = await service.createProduct(requestBody);

            expect(result).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                price: expect.any(Number),
                stock: expect.any(Number),
            });
        })

        test("should throw error with unable to create product", async () => {
            const service = new CatalogService(repository);
            const requestBody = mockProduct();

            jest.spyOn(repository, "create").mockImplementationOnce(() => Promise.resolve({} as Product));

            await expect(service.createProduct(requestBody)).rejects.toThrow("unable to create product")
        });

        test("should throw error with product already exist", async () => {
            const service = new CatalogService(repository);
            const requestBody = mockProduct();

            jest.spyOn(repository, "create")
                .mockImplementationOnce(() => Promise.reject(new Error("product already exist")));

            await expect(service.createProduct(requestBody)).rejects.toThrow("product already exist")
        });
    });

    describe("updateProduct", () => {
        test("should update product", async () => {
            const service = new CatalogService(repository);
            const requestBody = mockProduct({
                id: faker.number.int({ min: 10, max: 1000 })
            });
            const result = await service.updateProduct(requestBody);

            expect(result).toMatchObject(requestBody);
        })

        test("should throw error with product does not exist", async () => {
            const service = new CatalogService(repository);

            jest.spyOn(repository, "update").mockImplementationOnce(() => Promise.reject(new Error("product does not exist")));

            await expect(service.updateProduct({})).rejects.toThrow("product does not exist")
        });
    });

    describe("getProducts", () => {
        test("should get products by offset and limit", async () => {
            const service = new CatalogService(repository);
            const randomLimit = faker.number.int({ min: 10, max: 50 })
            const products = ProductFactory.buildList(randomLimit)
            jest.spyOn(repository, "find").mockImplementationOnce(() => Promise.resolve(products))
            const result = await service.getProducts(randomLimit, 0);
            expect(result.length).toEqual(randomLimit);
            expect(result).toMatchObject(products)
        })

        test("should throw error with products does not exist", async () => {
            const service = new CatalogService(repository);

            jest.spyOn(repository, "find")
                .mockImplementationOnce(() => Promise.reject(new Error("products does not exist")));

            await expect(service.getProducts(0, 0)).rejects.toThrow("products does not exist")
        });
    });

    describe("getProduct", () => {
        test("should get product by id", async () => {
            const service = new CatalogService(repository);
            const product = ProductFactory.build()
            jest.spyOn(repository, "findOne").mockImplementationOnce(() => Promise.resolve(product))
            const result = await service.getProduct(product.id!);
            expect(result).toEqual(product);
            expect(result).toMatchObject(product)
        })

        test("should throw error with product does not exist", async () => {
            const service = new CatalogService(repository);
            const product = ProductFactory.build()

            jest.spyOn(repository, "findOne")
                .mockImplementationOnce(() => Promise.reject(new Error("product does not exist")));

            await expect(service.getProduct(product.id!)).rejects.toThrow("product does not exist")
        });
    });

    describe("deleteProduct", () => {
        test("should delete product by id", async () => {
            const service = new CatalogService(repository);
            const product = ProductFactory.build()
            jest.spyOn(repository, "delete").mockImplementationOnce(() => Promise.resolve(product.id!));
            const result = await service.deleteProduct(product.id!);
            expect(result).toEqual(product.id);
        })

        test("should throw error with product does not exist", async () => {
            const service = new CatalogService(repository);
            const product = ProductFactory.build()

            jest.spyOn(repository, "delete")
                .mockImplementationOnce(() => Promise.reject(new Error("product does not exist")));

            await expect(service.deleteProduct(product.id!)).rejects.toThrow("product does not exist")
        });
    });
});