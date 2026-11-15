
export const speakText = (text, options = {}) => {
  if (!("speechSynthesis" in window)) {
    alert("Your browser does not support speech");
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = options.lang || "en-IN";
  utterance.rate = options.rate || 1;
  utterance.pitch = options.pitch || 1;
  utterance.volume = options.volume || 1;

  window.speechSynthesis.speak(utterance);
};

export const pauseSpeech = () => {
  window.speechSynthesis.pause();
};

export const resumeSpeech = () => {
  window.speechSynthesis.resume();
};

export const stopSpeech = () => {
  window.speechSynthesis.cancel();
};
