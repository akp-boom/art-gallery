<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDiVWfJdqJO4XL9EN9AATGPe95owwTI5oM",
    authDomain: "art-challangr.firebaseapp.com",
    projectId: "art-challangr",
    storageBucket: "art-challangr.firebasestorage.app",
    messagingSenderId: "567075818296",
    appId: "1:567075818296:web:cd4cf4a65b90a1df5acfcd"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
</script>
  // Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

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

      // Check for duplicate images
      if (isImageDuplicate(imageData)) {
        alert('This image has already been uploaded!');
        return;
      }

      try {
        // Save image to localStorage
        saveImageToLocalStorage(imageData);

        // Add image to the gallery
        const img = document.createElement('img');
        img.src = imageData;
        img.style.width = '200px';
        img.style.height = 'auto';
        document.getElementById('drawingGallery').appendChild(img);

        console.log('Image uploaded successfully!');
      } catch (error) {
        console.error('Error saving image:', error);
        alert('An error occurred while uploading the image. Please try again.');
      }
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

// Function to Save an Image to LocalStorage
function saveImageToLocalStorage(imageData) {
  let images = JSON.parse(localStorage.getItem('images')) || [];

  try {
    images.push(imageData); // Add new image to the list
    localStorage.setItem('images', JSON.stringify(images)); // Save updated list to localStorage
  } catch (error) {
    if (isQuotaExceeded(error)) {
      alert('Storage limit exceeded! Please clear the gallery or reduce image sizes.');
    } else {
      console.error('Error storing image:', error);
      throw error;
    }
  }
}

// Function to Check if an Image is a Duplicate
function isImageDuplicate(imageData) {
  const images = JSON.parse(localStorage.getItem('images')) || [];
  return images.includes(imageData);
}

// Function to Check if the Storage Quota is Exceeded
function isQuotaExceeded(e) {
  if (e) {
    if (e.code === 22 || e.code === 1014 || e.name === 'QuotaExceededError') {
      return true;
    }
  }
  return false;
}

// Function to Load Images from LocalStorage into the Gallery
function loadImagesFromLocalStorage() {
  const images = JSON.parse(localStorage.getItem('images')) || [];
  const gallery = document.getElementById('drawingGallery');

  images.forEach(function (imageData) {
    const img = document.createElement('img');
    img.src = imageData;
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
  try {
    loadImagesFromLocalStorage(); // Load persisted images into the gallery
    console.log('Images loaded successfully from localStorage.');
  } catch (error) {
    console.error('Error loading images from localStorage:', error);
  }
};
