package com.pinyourword.william.repository;


import com.pinyourword.william.entity.Pin;
import com.pinyourword.william.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PinRepository extends JpaRepository<Pin, Long> {

    List<Pin> findAllByUserId(Long user);

}
