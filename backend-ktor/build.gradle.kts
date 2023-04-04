val ktorVersion = "2.2.4"
val kotlinVersion = "1.8.10"
val logbackVersion = "1.2.11"
val exposedVersion = "0.41.1"

plugins {
    kotlin("jvm") version "1.8.10"
    id("io.ktor.plugin") version "2.2.4"
}

group = "com.yourshop"
version = "0.0.1"
application {
    mainClass.set("com.yourshop.application.ApplicationKt")

    val isDevelopment: Boolean = project.ext.has("development")
    applicationDefaultJvmArgs = listOf("-Dio.ktor.development=$isDevelopment")
}

repositories {
    mavenCentral()
}

/*
dependencies {
    implementation("io.ktor:ktor-server-core-jvm:$ktorVersion")
    implementation("io.ktor:ktor-server-netty-jvm:$ktorVersion")
    implementation("ch.qos.logback:logback-classic:$logback_version")
    testImplementation("io.ktor:ktor-server-tests-jvm:$ktorVersion")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit:$kotlin_version")
}*/

dependencies {
    implementation("io.ktor:ktor-server-core:${ktorVersion}")
    implementation("io.ktor:ktor-server-netty:${ktorVersion}")
    implementation("io.ktor:ktor-server-auth:${ktorVersion}")
    implementation("io.ktor:ktor-server-auth-jwt:${ktorVersion}")
    implementation("io.ktor:ktor-serialization:${ktorVersion}")
    implementation("io.ktor:ktor-client-core:${ktorVersion}")
    implementation("io.ktor:ktor-client-apache:${ktorVersion}")
    implementation("ch.qos.logback:logback-classic:${logbackVersion}")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8:${kotlinVersion}")
    implementation("org.jetbrains.kotlin:kotlin-reflect:${kotlinVersion}")
    implementation("org.jetbrains.exposed:exposed-core:${exposedVersion}")
    implementation("org.jetbrains.exposed:exposed-dao:${exposedVersion}")
    implementation("org.jetbrains.exposed:exposed-jdbc:${exposedVersion}")
    //implementation("org.postgresql:postgresql:${postgresVersion}")
    //implementation("com.zaxxer:HikariCP:${hikariCPVersion}")

    implementation("io.jsonwebtoken:jjwt-api:0.11.2")
    implementation("io.jsonwebtoken:jjwt-impl:0.11.2")
    implementation("io.jsonwebtoken:jjwt-jackson:0.11.2")

    implementation("io.ktor:ktor-server-content-negotiation:$ktorVersion")
    implementation("io.ktor:ktor-serialization-jackson:$ktorVersion")

    implementation("org.jetbrains.exposed:exposed-java-time:0.41.1")

    implementation("io.ktor:ktor-server-cors:$ktorVersion")

    implementation("org.postgresql:postgresql:42.3.8")

    testImplementation("io.ktor:ktor-server-tests:${ktorVersion}")
    testImplementation("org.jetbrains.kotlin:kotlin-test:${kotlinVersion}")
    //testImplementation("junit:junit:${junitVersion}")
}

