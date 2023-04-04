package com.yourshop.application.product

import com.yourshop.domain.model.*
import com.yourshop.infrastructure.database.*

class ProductService(private val productRepository: ProductRepository) {

    suspend fun getProducts(page: Int, limit: Int): List<Product> {
        return productRepository.getProducts(page, limit)
    }

    suspend fun getProduct(productId: Int): Product? = newSuspendedTransaction {
        productRepository.findById(productId)
    }

}
