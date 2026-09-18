const uploadButton = document.getElementById("uploadButton");
const videoInput = document.getElementById("videoInput");
const videoPreview = document.getElementById("videoPreview");

uploadButton.addEventListener("click", function () {
  videoInput.click();
});

videoInput.addEventListener("change", function () {
  const file = videoInput.files[0];

  if (file) {
    const videoURL = URL.createObjectURL(file);

    videoPreview.src = videoURL;
    videoPreview.hidden = false;
  }
});