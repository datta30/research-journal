package com.research.journal.service;

import com.research.journal.dto.AuthResponse;
import com.research.journal.dto.LoginRequest;
import com.research.journal.dto.UserRegistrationDto;
import com.research.journal.model.User;
import com.research.journal.repository.UserRepository;
import com.research.journal.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;

@Service
@Transactional
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    public User registerUser(UserRegistrationDto registrationDto) {
        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setEmail(registrationDto.getEmail());
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        user.setFirstName(registrationDto.getFirstName());
        user.setLastName(registrationDto.getLastName());
        user.setAffiliation(registrationDto.getAffiliation());
        user.setOrcidId(registrationDto.getOrcidId());
        
        if (registrationDto.getRoles() == null || registrationDto.getRoles().isEmpty()) {
            user.setRoles(new HashSet<>());
            user.getRoles().add(User.Role.AUTHOR);
        } else {
            user.setRoles(registrationDto.getRoles());
        }
        
        user.setActive(true);
        
        return userRepository.save(user);
    }
    
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);
        
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return new AuthResponse(token, user.getId(), user.getEmail(), 
                user.getFirstName(), user.getLastName(), user.getRoles());
    }
}
