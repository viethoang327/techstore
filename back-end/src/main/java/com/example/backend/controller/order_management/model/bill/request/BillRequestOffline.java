package com.example.backend.controller.order_management.model.bill.request;

import com.example.backend.entity.SKU;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class BillRequestOffline {

    private String userName;

    private String phoneNumber;

    private String email;

    private String address;

    private String province;

    private String district;

    private BigDecimal itemDiscount;

    private BigDecimal totalMoney;

    private List<BillAskClient> billDetail;

    private String paymentMethod;

    private BigDecimal afterPrice;

    private Integer idVoucher;

    private String wards;

}
