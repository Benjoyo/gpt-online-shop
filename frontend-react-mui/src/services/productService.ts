import api from "../utils/api";

export async function getProducts(page: number = 1, limit: number = 10) {
    const response = await api.get("/products", { params: { page, limit } });
    return response.data;
}

export async function getProductById(productId: number) {
    const response = await api.get(`/products/${productId}`);
    return response.data;
}


