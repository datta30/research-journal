package com.research.journal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class JournalManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(JournalManagementApplication.class, args);
    }
}
