let currentTemplate = "template1";

function selectTemplate(template) {
  currentTemplate = template;
  updatePreview();
}

function updatePreview() {
  const input = document.getElementById("userInput");
  const preview = document.getElementById("preview");

  if (!input || !preview) return;

  const text = input.value.trim() || "Your document preview will appear here...";

  preview.innerHTML = `
    <div class="preview-content ${currentTemplate}">${escapeHtml(text)}</div>
    <div class="watermark">FormatFlow Preview</div>
  `;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML.replace(/\n/g, "<br>");
}

function rewrite(type) {
  alert("Rewrite function placeholder: " + type);
}

function exportPDF() {
  alert("PDF export coming next");
}

function exportDOCX() {
  alert("DOCX export coming next");
}

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("userInput");
  if (input) {
    input.addEventListener("input", updatePreview);
  }
  updatePreview();
});
