# IconCut - Icon Generator Tool

A fast, simple, and free icon generator tool that supports generating website favicons, iOS app icons, and Android app icons.

## 🚀 Features

- **Pure Frontend Processing**: All image processing is done locally in the browser, protecting privacy and security
- **Multi-Platform Support**: Supports website favicons, iOS apps, and Android apps with three platform presets
- **Batch Generation**: Generate multiple icon sizes with one click
- **ZIP Package Download**: Convenient batch download of all generated icons
- **Responsive Design**: Compatible with desktop and mobile devices
- **Drag & Drop Upload**: Supports drag and drop file upload for easy operation

## 📱 Supported Platforms and Sizes

### Website Favicon
- 16×16 (favicon-16x16.png)
- 32×32 (favicon-32x32.png)
- 48×48 (favicon-48x48.png)
- 96×96 (favicon-96x96.png)
- 144×144 (favicon-144x144.png)
- 180×180 (apple-touch-icon.png)
- 192×192 (android-chrome-192x192.png)

### Browser Extension
- 16×16 (extension-16x16.png)
- 32×32 (extension-32x32.png)
- 48×48 (extension-48x48.png)
- 128×128 (extension-128x128.png)
- 256×256 (extension-256x256.png)
- 512×512 (extension-512x512.png)

### iOS App
- 60×60 (ios-60x60.png)
- 120×120 (ios-120x120.png)
- 180×180 (ios-180x180.png)

### Android App
- 48×48 (android-48x48.png)
- 96×96 (android-96x96.png)
- 192×192 (android-192x192.png)

### Complete Icon Set
- 16×16 (icon-16x16.png)
- 32×32 (icon-32x32.png)
- 48×48 (icon-48x48.png)
- 96×96 (icon-96x96.png)
- 128×128 (icon-128x128.png)
- 144×144 (icon-144x144.png)
- 180×180 (icon-180x180.png)
- 192×192 (icon-192x192.png)
- 256×256 (icon-256x256.png)
- 512×512 (icon-512x512.png)

## 🛠️ Tech Stack

- **React 18** - User interface framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **Canvas API** - Image processing
- **JSZip** - ZIP file generation
- **FileSaver.js** - File download

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Development Mode
```bash
npm run dev
```

### Build Production Version
```bash
npm run build
```

### Preview Production Version
```bash
npm run preview
```

## 📖 Usage

1. **Upload Image**: Drag and drop or click to select PNG/JPG format image files
2. **Select Platform**: Choose target platform (Website, iOS, or Android)
3. **Download Icons**: Preview generated icons and download ZIP package

## 🎯 MVP Features

- ✅ Basic image upload and preview
- ✅ 3 platform preset sizes
- ✅ Center crop processing
- ✅ ZIP package download
- ✅ Responsive layout

## 📝 Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Page header
│   ├── ImageUpload.tsx # Image upload component
│   ├── PlatformSelector.tsx # Platform selection component
│   ├── IconPreview.tsx # Icon preview component
│   └── Footer.tsx      # Page footer
├── utils/              # Utility functions
│   ├── imageProcessor.ts # Image processing logic
│   └── downloadHelper.ts # Download functionality
├── types/              # TypeScript type definitions
├── constants/          # Constant configurations
└── App.tsx            # Main application component
```

## 🔧 Core Functionality Implementation

### Image Processing
Uses Canvas API to implement image center cropping and size adjustment:
- Automatically calculates optimal crop area
- Optimizes file size while maintaining image quality
- Supports batch processing of multiple sizes

### File Download
- Single icon download
- ZIP batch package download
- Automatic filename generation

## 🌟 Performance Optimization

- Image processing time < 3 seconds (for images under 1MB)
- Page load time < 2 seconds
- Zero server dependency, completely offline available

## 📄 License

MIT License

## 🤝 Contributing

Welcome to submit Issues and Pull Requests!

## 📞 Contact

If you have any questions or suggestions, please contact us through GitHub Issues.