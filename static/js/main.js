/**
 * Blood Group Detection From Fingerprint - Main Application JavaScript
 * Handlers for SPA Navigation, Drag & Drop File Upload, Flask Prediction API,
 * LocalStorage History Management, and Mobile UI interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Application Features
  initRouter();
  initMobileNav();
  initUploadDropzone();
  initDetectionForm();
  initHistoryView();
  initContactForm();
});

/* ==========================================================================
   1. CLIENT-SIDE SPA ROUTER
   ========================================================================== */
const VALID_ROUTES = ['home', 'detect', 'history', 'how-it-works', 'about', 'contact'];

function initRouter() {
  handleRoute();
  window.addEventListener('hashchange', handleRoute);

  document.addEventListener('click', (e) => {
    const target = e.target.closest('a[href^="#"]');
    if (target) {
      const hash = target.getAttribute('href').substring(1);
      if (VALID_ROUTES.includes(hash)) {
        e.preventDefault();
        window.location.hash = hash;
      }
    }
  });
}

function handleRoute() {
  let hash = window.location.hash.substring(1);
  if (!hash || !VALID_ROUTES.includes(hash)) {
    hash = 'home';
  }

  document.querySelectorAll('.page-view').forEach(view => {
    if (view.id === `${hash}-page`) {
      view.classList.add('active');
    } else {
      view.classList.remove('active');
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === `#${hash}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  const navLinks = document.getElementById('navLinks');
  if (navLinks) {
    navLinks.classList.remove('show');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (hash === 'history') {
    renderHistoryTable();
  }
}

/* ==========================================================================
   2. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }
}

/* ==========================================================================
   3. DRAG & DROP FILE UPLOAD
   ========================================================================== */
let selectedFile = null;
let currentThumbnailData = '';

function initUploadDropzone() {
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fingerprintInput');
  const previewCard = document.getElementById('previewCard');
  const previewThumb = document.getElementById('previewThumb');
  const previewName = document.getElementById('previewName');
  const previewSize = document.getElementById('previewSize');
  const btnRemoveImage = document.getElementById('btnRemoveImage');

  if (!dropzone || !fileInput) return;

  // Prevent event bubbling on file input click
  fileInput.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Dropzone click opens file dialog
  dropzone.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
    }, false);
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    if (dt.files && dt.files[0]) {
      handleFileSelection(dt.files[0]);
    }
  });

  if (btnRemoveImage) {
    btnRemoveImage.addEventListener('click', (e) => {
      e.stopPropagation();
      clearSelectedFile();
    });
  }

  function handleFileSelection(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/bmp'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(png|jpg|jpeg|bmp)$/i)) {
      alert('Invalid file format. Please upload a PNG, JPG, JPEG, or BMP fingerprint image.');
      return;
    }

    selectedFile = file;
    previewName.textContent = file.name;
    previewSize.textContent = formatBytes(file.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      currentThumbnailData = e.target.result;
      previewThumb.src = currentThumbnailData;
      previewCard.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  }

  function clearSelectedFile() {
    selectedFile = null;
    currentThumbnailData = '';
    fileInput.value = '';
    previewCard.style.display = 'none';
    previewThumb.src = '';
    previewName.textContent = '';
    previewSize.textContent = '';
  }

  window.resetUploadZone = clearSelectedFile;
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/* ==========================================================================
   4. FORM SUBMISSION & FLASK PREDICTION API
   ========================================================================== */
function initDetectionForm() {
  const form = document.getElementById('detectionForm');
  const emptyResultState = document.getElementById('emptyResultState');
  const loadingState = document.getElementById('loadingState');
  const resultCard = document.getElementById('resultCard');
  const btnAnalyze = document.getElementById('btnAnalyze');
  const btnAnalyzeAnother = document.getElementById('btnAnalyzeAnother');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('patientName').value.trim();
    const mobile = document.getElementById('patientMobile').value.trim();
    const gender = document.getElementById('patientGender').value;
    const age = document.getElementById('patientAge').value;

    const fileInput = document.getElementById('fingerprintInput');
    if (!selectedFile && fileInput.files && fileInput.files[0]) {
      selectedFile = fileInput.files[0];
    }

    if (!name || !mobile || !gender || !age) {
      alert('Please fill out all patient details.');
      return;
    }

    if (!selectedFile) {
      alert('Please upload a fingerprint image to analyze.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    if (emptyResultState) emptyResultState.style.display = 'none';
    if (resultCard) resultCard.style.display = 'none';
    if (loadingState) loadingState.style.display = 'flex';

    if (btnAnalyze) {
      btnAnalyze.disabled = true;
      btnAnalyze.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    }

    fetch('/predict', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => { throw new Error(err.error || `Server error (Status ${response.status})`); });
      }
      return response.json();
    })
    .then(data => {
      displayPredictionResult(data, { name, mobile, gender, age });
      
      saveToHistory({
        name,
        mobile,
        gender,
        age,
        predicted_label: data.predicted_label,
        confidence: data.confidence,
        thumbnail: currentThumbnailData
      });
    })
    .catch(error => {
      console.error('Prediction Error:', error);
      alert('Prediction Error: ' + error.message);
      if (emptyResultState) emptyResultState.style.display = 'flex';
    })
    .finally(() => {
      if (loadingState) loadingState.style.display = 'none';
      if (btnAnalyze) {
        btnAnalyze.disabled = false;
        btnAnalyze.innerHTML = '<i class="fas fa-microscope"></i> Analyze Fingerprint';
      }
    });
  });

  if (btnAnalyzeAnother) {
    btnAnalyzeAnother.addEventListener('click', () => {
      if (resultCard) resultCard.style.display = 'none';
      if (emptyResultState) emptyResultState.style.display = 'flex';
      form.reset();
      if (window.resetUploadZone) window.resetUploadZone();
    });
  }
}

function displayPredictionResult(data, patient) {
  const resultCard = document.getElementById('resultCard');
  const resBloodGroup = document.getElementById('resBloodGroup');
  const resConfidenceText = document.getElementById('resConfidenceText');
  const resConfidenceFill = document.getElementById('resConfidenceFill');
  const resTableBody = document.getElementById('resTableBody');

  if (!resultCard) return;

  resBloodGroup.textContent = data.predicted_label;

  let confPercentageStr = 'N/A';
  if (data.confidence !== undefined && data.confidence !== null) {
    const confVal = data.confidence <= 1 ? data.confidence * 100 : data.confidence;
    confPercentageStr = confVal.toFixed(2) + '%';
    if (resConfidenceFill) {
      resConfidenceFill.style.width = Math.min(confVal, 100) + '%';
    }
  }
  if (resConfidenceText) {
    resConfidenceText.textContent = `Confidence: ${confPercentageStr}`;
  }

  const formattedDate = new Date().toLocaleString();
  resTableBody.innerHTML = `
    <tr><td>Patient Name</td><td>${escapeHtml(patient.name)}</td></tr>
    <tr><td>Mobile</td><td>${escapeHtml(patient.mobile)}</td></tr>
    <tr><td>Gender / Age</td><td>${escapeHtml(patient.gender)}, ${escapeHtml(patient.age)} yrs</td></tr>
    <tr><td>Timestamp</td><td>${formattedDate}</td></tr>
    <tr><td>Analyzed Fingerprint</td><td><img src="${currentThumbnailData}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid #cbd5e1;"/></td></tr>
  `;

  resultCard.style.display = 'block';
}

/* ==========================================================================
   5. PREDICTION HISTORY (LOCALSTORAGE)
   ========================================================================== */
const STORAGE_KEY = 'hemo_fingerprint_history';

function saveToHistory(record) {
  let history = getHistoryRecords();
  const newEntry = {
    id: Date.now(),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    name: record.name,
    mobile: record.mobile,
    gender: record.gender,
    age: record.age,
    bloodGroup: record.predicted_label,
    confidence: record.confidence !== undefined ? (record.confidence <= 1 ? (record.confidence * 100).toFixed(2) + '%' : record.confidence.toFixed(2) + '%') : 'N/A',
    thumbnail: record.thumbnail,
    status: 'Completed'
  };

  history.unshift(newEntry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function getHistoryRecords() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function initHistoryView() {
  const btnClearHistory = document.getElementById('btnClearHistory');
  if (btnClearHistory) {
    btnClearHistory.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all prediction history?')) {
        localStorage.removeItem(STORAGE_KEY);
        renderHistoryTable();
      }
    });
  }
}

function renderHistoryTable() {
  const historyWrapper = document.getElementById('historyTableWrapper');
  const emptyState = document.getElementById('emptyHistoryState');
  const tableBody = document.getElementById('historyTableBody');
  const btnClearHistory = document.getElementById('btnClearHistory');

  if (!historyWrapper || !emptyState || !tableBody) return;

  const records = getHistoryRecords();

  if (records.length === 0) {
    historyWrapper.style.display = 'none';
    emptyState.style.display = 'block';
    if (btnClearHistory) btnClearHistory.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  historyWrapper.style.display = 'block';
  if (btnClearHistory) btnClearHistory.style.display = 'inline-flex';

  tableBody.innerHTML = records.map(item => `
    <tr>
      <td>${escapeHtml(item.date)}</td>
      <td>
        <strong>${escapeHtml(item.name)}</strong><br/>
        <span style="font-size: 0.8rem; color: #64748b;">${escapeHtml(item.gender)}, ${escapeHtml(item.age)} yrs</span>
      </td>
      <td>
        ${item.thumbnail ? `<img src="${item.thumbnail}" class="table-thumb" alt="Fingerprint"/>` : '<span style="color:#94a3b8">N/A</span>'}
      </td>
      <td><span class="badge-group">${escapeHtml(item.bloodGroup)}</span></td>
      <td><strong>${escapeHtml(item.confidence)}</strong></td>
      <td><span class="badge-status"><i class="fas fa-check-circle"></i> ${escapeHtml(item.status)}</span></td>
    </tr>
  `).join('');
}

/* ==========================================================================
   6. CONTACT FORM DEMO INTERACTION
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const contactToast = document.getElementById('contactToast');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (contactToast) {
      contactToast.style.display = 'flex';
      setTimeout(() => {
        contactToast.style.display = 'none';
      }, 5000);
    }
    contactForm.reset();
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
