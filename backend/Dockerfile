# Multi-stage build for Spring Boot backend
FROM maven:3.9.5-eclipse-temurin-17 AS build

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Create uploads directory
RUN mkdir -p /app/uploads

# Copy the built JAR from build stage
COPY --from=build /app/target/journal-management-1.0.0.jar app.jar

# Expose port 8080
EXPOSE 8080

# Set environment variables (will be overridden by docker-compose)
ENV SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/research_journal_db
ENV SPRING_DATASOURCE_USERNAME=root
ENV SPRING_DATASOURCE_PASSWORD=root

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
