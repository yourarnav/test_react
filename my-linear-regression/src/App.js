import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ReferenceLine } from 'recharts';
import { Play, Pause, RotateCcw, TrendingUp, BarChart3, Zap } from 'lucide-react';

const LinearRegressionDemo = () => {
  const [slope, setSlope] = useState(2);
  const [intercept, setIntercept] = useState(10);
  const [noise, setNoise] = useState(5);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dataPoints, setDataPoints] = useState([]);
  const [showPredictionLine, setShowPredictionLine] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState(null);

  // Generate sample data points
  const generateDataPoints = (numPoints = 50) => {
    const points = [];
    for (let i = 0; i < numPoints; i++) {
      const x = Math.random() * 20;
      const trueY = slope * x + intercept;
      const noisyY = trueY + (Math.random() - 0.5) * noise * 2;
      points.push({
        x: parseFloat(x.toFixed(2)),
        y: parseFloat(noisyY.toFixed(2)),
        trueY: parseFloat(trueY.toFixed(2)),
        id: i
      });
    }
    return points.sort((a, b) => a.x - b.x);
  };

  // Calculate actual best fit line using least squares
  const calculateBestFit = useMemo(() => {
    if (dataPoints.length < 2) return { slope: 0, intercept: 0, r2: 0 };
    
    const n = dataPoints.length;
    const sumX = dataPoints.reduce((sum, point) => sum + point.x, 0);
    const sumY = dataPoints.reduce((sum, point) => sum + point.y, 0);
    const sumXY = dataPoints.reduce((sum, point) => sum + point.x * point.y, 0);
    const sumX2 = dataPoints.reduce((sum, point) => sum + point.x * point.x, 0);
    const sumY2 = dataPoints.reduce((sum, point) => sum + point.y * point.y, 0);
    
    const bestSlope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const bestIntercept = (sumY - bestSlope * sumX) / n;
    
    // Calculate R²
    const meanY = sumY / n;
    const totalSS = dataPoints.reduce((sum, point) => sum + Math.pow(point.y - meanY, 2), 0);
    const residualSS = dataPoints.reduce((sum, point) => {
      const predicted = bestSlope * point.x + bestIntercept;
      return sum + Math.pow(point.y - predicted, 2);
    }, 0);
    const r2 = 1 - (residualSS / totalSS);
    
    return {
      slope: parseFloat(bestSlope.toFixed(3)),
      intercept: parseFloat(bestIntercept.toFixed(3)),
      r2: parseFloat(Math.max(0, r2).toFixed(3))
    };
  }, [dataPoints]);

  // Generate regression line data
  const regressionLine = useMemo(() => {
    if (dataPoints.length === 0) return [];
    const minX = Math.min(...dataPoints.map(p => p.x));
    const maxX = Math.max(...dataPoints.map(p => p.x));
    return [
      { x: minX, y: calculateBestFit.slope * minX + calculateBestFit.intercept },
      { x: maxX, y: calculateBestFit.slope * maxX + calculateBestFit.intercept }
    ];
  }, [dataPoints, calculateBestFit]);

  // Generate current parameter line
  const currentLine = useMemo(() => {
    if (dataPoints.length === 0) return [];
    const minX = Math.min(...dataPoints.map(p => p.x));
    const maxX = Math.max(...dataPoints.map(p => p.x));
    return [
      { x: minX, y: slope * minX + intercept },
      { x: maxX, y: slope * maxX + intercept }
    ];
  }, [dataPoints, slope, intercept]);

  // Initialize data points
  useEffect(() => {
    setDataPoints(generateDataPoints());
  }, []);

  // Animation effect
  useEffect(() => {
    let interval;
    if (isAnimating) {
      interval = setInterval(() => {
        setSlope(prev => prev + (Math.random() - 0.5) * 0.2);
        setIntercept(prev => prev + (Math.random() - 0.5) * 2);
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isAnimating]);

  const resetToOptimal = () => {
    setSlope(calculateBestFit.slope);
    setIntercept(calculateBestFit.intercept);
    setIsAnimating(false);
  };

  const generateNewData = () => {
    setDataPoints(generateDataPoints());
    setIsAnimating(false);
  };

  const calculateMSE = () => {
    if (dataPoints.length === 0) return 0;
    const mse = dataPoints.reduce((sum, point) => {
      const predicted = slope * point.x + intercept;
      return sum + Math.pow(point.y - predicted, 2);
    }, 0) / dataPoints.length;
    return parseFloat(mse.toFixed(2));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Interactive Linear Regression
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Explore how slope and intercept parameters affect the regression line. Watch the magic of machine learning unfold!
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Visualization Panel */}
          <div className="xl:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <h2 className="text-2xl font-bold text-white">Live Regression Plot</h2>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsAnimating(!isAnimating)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isAnimating 
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30' 
                        : 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
                    }`}
                  >
                    {isAnimating ? <Pause size={16} /> : <Play size={16} />}
                    {isAnimating ? 'Pause' : 'Animate'}
                  </button>
                  <button
                    onClick={generateNewData}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-300"
                  >
                    <RotateCcw size={16} />
                    New Data
                  </button>
                </div>
              </div>

              {/* Chart Container */}
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="x" 
                      type="number" 
                      domain={['dataMin - 1', 'dataMax + 1']} 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis 
                      dataKey="y" 
                      type="number" 
                      domain={['dataMin - 5', 'dataMax + 5']} 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-black/80 backdrop-blur-lg rounded-lg p-3 border border-white/20">
                              <p className="text-white font-medium">Point Data</p>
                              <p className="text-blue-300">X: {data.x}</p>
                              <p className="text-green-300">Y: {data.y}</p>
                              <p className="text-purple-300">Predicted: {(slope * data.x + intercept).toFixed(2)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    
                    {/* Data Points */}
                    <Scatter 
                      data={dataPoints} 
                      fill="#60A5FA"
                      fillOpacity={0.8}
                      stroke="#3B82F6"
                      strokeWidth={2}
                    />
                    
                    {/* Current Parameter Line */}
                    <Line 
                      data={currentLine}
                      type="linear"
                      dataKey="y"
                      stroke="#EF4444"
                      strokeWidth={3}
                      dot={false}
                      strokeDasharray="5 5"
                    />
                    
                    {/* Best Fit Line */}
                    {showPredictionLine && (
                      <Line 
                        data={regressionLine}
                        type="linear"
                        dataKey="y"
                        stroke="#10B981"
                        strokeWidth={3}
                        dot={false}
                      />
                    )}
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                  <span className="text-slate-300">Data Points</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-red-400 rounded"></div>
                  <span className="text-slate-300">Your Line</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-green-400 rounded"></div>
                  <span className="text-slate-300">Best Fit Line</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Parameter Controls */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="text-purple-400" size={24} />
                <h3 className="text-xl font-bold text-white">Parameters</h3>
              </div>
              
              <div className="space-y-6">
                {/* Slope Control */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-slate-300 font-medium">Slope (m)</label>
                    <span className="text-purple-400 font-mono text-lg">{slope.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.1"
                    value={slope}
                    onChange={(e) => setSlope(parseFloat(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>-5</span>
                    <span>0</span>
                    <span>5</span>
                  </div>
                </div>

                {/* Intercept Control */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-slate-300 font-medium">Intercept (b)</label>
                    <span className="text-blue-400 font-mono text-lg">{intercept.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="0.5"
                    value={intercept}
                    onChange={(e) => setIntercept(parseFloat(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>0</span>
                    <span>25</span>
                    <span>50</span>
                  </div>
                </div>

                {/* Noise Control */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-slate-300 font-medium">Noise Level</label>
                    <span className="text-orange-400 font-mono text-lg">{noise.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={noise}
                    onChange={(e) => setNoise(parseFloat(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>0</span>
                    <span>7.5</span>
                    <span>15</span>
                  </div>
                </div>

                <button
                  onClick={resetToOptimal}
                  className="w-full mt-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Zap size={16} />
                  Snap to Best Fit
                </button>
              </div>
            </div>

            {/* Statistics Panel */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="text-green-400" size={24} />
                <h3 className="text-xl font-bold text-white">Statistics</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-300">Your Equation:</span>
                  <span className="text-purple-400 font-mono">y = {slope.toFixed(2)}x + {intercept.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-300">Best Fit:</span>
                  <span className="text-green-400 font-mono">y = {calculateBestFit.slope}x + {calculateBestFit.intercept}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-300">R² Score:</span>
                  <span className="text-blue-400 font-mono">{calculateBestFit.r2}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-300">Mean Squared Error:</span>
                  <span className="text-red-400 font-mono">{calculateMSE()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-300">Data Points:</span>
                  <span className="text-orange-400 font-mono">{dataPoints.length}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-black/20 rounded-lg border border-white/10">
                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong className="text-white">Tip:</strong> The closer your red dashed line is to the green solid line, the better your model fits the data. Try to minimize the Mean Squared Error!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <LinearRegressionDemo />
    </div>
  );
}

export default App;
