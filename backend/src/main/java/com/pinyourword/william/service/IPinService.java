package com.pinyourword.william.service;

import com.pinyourword.william.dto.request.PinCreateRequest;
import com.pinyourword.william.entity.Pin;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IPinService {
    List<Pin> getAllPinsByUserId(Authentication authentication);
    Pin savePin(Authentication authentication, PinCreateRequest data, List<MultipartFile> images);

}
