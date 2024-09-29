import { Request, Response, Router } from 'express';
import { CatalogService } from '../service/catalog.service';
import { CatalogRepository } from '../repository/catalog.repository';
import { RequestValidator } from '../utils/requestValidator';
import { CreateProductRequest, UpdateProductRequest } from '../dto/product.dto';

const router = Router();

export const catalogService = new CatalogService(new CatalogRepository());

router.post('/products', async (req: Request, res: Response) => {
    try {
        const { errors, input } = await RequestValidator(CreateProductRequest, req.body)
        if (errors) {
            res.status(400).json(errors);
            return;
        }
        const data = await catalogService.createProduct(input);
        res.status(201).json(data);
        return;
    } catch (error) {
        const err = error as Error;
        res.status(500).json(err.message);
        // next(error);
    }
});
router.patch('/products/:id', async (req, res) => {
    try {
        const { errors, input } = await RequestValidator(UpdateProductRequest, req.body)
        if (errors) {
            res.status(400).json(errors);
            return;
        }
        const data = await catalogService.updateProduct({...input, id: parseInt(req.params.id) });
        res.status(200).json(data);
        return;
    } catch (error) {
        const err = error as Error;
        res.status(500).json(err.message);
        // next(error);
    }
});
router.get('/products', async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = parseInt(req.query.offset as string) || 0;
        const data = await catalogService.getProducts(limit, offset);
        res.status(200).json(data);
        return;
    } catch (error) {
        const err = error as Error;
        res.status(500).json(err.message);
        // next(error);
    }
})
router.get('/products/:id', async (req: Request, res: Response) => {
    try {
        const data = await catalogService.getProduct(parseInt(req.params.id));
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
})
router.delete('/products/:id', async (req: Request, res: Response) => {
    try {
        const data = await catalogService.deleteProduct(parseInt(req.params.id));
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
})

export default router;
