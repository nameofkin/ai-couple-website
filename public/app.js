const photoInput = document.getElementById("photoInput");
const preview = document.getElementById("preview");
const dropZone = document.getElementById("dropZone");
const statusEl = document.getElementById("status");
const result = document.getElementById("result");
const generateBtn = document.getElementById("generateBtn");
const styleSelect = document.getElementById("styleSelect");
let mode = "image";
let photoData = null;

document.getElementById("year").textContent = new Date().getFullYear();

document.querySelectorAll(".style-card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".style-card").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    styleSelect.value = card.dataset.style;
    document.getElementById("generator").scrollIntoView({behavior:"smooth", block:"start"});
  });
});

document.querySelectorAll(".mode").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".mode").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    mode = button.dataset.mode;
    generateBtn.textContent = mode === "image" ? "✦ Generate romantic photo" : "▶ Generate romantic video";
    statusEl.textContent = mode === "image"
      ? "Image mode selected. Connect an AI image provider for real results."
      : "Video mode selected. Connect an AI video provider for real results.";
  });
});

function showError(message) {
  statusEl.textContent = message;
  statusEl.classList.add("error");
}
function clearError() { statusEl.classList.remove("error"); }

photoInput.addEventListener("change", () => {
  const file = photoInput.files && photoInput.files[0];
  if (!file) return;
  clearError();
  if (!["image/jpeg","image/png","image/webp"].includes(file.type)) {
    photoInput.value = ""; photoData = null; preview.hidden = true;
    return showError("Please choose a JPG, PNG or WebP image.");
  }
  if (file.size > 8 * 1024 * 1024) {
    photoInput.value = ""; photoData = null; preview.hidden = true;
    return showError("The photo is larger than 8 MB. Please choose a smaller image.");
  }
  const reader = new FileReader();
  reader.onload = () => {
    photoData = reader.result;
    preview.src = photoData;
    preview.hidden = false;
    dropZone.querySelector(".upload-symbol").hidden = true;
    dropZone.querySelector("b").textContent = file.name;
    dropZone.querySelector("small").textContent = "Photo ready — tap to change";
    statusEl.textContent = "Photo loaded in your browser. Choose a style and generate.";
  };
  reader.onerror = () => showError("Could not read that photo. Please try another file.");
  reader.readAsDataURL(file);
});

["dragenter","dragover"].forEach(name => dropZone.addEventListener(name, e => {
  e.preventDefault(); dropZone.style.borderColor = "#ff4f83";
}));
["dragleave","drop"].forEach(name => dropZone.addEventListener(name, e => {
  e.preventDefault(); dropZone.style.borderColor = "";
}));
dropZone.addEventListener("drop", e => {
  const file = e.dataTransfer.files && e.dataTransfer.files[0];
  if (!file) return;
  const transfer = new DataTransfer(); transfer.items.add(file); photoInput.files = transfer.files;
  photoInput.dispatchEvent(new Event("change"));
});

generateBtn.addEventListener("click", async () => {
  clearError(); result.hidden = true;
  if (!photoData) return showError("Please upload a couple photo first.");
  generateBtn.disabled = true;
  generateBtn.textContent = "Connecting…";
  statusEl.textContent = "Checking the AI generation service…";
  try {
    const response = await fetch(mode === "image" ? "/api/generate-image" : "/api/generate-video", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({image:photoData, style:styleSelect.value, prompt:document.getElementById("prompt").value.trim()})
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || data.error || "Generation service is not ready.");
    if (data.url) {
      result.hidden = false;
      result.innerHTML = "";
      if (mode === "image") {
        const img = document.createElement("img"); img.src = data.url; img.alt = "AI-generated romantic result"; img.style.cssText = "width:100%;border-radius:10px";
        result.appendChild(img);
      } else {
        const video = document.createElement("video"); video.src = data.url; video.controls = true; video.style.cssText = "width:100%;border-radius:10px";
        result.appendChild(video);
      }
      statusEl.textContent = "Your result is ready.";
    } else {
      statusEl.textContent = data.message || "The provider responded, but no result URL was returned.";
    }
  } catch (error) {
    showError(error.message);
    result.hidden = false;
    result.textContent = "The interface is working, but actual AI output requires a connected image/video generation provider and server-side API credentials. See README.md.";
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = mode === "image" ? "✦ Generate romantic photo" : "▶ Generate romantic video";
  }
});
