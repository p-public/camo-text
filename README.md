# 🕵️ Camo Text - Steganography Tool

A modern web application for hiding secret messages in plain text using invisible Unicode characters. Built with HTML, CSS, and JavaScript.

## ✨ Features

- **🔐 Secure Steganography**: Uses invisible Unicode characters (Zero Width Space and Zero Width Non-Joiner)
- **👁️ Invisible to Humans**: Hidden messages are completely undetectable to the naked eye
- **⚡ Instant Encoding/Decoding**: Real-time processing with beautiful UI
- **📋 Copy to Clipboard**: Easy copying of encoded text
- **🎨 Modern UI**: Beautiful, responsive design with smooth animations
- **⌨️ Keyboard Shortcuts**: Quick access with Ctrl+Enter and Ctrl+Shift+Enter

## 🚀 How to Use

1. **Encode a Secret Message**:

   - Enter your cover text (the visible text)
   - Enter your secret message (the hidden text)
   - Click "Encode message" or press `Ctrl+Enter`
   - Copy the encoded text to share

2. **Decode a Hidden Message**:
   - Paste the steganographic text containing hidden message
   - Click "Decode message" or press `Ctrl+Shift+Enter`
   - View the revealed secret message

## 🛠️ Technical Details

### Steganography Method

The tool uses two invisible Unicode characters:

- `\u200b` (Zero Width Space) - represents binary `0`
- `\u200c` (Zero Width Non-Joiner) - represents binary `1`

### Encoding Process

1. Convert secret text to UTF-8 bytes
2. Convert bytes to binary string (8 bits per byte)
3. Map each binary digit to invisible character
4. Append invisible characters to cover text

### Decoding Process

1. Extract invisible characters from text
2. Convert invisible characters back to binary
3. Group binary into 8-bit bytes
4. Convert bytes back to UTF-8 text

## 📁 Project Structure

```
camo-text/
├── index.html      # Main HTML file
├── styles.css      # CSS styling
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## ⚠️ Important Notes

- The hidden message is completely invisible but can be detected by tools that analyze Unicode characters
- Large secret messages will result in many invisible characters, which might be suspicious
- Always test encoding/decoding with the same tool to ensure compatibility
- The tool works best with plain text; formatting might interfere with the steganography

## 🎯 Use Cases

- **Privacy**: Hide sensitive information in seemingly innocent text
- **Security**: Pass secret messages through monitored channels
- **Fun**: Create hidden messages for games or puzzles
- **Research**: Study steganography techniques and applications

## 📄 License

This project is open source and available under the MIT License.

---

**© 2025 [PGroup JSC](https://hungphu.org). All rights reserved.**
