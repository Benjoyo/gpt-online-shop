package com.yourshop.application.auth

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.authController(authService: AuthService) {
    route("/api/auth") {
        post("/login") {
            val loginRequest = call.receive<LoginRequest>()
            val token = authService.authenticate(loginRequest.username, loginRequest.password)
            if (token != null) {
                call.respond(mapOf("access_token" to token))
            } else {
                call.respond(HttpStatusCode.Unauthorized)
            }
        }
    }

}

data class LoginRequest(
    val username: String,
    val password: String
)

