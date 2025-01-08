import { useProductStore } from "@/stores/productStore";
import { Category, Product } from "@/api/interfaces";
import { storeToRefs } from "pinia";

export const useProduct = () => {
  const productStore = useProductStore();

  const { products, currentCart, categories } = storeToRefs(productStore);

  // Functions
  const setProducts = (products: Product[]) => {
    productStore.setProducts(products);
  }

  const setCategories = (categories: Category[]) => {
    productStore.setCategories(categories);
  }

  const getProductById = (id: string): Product | undefined => {
    return products.value.find(product => product.id === id);
  }

  const searchProductByCodeOrName = (search: string): Product[] | null => {
    if (!search || search === '') return null
    const foundProducts = products.value.filter(product => 
      product.name.toLowerCase().includes(search.toLowerCase()) || 
      product.id.toLowerCase().includes(search.toLowerCase())
    );
    if (foundProducts.length === 0) {
      return null;
    }
    return foundProducts;
  }

  const addProductToCart = (product: Product, quantity = 1) => {
    const productCart = {
      ...product,
      quantity,
    }
    productStore.addCart(productCart);
  }

  const removeProductFromCart = (productId: string) => {
    productStore.removeCart(productId);
  }

  const editProductQuantityInCart = (productId: string, quantity: number) => {
    productStore.editQuantityCart(productId, quantity);
  }

  return {
    products,
    setProducts,
    getProductById,
    searchProductByCodeOrName,

    currentCart,
    addProductToCart,
    removeProductFromCart,
    editProductQuantityInCart,

    categories,
    setCategories,
  }
}