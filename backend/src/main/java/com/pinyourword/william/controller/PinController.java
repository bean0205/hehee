package com.pinyourword.william.controller;


import com.pinyourword.william.dto.response.ApiResponse;
import com.pinyourword.william.dto.response.UserProfileResponse;
import com.pinyourword.william.entity.Pin;
import com.pinyourword.william.service.IPinService;
import com.pinyourword.william.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/v1/pin")
@RequiredArgsConstructor
@Tag(name = "Pin", description = "Pin management APIs")
@SecurityRequirement(name = "bearerAuth")
public class PinController {
    
    private final IPinService pinService;
    
    @GetMapping("/pins-by-user")
    @Operation(summary = "Get pins by user", description = "Get the Pins of user")
    public ResponseEntity<ApiResponse<List<Pin>>> getCurrentUser(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(pinService.getAllPinsByUserId(authentication)));
    }

}
