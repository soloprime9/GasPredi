'use client';
import React, { useState, useRef, useEffect } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";

const GasDetector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [gasLevel, setGasLevel] = useState(null);
  const [model, setModel] = useState(null);

  // Load TensorFlow Model on Component Mount
  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await mobilenet.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  // Start Camera
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  // Real-Time Analysis Every 3 Seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && model) {
        analyzeGasLevel();
      }
    }, 3000); // Run every 3 seconds

    return () => clearInterval(interval);
  }, [model]);

  // Function to Process Image & Detect Gas Level
  const analyzeGasLevel = async () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Capture Frame from Video
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const predictions = await model.classify(canvas);

    console.log("Predictions:", predictions);

    // AI Logic for Gas Detection (Basic Brightness Check)
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let totalBrightness = 0;
    let pixelCount = imageData.data.length / 4;

    for (let i = 0; i < imageData.data.length; i += 4) {
      let brightness = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
      totalBrightness += brightness;
    }

    let avgBrightness = totalBrightness / pixelCount;
    let estimatedGasLevel = Math.max(0, Math.min(100, (avgBrightness / 255) * 100));

    setGasLevel(Math.round(estimatedGasLevel));
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mt-6">Real-Time Gas Level Detector</h1>
      <video ref={videoRef} autoPlay className="w-80 h-60 bg-black mt-4" />
      <canvas ref={canvasRef} width={300} height={200} className="hidden" />
      <button onClick={startCamera} className="bg-blue-500 px-4 py-2 mt-4 rounded">
        Enable Camera
      </button>
      {gasLevel !== null && (
        <p className="text-xl mt-4">Estimated Gas Level: {gasLevel.toFixed(2)}%</p>
      )}
    </div>
  );
};

export default GasDetector;
