package com.yourshop.application.cart

import com.yourshop.domain.model.*
import com.yourshop.infrastructure.database.*
import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.sql.*

class CartRepository {

     fun getCartItems(userId: Int): List<CartItem> =
        CartItem.find { CartItems.userId eq userId }.toList()

    fun addOrUpdateCartItem(userId: Int, productId: Int, quantity: Int): Pair<CartItemDTO, Int> {
        val user = User[userId]
        val product = Product[productId]
        val existingCartItem = CartItem.find { (CartItems.userId eq userId) and (CartItems.productId eq productId) }.firstOrNull()

        val cartItem = if (existingCartItem != null) {
            val quantityDifference = quantity - existingCartItem.quantity
            existingCartItem.quantity = quantity
            existingCartItem to quantityDifference
        } else {
            val newCartItem = CartItem.new {
                this.user = user
                this.product = product
                this.quantity = quantity
            }
            newCartItem to quantity
        }

        return cartItem.first.toCartItemDTO() to cartItem.second
    }

    fun removeCartItem(userId: Int, itemId: Int): CartItem? {
        val cartItem = CartItem.find { (CartItems.id eq itemId) and (CartItems.userId eq userId) }.singleOrNull()
        cartItem?.delete()
        return cartItem
    }

    fun clearCart(userId: Int) = CartItem.find { CartItems.userId eq userId }.forEach { it.delete() }

}
