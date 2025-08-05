document.addEventListener('DOMContentLoaded', function() {
    // Loader simulation based on network speed
    const loaderWrapper = document.querySelector('.loader-wrapper');
    const loaderText = document.querySelector('.loader-text');
    
    // Simulate network speed detection
    const connectionSpeed = navigator.connection ? navigator.connection.downlink : 5; // in Mbps
    const minLoadTime = connectionSpeed > 5 ? 1000 : connectionSpeed > 2 ? 2000 : 3000;
    const maxLoadTime = connectionSpeed > 5 ? 2000 : connectionSpeed > 2 ? 3500 : 5000;
    
    const loadTime = Math.random() * (maxLoadTime - minLoadTime) + minLoadTime;
    
    // Update loader text based on speed
    if (connectionSpeed < 2) {
        loaderText.textContent = "Loading... (Slow connection detected)";
    }
    
    // Hide loader after simulated load time
    setTimeout(function() {
        loaderWrapper.style.opacity = '0';
        setTimeout(function() {
            loaderWrapper.style.display = 'none';
            document.body.classList.add('loaded');
        }, 500);
    }, loadTime);
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Course Completion System
    const setupModuleCompletion = () => {
        const currentModule = document.querySelector('.course-module:not(.module-locked)');
        if (!currentModule) return;

        const moduleId = currentModule.id;
        const moduleItem = document.querySelector(`.module-item[href="#${moduleId}"]`);
        const completeBtn = document.createElement('button');
        
        // Create completion button
        completeBtn.className = 'complete-module-btn';
        completeBtn.innerHTML = '<i class="fas fa-check-circle"></i> Mark as Completed';
        
        // Check if already completed
        if (localStorage.getItem(`module-${moduleId}-completed`)) {
            moduleItem.classList.add('completed');
            completeBtn.textContent = 'Completed!';
            completeBtn.disabled = true;
        }

        // Insert button before navigation
        const navContainer = currentModule.querySelector('.module-navigation');
        if (navContainer) {
            navContainer.prepend(completeBtn);
        }

        // Completion handler
        completeBtn.addEventListener('click', () => {
            // Confirm completion
            const confirmComplete = confirm('Have you completed all exercises in this module?');
            if (confirmComplete) {
                // Mark complete in UI
                moduleItem.classList.add('completed');
                completeBtn.innerHTML = '<i class="fas fa-check-circle"></i> Completed!';
                completeBtn.disabled = true;
                
                // Save to storage
                localStorage.setItem(`module-${moduleId}-completed`, 'true');
                
                // Update progress
                updateCourseProgress();
                
                // Unlock next module if exists
                const nextModuleItem = moduleItem.parentElement.nextElementSibling;
                if (nextModuleItem) {
                    nextModuleItem.classList.remove('locked');
                    nextModuleItem.querySelector('.fa-lock').className = 'fas fa-unlock';
                }
            }
        });
    };

    // Update progress bar
    const updateCourseProgress = () => {
        const totalModules = document.querySelectorAll('.module-item').length;
        const completedModules = document.querySelectorAll('.module-item.completed').length;
        const progressPercent = Math.round((completedModules / totalModules) * 100);
        
        document.querySelector('.progress-fill').style.width = `${progressPercent}%`;
        document.querySelector('.course-progress span').textContent = `${progressPercent}% Complete`;
    };

    // Initialize
    setupModuleCompletion();
    updateCourseProgress();

    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Copy code button functionality
    const copyBtns = document.querySelectorAll('.copy-btn');
    
    copyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const codeBlock = this.parentElement.querySelector('code');
            const textToCopy = codeBlock.textContent;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            });
        });
    });
    
    // Show answer buttons
    const showAnswerBtns = document.querySelectorAll('.show-answer');
    
    showAnswerBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
            this.textContent = answer.style.display === 'block' ? 'Hide Solution' : 'Show Solution';
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks && window.getComputedStyle(navLinks).display === 'flex') {
                    navLinks.style.display = 'none';
                }
            }
        });
    });
    
    // Load Pyodide (Python in the browser)
async function initPyodide() {
    let pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/"
    });
    return pyodide;
}

let pyodideInstance = null;

// Initialize editor functionality
function setupPythonEditor() {
    const runBtn = document.getElementById('run-btn');
    const resetBtn = document.getElementById('reset-btn');
    const clearOutputBtn = document.getElementById('clear-output');
    const codeArea = document.getElementById('python-code');
    const outputArea = document.getElementById('output');
    
    // Default starter code
    const defaultCode = `# Write your Python code here
print("Hello, LegendTech!")`;
    
    // Run Python code
    async function runCode() {
        if (!pyodideInstance) {
            outputArea.textContent = "Loading Python runtime...";
            pyodideInstance = await initPyodide();
            outputArea.textContent = "Python runtime ready!\n\n";
        }
        
        try {
            outputArea.textContent += ">>> Running your code...\n";
            const code = codeArea.value;
            let result = await pyodideInstance.runPythonAsync(code);
            if (result !== undefined) {
                outputArea.textContent += result + "\n";
            }
            outputArea.textContent += ">>> Execution finished.\n";
        } catch (error) {
            outputArea.textContent += "Error: " + error.message + "\n";
        }
        
        // Scroll to bottom of output
        outputArea.scrollTop = outputArea.scrollHeight;
    }
    
    // Reset editor
    function resetEditor() {
        if (confirm("Reset the code to default example?")) {
            codeArea.value = defaultCode;
            outputArea.textContent = "";
        }
    }
    
    // Clear output
    function clearOutput() {
        outputArea.textContent = "";
    }
    
    // Event listeners
    runBtn.addEventListener('click', runCode);
    resetBtn.addEventListener('click', resetEditor);
    clearOutputBtn.addEventListener('click', clearOutput);
    
    // Initialize with default code
    codeArea.value = defaultCode;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // ... your existing code ...
    
    setupPythonEditor();
});
}); // This closes the DOMContentLoaded event listener
console.log('Hello, World!')