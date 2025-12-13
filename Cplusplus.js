// Course Data
const courseModules = [
    {
        id: 1,
        title: "Introduction to C++",
        description: "Learn the fundamentals of C++ programming language",
        completed: false,
        lessons: [
            { id: 1, title: "What is C++?", duration: "10 min", completed: false },
            { id: 2, title: "Setting up Development Environment", duration: "15 min", completed: false },
            { id: 3, title: "Your First C++ Program", duration: "20 min", completed: false },
            { id: 4, title: "Understanding Compilation Process", duration: "12 min", completed: false }
        ]
    },
    {
        id: 2,
        title: "Basic Syntax and Structure",
        description: "Master the basic building blocks of C++ programs",
        completed: false,
        lessons: [
            { id: 5, title: "Variables and Data Types", duration: "25 min", completed: false },
            { id: 6, title: "Operators and Expressions", duration: "20 min", completed: false },
            { id: 7, title: "Input and Output Operations", duration: "18 min", completed: false },
            { id: 8, title: "Comments and Code Documentation", duration: "10 min", completed: false }
        ]
    },
    {
        id: 3,
        title: "Control Flow",
        description: "Learn to control program execution flow",
        completed: false,
        lessons: [
            { id: 9, title: "If-Else Statements", duration: "22 min", completed: false },
            { id: 10, title: "Switch Case Statements", duration: "18 min", completed: false },
            { id: 11, title: "For Loops", duration: "20 min", completed: false },
            { id: 12, title: "While and Do-While Loops", duration: "15 min", completed: false }
        ]
    },
    {
        id: 4,
        title: "Functions",
        description: "Understand function declaration, definition, and usage",
        completed: false,
        lessons: [
            { id: 13, title: "Function Basics", duration: "25 min", completed: false },
            { id: 14, title: "Parameters and Return Values", duration: "20 min", completed: false },
            { id: 15, title: "Function Overloading", duration: "18 min", completed: false },
            { id: 16, title: "Recursion", duration: "22 min", completed: false }
        ]
    },
    {
        id: 5,
        title: "Object-Oriented Programming",
        description: "Master the principles of OOP in C++",
        completed: false,
        lessons: [
            { id: 17, title: "Classes and Objects", duration: "30 min", completed: false },
            { id: 18, title: "Constructors and Destructors", duration: "25 min", completed: false },
            { id: 19, title: "Inheritance", duration: "28 min", completed: false },
            { id: 20, title: "Polymorphism", duration: "30 min", completed: false },
            { id: 21, title: "Encapsulation and Abstraction", duration: "25 min", completed: false }
        ]
    },
    {
        id: 6,
        title: "Advanced Topics",
        description: "Explore advanced C++ features and techniques",
        completed: false,
        lessons: [
            { id: 22, title: "Templates", duration: "35 min", completed: false },
            { id: 23, title: "Exception Handling", duration: "25 min", completed: false },
            { id: 24, title: "File Handling", duration: "30 min", completed: false },
            { id: 25, title: "STL (Standard Template Library)", duration: "40 min", completed: false }
        ]
    }
];

// DOM Elements
const modulesContainer = document.querySelector('.modules-container');
const modulesList = document.getElementById('modulesList');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const progressCircle = document.getElementById('progressCircle');
const circlePercent = document.getElementById('circlePercent');
const completedCount = document.getElementById('completedCount');
const timeSpent = document.getElementById('timeSpent');
const certificateSection = document.getElementById('certificateSection');
const certificateForm = document.getElementById('certificateForm');
const certificateDownload = document.getElementById('certificateDownload');
const nameForm = document.getElementById('nameForm');
const fullNameInput = document.getElementById('fullName');
const completionModal = document.getElementById('completionModal');
const modalClose = document.getElementById('modalClose');
const goToCertificate = document.getElementById('goToCertificate');
const generateBtn = document.getElementById('generateBtn');
const downloadPdf = document.getElementById('downloadPdf');
const downloadImage = document.getElementById('downloadImage');
const shareCertificate = document.getElementById('shareCertificate');

// State Management
let totalLessons = 0;
let completedLessons = 0;
let startTime = Date.now();
let isCourseCompleted = false;

// Initialize the course
function initCourse() {
    // Calculate total lessons
    courseModules.forEach(module => {
        totalLessons += module.lessons.length;
    });
    
    // Load saved progress
    loadProgress();
    
    // Render modules
    renderModules();
    
    // Render sidebar modules list
    renderSidebarModules();
    
    // Update progress
    updateProgress();
    
    // Set current date on certificate
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Update time spent periodically
    updateTimeSpent();
    setInterval(updateTimeSpent, 60000); // Update every minute
}

