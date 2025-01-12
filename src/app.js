// app.js
import { heicTo } from "heic-to";

document.getElementById("upload-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const fileInput = document.getElementById("file-input");
  const files = Array.from(fileInput.files);
  const output = document.getElementById("output");
  const loading = document.getElementById("loading");
  const convertBtn = document.getElementById("convert-btn");
  output.innerHTML = "";

  if (files.length === 0) {
    output.innerHTML = "<div class='text-red-500'>Please select at least one HEIC file.</div>";
    return;
  }

  loading.classList.remove("hidden");
  convertBtn.disabled = true;
  convertBtn.classList.add("bg-gray-400", "cursor-not-allowed");
  convertBtn.classList.remove("bg-blue-500", "hover:bg-blue-600");

  try {
    for (const file of files) {
      try {
        // Convert HEIC to JPEG
        const jpegBlob = await heicTo({
          blob: file,
          type: "image/jpeg",
          quality: 0.8,
        });
        
        // Convert HEIC to PNG
        const pngBlob = await heicTo({
          blob: file,
          type: "image/png",
          quality: 0.8,
        });

        // Display converted images
        const jpegImage = document.createElement("img");
        jpegImage.src = URL.createObjectURL(jpegBlob);
        jpegImage.alt = `${file.name} - JPEG`;
        jpegImage.className = "w-full mb-2 rounded-lg border border-gray-300";

        const pngImage = document.createElement("img");
        pngImage.src = URL.createObjectURL(pngBlob);
        pngImage.alt = `${file.name} - PNG`;
        pngImage.className = "w-full mb-2 rounded-lg border border-gray-300";

        // Create download links
        const jpegLink = document.createElement("a");
        jpegLink.href = URL.createObjectURL(jpegBlob);
        jpegLink.download = file.name.replace(/\..+$/, ".jpeg");
        jpegLink.textContent = `Download JPEG for ${file.name}`;
        jpegLink.className = "text-blue-500 hover:underline block mb-2";

        const pngLink = document.createElement("a");
        pngLink.href = URL.createObjectURL(pngBlob);
        pngLink.download = file.name.replace(/\..+$/, ".png");
        pngLink.textContent = `Download PNG for ${file.name}`;
        pngLink.className = "text-blue-500 hover:underline block mb-2";

        // Append images and links to the output
        const container = document.createElement("div");
        container.className = "bg-white p-4 rounded-lg shadow-md";
        container.appendChild(jpegImage);
        container.appendChild(jpegLink);
        container.appendChild(pngImage);
        container.appendChild(pngLink);
        output.appendChild(container);
      } catch (error) {
        console.error("Error converting file:", file.name, error);
        const errorMsg = document.createElement("div");
        errorMsg.className = "text-red-500";
        errorMsg.textContent = `Failed to convert ${file.name}: ${error.message}`;
        output.appendChild(errorMsg);
      }
    }
  } finally {
    loading.classList.add("hidden");
    convertBtn.disabled = false;
    convertBtn.classList.remove("bg-gray-400", "cursor-not-allowed");
    convertBtn.classList.add("bg-blue-500", "hover:bg-blue-600");
  }
});