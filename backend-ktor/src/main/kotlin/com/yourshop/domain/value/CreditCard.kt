package com.yourshop.domain.value

import com.yourshop.domain.model.*
import com.yourshop.infrastructure.database.*
import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.*

class CreditCard(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<CreditCard>(CreditCards)

    var user by User referencedOn CreditCards.userId
    var cardNumber by CreditCards.cardNumber
    var expiryMonth by CreditCards.expiryMonth
    var expiryYear by CreditCards.expiryYear
}
