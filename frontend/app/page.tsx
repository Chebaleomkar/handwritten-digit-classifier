'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'cnn' | 'mlp'>('cnn');
  const [prediction, setPrediction] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 15;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent).clientX - rect.left;
      y = (e as React.MouseEvent).clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setPrediction(null);
        setConfidence(null);
        setError(null);
      }
    }
  };

  const predict = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setLoading(true);
    setError(null);

    try {
      // Get base64 image
      const imageBase64 = canvas.toDataURL('image/png');

      const response = await fetch(`http://localhost:8000/predict/${selectedModel}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_base64: imageBase64 }),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const data = await response.json();
      setPrediction(data.prediction);
      setConfidence(data.confidence);
    } catch (err) {
      setError('Error connecting to backend. Is it running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[100px]"></div>
      </div>

      <div className="w-full max-w-4xl glass-panel rounded-3xl p-8 sm:p-12 flex flex-col items-center gap-8 animate-fade-in">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Handwritten Digit Classifier
          </h1>
          <p className="text-lg text-gray-400 font-medium mt-10 max-sm:mt-5">
            created by <span className="text-white font-semibold">Omkar Chebale</span>
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 w-full items-center justify-center">

          {/* Controls & Input */}
          <div className="flex flex-col gap-6 items-center">

            {/* Model Selector */}
            <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setSelectedModel('cnn')}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${selectedModel === 'cnn'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                CNN Model
              </button>
              <button
                onClick={() => setSelectedModel('mlp')}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${selectedModel === 'mlp'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                MLP Model
              </button>
            </div>

            {/* Canvas */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-black rounded-xl border border-slate-700 overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={280}
                  height={280}
                  className="cursor-crosshair touch-none"
                  onMouseDown={startDrawing}
                  onMouseUp={stopDrawing}
                  onMouseOut={stopDrawing}
                  onMouseMove={draw}
                  onTouchStart={startDrawing}
                  onTouchEnd={stopDrawing}
                  onTouchMove={draw}
                />
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={clearCanvas}
                  className="p-2 bg-slate-800/80 text-white rounded-lg hover:bg-red-500/80 transition-colors backdrop-blur-sm border border-slate-700"
                  title="Clear Canvas"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                </button>
              </div>
            </div>

            <button
              onClick={predict}
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Predict Digit'}
            </button>
          </div>

          {/* Results */}
          <div className="flex flex-col items-center justify-center w-full max-w-xs">
            <div className="w-full aspect-square rounded-2xl bg-slate-800/50 border border-slate-700 flex flex-col items-center justify-center p-8 relative overflow-hidden">
              {prediction !== null ? (
                <>
                  <div className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Prediction</div>
                  <div className="text-9xl font-bold text-white mb-4 animate-scale-in">
                    {prediction}
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-full border border-slate-700">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm text-slate-300">
                      {(confidence! * 100).toFixed(1)}% Confidence
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center text-slate-500">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <p>Draw a digit and click predict</p>
                </div>
              )}

              {error && (
                <div className="absolute inset-0 bg-red-900/90 backdrop-blur-sm flex items-center justify-center p-6 text-center">
                  <p className="text-white font-medium">{error}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
