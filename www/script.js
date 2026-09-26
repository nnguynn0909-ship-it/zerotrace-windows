let currentFiles = [];
let currentDecryptedPin = null;
let pendingAction = null;
let isConfettiEnabled = localStorage.getItem('confetti') === 'true';
let isBubblesEnabled = localStorage.getItem('bubbles') === 'true';

function toggleSettingsMenu(event) {
    if (event) {
        event.stopPropagation();
    }
    const backdrop = document.getElementById('settingsBackdrop');
    if (backdrop) {
        backdrop.classList.toggle('show');
    }
}

function closeSettingsMenu(event) {
    if (event) {
        event.stopPropagation();
    }
    const backdrop = document.getElementById('settingsBackdrop');
    if (backdrop) {
        backdrop.classList.remove('show');
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSettingsMenu();
    }
});

function initConfettiToggle() {
    const btn = document.getElementById('confettiMenuBtn');
    if (btn) {
        if (isConfettiEnabled) btn.classList.remove('inactive');
        else btn.classList.add('inactive');
    }
}

function initBubbleToggle() {
    const btn = document.getElementById('bubbleMenuBtn');
    if (btn) {
        if (isBubblesEnabled) btn.classList.remove('inactive');
        else btn.classList.add('inactive');
    }
}

function toggleConfetti() {
    isConfettiEnabled = !isConfettiEnabled;
    localStorage.setItem('confetti', isConfettiEnabled);
    initConfettiToggle();
}

function toggleBubbles() {
    isBubblesEnabled = !isBubblesEnabled;
    localStorage.setItem('bubbles', isBubblesEnabled);
    initBubbleToggle();
    if (isBubblesEnabled) {
        showToast("Đã bật hiệu ứng bong bóng! 🫧", "success");
    }
}

function handleBubbleEffect(e) {
    if (!isBubblesEnabled) return;
    
    // Bỏ qua nếu đang bấm vào các nút hoặc thẻ nhập liệu
    if (e.target.closest('button') || e.target.closest('.switch') || e.target.closest('.modal-content') || e.target.closest('input') || e.target.closest('textarea')) return;

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = e.clientX + 'px';
    container.style.top = e.clientY + 'px';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    const size = 40 + Math.random() * 20;
    
    const bubble = document.createElement('div');
    bubble.className = 'realistic-bubble';
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    container.appendChild(bubble);
    
    setTimeout(() => {
        bubble.style.display = 'none';
        
        const burst = document.createElement('div');
        burst.className = 'bubble-burst';
        burst.style.width = (size * 1.8) + 'px';
        burst.style.height = (size * 1.8) + 'px';
        burst.innerHTML = `
        <svg viewBox="0 0 100 100" style="width:100%; height:100%; overflow:visible;">
            <defs>
                <linearGradient id="bubbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="rgba(135, 206, 235, 0.7)" />
                    <stop offset="50%" stop-color="rgba(255, 182, 193, 0.7)" />
                    <stop offset="100%" stop-color="rgba(255, 255, 224, 0.7)" />
                </linearGradient>
            </defs>
            <path d="M 50 0 L 62 28 L 95 15 L 75 42 L 100 65 L 68 62 L 50 95 L 32 62 L 0 65 L 25 42 L 5 15 L 38 28 Z" fill="url(#bubbleGrad)" stroke="rgba(255, 255, 255, 0.9)" stroke-width="2" stroke-linejoin="round"/>
        </svg>`;
        container.appendChild(burst);
        
        setTimeout(() => {
            container.remove();
        }, 300);
    }, 150);
}

document.addEventListener('click', handleBubbleEffect);
document.addEventListener('contextmenu', handleBubbleEffect);

const adminDenyMessages = [
    "Chê à? Chê thì khỏi xài nha!",
    "Lương tâm bạn không cắn rứt sao? Chọn lại!",
    "Bấm nhầm đúng không? Cho cơ hội chọn lại đấy!",
    "Admin đang nhìn bạn qua camera đấy... Cẩn thận!",
    "Lỗi hệ thống: Từ chối người không biết khen!",
    "Không khen thì cạp đất mà ăn nha!",
    "Có mỗi việc khen thôi cũng tiếc à?"
];

function switchTab(tabName) {
    document.querySelectorAll('.form-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    if (tabName === 'send') {
        document.getElementById('sendTab').classList.add('active');
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
    } else {
        document.getElementById('receiveTab').classList.add('active');
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
    }
}

function toggleInputType() {
    if (document.getElementById('dataType').value === 'text') {
        document.getElementById('textInputGroup').style.display = 'block';
        document.getElementById('fileInputGroup').style.display = 'none';
    } else {
        document.getElementById('textInputGroup').style.display = 'none';
        document.getElementById('fileInputGroup').style.display = 'block';
    }
}

