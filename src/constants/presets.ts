import { PlatformPreset } from '../types';

export const PLATFORM_PRESETS: PlatformPreset[] = [
  {
    id: 'favicon',
    name: '网站 Favicon',
    description: '适用于网站图标',
    sizes: [
      { width: 16, height: 16, name: 'favicon-16x16.png' },
      { width: 32, height: 32, name: 'favicon-32x32.png' },
      { width: 180, height: 180, name: 'apple-touch-icon.png' }
    ]
  },
  {
    id: 'ios',
    name: 'iOS 应用',
    description: '适用于苹果应用商店',
    sizes: [
      { width: 60, height: 60, name: 'ios-60x60.png' },
      { width: 120, height: 120, name: 'ios-120x120.png' },
      { width: 180, height: 180, name: 'ios-180x180.png' }
    ]
  },
  {
    id: 'android',
    name: 'Android 应用',
    description: '适用于谷歌应用商店',
    sizes: [
      { width: 48, height: 48, name: 'android-48x48.png' },
      { width: 96, height: 96, name: 'android-96x96.png' },
      { width: 192, height: 192, name: 'android-192x192.png' }
    ]
  }
];