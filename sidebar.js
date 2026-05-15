const editor = document.getElementById("editor");
const workspaceSelect = document.getElementById("workspaceSelect");

function getKey(){
  return `draftpad-${workspaceSelect.value}`;
}

function loadWorkspace(){
  editor.value = localStorage.getItem(getKey()) || "";
}

function saveWorkspace(){
  localStorage.setItem(getKey(), editor.value);
}

workspaceSelect.addEventListener("change", loadWorkspace);
editor.addEventListener("input", saveWorkspace);

window.addEventListener("message", (event) => {
  const msg = event.data;

  if(msg.type === "append-note"){
    editor.value += `\n${msg.content}\n`;
    saveWorkspace();
  }
});

loadWorkspace();

document.getElementById("exportMd").addEventListener("click", () => {
  const blob = new Blob([editor.value], {type:"text/plain"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${workspaceSelect.value}.md`;
  a.click();
});

document.getElementById("copyNotion").addEventListener("click", async () => {
  await navigator.clipboard.writeText(editor.value);
  alert("Copied!");
});