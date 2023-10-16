package com.example.backend.controller.address.district.controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/public/district/")
@CrossOrigin("*")
public class DistrictController {

    @GetMapping("")
    public String getAll(@RequestParam("province_id") Integer province_id){
        RestTemplate restTemplate = new RestTemplate();

        // Tạo tiêu đề
        HttpHeaders headers = new HttpHeaders();
        headers.set("token", "99acedc2-6a67-11ee-a6e6-e60958111f48");
        headers.set("Content-Type", "application/json"); // Thay thế tên và giá trị của tiêu đề cần thiết

        // Tạo đối tượng HttpEntity chứa tiêu đề
        HttpEntity<String> entity = new HttpEntity<>(headers);

        // Thực hiện yêu cầu HTTP với tiêu đề
        ResponseEntity<String> response = restTemplate.exchange("https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=" + province_id, HttpMethod.GET, entity, String.class);
        if (response.getStatusCode().is2xxSuccessful()) {
            return response.getBody();
        } else {
            // Xử lý khi có lỗi
            return null;
        }
    }
}
