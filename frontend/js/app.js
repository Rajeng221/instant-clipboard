// ==========================================
// 1. DOM Elements
// ==========================================
const tabSend = document.getElementById('tab-send');
const tabReceive = document.getElementById('tab-receive');
const sectionSend = document.getElementById('section-send');
const sectionReceive = document.getElementById('section-receive');

const sendTextInput = document.getElementById('send-text-input');
const fileInput = document.getElementById('file-input');
const dropzone = document.getElementById('dropzone');
const fileLabel = document.getElementById('file-label');
const filePreviewName = document.getElementById('file-preview-name');
const filePreviewText = document.getElementById('file-preview-text');
const burnToggle = document.getElementById('burn-toggle');
const btnGenerate = document.getElementById('btn-generate-code');

const codeResultBox = document.getElementById('code-result-box');
const displayCode = document.getElementById('display-code');
const btnCopyCode = document.getElementById('btn-copy-code');
const expiryTimer = document.getElementById('expiry-timer');
const qrcodeContainer = document.getElementById('qrcode-container');

const receiveCodeInput = document.getElementById('receive-code-input');
const btnFetchData = document.getElementById('btn-fetch-data');
const receiveResultBox = document.getElementById('receive-result-box');
const receivedText = document.getElementById('received-text');
const btnCopyReceived = document.getElementById('btn-copy-received');
const receivedFileBox = document.getElementById('received-file-box');
const receivedFileLink = document.getElementById('received-file-link');
const receivedImageContainer = document.getElementById('received-image-container');
const receivedImagePreview = document.getElementById('received-image-preview');
const receivedFileName = document.getElementById('received-file-name');

let selectedFile = null;
let countdownInterval = null;

// ==========================================
// 2. Tab Navigation
// ==========================================
tabSend.addEventListener('click', () => {
  tabSend.className = 'tab-btn active-tab flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md';
  tabReceive.className = 'tab-btn inactive-tab flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-xs sm:text-sm tracking-wide transition-all text-slate-600 hover:text-slate-900';
  sectionSend.classList.remove('hidden');
  sectionReceive.classList.add('hidden');
});

tabReceive.addEventListener('click', () => {
  tabReceive.className = 'tab-btn active-tab flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md';
  tabSend.className = 'tab-btn inactive-tab flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-xs sm:text-sm tracking-wide transition-all text-slate-600 hover:text-slate-900';
  sectionReceive.classList.remove('hidden');
  sectionSend.classList.add('hidden');
  receiveCodeInput.focus();
});

// ==========================================
// 3. Global Paste Listener (Ctrl+V / Cmd+V)
// ==========================================
window.addEventListener('paste', (event) => {
  if (document.activeElement === sendTextInput || document.activeElement === receiveCodeInput) {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (let item of items) {
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        event.preventDefault();
        const blob = item.getAsFile();
        attachFile(blob, `pasted-image-${Date.now()}.png`);
        break;
      }
    }
    return;
  }

  const items = (event.clipboardData || event.originalEvent.clipboardData).items;
  for (let item of items) {
    if (item.kind === 'file' && item.type.startsWith('image/')) {
      event.preventDefault();
      const blob = item.getAsFile();
      attachFile(blob, `pasted-image-${Date.now()}.png`);
      break;
    } else if (item.kind === 'string' && item.type === 'text/plain') {
      item.getAsString((text) => {
        sendTextInput.value = text;
      });
    }
  }
});

// ==========================================
// 4. File Drag & Drop + Selection
// ==========================================
dropzone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    attachFile(e.target.files[0], e.target.files[0].name);
  }
});

dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.classList.add('border-violet-500', 'bg-violet-100/50');
});

dropzone.addEventListener('dragleave', () => {
  dropzone.classList.remove('border-violet-500', 'bg-violet-100/50');
});

dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('border-violet-500', 'bg-violet-100/50');
  if (e.dataTransfer.files.length > 0) {
    attachFile(e.dataTransfer.files[0], e.dataTransfer.files[0].name);
  }
});

function attachFile(file, fileName) {
  selectedFile = file;
  fileLabel.classList.add('hidden');
  filePreviewText.textContent = fileName;
  filePreviewName.classList.remove('hidden');
  lucide.createIcons();
}

// ==========================================
// 5. QR Code Generator Helper
// ==========================================
function renderQRCode(code) {
  if (!qrcodeContainer || typeof QRCode === 'undefined') return;

  qrcodeContainer.innerHTML = '';
  const retrievalUrl = `${window.location.origin}${window.location.pathname}?code=${code}`;

  new QRCode(qrcodeContainer, {
    text: retrievalUrl,
    width: 140,
    height: 140,
    colorDark: '#1e1b4b',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.M,
  });
}