// Render course modules
function renderModules() {
    modulesContainer.innerHTML = '';
    
    courseModules.forEach(module => {
        const moduleElement = document.createElement('div');
        moduleElement.className = `module ${module.completed ? 'completed' : ''}`;
        moduleElement.dataset.moduleId = module.id;
        
        // Calculate module progress
        const moduleLessons = module.lessons.length;
        const completedModuleLessons = module.lessons.filter(lesson => lesson.completed).length;
        const moduleProgress = moduleLessons > 0 ? Math.round((completedModuleLessons / moduleLessons) * 100) : 0;
        
        moduleElement.innerHTML = `
            <div class="module-header">
                <h3 class="module-title">Module ${module.id}: ${module.title}</h3>
                <span class="module-status">
                    ${completedModuleLessons}/${moduleLessons} lessons
                    ${moduleProgress === 100 ? '✓' : `(${moduleProgress}%)`}
                </span>
            </div>
            <p>${module.description}</p>
            <div class="module-content">
                ${module.lessons.map(lesson => `
                    <div class="lesson-item ${lesson.completed ? 'completed' : ''}" data-lesson-id="${lesson.id}">
                        <span class="lesson-checkbox">${lesson.completed ? '✓' : '○'}</span>
                        <span class="lesson-title">${lesson.title}</span>
                        <span class="lesson-duration">${lesson.duration}</span>
                    </div>
                `).join('')}
            </div>
            <div class="module-actions">
                <button class="btn btn-primary" onclick="completeModule(${module.id})">
                    <i class="fas fa-check-circle"></i> Mark Module Complete
                </button>
                <button class="btn btn-secondary" onclick="resetModule(${module.id})">
                    <i class="fas fa-redo"></i> Reset Module
                </button>
            </div>
        `;
        
        modulesContainer.appendChild(moduleElement);
    });
    
    // Add event listeners to lessons
    document.querySelectorAll('.lesson-item').forEach(item => {
        item.addEventListener('click', function() {
            const lessonId = parseInt(this.dataset.lessonId);
            toggleLessonCompletion(lessonId);
        });
    });
}

