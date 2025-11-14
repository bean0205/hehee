package com.pinyourword.william.service.impl;

import com.pinyourword.william.entity.Pin;
import com.pinyourword.william.entity.user.User;
import com.pinyourword.william.exception.ResourceNotFoundException;
import com.pinyourword.william.repository.PinRepository;
import com.pinyourword.william.repository.UserRepository;
import com.pinyourword.william.service.IPinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PinServiceImpl implements IPinService {
    @Autowired
    PinRepository pinRepository;
    @Autowired
    UserRepository userRepository;

    @Override
    public List<Pin> getAllPinsByUserId(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        User user = userRepository.findByUuid(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "uuid", userId));
        List<Pin> pins = pinRepository.findAllByUserId(user.getId());
        return pins;
    }
}
