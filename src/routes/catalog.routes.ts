import { Router } from 'express';
import { CatalogController } from '../controllers/catalog.controllers';
import { CatalogRepository } from '../repository/catalog.repository';
import { CatalogInteractor } from '../interactors/catalog.interactors';

const router = Router();
const catalogRepository = new CatalogRepository();
export const catalogInteractor = new CatalogInteractor(catalogRepository);
const catalogController = new CatalogController(catalogInteractor);

router.post('/products', catalogController.createProduct.bind(catalogController));
router.patch('/products/:id', catalogController.updateProduct.bind(catalogController));
router.get('/products', catalogController.getProducts.bind(catalogController));
router.get('/products/:id', catalogController.getProductById.bind(catalogController));
router.delete('/products/:id', catalogController.deleteProduct.bind(catalogController));

export default router;
