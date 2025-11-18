package com.pinyourword.william.service.impl;

import com.pinyourword.william.dto.request.PinCreateRequest;
import com.pinyourword.william.entity.Pin;
import com.pinyourword.william.entity.user.User;
import com.pinyourword.william.exception.ResourceNotFoundException;
import com.pinyourword.william.repository.PinRepository;
import com.pinyourword.william.repository.UserRepository;
import com.pinyourword.william.service.IPinService;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;

@Service
public class PinServiceImpl implements IPinService {
    @Autowired
    PinRepository pinRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    private GeometryFactory geometryFactory;

    @Override
    public List<Pin> getAllPinsByUserId(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        User user = userRepository.findByUuid(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "uuid", userId));
        List<Pin> pins = pinRepository.findAllByUserId(user.getId());
        return pins;
    }

    @Override
    public Pin savePin(Authentication authentication, PinCreateRequest data, List<MultipartFile> images) {
        UUID userId = (UUID) authentication.getPrincipal();
        Instant instant = Instant.parse(data.visitDate());
        LocalDate localDate = instant.atZone(ZoneId.systemDefault()).toLocalDate();
        User user = userRepository.findByUuid(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "uuid", userId));
        Pin pin = Pin.builder()
                .userId(user.getId())
                .placeName(data.location().name())
                .placeIdGoogle(data.location().placeId())
                .notes(data.notes())
                .rating(data.rating())
                .status(data.status())
                .visitedDate(localDate)
                .location(geometryFactory.createPoint(new Coordinate(data.location().lon(), data.location().lat())))
                .addressFormatted(data.location().displayName())
                .addressCity(data.location().address().city())
                .addressCountry(data.location().address().country())
                .addressCountryCode(data.location().address().countryCode())
                .build();
        pinRepository.save(pin);
        return pin;
    }
}
