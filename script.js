// Invisible characters mapping (same as Python version)
const INVISIBLE_CHARS = {
  0: "\u200b", // Zero Width Space
  1: "\u200c", // Zero Width Non-Joiner
};

// Encode function - converts secret text to binary and hides it in cover text
function encode(coverText, secretText) {
  try {
    // Convert secret text to UTF-8 bytes, then to binary string
    const encoder = new TextEncoder();
    const bytes = encoder.encode(secretText);
    const binary = Array.from(bytes)
      .map((byte) => byte.toString(2).padStart(8, "0"))
      .join("");

    // Convert binary to invisible characters
    const hidden = binary
      .split("")
      .map((bit) => INVISIBLE_CHARS[parseInt(bit)])
      .join("");

    return coverText + hidden;
  } catch (error) {
    throw new Error("Encoding failed: " + error.message);
  }
}

// Decode function - extracts hidden message from steganographic text
function decode(stegoText) {
  try {
    // Extract invisible characters and convert back to binary
    const bits = Array.from(stegoText)
      .filter(
        (char) => char === INVISIBLE_CHARS[0] || char === INVISIBLE_CHARS[1]
      )
      .map((char) => (char === INVISIBLE_CHARS[0] ? "0" : "1"))
      .join("");

    if (bits.length === 0) {
      throw new Error("No hidden message found in the text");
    }

    // Convert binary back to bytes
    const bytes = [];
    for (let i = 0; i < bits.length; i += 8) {
      const byteString = bits.substr(i, 8);
      if (byteString.length === 8) {
        bytes.push(parseInt(byteString, 2));
      }
    }

    // Convert bytes back to text
    const decoder = new TextDecoder();
    return decoder.decode(new Uint8Array(bytes));
  } catch (error) {
    throw new Error("Decoding failed: " + error.message);
  }
}

// Utility function to copy text to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackError) {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

// Show notification
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;

  if (type === "success") {
    notification.style.background = "linear-gradient(135deg, #48bb78, #38a169)";
  } else if (type === "error") {
    notification.style.background = "linear-gradient(135deg, #f56565, #e53e3e)";
  } else {
    notification.style.background = "linear-gradient(135deg, #667eea, #764ba2)";
  }

  document.body.appendChild(notification);

  // Auto remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// DOM elements
const coverTextInput = document.getElementById("cover-text");
const secretTextInput = document.getElementById("secret-text");
const encodeBtn = document.getElementById("encode-btn");
const encodedResult = document.getElementById("encoded-result");
const encodedText = document.getElementById("encoded-text");
const copyEncodedBtn = document.getElementById("copy-encoded");

const stegoTextInput = document.getElementById("stego-text");
const pasteStegoBtn = document.getElementById("paste-stego");
const decodeBtn = document.getElementById("decode-btn");
const decodedResult = document.getElementById("decoded-result");
const decodedText = document.getElementById("decoded-text");
const copyDecodedBtn = document.getElementById("copy-decoded");
// Copy decoded message to clipboard
if (copyDecodedBtn) {
  copyDecodedBtn.addEventListener("click", async () => {
    const text = decodedText.textContent;
    if (!text) {
      showNotification("No hidden message to copy", "error");
      return;
    }
    const success = await copyToClipboard(text);
    if (success) {
      showNotification("Hidden message copied!", "success");
    } else {
      showNotification("Failed to copy hidden message", "error");
    }
  });
}

// Event listeners
encodeBtn.addEventListener("click", async () => {
  const coverText = coverTextInput.value.trim();
  const secretText = secretTextInput.value.trim();

  if (!coverText) {
    showNotification("Please enter cover text", "error");
    coverTextInput.focus();
    return;
  }

  if (!secretText) {
    showNotification("Please enter secret message", "error");
    secretTextInput.focus();
    return;
  }

  try {
    encodeBtn.classList.add("loading");
    encodeBtn.disabled = true;

    const encoded = encode(coverText, secretText);
    encodedText.textContent = encoded;
    encodedResult.style.display = "block";

    showNotification("Message encoded successfully!", "success");

    // Scroll to result
    encodedResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (error) {
    showNotification(error.message, "error");
  } finally {
    encodeBtn.classList.remove("loading");
    encodeBtn.disabled = false;
  }
});

decodeBtn.addEventListener("click", async () => {
  const stegoText = stegoTextInput.value.trim();
  if (!stegoText) {
    showNotification("Please enter steganographic text", "error");
    stegoTextInput.focus();
    return;
  }
  try {
    decodeBtn.classList.add("loading");
    decodeBtn.disabled = true;
    const decoded = decode(stegoText);
    decodedText.textContent = decoded;
    decodedResult.style.display = "block";
    showNotification("Message decoded successfully!", "success");
    decodedResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (error) {
    showNotification(error.message, "error");
    decodedResult.style.display = "none";
  } finally {
    decodeBtn.classList.remove("loading");
    decodeBtn.disabled = false;
  }
});

copyEncodedBtn.addEventListener("click", async () => {
  const text = encodedText.textContent;
  if (!text) {
    showNotification("No text to copy", "error");
    return;
  }

  const success = await copyToClipboard(text);
  if (success) {
    showNotification("Text copied to clipboard!", "success");
  } else {
    showNotification("Failed to copy text", "error");
  }
});

pasteStegoBtn.addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    stegoTextInput.value = text;
    autoResize(stegoTextInput);
    showNotification("Text pasted from clipboard!", "success");
    stegoTextInput.focus();
  } catch (error) {
    showNotification(
      "Failed to paste from clipboard. Please paste manually (Ctrl+V)",
      "error"
    );
  }
});

// Auto-resize textareas
function autoResize(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

[coverTextInput, secretTextInput, stegoTextInput].forEach((textarea) => {
  textarea.addEventListener("input", () => autoResize(textarea));
});

// Initialize with example data
document.addEventListener("DOMContentLoaded", () => {
  coverTextInput.value = "";
  secretTextInput.value = "";

  // Auto-resize initial content
  autoResize(coverTextInput);
  autoResize(secretTextInput);
});

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + Enter to encode
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    if (
      document.activeElement === coverTextInput ||
      document.activeElement === secretTextInput
    ) {
      e.preventDefault();
      encodeBtn.click();
    }
  }

  // Ctrl/Cmd + Shift + Enter to decode
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "Enter") {
    if (document.activeElement === stegoTextInput) {
      e.preventDefault();
      decodeBtn.click();
    }
  }
});
