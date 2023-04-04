package com.yourshop.application.user

import com.yourshop.domain.model.*
import com.yourshop.domain.value.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.userController(userService: UserService) {

    route("/api/users") {
        post {
            val registerRequest = call.receive<RegisterRequest>()
            val user = userService.register(
                registerRequest.username,
                registerRequest.email,
                registerRequest.password
            )
            call.respond(HttpStatusCode.Created, user.toUserDTO())
        }
    }

    route("/api/users") {
        authenticate {
            get("/me") {
                val userId = call.authentication.principal<JWTPrincipal>()!!.payload.subject.toInt()
                val user = userService.getUser(userId)
                if (user != null) {
                    call.respond(user.toUserDTO())
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            }
        }
    }

    route("/api/users/me") {
        authenticate {
            post("/cards") {
                val userId = call.authentication.principal<JWTPrincipal>()!!.payload.subject.toInt()
                val cardRequest = call.receive<CardRequest>()
                val (card, user) = userService.addCreditCard(
                    userId,
                    cardRequest.cardNumber,
                    cardRequest.expiryMonth,
                    cardRequest.expiryYear
                )
                call.respond(HttpStatusCode.Created, card.toCardDTO(user))
            }
        }
    }

    route("/api/users/me") {
        authenticate {
            post("/addresses") {
                val userId = call.authentication.principal<JWTPrincipal>()!!.payload.subject.toInt()
                val addressRequest = call.receive<AddressRequest>()
                val (address, user) = userService.addAddress(
                    userId,
                    addressRequest.street,
                    addressRequest.city,
                    addressRequest.state,
                    addressRequest.country,
                    addressRequest.postalCode
                )
                call.respond(HttpStatusCode.Created, address.toAddressDTO(user))
            }
        }
    }

    route("/api/users/me") {
        authenticate {
            get("/billing") {
                val userId = call.authentication.principal<JWTPrincipal>()!!.payload.subject.toInt()
                val billingInfo = userService.getBillingInfo(userId)
                call.respond(billingInfo)
            }
        }
    }

}

data class RegisterRequest(
    val username: String,
    val email: String,
    val password: String
)

data class CardRequest(
    val cardNumber: String,
    val expiryMonth: Int,
    val expiryYear: Int,
    val cvv: String
)

data class AddressRequest(
    val street: String,
    val city: String,
    val state: String,
    val country: String,
    val postalCode: String
)

data class CardDTO(
    val id: Int,
    val userId: Int,
    val cardNumber: String,
    val expiryMonth: Int,
    val expiryYear: Int
)

data class AddressDTO(
    val id: Int,
    val userId: Int,
    val street: String,
    val city: String,
    val state: String,
    val country: String,
    val postalCode: String
)

data class UserDTO(
    val id: Int,
    val username: String,
    val email: String
)

fun User.toUserDTO(): UserDTO {
    return UserDTO(
        id = this.id.value,
        username = this.username,
        email = this.email
    )
}

fun CreditCard.toCardDTO(user: User) = CardDTO(
    id = this.id.value,
    userId = user.id.value,
    cardNumber = this.cardNumber,
    expiryMonth = this.expiryMonth,
    expiryYear = this.expiryYear
)

fun Address.toAddressDTO(user: User) = AddressDTO(
    id = this.id.value,
    userId = user.id.value,
    street = this.street,
    city = this.city,
    state = this.state,
    country = this.country,
    postalCode = this.postalCode
)