import {
  FilesetResolver,
  PoseLandmarker,
  DrawingUtils
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/+esm";

let poseLandmarker = null;

async function createPoseLandmarker() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  poseLandmarker = await PoseLandmarker.createFromOptions(
    vision,
    {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task",
        delegate: "GPU"
      },

      runningMode: "VIDEO",
      numPoses: 1
    }
  );

  console.log("Pose Landmarker loaded!");
}

createPoseLandmarker();
const uploadButton = document.getElementById("uploadButton");
const videoInput = document.getElementById("videoInput");
const videoPreview = document.getElementById("videoPreview");

const videoInfo = document.getElementById("videoInfo");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const videoDuration = document.getElementById("videoDuration");
const videoResolution = document.getElementById("videoResolution");
const analyzeButton = document.getElementById("analyzeButton");
const videoContainer = document.getElementById("videoContainer");
const poseCanvas = document.getElementById("poseCanvas");
const canvasCtx = poseCanvas.getContext("2d");
const drawingUtils = new DrawingUtils(canvasCtx);

let lastVideoTime = -1;

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
videoContainer.hidden = false;

analyzeButton.hidden = false;

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
const analysisResults = document.getElementById("analysisResults");

analyzeButton.addEventListener("click", function () {
  analysisResults.hidden = false;

  document.getElementById("elbowAngle").textContent = "87°";
  document.getElementById("kneeAngle").textContent = "112°";
  document.getElementById("bodyLean").textContent = "6°";
  document.getElementById("releaseHeight").textContent = "88%";
  document.getElementById("overallScore").textContent = "82 / 100";
});
function detectPose() {
  if (!poseLandmarker) {
    requestAnimationFrame(detectPose);
    return;
  }

  if (videoPreview.paused || videoPreview.ended) {
    return;
  }

  if (videoPreview.videoWidth === 0 || videoPreview.videoHeight === 0) {
    requestAnimationFrame(detectPose);
    return;
  }

  poseCanvas.width = videoPreview.videoWidth;
  poseCanvas.height = videoPreview.videoHeight;

  if (videoPreview.currentTime !== lastVideoTime) {
    const results = poseLandmarker.detectForVideo(
      videoPreview,
      performance.now()
    );

    lastVideoTime = videoPreview.currentTime;

    canvasCtx.clearRect(
      0,
      0,
      poseCanvas.width,
      poseCanvas.height
    );

    for (const landmarks of results.landmarks) {
      drawingUtils.drawConnectors(
        landmarks,
        PoseLandmarker.POSE_CONNECTIONS,
        {
          lineWidth: 3
        }
      );

      drawingUtils.drawLandmarks(
        landmarks,
        {
          radius: 4
        }
      );
    }
  }

  requestAnimationFrame(detectPose);
}

videoPreview.addEventListener("play", function () {
  detectPose();
});