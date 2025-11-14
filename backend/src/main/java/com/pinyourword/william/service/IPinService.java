package com.pinyourword.william.service;

import com.pinyourword.william.entity.Pin;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface IPinService {
    List<Pin> getAllPinsByUserId(Authentication authentication);
}
