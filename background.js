try {


// Handle data transmission to the server here
// Example: Capture audio data and send it to the server
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("message:", message.data)
  if (message.type === "audioData") {
    // socket.emit("audioData", message.data); // Send audio data to the server
  }
});



} catch (err) {
    console.log(err)
}