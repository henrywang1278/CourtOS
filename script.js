const uploadButton = document.getElementById("uploadButton");
const videoInput = document.getElementById("videoInput");
const videoPreview = document.getElementById("videoPreview");

const videoInfo = document.getElementById("videoInfo");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const videoDuration = document.getElementById("videoDuration");
const videoResolution = document.getElementById("videoResolution");

uploadButton.addEventListener("click", function () {
  videoInput.click();
});

videoInput.addEventListener("change", function () {
  const file = videoInput.files[0];

  if (!file) {
    return;
  }

  const videoURL = URL.createObjectURL(file);

  videoPreview.src = videoURL;
  videoPreview.hidden = false;

  fileName.textContent = file.name;

  const sizeMB = file.size / 1024 / 1024;
  fileSize.textContent = sizeMB.toFixed(2) + " MB";

  videoPreview.addEventListener("loadedmetadata", function () {
    videoDuration.textContent =
      videoPreview.duration.toFixed(1) + " seconds";

    videoResolution.textContent =
      videoPreview.videoWidth +
      " × " +
      videoPreview.videoHeight;

    videoInfo.hidden = false;
  });
});