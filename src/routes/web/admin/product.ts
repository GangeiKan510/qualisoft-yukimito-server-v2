import { Request, Response, Router } from 'express';
import {
  createProduct,
  getAllProducts,
  updateProductById,
  deleteProductById,
} from '../../../controllers/admin/product';

const router = Router();

router.post('/create-product', async (req: Request, res: Response) => {
  try {
    const productData = req.body;

    const newProduct = await createProduct(productData);

    if (!newProduct) {
      return res.status(400).json({ error: 'Failed to create product.' });
    }

    res.status(201).json(newProduct);
  } catch (error: any) {
    console.error('Error creating product:', error.message || error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

router.get('/all-products', async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error.message || error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

router.post('/update-product', async (req: Request, res: Response) => {
  const { id, ...productData } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    const updatedProduct = await updateProductById(id, productData);

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ error: 'Product not found or not updated' });
    }

    res.status(200).json(updatedProduct);
  } catch (error: any) {
    console.error('Error updating product:', error.message || error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

router.delete('/delete-product', async (req: Request, res: Response) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    const deletedProduct = await deleteProductById(id as string);

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ error: 'Product not found or already deleted' });
    }

    res.status(200).json(deletedProduct);
  } catch (error: any) {
    console.error('Error deleting product:', error.message || error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

export default router;