// Toast Function with Theme Awareness
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    // Xóa ngay toast cũ để không bị chồng chất / che khuất nút bấm
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Cho phép bấm vào để đóng toast ngay lập tức
    toast.onclick = () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 250);
    };

    // Xác định icon theo chủ đề hiện tại nếu type là success
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'cyber';
    const themeIcons = {
        'cyber': '⚡',
        'cloud': '☁️',
        'gradient': '🌈',
        'holographic': '💠',
        'levitate': '🔮',
        'diamond': '💎',
        'light': '☼',
        'dark': '☾'
    };

    let icon = type === 'error' ? '⚠️' : (themeIcons[currentTheme] || '✨');

    // Nếu thông báo đã có emoji hoặc biểu tượng ở đầu, giữ nguyên
    const trimmed = message.trim();
    const hasIconPrefix = /^[\p{Emoji}\u2600-\u27BF\u25A0-\u25FF]/u.test(trimmed);

    if (hasIconPrefix) {
        toast.innerHTML = `<span class="toast-text">${message}</span>`;
    } else {
        toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-text">${message}</span>`;
    }

    container.appendChild(toast);

    // Trigger reflow
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 250);
        }
    }, 2200);
}

function addFiles(newFiles) {
    let spaceLeft = 10 - currentFiles.length;
    if (spaceLeft <= 0) {
        showToast("Đã đạt giới hạn tối đa 10 file!", "error");
        return;
    }
    
    const MAX_SIZE = 25 * 1024 * 1024; // 25MB
    let currentSize = currentFiles.reduce((acc, file) => acc + file.size, 0);

    let added = false;
    for (let i = 0; i < newFiles.length; i++) {
        if (i < spaceLeft) {
            if (currentSize + newFiles[i].size > MAX_SIZE) {
                showToast("Tổng dung lượng không được vượt quá 25MB!", "error");
                break;
            }
            currentFiles.push(newFiles[i]);
            currentSize += newFiles[i].size;
            added = true;
        } else {
            showToast("Chỉ có thể tải lên tối đa 10 file! Một số file đã bị bỏ qua.", "error");
            break;
        }
    }
    
    if (added) {
        renderPreviews();
    }
}

document.addEventListener('paste', function (e) {
    if (document.getElementById('dataType').value !== 'file' || !document.getElementById('sendTab').classList.contains('active')) return;

    const clipboardData = e.clipboardData || window.clipboardData;
    const items = clipboardData.items;
    let tempFiles = [];

    for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'file') {
            tempFiles.push(items[i].getAsFile());
        }
    }
    if (tempFiles.length > 0) {
        e.preventDefault();
        addFiles(tempFiles);
    }
});

// Drag and Drop support
const pasteZone = document.getElementById('pasteZone');
if(pasteZone) {
    pasteZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        pasteZone.style.borderColor = 'var(--text-main)';
        pasteZone.style.background = 'var(--paste-hover-bg)';
    });

    pasteZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        pasteZone.style.borderColor = '';
        pasteZone.style.background = '';
    });

    pasteZone.addEventListener('drop', (e) => {
        e.preventDefault();
        pasteZone.style.borderColor = '';
        pasteZone.style.background = '';
        
        if (document.getElementById('dataType').value !== 'file' || !document.getElementById('sendTab').classList.contains('active')) return;

        if (e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                addFiles(files);
            }
        }
    });
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    addFiles(files);
    e.target.value = '';
}

function removeImage(index) {
    currentFiles.splice(index, 1);
    renderPreviews();
}

function renderPreviews() {
    const container = document.getElementById('previewContainer');
    container.innerHTML = '';

    if (currentFiles.length === 0) {
        document.getElementById('dropText').style.display = 'block';
        document.getElementById('previewCount').innerText = '';
        return;
    }

    document.getElementById('dropText').style.display = 'none';
    document.getElementById('previewCount').innerText = `Đã đính kèm ${currentFiles.length} file`;

    currentFiles.forEach((file, index) => {
        const div = document.createElement('div');
        div.className = 'preview-item';

        if (file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            const img = document.createElement('img');
            img.src = url;
            div.appendChild(img);
        } else {
            const ext = file.name.split('.').pop().toUpperCase();
            const iconDiv = document.createElement('div');
            iconDiv.className = 'file-icon';
            iconDiv.innerText = ext.length <= 4 ? ext : 'FILE';
            
            const nameDiv = document.createElement('div');
            nameDiv.className = 'file-name-preview';
            nameDiv.innerText = file.name;
            
            div.appendChild(iconDiv);
            div.appendChild(nameDiv);
        }

        const delBtn = document.createElement('div');
        delBtn.className = 'delete-btn';
        delBtn.innerHTML = 'X';
        delBtn.onclick = function (e) {
            e.stopPropagation();
            removeImage(index);
        };

        div.appendChild(delBtn);
        container.appendChild(div);
    });
}

async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

