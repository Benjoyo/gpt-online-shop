package com.yourshop.infrastructure.database

import com.typesafe.config.*
import com.yourshop.domain.model.*
import io.ktor.server.application.*
import io.ktor.server.config.*
import io.ktor.util.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.javatime.*
import org.jetbrains.exposed.sql.transactions.experimental.*
import org.jetbrains.exposed.sql.transactions.transaction
import java.sql.*

object DatabaseFactory {
    fun connect() {
        val config = HoconApplicationConfig(ConfigFactory.load())
        val driver = config.property("ktor.database.driver").getString()
        val url = config.property("ktor.database.url").getString()
        val user = config.property("ktor.database.user").getString()
        val password = config.property("ktor.database.password").getString()

        Database.connect(
            url = url,
            driver = driver,
            user = user,
            password = password
        )
    }

    val appConfig = HoconApplicationConfig(ConfigFactory.load())

    fun createDatabaseIfNotExists(databaseName: String) {
        val config = HoconApplicationConfig(ConfigFactory.load())
        val jdbcUrl = config.property("ktor.database.url").getString()
        val user = config.property("ktor.database.user").getString()
        val password = config.property("ktor.database.password").getString()

        val withoutDbUrl = jdbcUrl.substringBeforeLast("/") + "/postgres"

        DriverManager.getConnection(withoutDbUrl, user, password).use { connection ->
            connection.autoCommit = true
            connection.createStatement().use { statement ->
                val resultSet = statement.executeQuery("SELECT 1 FROM pg_database WHERE datname = '$databaseName'")
                if (!resultSet.next()) {
                    statement.executeUpdate("CREATE DATABASE $databaseName")
                }
            }
        }
    }
}



suspend fun <T> newSuspendedTransaction(block: Transaction.() -> T): T =
    withContext(Dispatchers.IO) {
        transaction {
            block()
        }
    }

object Users : IntIdTable() {
    val username = varchar("username", 255).uniqueIndex()
    val email = varchar("email", 255).uniqueIndex()
    val password = varchar("password", 255)
}

object CreditCards : IntIdTable() {
    val userId = reference("user_id", Users)
    val cardNumber = varchar("card_number", 255)
    val expiryMonth = integer("expiry_month")
    val expiryYear = integer("expiry_year")
}

object Addresses : IntIdTable() {
    val userId = reference("user_id", Users)
    val street = varchar("street", 255)
    val city = varchar("city", 255)
    val state = varchar("state", 255)
    val country = varchar("country", 255)
    val postalCode = varchar("postal_code", 255)
}

object Products : IntIdTable() {
    val name = varchar("name", 255)
    val description = text("description")
    val imageUrl = varchar("image_url", 255)
    val price = decimal("price", 12, 2)
    val stockQuantity = integer("stock_quantity")
}

object CartItems : IntIdTable() {
    val userId = reference("user_id", Users)
    val productId = reference("product_id", Products)
    val quantity = integer("quantity")
}

object Orders : IntIdTable() {
    val userId = reference("user_id", Users)
    val paymentMethodId = reference("payment_method_id", CreditCards)
    val shippingAddressId = reference("shipping_address_id", Addresses)
    val status = enumeration("status", OrderStatus::class)
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
}

object OrderItems : IntIdTable() {
    val orderId = reference("order_id", Orders)
    val productId = reference("product_id", Products)
    val quantity = integer("quantity")
}
