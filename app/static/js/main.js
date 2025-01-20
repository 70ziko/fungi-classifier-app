document.getElementById('image-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const resultDiv = document.getElementById('result');
    
    document.getElementById('scientific-name').textContent = '';
    document.getElementById('common-name').textContent = '';
    document.getElementById('taxonomy-list').innerHTML = '';
    document.getElementById('confidence').textContent = '';
    resultDiv.classList.add('hidden');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            previewContainer && previewContainer.classList.remove('hidden');
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
            
            const speciesInfo = result.species_info;
            document.getElementById('scientific-name').textContent = speciesInfo.scientific_name;
            document.getElementById('common-name').textContent = `Common name: ${speciesInfo.common_name}`;
            
            const taxonomyList = document.getElementById('taxonomy-list');
            taxonomyList.innerHTML = `
                <li>Kingdom: ${speciesInfo.kingdom}</li>
                <li>Phylum: ${speciesInfo.phylum}</li>
                <li>Family: ${speciesInfo.family}</li>
                <li>Genus: ${speciesInfo.genus}</li>
            `;
            
            document.getElementById('confidence').textContent = 
                `Confidence: ${(result.score * 100).toFixed(2)}%`;
            
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        alert('Error uploading image');
        console.error('Error:', error);
    }
});