async function handleSend() {
    const adminHandsome = document.getElementById('adminHandsomeSend').checked;
    if (!adminHandsome) {
        pendingAction = 'send';
        document.getElementById('adminModal').classList.add('show');
        return;
    }

    const type = document.getElementById('dataType').value;
    const btn = document.querySelector('#sendTab .action-btn');
    const originalText = btn.innerText;

    let payload = {};

    try {
        if (type === 'text') {
            const textContent = document.getElementById('textContent').value;
            if (!textContent) {
                showToast("Bạn chưa nhập văn bản!", "error");
                return;
            }
            payload = { type: 'text', data: textContent };
        } else {
            if (currentFiles.length === 0) {
                showToast("Bạn chưa dán hay đính kèm file nào cả!", "error");
                return;
            }
            btn.innerHTML = '<span class="spinner"></span> ĐANG ĐỌC FILE...';
            const fileDataList = [];
            for (let file of currentFiles) {
                const b64 = await fileToBase64(file);
                fileDataList.push({ name: file.name, mime: file.type, base64: b64 });
            }
            payload = { type: 'file', data: fileDataList };
        }

        btn.innerHTML = '<span class="spinner"></span> ĐANG MÃ HÓA...';
        const payloadStr = JSON.stringify(payload);
        
        // Generate random 6 digit PIN
        const fakePin = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Encrypt data
        const encryptedBase64 = await encryptPayload(payloadStr, fakePin);
        
        // Save to Cloudflare KV via API
        const expireMinutes = parseInt(document.getElementById('expireTime').value) || 15;
        const expireAt = Date.now() + (expireMinutes * 60 * 1000);

        const res = await fetch('/api/clip', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pin: fakePin,
                ciphertext: encryptedBase64,
                expireAt: expireAt
            })
        });

        if (!res.ok) {
            throw new Error("Lỗi khi tải dữ liệu lên máy chủ");
        }

        const resultPin = document.getElementById('modalPin');
        resultPin.innerText = fakePin;
        document.getElementById('memorizeCheckbox').checked = false;
        document.getElementById('closeModalBtn').disabled = true;
        
        const qrcodeContainer = document.getElementById('qrcode-container');
        qrcodeContainer.innerHTML = '';
        new QRCode(qrcodeContainer, {
            text: `${window.location.origin}${window.location.pathname}?pin=${fakePin}`,
            width: 160,
            height: 160,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
        
        document.getElementById('resultModal').classList.add('show');
        showToast("Đã mã hóa và tải lên thành công!", "success");

        currentFiles = [];
        renderPreviews();
        document.getElementById('textContent').value = '';
        
    } catch (e) {
        console.error(e);
        showToast("Có lỗi xảy ra khi mã hóa!", "error");
    } finally {
        btn.innerText = originalText;
        document.getElementById('adminHandsomeSend').checked = false;
    }
}

function adminYes() {
    document.getElementById('adminModal').classList.remove('show');
    showToast("Quá chuẩn! Bạn có mắt nhìn người đấy.", "success");
    
    // Bắn pháo hoa ăn mừng khi khen admin
    if (isConfettiEnabled && typeof confetti === 'function') {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, zIndex: 10000 });
    }
    
    if (pendingAction === 'send') {
        document.getElementById('adminHandsomeSend').checked = true;
        handleSend();
    } else if (pendingAction === 'receive') {
        document.getElementById('adminHandsomeReceive').checked = true;
        handleReceive();
    }
    pendingAction = null;
}

function adminNo() {
    const msg = adminDenyMessages[Math.floor(Math.random() * adminDenyMessages.length)];
    showToast(msg, "error");
}

function toggleCloseBtn() {
    const cb = document.getElementById('memorizeCheckbox');
    const btn = document.getElementById('closeModalBtn');
    btn.disabled = !cb.checked;
}

function closeModal() {
    document.getElementById('resultModal').classList.remove('show');
    const btn = document.querySelector('#sendTab .action-btn');
    btn.innerText = "MÃ HÓA & GỬI";
}

