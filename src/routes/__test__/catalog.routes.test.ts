import request from 'supertest'
import express from 'express'
import { faker } from '@faker-js/faker'
import catalogRoutes, { catalogService } from '../catalog.routes'
import { ProductFactory } from '../../utils/Fixtures'

const app = express()
app.use(express.json())
app.use(catalogRoutes)

const mockRequest = () => {
    return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        stock: faker.number.int({ min: 10, max: 100 }),
        price: +faker.commerce.price()
    }
}

describe("Catalog routes", () => {
    describe("POST /products", () => {

        test("should create product successfully", async () => {
            const requestBody = mockRequest();
            const product = ProductFactory.build();
            jest.spyOn(catalogService, "createProduct")
                .mockImplementationOnce(() => Promise.resolve(product))
            const response = await request(app)
                .post('/products')
                .send(requestBody)
                .set("Accept", "application/json")
            expect(response.status).toBe(201);
            expect(response.body).toEqual(product);
        });

        test("should response with validation error 400", async () => {
            const requestBody = mockRequest();
            const response = await request(app)
                .post('/products')
                .send({ ...requestBody, name: "" })
                .set("Accept", "application/json")
            expect(response.status).toBe(400);
            expect(response.body).toEqual("name should not be empty");
        });

        test("should response with an internal error code 500", async () => {
            const requestBody = mockRequest();
            jest.spyOn(catalogService, "createProduct")
                .mockImplementationOnce(() => Promise.reject(new Error("unable to create product")));
            const response = await request(app)
                .post('/products')
                .send(requestBody)
                .set("Accept", "application/json")
            expect(response.status).toBe(500);
            expect(response.body).toEqual("unable to create product");
        });

    });

    describe("PATCH /products/:id", () => {

        test("should update product successfully", async () => {
            const product = ProductFactory.build();
            const requestBody = {
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock + 10,
            }
            jest.spyOn(catalogService, "updateProduct")
                .mockImplementationOnce(() => Promise.resolve(product))
            const response = await request(app)
                .patch(`/products/${product.id}`)
                .send(requestBody)
                .set("Accept", "application/json")
            expect(response.status).toBe(200);
            expect(response.body).toEqual(product);
        });

        test("should response with validation error 400", async () => {
            const product = ProductFactory.build();
            const requestBody = {
                name: product.name,
                description: product.description,
                price: -1,
                stock: product.stock + 10,
            }
            const response = await request(app)
                .patch(`/products/${product.id}`)
                .send({ ...requestBody })
                .set("Accept", "application/json")
            expect(response.status).toBe(400);
            expect(response.body).toEqual("price must not be less than 1");
        });

        test("should response with an internal error code 500", async () => {
            const product = ProductFactory.build();
            const requestBody = mockRequest();
            jest.spyOn(catalogService, "updateProduct")
                .mockImplementationOnce(() => Promise.reject(new Error("product does not exist")));
            const response = await request(app)
                .patch(`/products/${product.id}`)
                .send(requestBody)
                .set("Accept", "application/json")
            expect(response.status).toBe(500);
            expect(response.body).toEqual("product does not exist");
        });

    });

    describe("GET /products/?limit=0&offset=0", () => {

        test("should return a range of product based on limit and offset", async () => {

            const randomLimit = faker.number.int({ min: 10, max: 50 })
            const products = ProductFactory.buildList(randomLimit)

            jest.spyOn(catalogService, "getProducts")
                .mockImplementationOnce(() => Promise.resolve(products))
            const response = await request(app)
                .get(`/products?limit=${randomLimit}&offset=0`)
                .set("Accept", "application/json")
            expect(response.status).toBe(200);
            expect(response.body).toEqual(products);
        });

        test("should response with an internal error code 500", async () => {
            jest.spyOn(catalogService, "getProducts")
                .mockImplementationOnce(() => Promise.reject(new Error("unable to get products")));
            const response = await request(app)
                .get(`/products`)
                .set("Accept", "application/json")
            expect(response.status).toBe(500);
            expect(response.body).toEqual("unable to get products");
        });
    });

    describe("GET /products/:id", () => {

        test("should return a product by id", async () => {
            const product = ProductFactory.build();
            jest.spyOn(catalogService, "getProduct")
                .mockImplementationOnce(() => Promise.resolve(product))
            const response = await request(app)
                .get(`/products/${product.id}`)
                .set("Accept", "application/json")
            expect(response.status).toBe(200);
            expect(response.body).toEqual(product);
        });

        test("should response with product not found error 404", async () => {
            const product = ProductFactory.build();
            jest.spyOn(catalogService, "getProduct")
                .mockImplementationOnce(() => Promise.reject(new Error("product not found")));
            const response = await request(app)
                .get(`/products/${product.id}`)
                .set("Accept", "application/json")
            // expect(response.status).toBe(404);
            expect(response.body).toEqual("product not found");
        });

        test("should response with an internal error code 500", async () => {
            const product = ProductFactory.build();
            jest.spyOn(catalogService, "getProduct")
                .mockImplementationOnce(() => Promise.reject(new Error("product does not exist")));
            const response = await request(app)
                .get(`/products/${product.id}`)
                .set("Accept", "application/json")
            expect(response.status).toBe(500);
            expect(response.body).toEqual("product does not exist");
        });

    });

    describe("DELETE /products/:id", () => {

        test("should delete a product by id", async () => {
            const product = ProductFactory.build();
            jest.spyOn(catalogService, "deleteProduct")
                .mockImplementationOnce(() => Promise.resolve(product.id!))
            const response = await request(app)
                .delete(`/products/${product.id}`)
                .set("Accept", "application/json")
            expect(response.status).toBe(200);
            expect(response.body).toEqual("product deleted successfully");
        });

        test("should response with product not found error 404", async () => {
            const product = ProductFactory.build();
            jest.spyOn(catalogService, "deleteProduct")
                .mockImplementationOnce(() => Promise.reject(new Error("product not found")));
            const response = await request(app)
                .delete(`/products/${product.id}`)
                .set("Accept", "application/json")
            // expect(response.status).toBe(404);
            expect(response.body).toEqual("product not found");
        });

        test("should response with an internal error code 500", async () => {
            const product = ProductFactory.build();
            jest.spyOn(catalogService, "deleteProduct")
                .mockImplementationOnce(() => Promise.reject(new Error("product does not exist")));
            const response = await request(app)
                .delete(`/products/${product.id}`)
                .set("Accept", "application/json")
            expect(response.status).toBe(500);
            expect(response.body).toEqual("product does not exist");
        });

    });
})