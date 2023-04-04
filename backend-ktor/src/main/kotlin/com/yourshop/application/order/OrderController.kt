package com.yourshop.application.order

import com.yourshop.application.cart.*
import com.yourshop.application.product.*
import com.yourshop.application.user.*
import com.yourshop.domain.model.*
import com.yourshop.infrastructure.database.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.plugins.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlin.text.get

fun Route.orderController(orderService: OrderService) {
    authenticate {
        route("/api/orders") {
            post {
                val orderRequest = call.receive<OrderRequest>()
                val userId = call.authentication.principal<JWTPrincipal>()!!.payload.subject.toInt()
                val order = orderService.createOrder(userId, orderRequest.paymentMethodId, orderRequest.shippingAddressId)
                call.respond(HttpStatusCode.Created, order)
            }

            get {
                val userId = call.authentication.principal<JWTPrincipal>()!!.payload.subject.toInt()
                val orders = orderService.getUserOrders(userId)
                call.respond(orders)
            }
        }
    }
    authenticate("AdminAuth") {
        route("/api/admin/orders") {
            get {
                val orders = orderService.getAllOrders()
                call.respond(orders)
            }

            patch("/{orderId}/mark-shipped") {
                val orderId = call.parameters["orderId"]?.toIntOrNull()
                if (orderId != null) {
                    val updatedOrder = orderService.markOrderAsShipped(orderId)
                    if (updatedOrder != null) {
                        call.respond(HttpStatusCode.OK, updatedOrder)
                    } else {
                        call.respond(HttpStatusCode.NotFound, "Order not found")
                    }
                } else {
                    call.respond(HttpStatusCode.BadRequest, "Invalid order ID")
                }
            }
        }
    }
}

data class OrderRequest(
    val userId: Int,
    val paymentMethodId: Int,
    val shippingAddressId: Int
)

data class OrderDTO(
    val id: Int,
    val userId: Int,
    val items: List<OrderItemDTO>,
    val total: Double,
    val paymentMethod: CardDTO,
    val shippingAddress: AddressDTO,
    val status: OrderStatus,
    val createdAt: String,
    val updatedAt: String
)

data class OrderItemDTO(
    val product: ProductDTO,
    val quantity: Int
)