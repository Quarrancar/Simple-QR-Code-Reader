const wrapper = document.querySelector(".wrapper");
const form = document.querySelector("form");
const fileInp = document.querySelector("input[type='file']");
const infoText = document.querySelector("p");
const closeBtn = document.querySelector(".close");
const copyBtn = document.querySelector(".copy");
const resultTextArea = document.querySelector("textarea");
const qrImage = form.querySelector("img");

// Fetch Data From Api
function fetchRequest(file, formData) {
    infoText.textContent = "The QR-Code is being scanned...";
    fetch("http://api.qrserver.com/v1/read-qr-code/", {
        method: 'POST', body: formData
    }).then(res => res.json()).then(result => {
        const qrData = result[0]?.symbol[0]?.data || "Could not read QR code. Please try another image.";
        infoText.textContent = qrData ? "QR-Code content:" : "Your QR-Code couldn't be scanned...";
        resultTextArea.textContent = qrData;
        qrImage.src = URL.createObjectURL(file);
        wrapper.classList.add("active");
    }).catch(() => {
        infoText.textContent = "An error occurred while scanning the QR-Code.";
    });
}

// Send QR Code File With Request To Api
fileInp.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    fetchRequest(file, formData);
});

// Copy Text To Clipboard
copyBtn.addEventListener("click", () => {
    const text = resultTextArea.textContent;
    navigator.clipboard.writeText(text).then(() => {
        infoText.textContent = "Text copied to clipboard!";
    }).catch(err => {
        infoText.textContent = "Failed to copy text: " + err;
    });
});

// When user clicks on form, trigger the file input
form.addEventListener("click", () => fileInp.click());

// Close the result view
closeBtn.addEventListener("click", () => wrapper.classList.remove("active"));