async function handleReceive() {
    const pin = document.getElementById('pinInput').value;
    if (!/^\d{6}$/.test(pin)) {
        showToast("Mã bảo mật phải gồm đúng 6 chữ số!", "error");
        return;
    }

    const adminHandsome = document.getElementById('adminHandsomeReceive').checked;
    if (!adminHandsome) {
        pendingAction = 'receive';
        document.getElementById('adminModal').classList.add('show');
        return;
    }

    const btn = document.getElementById('receiveBtn');
    const originalText = btn.innerText;
    btn.innerHTML = '<span class="spinner"></span> ĐANG GIẢI MÃ...';

    try {
        const res = await fetch(`/api/clip?pin=${pin}`, { cache: 'no-store' });
        const data = await res.json();

        if (!res.ok) {
            showToast(data.error || "Mã PIN sai hoặc dữ liệu đã tự hủy!", "error");
            btn.innerText = originalText;
            return;
        }

        const encryptedBase64 = data.ciphertext;
        const decryptedStr = await decryptPayload(encryptedBase64, pin);
        currentDecryptedPin = pin; // Lưu lại để dùng cho nút XÓA NGAY
        const payload = JSON.parse(decryptedStr);

        document.getElementById('receiveResult').style.display = 'block';
        const receivedTextDiv = document.getElementById('receivedText');
        const receivedImagesDiv = document.getElementById('receivedImagesContainer');
        const copyBtn = document.getElementById('copyTextBtn');

        receivedTextDiv.innerText = '';
        receivedImagesDiv.innerHTML = '';
        copyBtn.style.display = 'none';

        if (payload.type === 'text') {
            receivedTextDiv.innerText = payload.data;
            copyBtn.style.display = 'block';
        } else if (payload.type === 'image' || payload.type === 'file') {
            payload.data.forEach((item, index) => {
                let base64Str = '';
                let isImage = false;
                let filename = `zeroclip_file_${Date.now()}_${index}`;
                
                if (typeof item === 'string') {
                    // Backward compatibility
                    base64Str = item;
                    isImage = true;
                    filename += '.png';
                } else {
                    base64Str = item.base64;
                    isImage = item.mime.startsWith('image/');
                    filename = item.name || filename;
                }

                const wrapper = document.createElement('div');
                wrapper.style.position = 'relative';
                wrapper.style.marginBottom = '10px';
                wrapper.style.background = 'var(--bg-color)';
                wrapper.style.padding = '10px';
                wrapper.style.borderRadius = '8px';
                wrapper.style.border = '1px solid var(--border-color)';
                
                if (isImage) {
                    const img = document.createElement('img');
                    img.src = base64Str;
                    img.style.width = '100%';
                    img.style.borderRadius = '4px';
                    img.style.display = 'block';
                    img.style.cursor = 'zoom-in';
                    img.onclick = () => {
                        document.getElementById('lightboxImg').src = base64Str;
                        document.getElementById('imageLightbox').classList.add('show');
                    };
                    wrapper.appendChild(img);
                } else {
                    const fileInfo = document.createElement('div');
                    fileInfo.style.color = 'var(--text-main)';
                    fileInfo.style.fontWeight = '600';
                    fileInfo.style.marginBottom = '8px';
                    fileInfo.style.wordBreak = 'break-all';
                    fileInfo.innerText = filename;
                    wrapper.appendChild(fileInfo);

                    let mime = item.mime || '';
                    if (mime.startsWith('audio/')) {
                        const audio = document.createElement('audio');
                        audio.controls = true;
                        audio.src = base64Str;
                        audio.style.width = '100%';
                        audio.style.marginBottom = '8px';
                        audio.style.outline = 'none';
                        wrapper.appendChild(audio);
                    } else if (mime.startsWith('video/')) {
                        const video = document.createElement('video');
                        video.controls = true;
                        video.src = base64Str;
                        video.style.width = '100%';
                        video.style.borderRadius = '4px';
                        video.style.marginBottom = '8px';
                        video.style.outline = 'none';
                        wrapper.appendChild(video);
                    } else if (mime === 'application/pdf') {
                        const iframe = document.createElement('iframe');
                        iframe.src = base64Str;
                        iframe.style.width = '100%';
                        iframe.style.height = '400px';
                        iframe.style.border = 'none';
                        iframe.style.borderRadius = '4px';
                        iframe.style.marginBottom = '8px';
                        iframe.style.background = '#fff';
                        wrapper.appendChild(iframe);
                    }
                }
                
                const dlBtn = document.createElement('button');
                dlBtn.innerText = "TẢI XUỐNG";
                dlBtn.className = "action-btn";
                dlBtn.style.marginTop = '8px';
                dlBtn.style.background = 'var(--card-bg)';
                dlBtn.style.color = 'var(--text-main)';
                dlBtn.style.border = '1px solid var(--border-color)';
                dlBtn.onclick = () => {
                    const a = document.createElement('a');
                    a.href = base64Str;
                    a.download = filename;
                    a.click();
                };
                
                wrapper.appendChild(dlBtn);
                receivedImagesDiv.appendChild(wrapper);
            });
        }

        // Không tự xóa nữa
        showToast("Đã lấy dữ liệu thành công! (Vẫn lưu trên máy chủ)", "success");
        if (isConfettiEnabled && typeof confetti === 'function') {
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, zIndex: 10000 });
        }
    } catch (e) {
        console.error(e);
        showToast("Mã PIN không đúng hoặc giải mã thất bại!", "error");
    } finally {
        btn.innerText = originalText;
        document.getElementById('adminHandsomeReceive').checked = false;
    }
}

function copyReceivedText() {
    const text = document.getElementById('receivedText').innerText;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        showToast("Đã sao chép vào bộ nhớ tạm!", "success");
    }).catch(err => {
        showToast("Trình duyệt không hỗ trợ sao chép tự động!", "error");
    });
}


// QR Scanner Logic
let html5QrCode = null;

function startScan() {
    document.getElementById('scannerModal').classList.add('show');
    
    html5QrCode = new Html5Qrcode("qr-reader");
    html5QrCode.start(
        { facingMode: "environment" }, 
        {
            fps: 10,
            qrbox: { width: 220, height: 220 },
            aspectRatio: 1.0
        },
        onScanSuccess,
        onScanFailure
    ).catch(err => {
        showToast("Không thể mở Camera. Hãy cấp quyền!", "error");
        stopScan();
    });
}

function stopScan() {
    document.getElementById('scannerModal').classList.remove('show');
    if (html5QrCode) {
        html5QrCode.stop().then(ignore => {
            html5QrCode.clear();
            html5QrCode = null;
        }).catch(err => {
            console.log(err);
        });
    }
}

function onScanSuccess(decodedText, decodedResult) {
    try {
        const url = new URL(decodedText);
        const pin = url.searchParams.get('pin');
        if (pin && pin.length === 6) {
            document.getElementById('pinInput').value = pin;
            stopScan();
            showToast("Quét thành công!", "success");
            handleReceive();
        } else {
            showToast("Mã QR không hợp lệ!", "error");
        }
    } catch (e) {
        if (decodedText.length === 6 && !isNaN(decodedText)) {
            document.getElementById('pinInput').value = decodedText;
            stopScan();
            showToast("Quét thành công!", "success");
            handleReceive();
        } else {
            showToast("Không nhận dạng được mã QR!", "error");
        }
    }
}

