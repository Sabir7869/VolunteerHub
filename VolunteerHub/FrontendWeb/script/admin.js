const username = prompt("Enter username:");
const password = prompt("Enter password:");

if (username !== "admin" || password !== "admin") {
  alert("Unauthorized access! Redirecting...");
  window.location.href = "index.html";
} else {
  fetch("http://localhost:8080/api/applicants/admin")
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch applicants");
      }
      return response.json();
    })
    .then(data => {
      const container = document.getElementById("applicants-container");
      data.forEach(applicant => {
        const div = document.createElement("div");
        div.textContent = `Name: ${applicant.name}, Email: ${applicant.email}`;
        container.appendChild(div);
      });
    })
    .catch(error => {
      console.error("Error fetching applicant data:", error);
      alert("Unable to load admin data.");
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('applicantsTableBody');
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const emptyState = document.getElementById('emptyState');
    const tableWrapper = document.getElementById('tableWrapper');
    const roleFilter = document.getElementById('roleFilter');
    const sortBy = document.getElementById('sortBy');
    const refreshBtn = document.getElementById('refreshBtn');
    const tableCount = document.getElementById('tableCount');
    
    const totalApplicants = document.getElementById('totalApplicants');
    const totalInterns = document.getElementById('totalInterns');
    const totalVolunteers = document.getElementById('totalVolunteers');
    
    let applicantsData = [];
    let filteredData = [];
    let currentSort = { field: 'name', direction: 'asc' };
    
    init();
    
    function init() {
        loadApplicants();
        setupEventListeners();
    }
    
    function setupEventListeners() {
        refreshBtn.addEventListener('click', loadApplicants);
        roleFilter.addEventListener('change', filterAndDisplayData);
        sortBy.addEventListener('change', handleSortChange);
        
        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', () => {
                const field = header.dataset.sort;
                handleTableSort(field);
            });
        });
    }
    
    async function loadApplicants() {
        try {
            showLoading();
            
            const response = await fetch('http://localhost:8080/api/applicants/admin');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            applicantsData = Array.isArray(data) ? data : [];
            
            updateStatistics();
            filterAndDisplayData();
            
        } catch (error) {
            console.error('Error fetching applicants:', error);
            showError();
        }
    }
    
    function updateStatistics() {
        const total = applicantsData.length;
        const interns = applicantsData.filter(app => app.role === 'Intern').length;
        const volunteers = applicantsData.filter(app => app.role === 'Volunteer').length;
        
        animateNumber(totalApplicants, total);
        animateNumber(totalInterns, interns);
        animateNumber(totalVolunteers, volunteers);
    }
    
    function animateNumber(element, target) {
        const start = parseInt(element.textContent) || 0;
        const duration = 1000;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (target - start) * progress);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    function filterAndDisplayData() {
        const roleFilterValue = roleFilter.value;
        
        filteredData = applicantsData.filter(applicant => {
            const matchesRole = !roleFilterValue || applicant.role === roleFilterValue;
            return matchesRole;
        });
        
        sortData();
        displayData();
        updateTableCount();
    }
    
    function handleSortChange() {
        const sortValue = sortBy.value;
        currentSort.field = sortValue;
        currentSort.direction = 'asc';
        filterAndDisplayData();
    }
    
    function handleTableSort(field) {
        if (currentSort.field === field) {
            currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            currentSort.field = field;
            currentSort.direction = 'asc';
        }
        
        document.querySelectorAll('.sortable').forEach(header => {
            header.classList.remove('sorted');
            const icon = header.querySelector('.sort-icon');
            icon.className = 'fas fa-sort sort-icon';
        });
        
        const activeHeader = document.querySelector(`[data-sort="${field}"]`);
        activeHeader.classList.add('sorted');
        const activeIcon = activeHeader.querySelector('.sort-icon');
        activeIcon.className = currentSort.direction === 'asc' ? 
            'fas fa-sort-up sort-icon' : 'fas fa-sort-down sort-icon';
        
        filterAndDisplayData();
    }
    
    function sortData() {
        filteredData.sort((a, b) => {
            let aValue = a[currentSort.field] || '';
            let bValue = b[currentSort.field] || '';
            
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }
            
            let result = 0;
            if (aValue < bValue) result = -1;
            else if (aValue > bValue) result = 1;
            
            return currentSort.direction === 'desc' ? -result : result;
        });
    }
    
    function displayData() {
        if (filteredData.length === 0) {
            showEmpty();
            return;
        }
        
        showTable();
        
        tableBody.innerHTML = '';
        
        filteredData.forEach((applicant, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="applicant-name">
                        <strong>${escapeHtml(applicant.name || 'N/A')}</strong>
                    </div>
                </td>
                <td>
                    <a href="mailto:${escapeHtml(applicant.email || '')}" class="email-link">
                        ${escapeHtml(applicant.email || 'N/A')}
                    </a>
                </td>
                <td>
                    <a href="tel:${escapeHtml(applicant.phone || '')}" class="phone-link">
                        ${escapeHtml(applicant.phone || 'N/A')}
                    </a>
                </td>
                <td>
                    <span class="role-badge role-${(applicant.role || '').toLowerCase()}">
                        <i class="fas fa-${applicant.role === 'Intern' ? 'graduation-cap' : 'heart'}"></i>
                        ${escapeHtml(applicant.role || 'N/A')}
                    </span>
                </td>
                <td>
                    <div class="skills-cell">
                        ${formatSkills(applicant.skills)}
                    </div>
                </td>
            `;
            
            row.style.cursor = 'pointer';
            row.addEventListener('click', () => viewApplicant(index));
            row.addEventListener('mouseenter', () => {
                row.style.transform = 'scale(1.01)';
                row.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                row.style.transition = 'all 0.2s ease';
            });
            row.addEventListener('mouseleave', () => {
                row.style.transform = 'scale(1)';
                row.style.boxShadow = 'none';
            });
            
            tableBody.appendChild(row);
        });
    }
    
    function formatSkills(skills) {
        if (!skills) return '<span class="no-skills">No skills listed</span>';
        
        const skillsArray = skills.split(',').map(skill => skill.trim()).slice(0, 3);
        const skillsHtml = skillsArray.map(skill => 
            `<span class="skill-tag">${escapeHtml(skill)}</span>`
        ).join('');
        
        const remaining = skills.split(',').length - 3;
        const moreText = remaining > 0 ? `<span class="more-skills">+${remaining} more</span>` : '';
        
        return skillsHtml + moreText;
    }
    
    function updateTableCount() {
        const total = applicantsData.length;
        const filtered = filteredData.length;
        
        if (total === filtered) {
            tableCount.textContent = `Showing ${total} applicant${total !== 1 ? 's' : ''}`;
        } else {
            tableCount.textContent = `Showing ${filtered} of ${total} applicant${total !== 1 ? 's' : ''}`;
        }
    }
    
    function showLoading() {
        hideAllStates();
        loadingState.style.display = 'block';
    }
    
    function showError() {
        hideAllStates();
        errorState.style.display = 'block';
    }
    
    function showEmpty() {
        hideAllStates();
        emptyState.style.display = 'block';
    }
    
    function showTable() {
        hideAllStates();
        tableWrapper.style.display = 'block';
    }
    
    function hideAllStates() {
        loadingState.style.display = 'none';
        errorState.style.display = 'none';
        emptyState.style.display = 'none';
        tableWrapper.style.display = 'none';
    }
    
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }
    
    window.viewApplicant = function(index) {
        const applicant = filteredData[index];
        const modal = document.getElementById('applicantModal');
        const modalBody = document.getElementById('modalBody');
        
        modalBody.innerHTML = `
            <div class="applicant-details">
                <div class="detail-row">
                    <strong><i class="fas fa-user"></i> Name:</strong>
                    <span>${escapeHtml(applicant.name || 'N/A')}</span>
                </div>
                <div class="detail-row">
                    <strong><i class="fas fa-envelope"></i> Email:</strong>
                    <span><a href="mailto:${escapeHtml(applicant.email || '')}">${escapeHtml(applicant.email || 'N/A')}</a></span>
                </div>
                <div class="detail-row">
                    <strong><i class="fas fa-phone"></i> Phone:</strong>
                    <span><a href="tel:${escapeHtml(applicant.phone || '')}">${escapeHtml(applicant.phone || 'N/A')}</a></span>
                </div>
                <div class="detail-row">
                    <strong><i class="fas fa-tag"></i> Role:</strong>
                    <span class="role-badge role-${(applicant.role || '').toLowerCase()}">
                        ${escapeHtml(applicant.role || 'N/A')}
                    </span>
                </div>
                <div class="detail-row">
                    <strong><i class="fas fa-cogs"></i> Skills:</strong>
                    <span>${escapeHtml(applicant.skills || 'No skills listed')}</span>
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
    };
    
    window.closeModal = function() {
        document.getElementById('applicantModal').style.display = 'none';
    };
    
    window.contactApplicant = function(email) {
        if (email) {
            window.location.href = `mailto:${email}`;
        } else {
            alert('No email address available');
        }
    };
    
    window.loadApplicants = loadApplicants;
});
