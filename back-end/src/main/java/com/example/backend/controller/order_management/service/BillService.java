package com.example.backend.controller.order_management.service;

import com.example.backend.controller.order_management.model.bill.request.BillRequest;
import com.example.backend.controller.order_management.model.bill.request.BillRequestOnline;
import com.example.backend.controller.order_management.model.bill.response.BillResponse;
import com.example.backend.entity.Bill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface BillService {
    String createBillCustomerOnlineRequest( BillRequestOnline request) ;
    Bill detail(Integer id);

    Page<Bill> searchNoDate(Pageable pageable, String key, String status, String user);

    Page<Bill> searchWithDate(Pageable pageable, String key, String status, String user, LocalDate dateStart, LocalDate dateEnd);
}
