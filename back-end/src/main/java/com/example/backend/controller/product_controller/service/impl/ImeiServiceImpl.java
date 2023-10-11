package com.example.backend.controller.product_controller.service.impl;

import com.example.backend.controller.product_controller.model.request.ImportImei;
import com.example.backend.controller.product_controller.service.Iservice;
import com.example.backend.entity.Imei;
import com.example.backend.entity.Product;
import com.example.backend.entity.SKU;
import com.example.backend.repository.ImeiRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.SKURepositoty;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ImeiServiceImpl implements Iservice<Imei> {

    @Autowired
    private ImeiRepository imeiRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SKURepositoty skuRepository;

    @Override
    public Page getAll(Pageable pageable) {
        return imeiRepository.findAll(pageable);
    }

    public Page<Imei> getDelete(Pageable pageable, String key) {
        return imeiRepository.deleteImei(pageable, key);
    }

    @Override
    public void insert(Imei imei) {
        imeiRepository.save(imei);
    }

    @Override
    public void update(Imei imei, Integer id) {

    }

    @Override
    public void delete(Integer id) {
        if (imeiRepository.existsById(id)) {
            imeiRepository.deleteById(id);
        }
    }

    @Override
    public void delete(Imei imei) {
        imei.setStatus(1);
        imeiRepository.save(imei);
    }

    @Override
    public void returnDelete(Imei imei) {
        imei.setStatus(0);
        imeiRepository.save(imei);
    }

    public Page<Imei> search(Pageable pageable, String key) {
        return imeiRepository.search(pageable, key);
    }

    public Imei getOne(Integer id) {
        return imeiRepository.findById(id).get();
    }


    public void importImeiDataFromExcel(MultipartFile file, Long idSku) throws IOException {
        InputStream inputStream = file.getInputStream();
        Workbook workbook = new XSSFWorkbook(inputStream);
        Sheet sheet = workbook.getSheetAt(0); // Sheet cần đọc
        List<String> listCodeImei = new ArrayList<>();
        //lấy ra đối tượng SKU
        SKU sku = skuRepository.findById(idSku).get();
        BigDecimal price = BigDecimal.valueOf(0);
        Integer countImei = 0;
        for (Row row : sheet) {
            if (row.getRowNum() == 0) {
                continue; // Bỏ qua hàng tiêu đề
            }
            if (row.getCell(1).getStringCellValue().trim().isEmpty()) {
                continue;
            }
            String codeImei = row.getCell(1).getStringCellValue();
            price = BigDecimal.valueOf(row.getCell(2).getNumericCellValue());

            // Tạo mới imei và set giá trị
            Imei imei = new Imei();
            imei.setCodeImei(codeImei);
            imei.setIdSku(sku);
            imei.setIdProduct(sku.getProduct());

            //Sét lại giá cho SKU
//

            //save imei
            imeiRepository.save(imei);
            //update gia cho SKU
//            skuRepository.save(sku);
            countImei++;
//            System.out.println("hihih ------: " + imei.getCodeImei() + "hihih ------: " + imei.getIdSku() +
//                    "hihih ------: "  + imei.getIdProduct().getId());
        }
//        System.out.println("--------------------- countImei: "+countImei);
        sku.setPrice(price);
        sku.setQuantity(countImei);
        skuRepository.save(sku); // update lại số lượng cho SKU theo tổng imei

        workbook.close();
    }

//    // đọc file imei ----------
//    public List<ImportImei> readImportFile(MultipartFile file) throws IOException {
//        InputStream inputStream = file.getInputStream();
//        Workbook workbook = new XSSFWorkbook(inputStream);
//        Sheet sheet = workbook.getSheetAt(0); // Sheet cần đọc
//
//        List<ImportImei> importImeiList = new ArrayList<>(); // danh sách imei hợp lệ
//
////        List<ImportImei> wrongList = new ArrayList<>(); // danh sách imei lỗi - tạm thời chưa làm
//        for (Row row : sheet) {
//            if (row.getRowNum() == 0) {
//                continue; // Bỏ qua hàng tiêu đề
//            }
//            if (row.getCell(1).getStringCellValue().trim() == null || row.getCell(2).getStringCellValue().trim() == null
//                    || row.getCell(3).getStringCellValue().trim() == null || row.getCell(4).getStringCellValue().trim() == null) {
////                wrongList.add(row); //tạm thời chưa làm
//                continue; // bỏ qua các hàng có imei rỗng
//            }
//
//            String codeImei = row.getCell(1).getStringCellValue().trim();
////            String color = row.getCell(3).getStringCellValue().trim();
////            String capacity = row.getCell(4).getStringCellValue().trim();
//            BigDecimal price = BigDecimal.valueOf(Long.parseLong(row.getCell(2).getStringCellValue().trim()));
//
//            ImportImei importImei = new ImportImei();
//            importImei.setCodeImei(codeImei);
////            importImei.setColor(color);
////            importImei.setCapacity(capacity);
//            importImei.setPrice(price);
//
//            importImeiList.add(importImei);
//        }
//        workbook.close();
//        System.out.println("Danh sach imei: " + importImeiList.size() + "------------------------------------");
//        return importImeiList;
//    }

    // Đọc file excel imei trả về list imei
    public List<ImportImei> readFileExcelImei(MultipartFile file) throws IOException {
        InputStream inputStream = file.getInputStream();
        Workbook workbook = new XSSFWorkbook(inputStream);
        Sheet sheet = workbook.getSheetAt(0); // Sheet cần đọc
        List<ImportImei> listCodeImei = new ArrayList<>();
        for (Row row : sheet) {
            if (row.getRowNum() == 0) {
                continue; // Bỏ qua hàng tiêu đề
            }
            Cell cell = row.getCell(1);
            System.out.println(cell);
            if (cell == null) {
                continue;
            }
            String codeImei = row.getCell(1).getStringCellValue();
            BigDecimal price = BigDecimal.valueOf(row.getCell(2).getNumericCellValue());

            //tạo đối tượng và sét giá trị
            ImportImei importImei = new ImportImei();
            importImei.setCodeImei(codeImei);
            importImei.setPrice(price);

            //add code imei vaof list
            listCodeImei.add(importImei);

        }
        workbook.close();


        return listCodeImei;
    }

    // check trung mã imei
    public List<ImportImei> isCheckImei(MultipartFile file, Long idSku) throws IOException {
        // lấy ra tất cả mã imei, dùng .stream() để chuyển 1 list đối tượng imei thành 1 list String chỉ có mã imei
        List<String> stringGetAllListCodeImei =
                imeiRepository.findAll().stream().map(imei -> imei.getCodeImei()).collect(Collectors.toList());

        // list String chỉ có code imei vừa được import file excel vào
        List<String> listStringCodeImeiImportExcel =
                readFileExcelImei(file).stream().map(importImei -> importImei.getCodeImei()).collect(Collectors.toList());

        //Find ra đối tượng SKU cần cập nhật
        SKU skuUpdate = skuRepository.findById(idSku).get();

        //list đối tượng ImportImei excel (codeImei, price) -TH: 1
        List<ImportImei> listImportExcel = readFileExcelImei(file);


        //- List imei trùng (Nếu có) -TH: 3
        List<ImportImei> trungImeiList = new ArrayList<>();

        //Trường hợp 2: chưa có imei nào trong dữ liệu và file import excel imei có dữ liệu
        if (stringGetAllListCodeImei.isEmpty() && !listStringCodeImeiImportExcel.isEmpty()) {
            //trường hợp này vì là trong dữ liệu chưa có imei nào nên không cần check trùng imei
            //duyệt qua list dữ liệu listImportExcel để add imei và cập nhật price và quantity cho SKU
            for (ImportImei importImei : listImportExcel) { //dùng listImportExcel vì trong list này có price
                //Tạo đối tượng Imei và sét giá trị
                Imei imei = new Imei();
                imei.setCodeImei(importImei.getCodeImei());
                imei.setIdSku(skuUpdate);
                imei.setIdProduct(skuUpdate.getProduct());

                //save imei
                imeiRepository.save(imei);
            }
            //set lại price cho SKU
            skuUpdate.setPrice(listImportExcel.get(0).getPrice());
            //set lại quantity cho SKU dựa trên tổng số lượng imei đc import vào
            skuUpdate.setQuantity(listImportExcel.size());
            //cập nhật lại price SKU
            skuRepository.save(skuUpdate);
        }

        //Trường hợp 3: có imei trong dữ liệu và file import excel imei có dữ liệu
        if (!stringGetAllListCodeImei.isEmpty() && !listStringCodeImeiImportExcel.isEmpty()) {
            //trường hợp này vì là trong dữ liệu  có imei nên cần check trùng imei
            int lengthListImeiImport = listStringCodeImeiImportExcel.size();
            for (int i = 0; i < lengthListImeiImport; i++) {
                if (stringGetAllListCodeImei.contains(listStringCodeImeiImportExcel.get(i).trim())) {
                    //lấy ra mã trùng
                    String codeImeiTrung = listStringCodeImeiImportExcel.get(i).trim();
                    //lấy ra đối tượng imei bị trùng
                    Imei imeiTrung = imeiRepository.findByCodeImei(codeImeiTrung);

                    //tạo đối tượng ImportImei và set lại giá
                    ImportImei importImeiTrung = new ImportImei();
                    importImeiTrung.setCodeImei(imeiTrung.getCodeImei());
                    importImeiTrung.setColor(imeiTrung.getIdSku().getColor());
                    importImeiTrung.setCapacity(imeiTrung.getIdSku().getCapacity());
                    importImeiTrung.setNameProduct(imeiTrung.getIdProduct().getName());
                    importImeiTrung.setPrice(imeiTrung.getIdSku().getPrice());


                    //add đối tượng đó vào list trùng
                    trungImeiList.add(importImeiTrung);
                }

            }
            if (trungImeiList.isEmpty()) {
                //duyệt qua list dữ liệu listImportExcel để add imei và cập nhật price và quantity cho SKU
                for (ImportImei importImei : listImportExcel) {
                    //Tạo đối tượng Imei và sét giá trị
                    Imei imei = new Imei();
                    imei.setCodeImei(importImei.getCodeImei());
                    imei.setIdSku(skuUpdate);
                    imei.setIdProduct(skuUpdate.getProduct());
                    //save imei
                    imeiRepository.save(imei);
                }
                //set lại price cho SKU
                skuUpdate.setPrice(listImportExcel.get(0).getPrice());
                //set lại quantity cho SKU dựa trên tổng số lượng imei đc import vào
                skuUpdate.setQuantity(listImportExcel.size());
                //cập nhật lại price SKU
                skuRepository.save(skuUpdate);
            }
        }
        return trungImeiList; //nếu list này rỗng là importImei excel thành công - và list có dữ liệu là thất bại
    }

}
