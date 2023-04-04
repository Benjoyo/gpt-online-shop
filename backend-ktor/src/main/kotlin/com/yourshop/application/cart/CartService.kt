package com.yourshop.application.cart

import com.yourshop.application.product.*
import com.yourshop.infrastructure.database.*

class CartService(private val cartRepository: CartRepository, private val productRepository: ProductRepository) {

    suspend fun getCartItems(userId: Int): List<CartItemDTO> {
        return newSuspendedTransaction { cartRepository.getCartItems(userId).map { it.toCartItemDTO() } }
    }

    suspend fun addOrUpdateCartItem(userId: Int, productId: Int, quantity: Int): CartItemDTO? {
        return newSuspendedTransaction {
            if (!productRepository.canAddToCart(productId, userId, quantity)) {
                null
            } else {
                val (cartItemDTO, quantityDifference) = cartRepository.addOrUpdateCartItem(userId, productId, quantity)
                val product = productRepository.findById(productId)
                product?.let {
                    productRepository.updateStockQuantity(productId, it.stockQuantity - quantityDifference)
                }
                cartItemDTO
            }
        }
    }

    suspend fun removeCartItem(userId: Int, itemId: Int) {
        newSuspendedTransaction {
            val cartItem = cartRepository.removeCartItem(userId, itemId)
            cartItem?.let {
                productRepository.updateStockQuantity(it.product.id.value, it.product.stockQuantity + it.quantity)
            }
        }
    }

    suspend fun checkout(userId: Int): CartSummaryDTO {
        return newSuspendedTransaction {
            val cartItems = cartRepository.getCartItems(userId).map { it.toCartItemDTO() }
            CartSummaryDTO(cartItems, cartItems.sumOf { it.product.price * it.quantity.toBigDecimal() }.toDouble())
        }
    }
}
