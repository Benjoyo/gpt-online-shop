package com.yourshop.domain.model

import com.yourshop.domain.value.*
import com.yourshop.infrastructure.database.*
import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.*
import org.jetbrains.exposed.sql.javatime.*


class Order(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<Order>(Orders)

    var user by User referencedOn Orders.userId
    var paymentMethod by CreditCard referencedOn Orders.paymentMethodId
    var shippingAddress by Address referencedOn Orders.shippingAddressId
    var status by Orders.status
    var createdAt by Orders.createdAt
    var updatedAt by Orders.updatedAt

    val items by OrderItem referrersOn OrderItems.orderId
}

enum class OrderStatus {
    PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELED
}

class OrderItem(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<OrderItem>(OrderItems)

    var order by Order referencedOn OrderItems.orderId
    var product by Product referencedOn OrderItems.productId
    var quantity by OrderItems.quantity
}
