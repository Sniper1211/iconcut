import { PlatformPreset } from '../types';

export const PLATFORM_PRESETS: PlatformPreset[] = [
  {
    id: 'favicon',
    name: 'Website Favicon',
    description: 'For website icons and browser tabs',
    sizes: [
      { width: 16, height: 16, name: 'favicon-16x16.png' },
      { width: 32, height: 32, name: 'favicon-32x32.png' },
      { width: 48, height: 48, name: 'favicon-48x48.png' },
      { width: 96, height: 96, name: 'favicon-96x96.png' },
      { width: 144, height: 144, name: 'favicon-144x144.png' },
      { width: 180, height: 180, name: 'apple-touch-icon.png' },
      { width: 192, height: 192, name: 'android-chrome-192x192.png' }
    ]
  },
  {
    id: 'browser-extension',
    name: 'Browser Extension',
    description: 'For Chrome/Firefox extensions',
    sizes: [
      { width: 16, height: 16, name: 'extension-16x16.png' },
      { width: 32, height: 32, name: 'extension-32x32.png' },
      { width: 48, height: 48, name: 'extension-48x48.png' },
      { width: 128, height: 128, name: 'extension-128x128.png' },
      { width: 256, height: 256, name: 'extension-256x256.png' },
      { width: 512, height: 512, name: 'extension-512x512.png' }
    ]
  },
  {
    id: 'ios',
    name: 'iOS App',
    description: 'For Apple App Store',
    sizes: [
      { width: 60, height: 60, name: 'ios-60x60.png' },
      { width: 120, height: 120, name: 'ios-120x120.png' },
      { width: 180, height: 180, name: 'ios-180x180.png' }
    ]
  },
  {
    id: 'android',
    name: 'Android App',
    description: 'For Google Play Store',
    sizes: [
      { width: 48, height: 48, name: 'android-48x48.png' },
      { width: 96, height: 96, name: 'android-96x96.png' },
      { width: 192, height: 192, name: 'android-192x192.png' }
    ]
  },
  {
    id: 'complete-set',
    name: 'Complete Icon Set',
    description: 'All essential sizes for web and apps',
    sizes: [
      { width: 16, height: 16, name: 'icon-16x16.png' },
      { width: 32, height: 32, name: 'icon-32x32.png' },
      { width: 48, height: 48, name: 'icon-48x48.png' },
      { width: 96, height: 96, name: 'icon-96x96.png' },
      { width: 128, height: 128, name: 'icon-128x128.png' },
      { width: 144, height: 144, name: 'icon-144x144.png' },
      { width: 180, height: 180, name: 'icon-180x180.png' },
      { width: 192, height: 192, name: 'icon-192x192.png' },
      { width: 256, height: 256, name: 'icon-256x256.png' },
      { width: 512, height: 512, name: 'icon-512x512.png' }
    ]
  }
];