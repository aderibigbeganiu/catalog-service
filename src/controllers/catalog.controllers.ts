import { Request, Response } from "express";
import { CreateProductRequest, UpdateProductRequest } from "../dto/product.dto";
import { RequestValidator } from "../utils/requestValidator";
import { CatalogInteractor } from "../useCases/catalog.interactors";


export class CatalogController {
    private readonly catalogInteractor: CatalogInteractor;
    constructor(catalogInteractor: CatalogInteractor) {
        this.catalogInteractor = catalogInteractor;
    }

    async createProduct(req: Request, res: Response) {
        try {
            const { errors, input } = await RequestValidator(CreateProductRequest, req.body)
            if (errors) {
                res.status(400).json(errors);
                return;
            }
            const data = await this.catalogInteractor.createProduct(input);
            res.status(201).json(data);
            return;
        } catch (error) {
            const err = error as Error;
            res.status(500).json(err.message);
            // next(error);
        }
    }

    async updateProduct(req: Request, res: Response) {
        try {
            const { errors, input } = await RequestValidator(UpdateProductRequest, req.body)
            if (errors) {
                res.status(400).json(errors);
                return;
            }
            const data = await this.catalogInteractor.updateProduct({ ...input, id: req.params.id });
            res.status(200).json(data);
            return;
        } catch (error) {
            const err = error as Error;
            res.status(500).json(err.message);
            // next(error);
        }
    }

    async getProducts(req: Request, res: Response) {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = parseInt(req.query.offset as string) || 0;
            const data = await this.catalogInteractor.getProducts(limit, offset);
            res.status(200).json(data);
            return;
        } catch (error) {
            const err = error as Error;
            res.status(500).json(err.message);
            // next(error);
        }
    }

    async getProductById(req: Request, res: Response) {
        try {
            const data = await this.catalogInteractor.getProduct(req.params.id);
            if (!data.id) {
                res.status(404).json("product not found");
                return;
            }
            res.status(200).json(data);
            return;
        } catch (error) {
            const err = error as Error;
            res.status(500).json(err.message);
            // next(error);
        }
    }

    async deleteProduct(req: Request, res: Response) {
        try {
            const data = await this.catalogInteractor.deleteProduct(req.params.id);
            if (!data) {
                res.status(404).json("product not found");
                return;
            }
            res.status(200).json("product deleted successfully");
            return;
        } catch (error) {
            const err = error as Error;
            res.status(500).json(err.message);
            // next(error);
        }
    }
}