// ==========================================
// 6. Generate Code & Share
// ==========================================
btnGenerate.addEventListener('click', async () => {
  const text = sendTextInput.value.trim();

  if (!text && !selectedFile) {
    alert('Please enter text or attach an image/file before generating code.');
    return;
  }

  btnGenerate.disabled = true;
  btnGenerate.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Generating...';
  lucide.createIcons();

  try {
    let fileMetadata = null;
    if (selectedFile) {
      fileMetadata = await window.handleFileUpload(selectedFile);
    }

    const payload = {
      text: text || null,
      fileUrl: fileMetadata ? fileMetadata.fileUrl : null,
      fileName: fileMetadata ? fileMetadata.fileName : null,
      fileType: fileMetadata ? fileMetadata.fileType : null,
      burnAfterRead: burnToggle.checked,
    };

    const response = await window.apiShareClipboard(payload);

    // Display Generated 6-digit code
    displayCode.textContent = response.code;
    displayCode.classList.remove('text-red-400');
    codeResultBox.classList.remove('hidden');

    // Render Dynamic QR Code
    renderQRCode(response.code);

    // Start countdown timer
    startCountdown(response.expiresInSeconds || 600);
    lucide.createIcons();
  } catch (err) {
    alert(err.message || 'Error occurred while creating clipboard entry.');
  } finally {
    btnGenerate.disabled = false;
    btnGenerate.innerHTML = '<i data-lucide="sparkles" class="w-5 h-5"></i> Generate 6-Digit Share Code';
    lucide.createIcons();
  }
});

// ==========================================
// 7. Live Expiration Countdown Timer
// ==========================================
function startCountdown(durationSeconds) {
  if (countdownInterval) clearInterval(countdownInterval);
  let timeLeft = durationSeconds;

  const updateDisplay = () => {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    expiryTimer.textContent = `${minutes}:${seconds}`;

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      displayCode.textContent = 'EXPIRED';
      displayCode.classList.add('text-red-400');
      if (qrcodeContainer) qrcodeContainer.innerHTML = '';
    }
    timeLeft--;
  };

  updateDisplay();
  countdownInterval = setInterval(updateDisplay, 1000);
}

// ==========================================
// 8. Copy Generated Code to Clipboard
// ==========================================
btnCopyCode.addEventListener('click', () => {
  navigator.clipboard.writeText(displayCode.textContent);
  btnCopyCode.innerHTML = '<i data-lucide="check" class="w-5 h-5 text-emerald-300"></i>';
  setTimeout(() => {
    btnCopyCode.innerHTML = '<i data-lucide="copy" class="w-5 h-5 text-white"></i>';
    lucide.createIcons();
  }, 2000);
});

// ==========================================
// 9. Retrieve Content via 6-Digit Code
// ==========================================
btnFetchData.addEventListener('click', async () => {
  const code = receiveCodeInput.value.trim();

  if (code.length < 6) {
    alert('Please enter a valid 6-digit numeric code.');
    return;
  }

  btnFetchData.disabled = true;
  btnFetchData.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Fetching...';
  lucide.createIcons();

  try {
    const payload = await window.apiRetrieveClipboard(code);

    receiveResultBox.classList.remove('hidden');
    receivedText.textContent = payload.text || '(No text attached to this code)';

    if (payload.fileUrl) {
      receivedFileBox.classList.remove('hidden');
      receivedFileLink.href = payload.fileUrl;
      receivedFileLink.download = payload.fileName || 'downloaded-file';
      if (receivedFileName) {
        receivedFileName.textContent = `Download (${payload.fileName || 'File'})`;
      }

      // Check for image preview
      const isImg = payload.fileType?.startsWith('image/') || payload.fileUrl.startsWith('data:image/');
      if (isImg && receivedImageContainer && receivedImagePreview) {
        receivedImagePreview.src = payload.fileUrl;
        receivedImageContainer.classList.remove('hidden');
      } else if (receivedImageContainer) {
        receivedImageContainer.classList.add('hidden');
      }
    } else {
      receivedFileBox.classList.add('hidden');
      if (receivedImageContainer) receivedImageContainer.classList.add('hidden');
    }

    lucide.createIcons();
  } catch (err) {
    alert(err.message || 'Unable to retrieve content. Check the code or expiry.');
    receiveResultBox.classList.add('hidden');
  } finally {
    btnFetchData.disabled = false;
    btnFetchData.innerHTML = '<i data-lucide="arrow-down-circle" class="w-5 h-5"></i> Retrieve Content';
    lucide.createIcons();
  }
});

// ==========================================
// 10. Copy Retrieved Text Content
// ==========================================
btnCopyReceived.addEventListener('click', () => {
  navigator.clipboard.writeText(receivedText.textContent);
  btnCopyReceived.innerHTML = '<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600"></i> Copied!';
  setTimeout(() => {
    btnCopyReceived.innerHTML = '<i data-lucide="copy" class="w-3.5 h-3.5"></i> Copy Text';
    lucide.createIcons();
  }, 2000);
});

// ==========================================
// 11. URL Query Param Auto-Retrieval on QR Scan
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const codeParam = params.get('code');

  if (codeParam && codeParam.length === 6) {
    tabReceive.click();
    receiveCodeInput.value = codeParam;

    setTimeout(() => {
      btnFetchData.click();
    }, 400);
  }
});