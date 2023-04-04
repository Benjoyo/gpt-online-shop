package com.yourshop.application.order

import com.yourshop.application.cart.*
import com.yourshop.application.product.*
import com.yourshop.application.user.*
import com.yourshop.domain.model.*
import com.yourshop.infrastructure.database.*

class OrderService(private val orderRepository: OrderRepository, private val cartRepository: CartRepository) {

    suspend fun createOrder(userId: Int, paymentMethodId: Int, shippingAddressId: Int): OrderDTO {
        return newSuspendedTransaction {
            orderRepository.createOrder(userId, paymentMethodId, shippingAddressId).toOrderDTO().also {
                cartRepository.clearCart(userId)
            }
        }
    }

    suspend fun getUserOrders(userId: Int): List<OrderDTO> {
        return newSuspendedTransaction {
            orderRepository.getUserOrders(userId).map { it.toOrderDTO() }
        }
    }

    suspend fun getAllOrders(): List<OrderDTO> {
        return newSuspendedTransaction {
            orderRepository.getAllOrders().map { it.toOrderDTO() }
        }
    }

    suspend fun markOrderAsShipped(orderId: Int): OrderDTO? {
        return newSuspendedTransaction {
            orderRepository.markOrderAsShipped(orderId)?.toOrderDTO()
        }
    }
}

fun Order.toOrderDTO(): OrderDTO {
    val order = this
    val items = order.items.map { item ->
        OrderItemDTO(
            product = ProductDTO(
                id = item.product.id.value,
                name = item.product.name,
                description = item.product.description,
                imageUrl = item.product.imageUrl,
                price = item.product.price
            ),
            quantity = item.quantity
        )
    }

    return OrderDTO(
        id = order.id.value,
        userId = order.user.id.value,
        items = items,
        total = items.sumOf { it.product.price * it.quantity.toBigDecimal() }.toDouble(),
        paymentMethod = CardDTO(
            id = order.paymentMethod.id.value,
            userId = order.user.id.value,
            cardNumber = order.paymentMethod.cardNumber,
            expiryMonth = order.paymentMethod.expiryMonth,
            expiryYear = order.paymentMethod.expiryYear
        ),
        shippingAddress = AddressDTO(
            id = order.shippingAddress.id.value,
            userId = order.user.id.value,
            street = order.shippingAddress.street,
            city = order.shippingAddress.city,
            state = order.shippingAddress.state,
            country = order.shippingAddress.country,
            postalCode = order.shippingAddress.postalCode
        ),
        status = order.status,
        createdAt = order.createdAt.toString(),
        updatedAt = order.updatedAt.toString()
    )
}

