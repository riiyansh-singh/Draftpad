chrome.commands.onCommand.addListener(async (command) => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    if (!tab?.id) return;

    // Inject content script safely
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });

    // Send message after injection
    chrome.tabs.sendMessage(tab.id, {
      type: command
    });

  } catch (err) {
    console.error("Draftpad Error:", err);
  }
});