# MySQL Dockerfile for Research Journal
FROM mysql:8.0

# Set environment variables with defaults
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=research_journal_db
ENV MYSQL_CHARACTER_SET_SERVER=utf8mb4
ENV MYSQL_COLLATION_SERVER=utf8mb4_unicode_ci

# Copy database initialization script
COPY schema.sql /docker-entrypoint-initdb.d/01-schema.sql

# Expose MySQL port
EXPOSE 3306

# Use the default MySQL entrypoint
