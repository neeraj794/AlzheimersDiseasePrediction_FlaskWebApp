// Wait for the HTML content to fully load before running the script
document.addEventListener("DOMContentLoaded", () => {
    
    // --- 0. CONFIGURATION ---
    // This is the URL where your Flask backend is running.
    const API_URL = "http://localhost:5000/predict";

    // --- 1. GET ALL DOM ELEMENTS ---
    const fileUploader = document.getElementById('file-uploader');
    const fileLabelText = document.getElementById('file-label-text');
    const imagePreview = document.getElementById('image-preview');
    const classifyBtn = document.getElementById('classify-btn');
    const resultsArea = document.getElementById('results-area');
    const spinner = document.getElementById('spinner');
    const defaultText = document.getElementById('default-text');
    const errorText = document.getElementById('error-text');
    const predictionBox = document.getElementById('prediction-box');
    const confidenceText = document.getElementById('confidence-text');
    const progressBarFill = document.getElementById('progress-bar-fill');

    let uploadedFile = null;

    // --- 2. FILE UPLOADER LOGIC ---
    fileUploader.addEventListener('change', (event) => {
        const files = event.target.files;
        if (files && files[0]) {
            uploadedFile = files[0];
            const reader = new FileReader();

            // Show image preview
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.classList.remove('hidden');
            };
            
            reader.readAsDataURL(uploadedFile);
            
            // Update UI
            fileLabelText.textContent = uploadedFile.name;
            classifyBtn.disabled = false;
            defaultText.classList.add('hidden');
            resultsArea.classList.add('hidden');
            errorText.classList.add('hidden');
        }
    });

    // --- 3. CLASSIFY BUTTON LOGIC ---
    classifyBtn.addEventListener('click', async () => {
        if (!uploadedFile) return;

        // Reset UI for new prediction
        spinner.classList.remove('hidden');
        resultsArea.classList.add('hidden');
        classifyBtn.disabled = true;
        errorText.classList.add('hidden');
        
        // Create FormData to send the file to the API
        const formData = new FormData();
        formData.append('file', uploadedFile);

        try {
            // Send file to Flask backend API
            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Handle prediction
            if (data.error) {
                throw new Error(data.error);
            }
            
            // Update the UI with the results
            displayResults(data.class, data.confidence);

        } catch (err) {
            // Handle any errors
            console.error("Fetch error:", err);
            errorText.textContent = `Error: ${err.message}. Please try again.`;
            errorText.classList.remove('hidden');
        } finally {
            // Clean up UI
            spinner.classList.add('hidden');
            classifyBtn.disabled = false;
        }
    });

    // --- 4. FUNCTION TO DISPLAY RESULTS ---
    function displayResults(predClass, confidence) {
        const confidencePercent = (confidence * 100).toFixed(2);
        
        // Update text
        predictionBox.textContent = predClass;
        confidenceText.textContent = `Confidence: ${confidencePercent}%`;
        
        // Update progress bar
        progressBarFill.style.width = `${confidencePercent}%`;
        progressBarFill.textContent = `${confidencePercent}%`;

        // Set colors based on class
        predictionBox.className = "prediction-box"; // Reset classes
        if (predClass === 'NonDemented') {
            predictionBox.classList.add('info');
        } else if (predClass === 'VeryMildDemented' || predClass === 'MildDemented') {
            predictionBox.classList.add('warning');
        } else {
            predictionBox.classList.add('error');
        }
        
        // Show results
        resultsArea.classList.remove('hidden');
    }
});
