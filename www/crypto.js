// Web Crypto API Helper Functions
// Handles high-speed AES-GCM encryption natively in the browser

async function getKeyMaterial(pin) {
    const enc = new TextEncoder();
    return window.crypto.subtle.importKey(
        "raw",
        enc.encode(pin),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
    );
}

async function getKey(keyMaterial, salt) {
    return window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

// Convert ArrayBuffer to Base64 (safe for large buffers)
function bufferToBase64(buffer) {
    return new Promise((resolve) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        const reader = new FileReader();
        reader.onload = function(e) {
            const dataUrl = e.target.result;
            const base64 = dataUrl.split(',')[1];
            resolve(base64);
        };
        reader.readAsDataURL(blob);
    });
}

// Convert Base64 back to ArrayBuffer
function base64ToBuffer(base64) {
    const binaryStr = atob(base64);
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
    }
    return bytes.buffer;
}

// Encrypt string payload and return Base64 string
async function encryptPayload(payloadStr, pin) {
    const keyMaterial = await getKeyMaterial(pin);
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const key = await getKey(keyMaterial, salt);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    
    const ciphertext = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        enc.encode(payloadStr)
    );
    
    // Combine salt + iv + ciphertext
    const result = new Uint8Array(salt.byteLength + iv.byteLength + ciphertext.byteLength);
    result.set(salt, 0);
    result.set(iv, salt.byteLength);
    result.set(new Uint8Array(ciphertext), salt.byteLength + iv.byteLength);
    
    return await bufferToBase64(result.buffer);
}

// Decrypt Base64 string payload and return original string
async function decryptPayload(encryptedBase64, pin) {
    const encryptedData = new Uint8Array(base64ToBuffer(encryptedBase64));
    
    if (encryptedData.length < 28) {
        throw new Error("Dữ liệu không hợp lệ.");
    }

    const salt = encryptedData.slice(0, 16);
    const iv = encryptedData.slice(16, 28);
    const ciphertext = encryptedData.slice(28);
    
    const keyMaterial = await getKeyMaterial(pin);
    const key = await getKey(keyMaterial, salt);
    
    try {
        const decrypted = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            key,
            ciphertext
        );
        const dec = new TextDecoder();
        return dec.decode(decrypted);
    } catch (e) {
        throw new Error("Mã PIN sai hoặc dữ liệu bị hỏng.");
    }
}
