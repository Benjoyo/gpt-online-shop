package com.yourshop.application.user

import com.yourshop.domain.model.*
import com.yourshop.domain.value.*

class UserService(private val userRepository: UserRepository) {

    suspend fun getUser(userId: Int): User? {
        return userRepository.findById(userId)
    }

    suspend fun register(username: String, email: String, password: String): User {
        return userRepository.create(username, email, password)
    }

    suspend fun addCreditCard(userId: Int, cardNumber: String, expiryMonth: Int, expiryYear: Int): Pair<CreditCard, User> {
        return userRepository.addCreditCard(userId, cardNumber, expiryMonth, expiryYear)
    }

    suspend fun addAddress(userId: Int, street: String, city: String, state: String, country: String, postalCode: String): Pair<Address, User> {
        return userRepository.addAddress(userId, street, city, state, country, postalCode)
    }

    suspend fun getBillingInfo(userId: Int): BillingInfoDTO {
        return userRepository.getBillingInfo(userId)
    }

}
