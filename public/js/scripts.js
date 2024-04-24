document.addEventListener('DOMContentLoaded', () => {
    const addExperienceBtn = document.getElementById('addExperience');
    const addEducationBtn = document.getElementById('addEducation');
    const experienceFields = document.getElementById('experienceFields');
    const educationFields = document.getElementById('educationFields');
    const resumeForm = document.getElementById('resumeForm');
    const previewSection = document.getElementById('previewSection');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');
    const themeSelect = document.getElementById('theme');
    const saveResumeBtn = document.getElementById('saveResume');
    const previewBtn = document.getElementById('previewBtn');

    // Add Experience
    addExperienceBtn.addEventListener('click', () => {
        addField(experienceFields, 'experience');
    });

    // Add Education
    addEducationBtn.addEventListener('click', () => {
        addField(educationFields, 'education');
    });

    // Add Field Function
    function addField(container, type) {
        const fieldItem = document.createElement('div');
        fieldItem.className = `${type}-item mb-3`;
        fieldItem.innerHTML = `
            <input type="text" class="form-control" name="${type}Title[]" placeholder="${type.charAt(0).toUpperCase() + type.slice(1)} Title" required>
            <textarea class="form-control mt-2" name="${type}Description[]" placeholder="${type.charAt(0).toUpperCase() + type.slice(1)} Description" rows="2" required></textarea>
            <button type="button" class="btn btn-danger mt-2 remove-btn">Remove</button>
        `;
        container.appendChild(fieldItem);

        // Remove Field
        fieldItem.querySelector('.remove-btn').addEventListener('click', () => {
            container.removeChild(fieldItem);
        });
    }

    // Submit Form
    resumeForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(resumeForm);
        const resumeData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            summary: formData.get('summary'),
            experienceTitle: formData.getAll('experienceTitle[]'),
            experienceDescription: formData.getAll('experienceDescription[]'),
            educationTitle: formData.getAll('educationTitle[]'),
            educationDescription: formData.getAll('educationDescription[]')
        };

        fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resumeData)
        })
        .then(response => response.text())
        .then(html => {
            previewSection.innerHTML = html;
            downloadBtn.disabled = false;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // Theme Options
    themeSelect.addEventListener('change', () => {
        const selectedTheme = themeSelect.value;
        previewSection.className = `resume-preview ${selectedTheme}`;
    });

    // Save Resume
    saveResumeBtn.addEventListener('click', () => {
        const resumeContent = previewSection.innerHTML;
        localStorage.setItem('savedResume', resumeContent);
        alert('Resume saved successfully!');
    });

    // Check for saved resume on page load
    const savedResume = localStorage.getItem('savedResume');
    if (savedResume) {
        previewSection.innerHTML = savedResume;
        downloadBtn.disabled = false;
    }

    // Preview Resume
    previewBtn.addEventListener('click', () => {
        // Open a new window to display the preview
        const previewWindow = window.open('', '_blank');
        previewWindow.document.write('<html><head><title>Resume Preview</title><link rel="stylesheet" href="/css/styles.css"></head><body>');
        previewWindow.document.write(previewSection.innerHTML);
        previewWindow.document.write('</body></html>');
    });

    // Download Resume as PDF
    downloadBtn.addEventListener('click', () => {
        const resumeContent = previewSection.cloneNode(true);
        const navbar = resumeContent.querySelector('nav.navbar');
        const footer = resumeContent.querySelector('footer.footer');

        if (navbar) {
            navbar.parentNode.removeChild(navbar);
        }
        
        if (footer) {
            footer.parentNode.removeChild(footer);
        }

        const opt = {
            margin: 1,
            filename: 'resume.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = resumeContent.innerHTML;

        html2pdf().from(contentDiv).set(opt).save();
    });

    // Reset Form
    resetBtn.addEventListener('click', () => {
        resumeForm.reset();
        previewSection.innerHTML = '';
        downloadBtn.disabled = true;
    });
});
