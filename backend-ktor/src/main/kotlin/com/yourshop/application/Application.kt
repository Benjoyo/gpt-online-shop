package com.yourshop.application

import com.fasterxml.jackson.databind.*
import com.yourshop.application.auth.*
import com.yourshop.application.cart.*
import com.yourshop.application.order.*
import com.yourshop.application.product.*
import com.yourshop.application.user.*
import com.yourshop.infrastructure.database.*
import com.yourshop.infrastructure.database.DatabaseFactory.createDatabaseIfNotExists
import com.yourshop.infrastructure.util.*
import io.ktor.http.*
import io.ktor.serialization.jackson.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.routing.*
import kotlinx.coroutines.*

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0", module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    createDatabaseIfNotExists("shopdb")
    DatabaseFactory.connect()

    migrate()

    install(ContentNegotiation) {
        jackson {
            configure(SerializationFeature.INDENT_OUTPUT, true)
        }
    }

    install(CORS) {
        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Delete)
        allowHeader(HttpHeaders.AccessControlAllowOrigin)
        allowHeader(HttpHeaders.ContentType)
        allowOrigins { true }
        allowSameOrigin = true
        allowHeaders { true }
        allowCredentials = true
        allowNonSimpleContentTypes = true
        anyHost() // Use this to allow requests from localhost
        // Or you can specify the hosts you want to allow
        // host("localhost:3000", schemes = listOf("http"))
    }

    val userRepository = UserRepository()

    install(Authentication) {
        jwt {
            realm = "ktor.io"
            verifier(JwtUtils.getJwtVerifier())
            validate { credential ->
                val principal = JwtUtils.validateAccessToken(credential.payload)
                if (principal != null) {
                    JWTPrincipal(principal.payload)
                } else {
                    null
                }
            }
        }
        jwt("AdminAuth") {
            realm = "yourshop-admin"
            verifier(JwtUtils.getJwtVerifier())
            validate { credential ->
                val userId = credential.payload.subject.toInt()
                val user = userRepository.findById(userId)

                if (user != null && user.username == "admin") {
                    JWTPrincipal(credential.payload)
                } else {
                    null
                }
            }
        }
    }

    val authService = AuthService(userRepository)
    val userService = UserService(userRepository)
    val productRepository = ProductRepository()
    val productService = ProductService(ProductRepository())
    val cartRepository = CartRepository()
    val cartService = CartService(cartRepository, productRepository)
    val orderRepository = OrderRepository(cartRepository)
    val orderService = OrderService(orderRepository, cartRepository)

    routing {
        authController(authService)
        userController(userService)
        productController(productService)
        cartController(cartService)
        orderController(orderService)
    }


}
