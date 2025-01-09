import prisma from '../db';
import { Product } from '@prisma/client';

export const createProduct = async (productData: Product) => {
  try {
    const newProduct = await prisma.product.create({
      data: {
        name: productData.name,
        category: productData.category,
        quantity: productData.quantity,
      },
    });

    return newProduct;
  } catch (error: any) {
    console.error('Error creating product:', error);
    throw new Error(`Failed to create product: ${error.message || error}`);
  }
};

export const getAllProducts = async () => {
  try {
    const products = await prisma.product.findMany();
    return products;
  } catch (error: any) {
    console.error('Error fetching products:', error);
    throw new Error(`Failed to fetch products: ${error.message || error}`);
  }
};

export const updateProductById = async (
  productId: string,
  productData: Partial<Product>
) => {
  try {
    const updateData: Partial<Product> = {
      name: productData.name,
      category: productData.category,
      quantity: productData.quantity,
    };

    Object.keys(updateData).forEach(
      (key) =>
        updateData[key as keyof Product] === undefined &&
        delete updateData[key as keyof Product]
    );

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    return updatedProduct;
  } catch (error: any) {
    console.error('Error updating product:', error);
    throw new Error(`Failed to update product: ${error.message || error}`);
  }
};

export const deleteProductById = async (productId: string) => {
  try {
    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
    });

    return deletedProduct;
  } catch (error: any) {
    console.error('Error deleting product:', error);
    throw new Error(`Failed to delete product: ${error.message || error}`);
  }
};
