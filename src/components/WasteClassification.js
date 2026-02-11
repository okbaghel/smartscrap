"use client"
import { useEffect, useState, useRef } from 'react';
import { Camera, RotateCcw, Sparkles, Award, CheckCircle, Leaf, Recycle, Trash2, AlertCircle } from 'lucide-react';

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

  // Get category icon and color
  const getCategoryInfo = () => {
    if (category === 'biodegradable') {
      return {
        icon: <Leaf className="w-12 h-12" />,
        gradient: 'from-green-500 to-emerald-600',
        bgGradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
        borderColor: 'border-green-500',
      };
    } else if (category === 'non-biodegradable') {
      return {
        icon: <Recycle className="w-12 h-12" />,
        gradient: 'from-blue-500 to-cyan-600',
        bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
        borderColor: 'border-blue-500',
      };
    } else {
      return {
        icon: <AlertCircle className="w-12 h-12" />,
        gradient: 'from-amber-500 to-yellow-600',
        bgGradient: 'from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
        borderColor: 'border-amber-500',
      };
    }
  };

  const categoryInfo = showResults ? getCategoryInfo() : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/30 py-8 px-4">
      <div className="container mx-auto max-w-6xl space-y-6">
        
        {/* Header Section */}
        <div className="text-center space-y-3 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 blur-3xl -z-10"></div>
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold mb-2">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Waste Scanner</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-800 dark:from-slate-100 dark:via-emerald-200 dark:to-teal-200 bg-clip-text text-transparent">
            EcoScan Waste Management
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Scan your household waste and earn rewards while helping the environment
          </p>
        </div>

        {/* Points Display */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Your Points</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{currentPoints}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Rewards Unlocked</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {rewards.length}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Camera Section */}
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-700 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Live Camera Feed</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Position your waste item in view</p>
              </div>
            </div>

            {/* Video Display */}
            <div className="relative rounded-xl overflow-hidden bg-slate-900 shadow-2xl">
              {stream ? (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                    autoPlay
                    playsInline
                  />
                  {/* Scanning Overlay */}
                  <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-xl pointer-events-none">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-lg"></div>
                  </div>
                </>
              ) : (
                <div className="w-full h-64 sm:h-80 lg:h-96 flex flex-col items-center justify-center">
                  <div className="animate-pulse p-4 bg-slate-800 rounded-full mb-4">
                    <Camera className="w-12 h-12 text-slate-500" />
                  </div>
                  <p className="text-slate-400 font-medium">Initializing Camera...</p>
                  <p className="text-sm text-slate-500 mt-2">Please allow camera access</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={captureImage}
                disabled={!stream}
                className="flex-1 group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative flex items-center justify-center gap-2">
                  <Camera className="w-5 h-5" />
                  Scan Waste
                </span>
              </button>
              {showResults && (
                <button 
                  onClick={rescan}
                  className="sm:w-auto group relative overflow-hidden bg-slate-600 hover:bg-slate-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <span className="flex items-center justify-center gap-2">
                    <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    Rescan
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {showResults ? (
              <>
                {/* Classification Result */}
                <div className={`bg-gradient-to-br ${categoryInfo.bgGradient} rounded-2xl shadow-xl p-6 border-2 ${categoryInfo.borderColor} space-y-4`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${categoryInfo.gradient} text-white shadow-lg`}>
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Scan Result</h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Classification complete</p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center space-y-4">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${categoryInfo.gradient} text-white shadow-xl`}>
                      {categoryInfo.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white capitalize mb-2">
                        {category} Waste
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        This waste belongs in the
                      </p>
                      <p className={`text-xl font-bold bg-gradient-to-r ${categoryInfo.gradient} bg-clip-text text-transparent mt-1`}>
                        {binType}
                      </p>
                    </div>

                    {/* Points Earned */}
                    <div className={`bg-gradient-to-r ${categoryInfo.bgGradient} rounded-lg p-4 border ${categoryInfo.borderColor}`}>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Points Earned</p>
                      <p className={`text-3xl font-bold bg-gradient-to-r ${categoryInfo.gradient} bg-clip-text text-transparent`}>
                        +{category === 'biodegradable' ? '50' : category === 'non-biodegradable' ? '30' : '20'} pts
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rewards Section */}
                {rewards.length > 0 && (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Unlocked Rewards</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Claim your rewards</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {rewards.map((reward, index) => (
                        <div 
                          key={index}
                          className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800 flex items-center gap-3"
                        >
                          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                            <CheckCircle className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900 dark:text-white">{reward.reward}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">Unlocked at {reward.threshold} points</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Instructions Card */
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-700 h-full flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md">
                  <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-xl">
                    <Trash2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Ready to Scan</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Position your waste item in front of the camera and click "Scan Waste" to identify the correct bin type and earn reward points.
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 text-sm text-slate-700 dark:text-slate-300">
                    <p className="font-semibold mb-2">💡 Tips for best results:</p>
                    <ul className="text-left space-y-1">
                      <li>• Ensure good lighting</li>
                      <li>• Hold item steady in frame</li>
                      <li>• Keep item centered</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden canvas for capturing image */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default WasteClassification;