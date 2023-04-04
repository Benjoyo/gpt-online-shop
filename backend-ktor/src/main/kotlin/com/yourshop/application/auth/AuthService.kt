package com.yourshop.application.auth

import com.yourshop.application.user.*
import com.yourshop.infrastructure.util.*
import java.util.logging.Logger

class AuthService(private val userRepository: UserRepository) {

    suspend fun authenticate(username: String, password: String): String? {
        val user = userRepository.findByUsername(username) ?: return null
        if (user.password != password) return null

        val t = JwtUtils.generateAccessToken(user)
        Logger.getLogger("dd").info(t)
        return t
    }
}
