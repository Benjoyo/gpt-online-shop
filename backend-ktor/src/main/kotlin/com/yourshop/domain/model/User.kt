package com.yourshop.domain.model

import com.yourshop.application.user.*
import com.yourshop.infrastructure.database.*
import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.*

class User(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<User>(Users)

    var username by Users.username
    var email by Users.email
    var password by Users.password
}
