package com.yourshop.application.order

import com.yourshop.application.cart.*
import com.yourshop.domain.model.*
import com.yourshop.domain.value.*
import com.yourshop.infrastructure.database.*
import kotlinx.coroutines.*
import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.sql.*
import java.time.*

class OrderRepository(private val cartRepository: CartRepository) {

    fun createOrder(userId: Int, paymentMethodId: Int, shippingAddressId: Int): Order {
            val user = User[userId]
            val paymentMethod = CreditCard[paymentMethodId]
            val shippingAddress = Address[shippingAddressId]
            val cartItems = cartRepository.getCartItems(userId)

            val order = Order.new {
                this.user = user
                this.paymentMethod = paymentMethod
                this.shippingAddress = shippingAddress
                status = OrderStatus.PENDING
                createdAt = Instant.now()
                updatedAt = Instant.now()
            }

            cartItems.forEach { cartItem ->
                OrderItem.new {
                    this.order = order
                    this.product = cartItem.product
                    this.quantity = cartItem.quantity
                }
            }

        return order
    }

    fun getUserOrders(userId: Int): List<Order> {
        return Orders
                .selectAll()
                .andWhere { Orders.userId eq userId }
                .map { rowToOrder(it) }
    }

    fun getAllOrders(): List<Order> {
        return Orders.selectAll().map { rowToOrder(it) }
    }

    fun markOrderAsShipped(orderId: Int): Order? {
        val order = Order.findById(orderId)
        if (order != null) {
            order.status = OrderStatus.SHIPPED
            order.updatedAt = Instant.now()
        }
        return order
    }

    private fun rowToOrder(row: ResultRow): Order {
        val order = Order.wrapRow(row)
        order.load(Order::user, Order::paymentMethod, Order::shippingAddress, Order::items)
        return order
    }
}

