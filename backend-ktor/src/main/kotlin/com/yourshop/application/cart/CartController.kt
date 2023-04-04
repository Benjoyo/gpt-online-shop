package com.yourshop.application.cart

import com.yourshop.application.product.*
import com.yourshop.domain.model.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlin.text.get

fun Route.cartController(cartService: CartService) {
    authenticate {
        route("/api/cart") {
            get {
                val userId = call.authentication.principal<JWTPrincipal>()!!.payload.subject.toInt()
                val cartItems = cartService.getCartItems(userId)
                call.respond(cartItems)
            }

            post("/items") {
                val userId = call.authentication.principal<JWTPrincipal>()!!.payload.subject.toInt()
                val cartItemRequest = call.receive<CartItemRequest>()
                val cartItemDTO = cartService.addOrUpdateCartItem(userId, cartItemRequest.productId, cartItemRequest.quantity)
                if (cartItemDTO != null) {
                    call.respond(cartItemDTO)
                } else {
                    call.respond(HttpStatusCode.BadRequest, "Cannot add the product to the cart. The stock quantity is insufficient.")
                }
            }

            delete("/items/{itemId}") {
                val userId = call.authentication.principal<JWTPrincipal>()!!.payload.subject.toInt()
                val itemId = call.parameters["itemId"]?.toIntOrNull()
                if (itemId != null) {
                    cartService.removeCartItem(userId, itemId)
                    call.respond(HttpStatusCode.NoContent)
                } else {
                    call.respond(HttpStatusCode.BadRequest)
                }
            }

            post("/checkout") {
                val userId = call.authentication.principal<JWTPrincipal>()!!.payload.subject.toInt()
                val cartSummary = cartService.checkout(userId)
                val cartSummaryDTO = CartSummaryDTO(cartSummary.items, cartSummary.total)
                call.respond(cartSummaryDTO)
            }
        }
    }
}

data class CartItemRequest(
    val productId: Int,
    val quantity: Int
)

fun CartItem.toCartItemDTO(): CartItemDTO = CartItemDTO(id.value, product.toProductDTO(), quantity)

data class CartItemDTO(
    val id: Int,
    val product: ProductDTO,
    val quantity: Int
)

data class CartSummaryDTO(
    val items: List<CartItemDTO>,
    val total: Double
)