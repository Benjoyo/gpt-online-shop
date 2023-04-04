package com.yourshop.domain.model

import com.yourshop.infrastructure.database.*
import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.*

class CartItem(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<CartItem>(CartItems)

    var user by User referencedOn CartItems.userId
    var product by Product referencedOn CartItems.productId
    var quantity by CartItems.quantity
}