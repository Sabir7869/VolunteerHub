package com.webBackend.SpringBoot.web.Backend.controller;


import com.webBackend.SpringBoot.web.Backend.Repo.ApplicantRepo;
import com.webBackend.SpringBoot.web.Backend.model.Applicant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/applicants")
public class ApplicantController {
    @Autowired
    private ApplicantRepo applicantRepo;

    @PostMapping
    public Applicant createApplicant(@RequestBody Applicant applicant){
        return applicantRepo.save(applicant);
    }

    @GetMapping("/admin")
    public List<Applicant> getAllApplicant(){
        return applicantRepo.findAll();
    }
}
