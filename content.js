let sidebarOpen = false;
let iframe = null;

function toggleSidebar() {
  if (sidebarOpen) {
    iframe.remove();
    sidebarOpen = false;
    return;
  }

  iframe = document.createElement("iframe");
  iframe.src = chrome.runtime.getURL("sidebar.html");
  iframe.id = "draftpad-sidebar";

  document.body.appendChild(iframe);
  sidebarOpen = true;
}

function sendToSidebar(payload) {
  const sidebar = document.getElementById("draftpad-sidebar");
  if (!sidebar) return;
  sidebar.contentWindow.postMessage(payload, "*");
}

function smartSnip() {
  const selection = window.getSelection().toString().trim();
  if (!selection) return;

  const markdown = `> ${selection}\n\nSource: [${document.title}](${window.location.href})\n`;

  sendToSidebar({
    type: "append-note",
    content: markdown
  });
}

function youtubeAnchor() {
  const video = document.querySelector("video");
  if (!video) return;

  const currentTime = Math.floor(video.currentTime);
  const url = new URL(window.location.href);

  url.searchParams.set("t", `${currentTime}s`);

  const timestamp = `[▶ ${Math.floor(currentTime/60)}:${String(currentTime%60).padStart(2,"0")}](${url.toString()})\n`;

  sendToSidebar({
    type: "append-note",
    content: timestamp
  });
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "toggle-sidebar") toggleSidebar();
  if (msg.type === "smart-snip") smartSnip();
  if (msg.type === "youtube-anchor") youtubeAnchor();
});