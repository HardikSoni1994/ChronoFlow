import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Flag } from "lucide-react";

interface LapEntry {
  absolute: number; // total timer value when lap was pressed
  duration: number; // time since the previous lap
}

export default function App() {
  const [timer, setTimer] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<LapEntry[]>([]);

  const intervalRef = useRef<number | null>(null);
  const lastLapTimeRef = useRef<number>(0); // for interval delta calc
  const lastLapTimerRef = useRef<number>(0); // timer value at last lap click

  /* ── Start ── */
  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      lastLapTimeRef.current = Date.now();

      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const delta = now - lastLapTimeRef.current;
        setTimer((prev) => prev + delta);
        lastLapTimeRef.current = now;
      }, 10);
    }
  };

  /* ── Pause ── */
  const handlePause = () => {
    if (isRunning) {
      setIsRunning(false);
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  /* ── Reset ── */
  const handleReset = () => {
    handlePause();
    setTimer(0);
    setLaps([]);
    lastLapTimerRef.current = 0;
  };

  /* ── Lap — stores absolute time + per-lap duration ── */
  const handleLap = () => {
    if (isRunning) {
      const duration = timer - lastLapTimerRef.current;
      lastLapTimerRef.current = timer;
      setLaps((prev) => [...prev, { absolute: timer, duration }]);
    }
  };

  /* ── Cleanup ── */
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, []);

  /* ── Format ms → MM:SS.ms ── */
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  };

  /* ── SVG Ring progress (1 full rotation = 60 seconds) ── */
  const RADIUS = 108;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const progress = (timer % 60000) / 60000;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  /* ── Fastest / Slowest by lap duration ── */
  const durations = laps.map((l) => l.duration);
  const minDur = durations.length > 1 ? Math.min(...durations) : null;
  const maxDur = durations.length > 1 ? Math.max(...durations) : null;

  return (
    <div className="page">
      {/* ── Brand Title ── */}
      <div
        className="flex flex-col items-center justify-center mb-6 pt-4"
        style={{ marginBottom: "35px" }}
      >
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold tracking-widest text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500 uppercase">
            ChronoFlow
          </h1>
        </div>
      </div>

      {/* ── Main Layout Wrapper ── */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-12 md:gap-24 w-full max-w-5xl mx-auto px-4">

        {/* ── Left Column (Timer & Buttons) ── */}
        <div className="flex flex-col items-center">
          {/* ── Ring + Timer ── */}
            <div className="ring-section">
              <svg className="ring-svg" viewBox="0 0 240 240">
                {/* Track */}
                <circle cx="120" cy="120" r={RADIUS} className="ring-track" />
                {/* Glowing arc */}
                <circle
                  cx="120"
                  cy="120"
                  r={RADIUS}
                  className="ring-arc"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={dashOffset}
                  transform="rotate(-90 120 120)"
                />
                {/* Glowing tip circle */}
                {timer > 0 && (
                  <circle
                    cx={120 + RADIUS * Math.cos(progress * 2 * Math.PI - Math.PI / 2)}
                    cy={120 + RADIUS * Math.sin(progress * 2 * Math.PI - Math.PI / 2)}
                    r="5"
                    className="ring-tip"
                  />
                )}
              </svg>

              {/* Time centered in ring */}
              <div className="ring-time-wrap">
                <span className="ring-time">{formatTime(timer)}</span>
              </div>
            </div>

          {/* ── Buttons ── */}
          <div className="btn-row">
            <button
              className="btn-circle flex flex-col items-center justify-center gap-1"
              onClick={handleReset}
              aria-label="Reset"
            >
              <RotateCcw size={20} />
              <span className="text-sm">Reset</span>
            </button>

            {!isRunning ? (
              <button
                className="btn-circle btn-primary flex flex-col items-center justify-center gap-1"
                onClick={handleStart}
                aria-label="Start"
              >
                <Play size={24} fill="currentColor" />
                <span className="text-sm font-bold">Start</span>
              </button>
            ) : (
              <button
                className="btn-circle btn-primary flex flex-col items-center justify-center gap-1"
                onClick={handlePause}
                aria-label="Stop"
              >
                <Pause size={24} fill="currentColor" />
                <span className="text-sm font-bold">Pause</span>
              </button>
            )}

            <button
              className="btn-circle flex flex-col items-center justify-center gap-1 disabled:opacity-50"
              onClick={handleLap}
              disabled={!isRunning}
              aria-label="Lap"
            >
              <Flag size={20} />
              <span className="text-sm">Lap</span>
            </button>
          </div>

        </div>

          {/* ── Right Column (Laps) ── */}
          <div className="w-full max-w-md">
            
            {/* ── Laps ── */}
              <div className="laps-section">
                {laps.length > 0 && (
                  <ul className="laps-list">
                    {[...laps].reverse().map((lap, revIdx) => {
                      const index = laps.length - 1 - revIdx;
                      const isBest = minDur !== null && lap.duration === minDur;
                      const isWorst = maxDur !== null && lap.duration === maxDur;
                      const rowCls = isBest
                        ? "lap-row best-row"
                        : isWorst
                          ? "lap-row worst-row"
                          : "lap-row";
                      return (
                        <li key={index} className={`${rowCls} flex items-center justify-between py-3 border-b border-gray-800/50 w-full gap-4`}>
                            {/* whitespace-nowrap line break rokkega */}
                            <span className="lap-name whitespace-nowrap w-16 text-left">
                              Lap {index + 1}
                            </span>
                  
                            {/* flex-1 isko beech mein proper center karega */}
                            <span className="lap-absolute font-mono flex-1 text-center text-white">
                              {formatTime(lap.absolute)}
                            </span>
                  
                            {/* w-24 fix width dega taaki sab ek seedh mein rahein */}
                            <span className="lap-delta font-mono whitespace-nowrap w-24 text-right">
                              +{formatTime(lap.duration)}
                            </span>
                          </li>
                      );
                    })}
                  </ul>
                )}
              </div>
          </div>
      </div>
    </div>
  );
}
