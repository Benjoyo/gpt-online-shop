package com.yourshop.infrastructure.database

import com.yourshop.application.product.*
import com.yourshop.application.user.*
import io.ktor.server.application.*
import io.ktor.util.*
import kotlinx.coroutines.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SchemaUtils.create
import org.jetbrains.exposed.sql.transactions.*
import org.jetbrains.exposed.sql.transactions.experimental.*

fun Application.migrate() {
    val userRepository = UserRepository()
    val productRepository = ProductRepository()

    transaction {
        create(Users, CreditCards, Addresses, Products, CartItems, Orders, OrderItems)
    }

    runBlocking {
        val adminUser = userRepository.findByUsername("admin")
        if (adminUser == null) {
            userRepository.create("admin", "admin@example.com", "admin")
        }

        val existingProducts = productRepository.getProducts(0, 15).size
        if (existingProducts == 0) {
            val imageUrl = "https://via.placeholder.com/250x250"
            productRepository.create("Product 1", "A great product", imageUrl, 19.99, 10)
            productRepository.create("Product 2", "A fantastic product", imageUrl, 29.99, 20)
            productRepository.create("Product 3", "An amazing product", imageUrl, 39.99, 15)
            productRepository.create("Product 4", "A high-quality product", imageUrl, 49.99, 8)
            productRepository.create("Product 5", "A top-notch product", imageUrl, 59.99, 5)
            productRepository.create("Product 6", "A superior product", imageUrl, 69.99, 12)
            productRepository.create("Product 7", "A premium product", imageUrl, 79.99, 18)
            productRepository.create("Product 8", "An outstanding product", imageUrl, 89.99, 10)
            productRepository.create("Product 9", "A remarkable product", imageUrl, 99.99, 3)
            productRepository.create("Product 10", "An extraordinary product", imageUrl, 109.99, 9)
            productRepository.create("Product 11", "An impressive product", imageUrl, 119.99, 15)
            productRepository.create("Product 12", "A superb product", imageUrl, 129.99, 30)
            productRepository.create("Product 13", "An excellent product", imageUrl, 139.99, 20)
            productRepository.create("Product 14", "A splendid product", imageUrl, 149.99, 25)
            productRepository.create("Product 15", "An exceptional product", imageUrl, 159.99, 5)
        }
    }
}