function onScanFailure(error) {
    // Ignore routine errors (like no QR found in frame)
}

function promptDelete() {
    if (!currentDecryptedPin) return;
    document.getElementById('confirmModal').classList.add('show');
}

function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('show');
}

async function executeDelete() {
    closeConfirmModal();
    if (!currentDecryptedPin) return;
    try {
        await fetch(`/api/clip?pin=${currentDecryptedPin}`, { method: 'DELETE' });
        showToast("Đã xóa vĩnh viễn thành công!", "success");
        
        // Xóa giao diện
        document.getElementById('receivedText').innerText = '';
        document.getElementById('receivedImagesContainer').innerHTML = '';
        document.getElementById('receiveResult').style.display = 'none';
        currentDecryptedPin = null;
    } catch (e) {
        showToast("Lỗi khi xóa dữ liệu!", "error");
    }
}

function fetchStorageStats() {
    showToast("Đang kiểm tra chỉ số Cân Bằng Tải & Lưu Trữ...", "success");
    fetch('/api/stats')
        .then(res => res.json())
        .then(data => {
            const storageBar = document.getElementById('storageBar');
            const storageText = document.getElementById('storageText');
            if (storageBar && storageText && data.percentage !== undefined) {
                storageBar.style.width = data.percentage + '%';
                storageText.innerText = data.percentage + '%';
                storageBar.parentElement.title = `Đã dùng ${data.count} / ${data.maxCapacity} ổ lưu trữ`;
                showToast(`Hạ tầng ổn định! Đã dùng ${data.count}/${data.maxCapacity} ô nhớ (${data.percentage}%).`, "success");
            }
        })
        .catch(err => {
            showToast("Hạ tầng Zero-Trace Edge CDN đang hoạt động 100%!", "success");
        });
}

// ==========================================================================
// APP ICONS WITH STYLIZED LETTER "Z" (ZeroClip Branding)
// ==========================================================================
const Z_PATH = "M 17 18 L 47 18 L 17 46 L 47 46";

const APP_ICONS = {
    'cyber': {
        name: 'Cyber',
        theme: 'cyber',
        svg: `<svg viewBox="0 0 64 64" width="100%" height="100%">
            <rect width="64" height="64" rx="16" fill="#050e24" stroke="#00f0ff" stroke-width="1.5"/>
            <path d="${Z_PATH}" fill="none" stroke="#00f0ff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 5px rgba(0, 240, 255, 0.9));"/>
        </svg>`
    },
    'cloud': {
        name: 'Cloud',
        theme: 'cloud',
        svg: `<svg viewBox="0 0 64 64" width="100%" height="100%">
            <defs>
                <linearGradient id="cloudBg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#7c8ff6"/>
                    <stop offset="35%" stop-color="#93a5fa"/>
                    <stop offset="70%" stop-color="#c4b5fd"/>
                    <stop offset="100%" stop-color="#fed7aa"/>
                </linearGradient>
            </defs>
            <rect width="64" height="64" rx="16" fill="url(#cloudBg)"/>
            <path d="${Z_PATH}" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 5px rgba(79, 70, 229, 0.4));"/>
        </svg>`
    },
    'gradient': {
        name: 'Gradient',
        theme: 'gradient',
        svg: `<svg viewBox="0 0 64 64" width="100%" height="100%">
            <defs>
                <linearGradient id="gradBg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#6366f1"/>
                    <stop offset="35%" stop-color="#d946ef"/>
                    <stop offset="70%" stop-color="#f43f5e"/>
                    <stop offset="100%" stop-color="#f97316"/>
                </linearGradient>
            </defs>
            <rect width="64" height="64" rx="16" fill="url(#gradBg)"/>
            <path d="${Z_PATH}" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 5px rgba(124, 58, 237, 0.45));"/>
        </svg>`
    },
    'holographic': {
        name: 'Holo',
        theme: 'holographic',
        svg: `<svg viewBox="0 0 64 64" width="100%" height="100%">
            <defs>
                <linearGradient id="holoPrismBg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fdf2f8"/>
                    <stop offset="25%" stop-color="#e0e7ff"/>
                    <stop offset="50%" stop-color="#c7d2fe"/>
                    <stop offset="75%" stop-color="#bae6fd"/>
                    <stop offset="100%" stop-color="#fed7aa"/>
                </linearGradient>
                <linearGradient id="holoPrismEdge" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#f43f5e"/>
                    <stop offset="33%" stop-color="#a855f7"/>
                    <stop offset="66%" stop-color="#3b82f6"/>
                    <stop offset="100%" stop-color="#10b981"/>
                </linearGradient>
            </defs>
            <rect width="64" height="64" rx="16" fill="url(#holoPrismBg)" stroke="url(#holoPrismEdge)" stroke-width="2"/>
            <path d="${Z_PATH}" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 5px rgba(104, 136, 248, 0.5));"/>
        </svg>`
    },
    'levitate': {
        name: 'Levitate',
        theme: 'levitate',
        svg: `<svg viewBox="0 0 64 64" width="100%" height="100%">
            <defs>
                <linearGradient id="leviBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#c084fc"/>
                    <stop offset="50%" stop-color="#a855f7"/>
                    <stop offset="100%" stop-color="#6b21a8"/>
                </linearGradient>
            </defs>
            <rect width="64" height="64" rx="16" fill="#0c0919" stroke="url(#leviBorder)" stroke-width="1.8"/>
            <path d="${Z_PATH}" fill="none" stroke="#c084fc" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 7px rgba(192, 132, 252, 0.95));"/>
        </svg>`
    },
    'diamond': {
        name: 'Diamond',
        theme: 'diamond',
        svg: `<svg viewBox="0 0 64 64" width="100%" height="100%">
            <defs>
                <linearGradient id="diaSomaBg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="35%" stop-color="#fce7f3"/>
                    <stop offset="70%" stop-color="#f3e8ff"/>
                    <stop offset="100%" stop-color="#bae6fd"/>
                </linearGradient>
                <linearGradient id="diaSomaBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="45%" stop-color="#f472b6"/>
                    <stop offset="75%" stop-color="#c084fc"/>
                    <stop offset="100%" stop-color="#38bdf8"/>
                </linearGradient>
            </defs>
            <rect width="64" height="64" rx="16" fill="url(#diaSomaBg)" stroke="url(#diaSomaBorder)" stroke-width="1.8"/>
            <polygon points="46,12 56,22 46,32 36,22" fill="rgba(244, 114, 182, 0.35)"/>
            <circle cx="50" cy="14" r="2" fill="#ffffff" opacity="0.95"/>
            <path d="${Z_PATH}" fill="none" stroke="#7e22ce" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 6px rgba(192, 132, 252, 0.6));"/>
        </svg>`
    },
    'light': {
        name: 'Sáng',
        theme: 'light',
        svg: `<svg viewBox="0 0 64 64" width="100%" height="100%">
            <rect width="64" height="64" rx="16" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>
            <path d="${Z_PATH}" fill="none" stroke="#09090b" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
    },
    'dark': {
        name: 'Tối',
        theme: 'dark',
        svg: `<svg viewBox="0 0 64 64" width="100%" height="100%">
            <rect width="64" height="64" rx="16" fill="#18181b" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
            <path d="${Z_PATH}" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
    }
};

