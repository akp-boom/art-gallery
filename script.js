// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const API_KEY = 'e06a1e55f4b625831c198f99c18eb569'; // Your Imgbb API Key

// Event Listener for the Upload Form
document.getElementById('uploadForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (file) {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      alert('File size exceeds 5MB. Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
      const imageData = event.target.result;

      // Upload image to Imgbb
      uploadImageToImgbb(imageData);
    };

    reader.onerror = function (error) {
      console.error('Error reading file:', error);
      alert('There was an issue reading the file. Please try a different file.');
    };

    reader.readAsDataURL(file); // Read file as Base64 string
  } else {
    alert('Please select a file to upload.');
  }
});

// Function to Upload Image to Imgbb
function uploadImageToImgbb(imageData) {
  const formData = new FormData();
  formData.append('image', imageData);

  fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      const imageUrl = data.data.url; // Get the public image URL from Imgbb
      console.log('Image uploaded successfully!');

      // Add image to gallery
      addImageToGallery(imageUrl);

      // Optionally, save the image URL to a list (localStorage or a database)
      saveImageUrl(imageUrl);
    } else {
      console.error('Error uploading image:', data.error.message);
      alert('Failed to upload image. Please try again.');
    }
  })
  .catch(error => {
    console.error('Error with the Imgbb API:', error);
    alert('An error occurred while uploading the image.');
  });
}

// Function to Add Image to Gallery
function addImageToGallery(imageUrl) {
  const img = document.createElement('img');
  img.src = imageUrl;
  img.style.width = '200px';
  img.style.height = 'auto';
  document.getElementById('drawingGallery').appendChild(img);
}

// Function to Save Image URL (For Persistence)
function saveImageUrl(imageUrl) {
  let images = JSON.parse(localStorage.getItem('images')) || [];
  images.push(imageUrl);
  localStorage.setItem('images', JSON.stringify(images)); // Save URLs to localStorage
}

// Function to Load Images from LocalStorage into the Gallery
function loadImagesFromLocalStorage() {
  const images = JSON.parse(localStorage.getItem('images')) || [];
  const gallery = document.getElementById('drawingGallery');

  images.forEach(function (imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.width = '200px';
    img.style.height = 'auto';
    gallery.appendChild(img);
  });
}

// Function to Clear the Gallery and LocalStorage
function clearGallery() {
  if (confirm('Are you sure you want to clear all images from the gallery?')) {
    localStorage.removeItem('images'); // Remove all images from localStorage
    document.getElementById('drawingGallery').innerHTML = ''; // Clear the gallery on the page
    alert('Gallery cleared!');
  }
}

// Load Images When the Page is Loaded
window.onload = function () {
  loadImagesFromLocalStorage(); // Load persisted images into the gallery
  console.log('Images loaded successfully from localStorage.');
};
