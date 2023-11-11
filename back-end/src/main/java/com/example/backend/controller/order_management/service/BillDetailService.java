package com.example.backend.controller.order_management.service;

import com.example.backend.controller.order_management.model.billDetail.request.FindBillDetailRequest;
import com.example.backend.controller.order_management.model.billDetail.response.BillDetailCustomerResponse;
import com.example.backend.controller.order_management.model.billOffLine.ion.BillDetailOffLineIon;
import com.example.backend.entity.BillDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BillDetailService {

    Page<BillDetails> getAll(FindBillDetailRequest request, Pageable pageable);

    List<BillDetailCustomerResponse> getAll(Integer id);

    void updateQuantity(Integer id, Integer newQuantity);

    List<BillDetailOffLineIon> findBillDetails(Integer id);

}
