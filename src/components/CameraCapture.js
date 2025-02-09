"use client";

import { useEffect, useRef } from "react";

// CameraCapture Component for capturing images
export default function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Initialize camera on mount
  useEffect(() => {
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Failed to access camera. Please enable camera permissions.');
      }
    }
    initCamera();

    return () => {
      // Cleanup camera stream on unmount
      const stream = videoRef.current?.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // Capture image from video
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the image to Base64 and send to parent component
    const imageData = canvas.toDataURL('image/jpeg');
    onCapture(imageData);
  };

  return (
    <div className="camera-section">
      <video ref={videoRef} id="cameraPreview" autoPlay></video>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      <div className="button-group">
        <button className="btn btn-primary" onClick={captureImage}>Scan Waste</button>
      </div>
    </div>
  );
}
