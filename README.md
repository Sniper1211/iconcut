# IconCut - 图标生成工具

一个快速、简单、免费的图标生成工具，支持生成网站 Favicon、iOS 应用图标和 Android 应用图标。

## 🚀 特性

- **纯前端处理**：所有图片处理都在浏览器本地完成，保护隐私安全
- **多平台支持**：支持网站 Favicon、iOS 应用、Android 应用三种平台预设
- **批量生成**：一键生成多种尺寸的图标
- **ZIP 打包下载**：方便批量下载所有生成的图标
- **响应式设计**：适配桌面和移动设备
- **拖拽上传**：支持拖拽文件上传，操作简便

## 📱 支持的平台和尺寸

### 网站 Favicon
- 16×16 (favicon-16x16.png)
- 32×32 (favicon-32x32.png)  
- 180×180 (apple-touch-icon.png)

### iOS 应用
- 60×60 (ios-60x60.png)
- 120×120 (ios-120x120.png)
- 180×180 (ios-180x180.png)

### Android 应用
- 48×48 (android-48x48.png)
- 96×96 (android-96x96.png)
- 192×192 (android-192x192.png)

## 🛠️ 技术栈

- **React 18** - 用户界面框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 快速的构建工具
- **Canvas API** - 图片处理
- **JSZip** - ZIP 文件生成
- **FileSaver.js** - 文件下载

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 📖 使用方法

1. **上传图片**：拖拽或点击选择 PNG/JPG 格式的图片文件
2. **选择平台**：选择目标平台（网站、iOS 或 Android）
3. **下载图标**：预览生成的图标并下载 ZIP 包

## 🎯 MVP 功能

- ✅ 基础图片上传和预览
- ✅ 3种平台预设尺寸
- ✅ 居中裁剪处理
- ✅ ZIP打包下载
- ✅ 响应式布局

## 📝 项目结构

```
src/
├── components/          # React 组件
│   ├── Header.tsx      # 页面头部
│   ├── ImageUpload.tsx # 图片上传组件
│   ├── PlatformSelector.tsx # 平台选择组件
│   ├── IconPreview.tsx # 图标预览组件
│   └── Footer.tsx      # 页面底部
├── utils/              # 工具函数
│   ├── imageProcessor.ts # 图片处理逻辑
│   └── downloadHelper.ts # 下载功能
├── types/              # TypeScript 类型定义
├── constants/          # 常量配置
└── App.tsx            # 主应用组件
```

## 🔧 核心功能实现

### 图片处理
使用 Canvas API 实现图片的居中裁剪和尺寸调整：
- 自动计算最佳裁剪区域
- 保持图片质量的同时优化文件大小
- 支持批量处理多种尺寸

### 文件下载
- 单个图标下载
- ZIP 批量打包下载
- 自动生成文件名

## 🌟 性能优化

- 图片处理时间 < 3秒（1MB以内图片）
- 页面加载时间 < 2秒
- 零服务器依赖，完全离线可用

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系

如有问题或建议，请通过 GitHub Issues 联系我们。