// Function to start audio capture
function startAudioCapture() {
    const mediaConstraints = { audio: true };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then((mediaStream) => {
        const mediaRecorder = new MediaRecorder(mediaStream);
  
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            // Convert the audio data to a Blob
            const audioBlob = new Blob([event.data], { type: "audio/wav" });
  
            // Send the audio data to the background script
            chrome.runtime.sendMessage({ type: "audioData", data: audioBlob });
          }
        };
  
        mediaRecorder.start();
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  }
  
  // Function to stop audio capture
  function stopAudioCapture() {
    console.log('stop here')
    // Stop audio capture logic (if needed)
    // This may involve stopping the MediaRecorder and releasing the microphone
    // Implement the logic based on your requirements
  }

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("messageType:", message)
    if (message.type === "startCapture") {
      startAudioCapture();
    } else if (message.type === "stopCapture") {
      stopAudioCapture();
    }
  });
  