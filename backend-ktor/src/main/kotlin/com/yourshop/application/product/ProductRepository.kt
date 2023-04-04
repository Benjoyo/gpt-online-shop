package com.yourshop.application.product

import com.yourshop.domain.model.*
import com.yourshop.infrastructure.database.*
import org.jetbrains.exposed.sql.*

class ProductRepository {

    suspend fun create(
        name: String,
        description: String,
        imageUrl: String,
        price: Double,
        stockQuantity: Int
    ): Product {
        val productId = newSuspendedTransaction {
            Products.insertAndGetId { products ->
                products[Products.name] = name
                products[Products.description] = description
                products[Products.imageUrl] = imageUrl
                products[Products.price] = price.toBigDecimal()
                products[Products.stockQuantity] = stockQuantity
            }
        }

        return newSuspendedTransaction {
            Product[productId]
        }
    }

    suspend fun getProducts(page: Int, limit: Int): List<Product> = newSuspendedTransaction {
        Product.all()
            .orderBy(Products.id to SortOrder.ASC)
            .limit(limit, offset = (page * limit).toLong())
            .toList()
    }

    fun findById(productId: Int): Product? {
        return Product.findById(productId)
    }

    fun updateStockQuantity(productId: Int, newQuantity: Int) {
        val product = Product[productId]
        product.stockQuantity = newQuantity
    }

    fun canAddToCart(productId: Int, userId: Int, requestedQuantity: Int): Boolean {
        val product = Product.findById(productId) ?: return false

        val existingCartItem = CartItem.find { (CartItems.userId eq userId) and (CartItems.productId eq productId) }.firstOrNull()

        return if (existingCartItem != null) {
            val availableQuantity = product.stockQuantity + existingCartItem.quantity
            requestedQuantity in 1..availableQuantity
        } else {
            requestedQuantity in 1..product.stockQuantity
        }
    }
}
