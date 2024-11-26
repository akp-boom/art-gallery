// When the form is submitted, upload the image
document.getElementById('uploadForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      // Get the image data URL (Base64 string)
      const imageData = event.target.result;

      // Check if this image is already uploaded
      if (isImageDuplicate(imageData)) {
        alert('This image has already been uploaded!');
        return;  // Stop if it's a duplicate
      }

      // Create an image element and append it to the gallery
      const img = document.createElement('img');
      img.src = imageData;
      img.style.width = '200px';
      img.style.height = 'auto';

      // Add the image to the gallery
      const gallery = document.getElementById('drawingGallery');
      gallery.appendChild(img);

      // Save the image in localStorage
      saveImageToLocalStorage(imageData);
    };
    reader.readAsDataURL(file);
  }
});

// Function to save the image in localStorage
function saveImageToLocalStorage(imageData) {
  let images = JSON.parse(localStorage.getItem('images')) || [];
  images.push(imageData);
  localStorage.setItem('images', JSON.stringify(images));
}

// Function to check if the image is a duplicate
function isImageDuplicate(imageData) {
  let images = JSON.parse(localStorage.getItem('images')) || [];
  return images.includes(imageData);
}

// Function to load images from localStorage
function loadImagesFromLocalStorage() {
  const images = JSON.parse(localStorage.getItem('images')) || [];
  const gallery = document.getElementById('drawingGallery');
  
  // Display all images stored in localStorage
  images.forEach(function(imageData) {
    const img = document.createElement('img');
    img.src = imageData;
    img.style.width = '200px';
    img.style.height = 'auto';
    gallery.appendChild(img);
  });
}

// Load images when the page is loaded
window.onload = loadImagesFromLocalStorage;