// ==========================================================================
// UNIFIED THEME & LOGO STATE MANAGEMENT
// ==========================================================================

const THEME_NOTIFICATIONS = {
    'cyber': {
        icon: '⚡',
        title: 'Cyber 2.5D',
        msg: 'Đã kích hoạt hệ thống số hóa & Neon Sci-Fi!'
    },
    'cloud': {
        icon: '☁️',
        title: 'Cloud Pastel',
        msg: 'Không gian mây trời hoàng hôn thanh bình & êm ái!'
    },
    'gradient': {
        icon: '🌈',
        title: 'Gradient UI',
        msg: 'Bảng màu chuyển động đa sắc sống động & tràn đầy năng lượng!'
    },
    'holographic': {
        icon: '💠',
        title: 'Holographic Prism',
        msg: 'Lăng kính pha lê 3D & khúc xạ quang phổ cầu vồng!'
    },
    'levitate': {
        icon: '🔮',
        title: 'Levitate 3D',
        msg: '3D Living Dashboard & khối năng lượng tím lơ lửng!'
    },
    'diamond': {
        icon: '💎',
        title: 'Diamond Sōma',
        msg: 'Sōma Pastel Crystal & kính lỏng siêu thực đã kết nối!'
    },
    'light': {
        icon: '☼',
        title: 'Giao diện Sáng',
        msg: 'Chế độ Sáng tối giản, thanh lịch & rõ nét!'
    },
    'dark': {
        icon: '☾',
        title: 'Giao diện Tối',
        msg: 'Chế độ Tối nền đen sâu tĩnh lặng & bảo vệ mắt!'
    }
};

function showThemeToast(themeKey) {
    const item = THEME_NOTIFICATIONS[themeKey] || THEME_NOTIFICATIONS['cyber'];
    showToast(`${item.icon} Giao diện: <strong>${item.title}</strong>`, 'success');
}

// ==========================================================================
// DYNAMIC APP ICON, FAVICON & PWA MANIFEST UPDATER (MOBILE / DESKTOP)
// ==========================================================================
let currentManifestBlobUrl = null;

