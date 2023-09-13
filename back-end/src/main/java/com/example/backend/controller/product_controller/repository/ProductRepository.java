package com.example.backend.controller.product_controller.repository;

import com.example.backend.entity.Product;
import com.example.backend.repository.IProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends IProductRepository {

    @Query(value = "select * from product ORDER BY date_create DESC, Id DESC", nativeQuery = true)
    Page<Product> getAllPage(Pageable pageable);
}
