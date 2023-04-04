package com.yourshop.application.user

import com.yourshop.domain.model.*
import com.yourshop.domain.value.*
import com.yourshop.infrastructure.database.*
import io.ktor.server.plugins.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.*

class UserRepository {

    suspend fun findById(id: Int): User? =
        newSuspendedTransaction {
            User.findById(id)
        }

    suspend fun findByUsername(username: String): User? =
        newSuspendedTransaction {
            User.find { Users.username eq username }.singleOrNull()
        }

    suspend fun create(username: String, email: String, password: String): User =
        newSuspendedTransaction {
            User.new {
                this.username = username
                this.email = email
                this.password = password
            }
        }

    suspend fun addCreditCard(userId: Int, cardNumber: String, expiryMonth: Int, expiryYear: Int): Pair<CreditCard, User> {
        lateinit var card: CreditCard
        lateinit var user: User
        newSuspendedTransaction {
            user = User.findById(userId) ?: throw NotFoundException("User not found")
            card = CreditCard.new {
                this.user = user
                this.cardNumber = cardNumber
                this.expiryMonth = expiryMonth
                this.expiryYear = expiryYear
            }
        }
        return Pair(card, user)
    }

    suspend fun addAddress(userId: Int, street: String, city: String, state: String, country: String, postalCode: String): Pair<Address, User> {
        lateinit var address: Address
        lateinit var user: User
        newSuspendedTransaction {
            user = User.findById(userId) ?: throw NotFoundException("User not found")
            address = Address.new {
                this.user = user
                this.street = street
                this.city = city
                this.state = state
                this.country = country
                this.postalCode = postalCode
            }
        }
        return Pair(address, user)
    }

    suspend fun getBillingInfo(userId: Int): BillingInfoDTO {
        lateinit var addresses: List<Address>
        lateinit var cards: List<CreditCard>
        lateinit var user: User

        newSuspendedTransaction {
            user = User.findById(userId) ?: throw NotFoundException("User not found")
            addresses = Address.find { Addresses.userId eq userId }.toList()
            cards = CreditCard.find { CreditCards.userId eq userId }.toList()
        }

        return BillingInfoDTO(
            addresses = addresses.map { it.toAddressDTO(user) },
            cards = cards.map { it.toCardDTO(user) }
        )
    }

}

data class BillingInfoDTO(
    val addresses: List<AddressDTO>,
    val cards: List<CardDTO>
)