// Render sidebar modules list
function renderSidebarModules() {
    modulesList.innerHTML = '';
    
    courseModules.forEach(module => {
        const completedModuleLessons = module.lessons.filter(lesson => lesson.completed).length;
        const totalModuleLessons = module.lessons.length;
        const isCompleted = completedModuleLessons === totalModuleLessons;
        
        const moduleLink = document.createElement('a');
        moduleLink.href = `#module-${module.id}`;
        moduleLink.className = `module-link ${isCompleted ? 'completed' : ''}`;
        moduleLink.textContent = `Module ${module.id}: ${module.title}`;
        moduleLink.addEventListener('click', (e) => {
            e.preventDefault();
            const moduleElement = document.querySelector(`[data-module-id="${module.id}"]`);
            if (moduleElement) {
                moduleElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        modulesList.appendChild(moduleLink);
    });
}

// Toggle lesson completion
function toggleLessonCompletion(lessonId) {
    let found = false;
    
    courseModules.forEach(module => {
        module.lessons.forEach(lesson => {
            if (lesson.id === lessonId) {
                lesson.completed = !lesson.completed;
                found = true;
            }
        });
        
        // Check if all lessons in module are completed
        const allCompleted = module.lessons.every(lesson => lesson.completed);
        module.completed = allCompleted;
        
        // Unlock achievements
        if (allCompleted && module.id === 1) {
            unlockAchievement(1);
        } else if (allCompleted && module.id === 5) {
            unlockAchievement(2);
        }
    });
    
    if (found) {
        updateProgress();
        saveProgress();
        renderModules();
        renderSidebarModules();
        checkCourseCompletion();
    }
}

// Complete an entire module
function completeModule(moduleId) {
    const module = courseModules.find(m => m.id === moduleId);
    if (module) {
        module.lessons.forEach(lesson => {
            lesson.completed = true;
        });
        module.completed = true;
        
        updateProgress();
        saveProgress();
        renderModules();
        renderSidebarModules();
        checkCourseCompletion();
    }
}

// Reset a module
function resetModule(moduleId) {
    const module = courseModules.find(m => m.id === moduleId);
    if (module) {
        module.lessons.forEach(lesson => {
            lesson.completed = false;
        });
        module.completed = false;
        
        updateProgress();
        saveProgress();
        renderModules();
        renderSidebarModules();
    }
}

// Update progress display
function updateProgress() {
    completedLessons = 0;
    courseModules.forEach(module => {
        completedLessons += module.lessons.filter(lesson => lesson.completed).length;
    });
    
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    
    // Update progress bar
    progressBar.style.width = `${progressPercentage}%`;
    progressText.textContent = `${progressPercentage}%`;
    
    // Update progress circle
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (progressPercentage / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
    circlePercent.textContent = `${progressPercentage}%`;
    
    // Update completed count
    completedCount.textContent = `${completedLessons}/${totalLessons}`;
    
    // Update achievements
    updateAchievements();
}

// Update time spent
function updateTimeSpent() {
    const elapsedMs = Date.now() - startTime;
    const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
    
    timeSpent.textContent = `${hours}h ${minutes}m`;
}

// Unlock achievement
function unlockAchievement(index) {
    const achievements = document.querySelectorAll('.achievement');
    if (index >= 0 && index < achievements.length) {
        achievements[index].classList.add('unlocked');
        achievements[index].dataset.unlocked = 'true';
        
        // Show notification
        showNotification(`Achievement Unlocked: ${achievements[index].querySelector('span').textContent}`);
    }
}

// Update achievements based on progress
function updateAchievements() {
    // Course Started
    if (completedLessons > 0) {
        unlockAchievement(0);
    }
    
    // First Program (Complete first lesson)
    if (courseModules[0]?.lessons[2]?.completed) {
        unlockAchievement(1);
    }
    
    // OOP Master (Complete OOP module)
    if (courseModules[4]?.completed) {
        unlockAchievement(2);
    }
    
    // Course Completed
    if (completedLessons === totalLessons) {
        unlockAchievement(3);
    }
}

// Check if course is completed
function checkCourseCompletion() {
    if (completedLessons === totalLessons && !isCourseCompleted) {
        isCourseCompleted = true;
        showCompletionModal();
    }
}

// Show completion modal
function showCompletionModal() {
    completionModal.classList.add('show');
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-bell"></i>
        <span>${message}</span>
    `;
    
    // Style notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 0.8rem;
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Save progress to localStorage
function saveProgress() {
    const progress = {
        modules: courseModules,
        startTime: startTime,
        completedLessons: completedLessons,
        isCourseCompleted: isCourseCompleted
    };
    localStorage.setItem('c++CourseProgress', JSON.stringify(progress));
}

// Load progress from localStorage
function loadProgress() {
    const savedProgress = localStorage.getItem('c++CourseProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        Object.assign(courseModules, progress.modules);
        startTime = progress.startTime || Date.now();
        completedLessons = progress.completedLessons || 0;
        isCourseCompleted = progress.isCourseCompleted || false;
    }
}

// Reset course progress
function resetCourse() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        courseModules.forEach(module => {
            module.completed = false;
            module.lessons.forEach(lesson => {
                lesson.completed = false;
            });
        });
        
        completedLessons = 0;
        isCourseCompleted = false;
        startTime = Date.now();
        
        updateProgress();
        saveProgress();
        renderModules();
        renderSidebarModules();
        
        // Hide certificate form
        certificateForm.style.display = 'block';
        certificateDownload.style.display = 'none';
        
        showNotification('Course progress has been reset.');
    }
}

// Add reset button to header
document.addEventListener('DOMContentLoaded', function() {
    const resetBtn = document.createElement('button');
    resetBtn.innerHTML = '<i class="fas fa-redo"></i> Reset Course';
    resetBtn.className = 'btn btn-secondary';
    resetBtn.style.marginLeft = 'auto';
    resetBtn.style.marginRight = '1rem';
    resetBtn.onclick = resetCourse;
    
    document.querySelector('.logo-container').appendChild(resetBtn);
});

// Certificate Generation
nameForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = fullNameInput.value.trim();
    
    if (name) {
        // Update certificate preview
        document.querySelector('.student-name').textContent = name;
        
        // Hide form, show download options
        certificateForm.style.display = 'none';
        certificateDownload.style.display = 'block';
        
        showNotification('Certificate generated successfully!');
    }
});

// Download PDF Certificate
downloadPdf.addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape', 'mm', 'a4');
    
    // Add certificate design to PDF
    const certificateElement = document.querySelector('.certificate-design');
    
    html2canvas(certificateElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 280;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const x = (297 - imgWidth) / 2;
        const y = (210 - imgHeight) / 2;
        
        doc.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
        doc.save('Legend-Tech-C++-Certificate.pdf');
        
        showNotification('PDF certificate downloaded!');
    });
});

// Download Image Certificate
downloadImage.addEventListener('click', function() {
    const certificateElement = document.querySelector('.certificate-design');
    
    html2canvas(certificateElement).then(canvas => {
        const link = document.createElement('a');
        link.download = 'Legend-Tech-C++-Certificate.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        showNotification('Image certificate downloaded!');
    });
});

// Share Certificate
shareCertificate.addEventListener('click', function() {
    if (navigator.share) {
        navigator.share({
            title: 'My C++ Programming Certificate',
            text: 'I just completed the Legend Tech C++ Programming Course!',
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        alert('Certificate shared! Share this achievement with your network.');
    }
});

// Modal functionality
modalClose.addEventListener('click', function() {
    completionModal.classList.remove('show');
});

goToCertificate.addEventListener('click', function() {
    completionModal.classList.remove('show');
    certificateSection.scrollIntoView({ behavior: 'smooth' });
});

// Close modal when clicking outside
completionModal.addEventListener('click', function(e) {
    if (e.target === completionModal) {
        completionModal.classList.remove('show');
    }
});

// Disable generate button if course not completed
function updateCertificateButton() {
    if (completedLessons === totalLessons) {
        generateBtn.disabled = false;
        generateBtn.style.opacity = '1';
        generateBtn.style.cursor = 'pointer';
    } else {
        generateBtn.disabled = true;
        generateBtn.style.opacity = '0.6';
        generateBtn.style.cursor = 'not-allowed';
    }
}

// Initialize course when page loads
document.addEventListener('DOMContentLoaded', initCourse);