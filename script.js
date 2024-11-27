// Maximum file size (5MB in bytes)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

document.getElementById('uploadForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (file) {
    // Check the file size
    if (file.size > MAX_FILE_SIZE) {
      alert('File size exceeds 5MB. Please upload a smaller image.');
      return; // Stop the upload process
    }

    const reader = new FileReader();

    reader.onload = function (event) {
      const imageData = event.target.result;

      // Check if the image is a duplicate
      if (isImageDuplicate(imageData)) {
        alert('This image has already been uploaded!');
        return; // Stop if it's a duplicate
      }

      try {
        // Save the image to localStorage and update the gallery
        saveImageToLocalStorage(imageData);

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

    reader.readAsDataURL(file); // Start reading the file as Base64
  } else {
    alert('Please select a file to upload.');
  }
});

function saveImageToLocalStorage(imageData) {
  let images = JSON.parse(localStorage.getItem('images')) || [];
  images.push(imageData);

  try {
    localStorage.setItem('images', JSON.stringify(images));
  } catch (error) {
    console.error('Error storing image to localStorage:', error);
    throw new Error('LocalStorage quota exceeded. Try clearing old images.');
  }
}

function isImageDuplicate(imageData) {
  let images = JSON.parse(localStorage.getItem('images')) || [];
  return images.includes(imageData);
}

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

// Load images when the page is loaded
window.onload = function () {
  try {
    loadImagesFromLocalStorage();
    console.log('Images loaded successfully from localStorage.');
  } catch (error) {
    console.error('Error loading images from localStorage:', error);
  }
};
