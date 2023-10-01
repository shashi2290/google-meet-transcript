document.addEventListener("DOMContentLoaded", function () {
    const extensionId = "nldfjaoejnhmfdpipllocfnfkkdcjfil"; // Replace with your extension's ID
    const startCaptureButton = document.getElementById("startCapture");
    const stopCaptureButton = document.getElementById("stopCapture");

  
    // Initialize Chrome extension messaging
    const tabQueryInfo = { active: true, currentWindow: true };
    console.log('here')
    // Send a message to the content script to start audio capture
    startCaptureButton.addEventListener("click", () => {
      chrome.tabs.query(tabQueryInfo, (tabs) => {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { type: "startCapture" });
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          function: startAudioCapture,
        });
      });
    });
  
    // Send a message to the content script to stop audio capture
    stopCaptureButton.addEventListener("click", () => {
      chrome.tabs.query(tabQueryInfo, (tabs) => {
        const activeTab = tabs[0];
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          function: stopAudioCapture,
        });
      });
    });
  
    // Function to start audio capture in the content script
    function startAudioCapture() {
      console.log("TRANSCRIPTION LOG STARTED");
      let transcriptions = [];
        let previousContent = ''; // Variable to store previous content
        let button = document.getElementsByClassName("VfPpkd-Bz112c-LgbsSe fzRBVc tmJved xHd4Cb rmHNDe")[0];
        button.click();
        const element = document.getElementsByClassName("iOzk7")[0];
        if(element) {
          element.style.visibility = "hidden";
        }
        console.log(element)

        const handleContentChange = (mutationsList, observer) => {
          for (const mutation of mutationsList) {
            if (mutation.type === "characterData" && mutation.target.data) {
              // Get the current timestamp in IST (Indian Standard Time)
              const timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
              
              // Get the new content (textContent) of the element
              const newContent = element.textContent.trim(); // Trim to remove leading/trailing spaces
             
              // if(newContent.includes(previousContent)) {
              //   previousContent = null
              // }
              // Check if the content has changed and is not empty spaces
              if (newContent !== previousContent && newContent !== '' ) {
                // Store the content with a timestamp
                const contentWithTimestamp = `${timestamp}: ${newContent}`;
                console.log("prev:", previousContent);
                console.log("new:", newContent);

                if(previousContent) {
                  previousContent = previousContent.slice(0, -1)
                }
                // Push the content to the transcriptions array
                // if(!newContent.includes(previousContent)) {
                  if (!transcriptions.length) {
                    transcriptions.push(contentWithTimestamp);
                  } else if(transcriptions.length && !newContent.includes(previousContent)) {
                    transcriptions.push(contentWithTimestamp);
                  } else if(transcriptions.length && newContent.includes(previousContent)) {
                    transcriptions[transcriptions.length -1] = contentWithTimestamp;
                  } 
                  console.log("array:", transcriptions);
                  localStorage.setItem("transcriptions", JSON.stringify(transcriptions))
                // }
                previousContent = newContent;
      
              }
            }
          }
        };
        // Create a MutationObserver instance
        const observer = new MutationObserver(handleContentChange);

        // Configure the observer to watch for changes in child elements and text content
        const observerConfig = {
          childList: true,
          subtree: true,
          characterData: true,
        };

        // Start observing the element
        observer.observe(element, observerConfig);
        const extensionId = "nldfjaoejnhmfdpipllocfnfkkdcjfil"; // Replace with your extension's ID

      chrome.runtime.sendMessage(extensionId, { type: "startCapture" });
    }
  
    // Function to stop audio capture in the content script
    function stopAudioCapture() {
      console.log("TRANSCRIPTION LOG STOPPED");
      const transcriptions = localStorage.getItem("transcriptions")
      console.log('Stopping transcript:', JSON.parse(transcriptions));
      downloadArrayAsTextFile(JSON.parse(transcriptions), "transcript.txt")
      document.getElementsByClassName("VfPpkd-Bz112c-LgbsSe fzRBVc tmJved xHd4Cb rmHNDe")[0].click();
      const extensionId = "nldfjaoejnhmfdpipllocfnfkkdcjfil"; // Replace with your extension's ID

      chrome.runtime.sendMessage(extensionId, { type: "stopCapture" });

      function downloadArrayAsTextFile(array, fileName) {
        // Create a blob with the array's content and set its type to plain text
        const blob = new Blob([array.join('\n')], { type: 'text/plain' });
      
        // Create a URL for the blob
        const url = URL.createObjectURL(blob);
      
        // Create a temporary anchor element
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
      
        // Trigger a click event on the anchor to initiate the download
        a.click();
      
        // Clean up: remove the temporary anchor and URL object
        URL.revokeObjectURL(url);
      }
      
    }
  });
  
  