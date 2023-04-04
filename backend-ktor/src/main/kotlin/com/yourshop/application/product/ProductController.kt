package com.yourshop.application.product

import com.yourshop.domain.model.*
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.math.*
import kotlin.text.get

fun Route.productController(productService: ProductService) {
    route("/api/products") {
        get {
            val page = call.request.queryParameters["page"]?.toIntOrNull() ?: 0
            val limit = call.request.queryParameters["limit"]?.toIntOrNull() ?: 10
            val products = productService.getProducts(page, limit)
            call.respond(HttpStatusCode.OK, products.map { it.toProductDTO() })
        }
        get("/{productId}") {
            val productId = call.parameters["productId"]?.toIntOrNull()
            if (productId != null) {
                val product = productService.getProduct(productId)
                if (product != null) {
                    call.respond(HttpStatusCode.OK, product.toProductDTO())
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            } else {
                call.respond(HttpStatusCode.BadRequest, "Invalid product ID")
            }
        }
    }
}

data class ProductDTO(
    val id: Int,
    val name: String,
    val description: String,
    val imageUrl: String,
    val price: BigDecimal
)

fun Product.toProductDTO() = ProductDTO(
    id = this.id.value,
    name = this.name,
    description = this.description,
    imageUrl = this.imageUrl,
    price = this.price
)
