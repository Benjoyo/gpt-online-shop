package com.yourshop.infrastructure.util

import com.auth0.jwt.*
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.*
import com.auth0.jwt.interfaces.*
import io.ktor.server.auth.jwt.JWTPrincipal
import java.util.*
import com.yourshop.domain.model.User
import java.time.*

object JwtUtils {
    private const val jwtIssuer = "yourshop"
    private const val jwtSecret = "your_jwt_secret"
    private const val jwtValidityMs = 36_000_000 // 10 hours

    fun getJwtVerifier(): JWTVerifier {
        return JWT.require(Algorithm.HMAC256(jwtSecret))
            .withIssuer(jwtIssuer)
            .build()
    }

    fun generateAccessToken(user: User): String {
        val now = Instant.now()
        val expiration = now.plusMillis(jwtValidityMs.toLong())

        return JWT.create()
            .withSubject(user.id.toString())
            .withIssuer(jwtIssuer)
            .withClaim("id", user.id.toString())
            .withClaim("username", user.username)
            .withIssuedAt(Date.from(now))
            .withExpiresAt(Date.from(expiration))
            .sign(Algorithm.HMAC256(jwtSecret))
    }


    fun validateAccessToken(payload: Payload): JWTPrincipal? {
        val id = payload.subject ?: return null
        return JWTPrincipal(payload)
    }
}
