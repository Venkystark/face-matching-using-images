// Select the video, canvas, and result elements from the HTML
var video = document.getElementById('video');
var canvas = document.getElementById('canvas');
var resultContainer = document.getElementById('result-container');
var resultElement = document.getElementById('result');
var resultimage=document.getElementById('res');

// Check if the browser supports getUserMedia
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // Request permission to access the camera
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
      // Set the video source to the stream from the camera
      video.srcObject = stream;
      video.play();
    })
    .catch(function(error) {
      console.log('Error accessing camera:', error);
    });
}

// Function to capture the picture
document.getElementById('capture-btn').addEventListener('click', function() {
  // Draw the current video frame onto the canvas
  var context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert the canvas image to base64 data URL
  var dataURL = canvas.toDataURL('image/jpeg');

  // Send the captured image to the server for matching
  sendImageToServer(dataURL);
});

// Function to send the image to the server for matching
function sendImageToServer(imageData) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/match', true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);

        // Display the match result
        //resultElement.textContent = response.result;
        //resultContainer.style.display = 'block';
        resultimage.src=response.image_url;
      } else {
        console.error('Error:', xhr.status);
      }
    }
  };

  var data = JSON.stringify({ image_data: imageData });
  xhr.send(data);
}  
