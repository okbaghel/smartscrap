"use client"
import { useEffect, useState, useRef } from 'react';

const WasteClassification = () => {
  const [stream, setStream] = useState(null);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [category, setCategory] = useState('');
  const [rewards, setRewards] = useState([]);
  const [binType, setBinType] = useState('');
  const videoRef = useRef(null); // Using useRef for the video element
  const canvasRef = useRef(null); // Using useRef for canvas to capture image

  // Initialize the camera on component mount
  useEffect(() => {
    const initCamera = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(userStream);
        if (videoRef.current) {
          videoRef.current.srcObject = userStream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Failed to access camera. Please enable camera permissions.');
      }
    };

    // Only initialize the camera once when the component mounts
    if (!stream) {
      initCamera();
    }

    return () => {
      // Cleanup the stream when the component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Function to classify waste (This is a placeholder logic)
  const classifyWaste = (image) => {
    const categories = ['biodegradable', 'non-biodegradable', 'mixture'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    let bin = '';
    if (randomCategory === 'biodegradable') bin = 'Green Bin';
    else if (randomCategory === 'non-biodegradable') bin = 'Blue Bin';
    else bin = 'Yellow Bin';

    setBinType(bin);
    setTimeout(() => showResult(randomCategory), 1500);
  };

  // Capture image from video feed
  const captureImage = () => {
    if (videoRef.current) {
      // Get the canvas and context
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      // Set canvas size to match video size
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      // Draw the video frame onto the canvas
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      // Get the image data from the canvas
      const image = canvas.toDataURL('image/jpeg');
      classifyWaste(image);
    } else {
      alert('Camera not ready yet.');
    }
  };

  // Show the result after classification
  const showResult = (category) => {
    setCategory(category);
    setShowResults(true);
    updateRewards(category);
  };

  // Update reward points based on waste category
  const updateRewards = (category) => {
    const pointsMap = {
      'biodegradable': 50,
      'non-biodegradable': 30,
      'mixture': 20,
    };

    const newPoints = currentPoints + pointsMap[category];
    setCurrentPoints(newPoints);

    const rewardsList = [
      { threshold: 100, reward: '₹100 Shopping Voucher' },
      { threshold: 200, reward: 'Eco-friendly Kit' },
      { threshold: 500, reward: 'Smart Bin Discount Coupon' },
    ];

    const availableRewards = rewardsList.filter(r => newPoints >= r.threshold);
    setRewards(availableRewards);
  };

  // Rescan to reset the state
  const rescan = () => {
    setShowResults(false);
    setCategory('');
    setBinType('');
    setRewards([]);
    setCurrentPoints(0);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="header text-center mb-6">
        <h1 className="text-3xl font-semibold text-white">EcoScan Waste Management</h1>
        <p className="text-lg text-gray-200">Scan your household waste and earn rewards</p>
      </div>

      <div className="camera-section bg-white bg-opacity-20 rounded-lg p-6 mb-6 backdrop-blur-md">
        {/* Display the video stream */}
        {stream ? (
          <video
            ref={videoRef}
            style={{
              width: '100%',
              height: '400px',
              borderRadius: '10px',
              objectFit: 'cover',
              marginBottom: '1.5rem',
              border: '2px solid #fff',
            }}
            autoPlay
            playsInline
          />
        ) : (
          <p className="text-white">Loading Camera...</p>
        )}

        <div className="flex justify-center gap-4">
          <button 
            onClick={captureImage}
            className="bg-blue-500 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-blue-600"
          >
            Scan Waste
          </button>
          {showResults && (
            <button 
              onClick={rescan}
              className="bg-gray-500 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-gray-600"
            >
              Rescan
            </button>
          )}
        </div>
      </div>

      {showResults && (
        <div className="result-section bg-white bg-opacity-20 rounded-lg p-6 mb-6 backdrop-blur-md">
          <h2 className="text-2xl font-semibold text-center text-primary">Scan Result</h2>
          <div className="category-display">
            <div className="bg-white p-4 my-4 rounded-lg shadow-lg text-center">
              <h3 className="text-xl text-primary font-semibold capitalize">{category} Waste</h3>
              <p className="mt-2 text-primary">This waste belongs in the <strong>{binType}</strong>.</p>
            </div>
          </div>

        </div>
      )}

      {/* Hidden canvas for capturing image */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default WasteClassification;
