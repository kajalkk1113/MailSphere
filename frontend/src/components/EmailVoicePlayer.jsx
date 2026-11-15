
import { useState, useEffect } from "react";

import {
  Play,
  Pause,
  Square,
  Volume2,
} from "lucide-react";

import {
  speakText,
  pauseSpeech,
  resumeSpeech,
  stopSpeech,
} from "../utils/speech";

function EmailVoicePlayer({ email }) {
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [rate, setRate] = useState(1);

  const readEmail = () => {
    const text = `
      Email from ${email.sender?.name || "Unknown sender"}.
      Subject: ${email.subject}.
      Message: ${email.message}
    `;

    speakText(text, { rate });

    setPlaying(true);
    setPaused(false);
  };

  const handlePause = () => {
    pauseSpeech();
    setPaused(true);
  };

  const handleResume = () => {
    resumeSpeech();
    setPaused(false);
  };

  const handleStop = () => {
    stopSpeech();
    setPlaying(false);
    setPaused(false);
  };

  useEffect(() => {
    const handleEnd = () => {
      setPlaying(false);
      setPaused(false);
    };

    // Voice complete hone par controls reset
    const originalSpeak = window.speechSynthesis.speak;

    return () => {
      stopSpeech();
    };
  }, [email._id]);

  return (
    <div className="mt-6 p-5 bg-slate-950 border border-slate-800 rounded-xl">

      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-blue-500/10 rounded-lg">
          <Volume2 className="text-blue-400" size={22} />
        </div>

        <div>
          <h3 className="font-semibold text-white">
            Read Email Aloud
          </h3>

          <p className="text-sm text-slate-400">
            Listen to your email
          </p>
        </div>
      </div>

      {/* Voice Controls */}
      <div className="flex flex-wrap gap-3">

        {!playing ? (
          <button
            onClick={readEmail}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            <Play size={18} />
            Play
          </button>
        ) : paused ? (
          <button
            onClick={handleResume}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
          >
            <Play size={18} />
            Resume
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition"
          >
            <Pause size={18} />
            Pause
          </button>
        )}

        <button
          onClick={handleStop}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
        >
          <Square size={18} />
          Stop
        </button>

      </div>

      {/* Speed Control */}
      <div className="mt-5">
        <label className="text-sm text-slate-400">
          Voice Speed: {rate}x
        </label>

        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full mt-2 accent-blue-500"
        />

        <div className="flex justify-between text-xs text-slate-500">
          <span>Slow</span>
          <span>Normal</span>
          <span>Fast</span>
        </div>
      </div>

    </div>
  );
}

export default EmailVoicePlayer;