function updateDynamicAppIcons(iconKey) {
    const item = APP_ICONS[iconKey] || APP_ICONS['cyber'];
    if (!item || !item.svg) return;

    let svgStr = item.svg;
    if (!svgStr.includes('xmlns=')) {
        svgStr = svgStr.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
    }

    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const blobUrl = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, 512, 512);
            ctx.drawImage(img, 0, 0, 512, 512);
            const pngDataUrl = canvas.toDataURL('image/png');

            // 1. Cập nhật Favicon (Tab trình duyệt)
            let favicon = document.getElementById('appFavicon') || document.querySelector('link[rel="icon"]');
            if (!favicon) {
                favicon = document.createElement('link');
                favicon.id = 'appFavicon';
                favicon.rel = 'icon';
                document.head.appendChild(favicon);
            }
            favicon.type = 'image/png';
            favicon.href = pngDataUrl;

            // 2. Cập nhật Apple Touch Icon (Khi người dùng iOS Thêm vào Màn hình chính)
            let appleTouch = document.getElementById('appTouchIcon') || document.querySelector('link[rel="apple-touch-icon"]');
            if (!appleTouch) {
                appleTouch = document.createElement('link');
                appleTouch.id = 'appTouchIcon';
                appleTouch.rel = 'apple-touch-icon';
                document.head.appendChild(appleTouch);
            }
            appleTouch.href = pngDataUrl;

            // 3. Cập nhật Manifest (Cho PWA Android & Desktop)
            updateDynamicManifest(iconKey, pngDataUrl);
        } catch (e) {
            console.warn('Canvas icon generation error:', e);
        } finally {
            URL.revokeObjectURL(blobUrl);
        }
    };
    img.onerror = () => {
        URL.revokeObjectURL(blobUrl);
    };
    img.src = blobUrl;
}

function updateDynamicManifest(iconKey, pngDataUrl) {
    const themeMode = APP_ICONS[iconKey]?.theme || 'cyber';
    const colorMap = {
        'cyber': { bg: '#030712', theme: '#00f0ff' },
        'cloud': { bg: '#8fa4f8', theme: '#4f46e5' },
        'gradient': { bg: '#faf5ff', theme: '#ec4899' },
        'holographic': { bg: '#f1f4ff', theme: '#6888f8' },
        'levitate': { bg: '#0c0919', theme: '#c084fc' },
        'diamond': { bg: '#fdf4ff', theme: '#c084fc' },
        'light': { bg: '#fafafa', theme: '#111111' },
        'dark': { bg: '#000000', theme: '#ffffff' }
    };
    const colors = colorMap[themeMode] || colorMap['cyber'];

    const manifestObj = {
        name: "ZeroClip",
        short_name: "ZeroClip",
        description: "Burn After Reading Clipboard",
        start_url: "./",
        display: "standalone",
        background_color: colors.bg,
        theme_color: colors.theme,
        icons: [
            {
                src: pngDataUrl,
                sizes: "192x192 512x512",
                type: "image/png",
                purpose: "any maskable"
            }
        ]
    };

    if (currentManifestBlobUrl) {
        URL.revokeObjectURL(currentManifestBlobUrl);
    }

    const manifestBlob = new Blob([JSON.stringify(manifestObj, null, 2)], { type: 'application/manifest+json' });
    currentManifestBlobUrl = URL.createObjectURL(manifestBlob);

    let manifestLink = document.getElementById('appManifestLink') || document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
        manifestLink = document.createElement('link');
        manifestLink.id = 'appManifestLink';
        manifestLink.rel = 'manifest';
        document.head.appendChild(manifestLink);
    }
    manifestLink.href = currentManifestBlobUrl;
}

function setAppIcon(iconKey, isUserManual = false) {
    if (!APP_ICONS[iconKey]) {
        iconKey = 'cyber';
    }

    if (isUserManual) {
        localStorage.setItem('zeroclip_app_icon', iconKey);
        // Nếu chọn icon là Cyber, Sáng, hoặc Tối -> đổi Theme tương ứng
        if (APP_ICONS[iconKey].theme) {
            setTheme(APP_ICONS[iconKey].theme, false);
            showThemeToast(APP_ICONS[iconKey].theme);
        }
    }

    // Cập nhật Favicon, Apple Touch Icon và PWA Manifest động
    updateDynamicAppIcons(iconKey);

    // Cập nhật Header Logo Badge
    const headerLogo = document.getElementById('headerLogoBadge');
    if (headerLogo) {
        headerLogo.innerHTML = APP_ICONS[iconKey].svg;
        headerLogo.title = `Biểu tượng: ${APP_ICONS[iconKey].name} (Bấm để đổi)`;
        headerLogo.onclick = (e) => toggleSettingsMenu(e);

        // Hiệu ứng pop scale khi đổi
        headerLogo.style.transform = 'scale(0.85) rotate(-6deg)';
        setTimeout(() => {
            headerLogo.style.transform = '';
        }, 220);
    }

    // Cập nhật dấu checkmark ✔ trong lưới App Icon
    document.querySelectorAll('.app-icon-card').forEach(card => {
        const key = card.getAttribute('data-icon-key');
        const checkmark = card.querySelector('.icon-checkmark');
        if (key === iconKey) {
            card.classList.add('active');
            if (!checkmark) {
                const checkEl = document.createElement('div');
                checkEl.className = 'icon-checkmark';
                checkEl.innerText = '✔';
                card.appendChild(checkEl);
            }
        } else {
            card.classList.remove('active');
            if (checkmark) {
                checkmark.remove();
            }
        }
    });
}

