// For demonstration, using a placeholder for FontAwesome
document.addEventListener('DOMContentLoaded', function() {
    // Load progress from localStorage
    loadProgress();
    
    // Toggle module content
    const toggleButtons = document.querySelectorAll('.toggle-content');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const content = this.parentElement.querySelector('.module-content');
            if (content.style.display === 'none') {
                content.style.display = 'block';
                this.textContent = 'Hide Content';
            } else {
                content.style.display = 'none';
                this.textContent = 'Show Content';
            }
        });
    });
    
    // Mark module as complete
    const completeButtons = document.querySelectorAll('.complete-module');
    completeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const moduleId = this.getAttribute('data-module');
            const moduleCard = document.getElementById(`module-${moduleId}`);
            const badge = moduleCard.querySelector('.completion-badge');
            
            // Mark as complete
            badge.style.display = 'inline-block';
            moduleCard.classList.add('module-complete');
            this.textContent = 'Completed!';
            this.disabled = true;
            
            // Save progress to localStorage
            saveProgress(moduleId);
            
            // Update progress
            updateProgress();
        });
    });
    
    // Load progress from localStorage
    function loadProgress() {
        const completedModules = JSON.parse(localStorage.getItem('completedModules')) || [];
        
        completedModules.forEach(moduleId => {
            const moduleCard = document.getElementById(`module-${moduleId}`);
            if (moduleCard) {
                const badge = moduleCard.querySelector('.completion-badge');
                const button = moduleCard.querySelector('.complete-module');
                
                badge.style.display = 'inline-block';
                moduleCard.classList.add('module-complete');
                button.textContent = 'Completed!';
                button.disabled = true;
            }
        });
        
        updateProgress();
    }
    
    // Save progress to localStorage
    function saveProgress(moduleId) {
        let completedModules = JSON.parse(localStorage.getItem('completedModules')) || [];
        
        if (!completedModules.includes(moduleId)) {
            completedModules.push(moduleId);
            localStorage.setItem('completedModules', JSON.stringify(completedModules));
        }
    }
    
    // Update progress function
    function updateProgress() {
        const completedModules = document.querySelectorAll('.module-complete').length;
        const totalModules = 8;
        const progressPercentage = (completedModules / totalModules) * 100;
        
        // Update progress bar
        const progressBar = document.querySelector('.progress-bar');
        progressBar.style.width = `${progressPercentage}%`;
        progressBar.textContent = `${Math.round(progressPercentage)}%`;
        progressBar.setAttribute('aria-valuenow', progressPercentage);
        
        // Update completed modules count
        document.getElementById('completed-modules').textContent = completedModules;
        
        // Update module list badges
        const moduleBadges = document.querySelectorAll('.list-group-item .badge');
        moduleBadges.forEach((badge, index) => {
            if (index < completedModules) {
                badge.textContent = '100%';
                badge.classList.remove('bg-secondary');
                badge.classList.add('bg-success');
            } else {
                badge.textContent = '0%';
                badge.classList.remove('bg-success');
                badge.classList.add('bg-secondary');
            }
        });
        
        // Enable certificate button if all modules completed
        if (completedModules === totalModules) {
            document.getElementById('generate-certificate').disabled = false;
        }
    }
    
    // Generate certificate
    document.getElementById('generate-certificate').addEventListener('click', function() {
        document.getElementById('certificate').style.display = 'block';
        // Scroll to certificate section
        document.getElementById('certificate').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Certificate form submission
    document.getElementById('certificate-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const studentName = document.getElementById('student-name').value;
        const completionDate = document.getElementById('completion-date').value;
        
        // Format date
        const dateObj = new Date(completionDate);
        const formattedDate = dateObj.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Update certificate
        document.getElementById('cert-name').textContent = studentName;
        document.getElementById('cert-date').textContent = formattedDate;
        
        // Show certificate
        document.getElementById('certificate-output').style.display = 'block';
        document.querySelector('.certificate-preview').style.display = 'none';
        
        // Show download and print buttons
        document.getElementById('download-certificate').style.display = 'inline-block';
        document.getElementById('print-certificate').style.display = 'inline-block';
    });
    
    // Print certificate
    document.getElementById('print-certificate').addEventListener('click', function() {
        const certificate = document.getElementById('certificate-output');
        const originalContents = document.body.innerHTML;
        
        document.body.innerHTML = certificate.outerHTML;
        window.print();
        document.body.innerHTML = originalContents;
        location.reload(); // Reload to restore functionality
    });
    
    // Set today's date as default completion date
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    document.getElementById('completion-date').value = formattedToday;
});