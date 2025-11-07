-- Research Journal Management System Database Schema
-- This file is for reference only. Hibernate will auto-create tables based on entities.

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    affiliation VARCHAR(255),
    orcid_id VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- User Roles Table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Papers Table
CREATE TABLE IF NOT EXISTS papers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    abstract_text TEXT,
    keywords VARCHAR(500),
    author_id BIGINT NOT NULL,
    assigned_editor_id BIGINT,
    status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED',
    file_path VARCHAR(500),
    original_file_name VARCHAR(500),
    current_version INT DEFAULT 1,
    submitted_at TIMESTAMP,
    published_at TIMESTAMP,
    editor_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id),
    FOREIGN KEY (assigned_editor_id) REFERENCES users(id),
    INDEX idx_author (author_id),
    INDEX idx_editor (assigned_editor_id),
    INDEX idx_status (status)
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    paper_id BIGINT NOT NULL,
    reviewer_id BIGINT NOT NULL,
    recommendation VARCHAR(50),
    comments TEXT,
    quality_score INT,
    originality_score INT,
    clarity_score INT,
    significance_score INT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    assigned_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (paper_id) REFERENCES papers(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id),
    INDEX idx_paper (paper_id),
    INDEX idx_reviewer (reviewer_id),
    INDEX idx_status (status)
);

-- Revisions Table
CREATE TABLE IF NOT EXISTS revisions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    paper_id BIGINT NOT NULL,
    version_number INT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    original_file_name VARCHAR(500),
    change_log TEXT,
    author_comments TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (paper_id) REFERENCES papers(id) ON DELETE CASCADE,
    INDEX idx_paper (paper_id)
);

-- Plagiarism Checks Table
CREATE TABLE IF NOT EXISTS plagiarism_checks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    paper_id BIGINT NOT NULL,
    similarity_score DOUBLE NOT NULL,
    status VARCHAR(50) NOT NULL,
    matched_sources TEXT,
    remarks TEXT,
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (paper_id) REFERENCES papers(id) ON DELETE CASCADE,
    INDEX idx_paper (paper_id),
    INDEX idx_status (status)
);