function renderAppIconGrid() {
    const grid = document.getElementById('appIconGrid');
    if (!grid) return;

    grid.innerHTML = '';
    const currentIcon = localStorage.getItem('zeroclip_app_icon') || 'light';

    Object.keys(APP_ICONS).forEach(key => {
        const item = APP_ICONS[key];
        const card = document.createElement('div');
        card.className = `app-icon-card ${key === currentIcon ? 'active' : ''}`;
        card.setAttribute('data-icon-key', key);
        card.onclick = () => setAppIcon(key, true);

        card.innerHTML = `
            <div class="app-icon-squircle">
                ${item.svg}
            </div>
            <div class="app-icon-name" title="${item.name}">${item.name}</div>
            ${key === currentIcon ? '<div class="icon-checkmark">✔</div>' : ''}
        `;

        grid.appendChild(card);
    });
}

function setTheme(mode, updateLogo = true) {
    if (!['cyber', 'cloud', 'gradient', 'holographic', 'levitate', 'diamond', 'light', 'dark'].includes(mode)) {
        mode = 'light';
    }

    localStorage.setItem('zeroclip_theme_mode', mode);

    // Gán data-theme (cyber, cloud, gradient, holographic, levitate, diamond, light, dark)
    document.documentElement.setAttribute('data-theme', mode);

    // Cập nhật Quick Theme Switch Bar
    const quickIcon = document.getElementById('quickThemeIcon');
    const quickLabel = document.getElementById('quickThemeLabel');
    if (quickIcon && quickLabel) {
        if (mode === 'cyber') {
            quickIcon.innerText = '⚡';
            quickLabel.innerText = 'Cyber';
        } else if (mode === 'cloud') {
            quickIcon.innerText = '☁️';
            quickLabel.innerText = 'Cloud';
        } else if (mode === 'gradient') {
            quickIcon.innerText = '🌈';
            quickLabel.innerText = 'Gradient';
        } else if (mode === 'holographic') {
            quickIcon.innerText = '💠';
            quickLabel.innerText = 'Holo';
        } else if (mode === 'levitate') {
            quickIcon.innerText = '🔮';
            quickLabel.innerText = 'Levitate';
        } else if (mode === 'diamond') {
            quickIcon.innerText = '💎';
            quickLabel.innerText = 'Diamond';
        } else if (mode === 'light') {
            quickIcon.innerText = '☼';
            quickLabel.innerText = 'Sáng';
        } else {
            quickIcon.innerText = '☾';
            quickLabel.innerText = 'Tối';
        }
    }

    // Cập nhật meta theme-color cho mobile / browser frame
    const metaThemeColor = document.getElementById('theme-color-meta');
    if (metaThemeColor) {
        const colorMap = {
            'cyber': '#030712',
            'cloud': '#7c8ff6',
            'gradient': '#ec4899',
            'holographic': '#6888f8',
            'levitate': '#090714',
            'diamond': '#fce7f3',
            'light': '#fafafa',
            'dark': '#000000'
        };
        metaThemeColor.setAttribute('content', colorMap[mode] || '#030712');
    }

    // Cập nhật Logo theo Theme nếu updateLogo = true
    if (updateLogo) {
        setAppIcon(mode, false);
    }
}

function cycleTheme() {
    const currentMode = localStorage.getItem('zeroclip_theme_mode') || 'light';
    const modes = ['light', 'dark', 'cyber', 'cloud', 'gradient', 'holographic', 'levitate', 'diamond'];
    let nextIdx = (modes.indexOf(currentMode) + 1) % modes.length;
    const nextTheme = modes[nextIdx];
    setTheme(nextTheme, false);
    setAppIcon(nextTheme, false);
    showThemeToast(nextTheme);
}

// Khởi tạo Theme và App Icon ngay khi load script
const initialThemeMode = localStorage.getItem('zeroclip_theme_mode') || 'light';
const initialAppIcon = localStorage.getItem('zeroclip_app_icon') || initialThemeMode;

// Chạy cấu hình ban đầu
setTheme(initialThemeMode, false);

// Check URL params for pin & DOM load handlers
window.addEventListener('DOMContentLoaded', () => {
    initConfettiToggle();
    initBubbleToggle();
    toggleInputType();
    renderAppIconGrid();
    setAppIcon(initialAppIcon, false);
    
    // Fetch real storage usage from DB
    fetch('/api/stats')
        .then(res => res.json())
        .then(data => {
            const storageBar = document.getElementById('storageBar');
            const storageText = document.getElementById('storageText');
            if (storageBar && storageText && data.percentage !== undefined) {
                setTimeout(() => {
                    storageBar.style.width = data.percentage + '%';
                    storageText.innerText = data.percentage + '%';
                    storageBar.parentElement.title = `Đã dùng ${data.count} / ${data.maxCapacity} ổ lưu trữ`;
                }, 300);
            }
        })
        .catch(err => console.error('Failed to fetch DB stats'));

    const params = new URLSearchParams(window.location.search);
    const pin = params.get('pin');
    if (pin && pin.length === 6) {
        switchTab('receive');
        document.getElementById('pinInput').value = pin;
        showToast("Đã nhập sẵn mã từ QR. Hãy bấm lấy dữ liệu!", "success");
    }
});

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registered', reg))
            .catch(err => console.error('Service Worker registration failed', err));
    });
}

// Chặn F12 và các phím tắt Developer (Không chặn chuột phải)
document.addEventListener('keydown', e => {
    if (e.key === 'F12' || 
       (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key)) || 
       (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
    }
});
