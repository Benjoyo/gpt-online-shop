package com.yourshop.domain.model

import com.yourshop.infrastructure.database.*
import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.*

class Product(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<Product>(Products)

    var name by Products.name
    var description by Products.description
    var imageUrl by Products.imageUrl
    var price by Products.price
    var stockQuantity by Products.stockQuantity
}
