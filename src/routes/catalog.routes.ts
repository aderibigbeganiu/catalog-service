import { Router } from 'express';
import { CatalogController } from '../controllers/catalog.controllers';
import { CatalogRepository } from '../repository/catalog.repository';
import { CatalogService } from '../services/catalog.services';

const router = Router();
const catalogRepository = new CatalogRepository();
export const catalogService = new CatalogService(catalogRepository);
const catalogController = new CatalogController(catalogService);

router.post('/products', catalogController.createProduct.bind(catalogController));
router.patch('/products/:id', catalogController.updateProduct.bind(catalogController));
router.get('/products', catalogController.getProducts.bind(catalogController));
router.get('/products/:id', catalogController.getProductById.bind(catalogController));
router.delete('/products/:id', catalogController.deleteProduct.bind(catalogController));

export default router;
