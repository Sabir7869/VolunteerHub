package com.webBackend.SpringBoot.web.Backend.Repo;

import com.webBackend.SpringBoot.web.Backend.model.Applicant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicantRepo extends JpaRepository<Applicant,Long> {
}
