document.getElementById("mode").addEventListener("change", (event) => {
    const value = event.target.value;
  
    let targetFile = null;
  
    if (value === "notes") {
      targetFile = "popup.html";
    } else if (value === "summarize") {
      targetFile = "summarize.html";
    } else if (value === "weather") {
      targetFile = "weather.html";
    } else if (value === "Todo") {
      targetFile = "todo.html";
    }
  
    if (targetFile) {
      const fullUrl = chrome.runtime.getURL(targetFile);
      if (window.location.href !== fullUrl) {
        window.location.href = fullUrl;
      }
    }
  });
  