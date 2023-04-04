package com.yourshop.domain.value

import com.yourshop.domain.model.*
import com.yourshop.infrastructure.database.*
import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.*

class Address(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<Address>(Addresses)

    var user by User referencedOn Addresses.userId
    var street by Addresses.street
    var city by Addresses.city
    var state by Addresses.state
    var country by Addresses.country
    var postalCode by Addresses.postalCode
}
