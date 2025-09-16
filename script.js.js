// script.js - Complete JavaScript for AI Obituary Writer

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const form = document.getElementById('obituaryForm');
    const generateBtn = document.getElementById('generateBtn');
    const loading = document.getElementById('loading');
    const successMessage = document.getElementById('successMessage');
    const actionButtons = document.getElementById('actionButtons');
    const obituaryPreview = document.getElementById('obituaryPreview');
    const errorDiv = document.getElementById('error');
    
    // Replace this with your actual Google Apps Script URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxgrVkYwgxt9abNx923rj0jZRR5x4GgQnZpv502_yf6mu710OpYCeF1GBF5dCFofIK5yQ/exec';
    
    // Sample data for demonstration (fallback if API fails)
    const sampleObituaries = {
        formal: `<h3>Obituary of [Name]</h3>
        <p>[Name], [Age], of [Location], passed away on [Date]. [He/She] was born on [Birthdate] to [Parents].</p>
        <p>[Name] was a dedicated [Profession] who spent [Number] years working at [Company/Organization]. [He/She] was known for [Professional Achievements].</p>
        <p>[Name] is survived by [Family Members]. [He/She] was preceded in death by [Deceased Family Members].</p>
        <p>A funeral service will be held at [Location] on [Date] at [Time]. In lieu of flowers, donations may be made to [Charity].</p>`,
        
        heartfelt: `<h3>In Loving Memory of [Name]</h3>
        <p>It is with heavy hearts that we announce the passing of [Name], who left us on [Date] at the age of [Age].</p>
        <p>[Name] was a beloved [Relationship] known for [Personal Qualities]. [He/She] brought joy to everyone with [His/Her] [Positive Traits] and will be remembered for [Special Memories].</p>
        <p>[Name]'s greatest passion was [Hobby/Interest], and [He/She] loved spending time [Activity]. [He/She] leaves behind a legacy of [Legacy].</p>
        <p>[Name] will be deeply missed by [Family Members] and all who knew [Him/Her]. A celebration of [His/Her] life will be held on [Date].</p>`,
        
        celebratory: `<h3>Celebrating the Life of [Name]</h3>
        <p>We joyfully celebrate the remarkable life of [Name], who passed peacefully on [Date] at [Age] years young.</p>
        <p>[Name] lived life to the fullest, embracing every moment with [Positive Trait] and [Positive Trait]. [He/She] was known for [His/Her] infectious laugh and generous spirit.</p>
        <p>Throughout [His/Her] life, [Name] touched countless lives through [Contributions] and will be remembered for [Legacy].</p>
        <p>Join us in celebrating [Name]'s extraordinary life on [Date] at [Location]. In keeping with [His/Her] vibrant spirit, please wear [Attire Request].</p>`,
        
        religious: `<h3>In God's Care: [Name]</h3>
        <p>On [Date], the Lord called [Name] home to eternal rest at the age of [Age].</p>
        <p>[Name] was a faithful member of [Church/Parish] where [He/She] served as [Role]. [His/Her] strong faith and devotion to [Religious Values] inspired all who knew [Him/Her].</p>
        <p>We take comfort in knowing that [Name] is now at peace in the arms of our Lord. [He/She] leaves behind a legacy of faith and love.</p>
        <p>A Mass of Christian Burial will be celebrated at [Church] on [Date] at [Time]. Interment will follow at [Cemetery].</p>`
    };

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const name = formData.get('name');
        const age = formData.get('age');
        const details = formData.get('details');
        const tone = formData.get('tone');
        
        // Validate required fields
        if (!name || !details) {
            showError('Please fill in all required fields');
            return;
        }
        
        // Show loading state
        loading.style.display = 'block';
        generateBtn.disabled = true;
        successMessage.style.display = 'none';
        errorDiv.style.display = 'none';
        actionButtons.style.display = 'none';

        try {
            // Try to call the Google Script API first
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    name: name,
                    age: age,
                    details: details,
                    tone: tone
                })
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                // Display the generated obituary
                obituaryPreview.innerHTML = result.obituary;
                
                // Show success message and action buttons
                successMessage.style.display = 'block';
                actionButtons.style.display = 'flex';
            } else {
                // If API returns an error, use sample data
                useSampleData(name, age, details, tone);
            }
            
        } catch (error) {
            console.error('API Error:', error);
            // If API call fails, use sample data as fallback
            useSampleData(name, age, details, tone);
        } finally {
            // Hide loading state
            loading.style.display = 'none';
            generateBtn.disabled = false;
            
            // Scroll to preview
            obituaryPreview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });

    // Use sample data when API is not available
    function useSampleData(name, age, details, tone) {
        // Generate obituary based on tone
        let obituaryText = sampleObituaries[tone] || sampleObituaries.heartfelt;
        
        // Replace placeholders with actual data
        obituaryText = obituaryText.replace(/\[Name\]/g, name)
                                  .replace(/\[Age\]/g, age || '')
                                  .replace(/\[Details\]/g, details)
                                  .replace(/\[Date\]/g, new Date().toLocaleDateString());
        
        // Display the generated obituary
        obituaryPreview.innerHTML = obituaryText;
        
        // Show success message and action buttons
        successMessage.style.display = 'block';
        actionButtons.style.display = 'flex';
        
        // Show info message that sample data is being used
        showError('Note: Using sample data as the AI service is temporarily unavailable. Your obituary is still beautifully formatted.', 'info');
    }

    // Show error message
    function showError(message, type = 'error') {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        errorDiv.className = type === 'error' ? 'error' : 'error info';
    }

    // FAQ accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isVisible = answer.classList.contains('show');
            
            // Close all answers first
            document.querySelectorAll('.faq-answer').forEach(ans => {
                ans.classList.remove('show');
            });
            document.querySelectorAll('.faq-question i').forEach(icon => {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            });
            
            // Toggle current answer if it wasn't already open
            if (!isVisible) {
                answer.classList.add('show');
                question.querySelector('i').classList.remove('fa-chevron-down');
                question.querySelector('i').classList.add('fa-chevron-up');
            }
        });
    });
});

// Copy text to clipboard
function copyText() {
    const obituaryText = document.getElementById('obituaryPreview').innerText;
    navigator.clipboard.writeText(obituaryText)
        .then(() => {
            alert('Obituary copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy text. Please try again.');
        });
}

// Download as PDF (simplified version)
function downloadPDF() {
    const obituaryText = document.getElementById('obituaryPreview').innerText;
    const blob = new Blob([obituaryText], { type: 'text/plain' });
    const a = document.createElement('a');
    a.download = 'obituary.txt';
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
}

// Reset form
function resetForm() {
    document.getElementById('obituaryForm').reset();
    document.getElementById('obituaryPreview').innerHTML = 
        '<p>Your generated obituary will appear here. Our AI will create a respectful and personalized tribute based on the information you provide.</p>';
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('actionButtons').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    
    // Scroll back to form
    document.getElementById('obituaryForm').scrollIntoView({ behavior: 'smooth' });
}