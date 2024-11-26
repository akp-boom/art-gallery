<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Art Challenge</title>
  <script type="module">
    // Import Firebase modules
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
    import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";
    import { getDatabase, ref as dbRef, set, push } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

    // Firebase configuration
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

    // Get references to Firebase services
    const storage = getStorage(app);
    const database = getDatabase(app);

    // Select HTML elements
    const fileInput = document.getElementById('fileInput');
    const uploadForm = document.getElementById('uploadForm');

    // Upload image handling
    uploadForm.addEventListener('submit', function (e) {
      e.preventDefault();  // Prevent default form submission

      const file = fileInput.files[0];  // Get the selected file
      if (file && file.size <= 5 * 1024 * 1024) {  // Validate file size
        const storageRef = ref(storage, 'drawings/' + file.name);  // Reference to Firebase Storage
        uploadBytes(storageRef, file).then((snapshot) => {  // Upload file
          console.log('Uploaded a file!', snapshot);
          getDownloadURL(snapshot.ref).then((downloadURL) => {  // Get the download URL of the image
            saveImageURLToDatabase(downloadURL);  // Save the URL to Firebase Realtime Database
          });
        });
      } else {
        alert('File size is too large! Maximum size is 5MB.');
      }
    });

    // Save the image URL in Firebase Realtime Database
    function saveImageURLToDatabase(url) {
      const imagesRef = dbRef(database, 'images');  // Reference to images node in DB
      const newImageRef = push(imagesRef);  // Create a new entry for the image
      set(newImageRef, {
        url: url,
        timestamp: Date.now()  // Save the timestamp to order images later
      }).then(function () {
        alert('Image uploaded successfully!');
        loadImages();  // Refresh the gallery
      }).catch(function (error) {
        alert('Error saving image URL: ' + error.message);
      });
    }

    // Display images from Firebase Realtime Database
    function loadImages() {
      const imagesRef = dbRef(database, 'images');  // Reference to images node in DB
      imagesRef.once('value').then(function(snapshot) {
        const imagesContainer = document.getElementById('imagesContainer');
        imagesContainer.innerHTML = '';  // Clear the gallery
        snapshot.forEach(function(childSnapshot) {
          const imageData = childSnapshot.val();
          const imgElement = document.createElement('img');
          imgElement.src = imageData.url;  // Set the image URL
          imgElement.alt = 'Uploaded Artwork';
          imgElement.style.width = '200px';
          imgElement.style.margin = '10px';
          imagesContainer.appendChild(imgElement);  // Add image to the gallery
        });
      });
    }

    // Load images when the page loads
    window.onload = loadImages;

  </script>
</head>
<body>
  <h1>Art Challenge</h1>

  <form id="uploadForm">
    <label for="fileInput">Upload your drawing (Max 5MB):</label><br>
    <input type="file" id="fileInput" accept="image/*"><br><br>
    <button type="submit">Upload</button>
  </form>

  <h2>Gallery</h2>
  <div id="imagesContainer">
    <!-- Images will be displayed here -->
  </div>

</body>
</html>
