document.getElementById('uploadForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = document.createElement('img');
      img.src = event.target.result;
      img.style.width = '200px';
      img.style.height = 'auto';
      
      document.getElementById('drawingGallery').appendChild(img);
    };
    reader.readAsDataURL(file);
  }
});
