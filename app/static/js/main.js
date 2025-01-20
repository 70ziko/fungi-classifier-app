document.getElementById('image-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            previewContainer.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    } else {
        previewContainer.classList.add('hidden');
    }
});

document.getElementById('upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('image-input');
    const resultDiv = document.getElementById('result');
    const predictionText = document.getElementById('prediction');
    const confidenceText = document.getElementById('confidence');
    
    if (!fileInput.files.length) {
        alert('Please select an image first');
        return;
    }
    
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    
    try {
        const response = await fetch('/predict', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
            resultDiv.classList.remove('hidden');
            predictionText.textContent = `Predicted Species: ${result.label}`;
            confidenceText.textContent = `Confidence: ${(result.score * 100).toFixed(2)}%`;
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        alert('Error uploading image');
        console.error('Error:', error);
    }
});
