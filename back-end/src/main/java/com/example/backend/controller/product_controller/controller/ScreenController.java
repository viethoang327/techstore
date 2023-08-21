package com.example.backend.controller.product_controller.controller;

import com.example.backend.controller.product_controller.service.impl.ScreenServiceImpl;
import com.example.backend.entity.Ram;
import com.example.backend.entity.Screen;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/screen/")
public class ScreenController {
    @Autowired
    private ScreenServiceImpl screenService;

    @GetMapping("display")
    public List<Screen> viewAll(@RequestParam(value = "page",defaultValue = "0") Integer page) {
        Pageable pageable = PageRequest.of(page, 10);
        Page<Screen> listScreen = screenService.getAll(pageable);
        return listScreen.getContent();
    }

    @PostMapping("save")
    public void save(@RequestBody Screen screen) {
        screenService.insert(screen);
    }

    @PutMapping("update/{id}")
    public void update(@RequestBody Screen screen,@PathVariable("id") Integer id) {
        screen.setId(id);
        screenService.insert(screen);
    }

    @DeleteMapping("delete/{id}")
    public void delete(@PathVariable("id") Integer id) {
        screenService.delete(id);
    }
}