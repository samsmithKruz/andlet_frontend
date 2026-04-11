// src/hooks/usePWAInstall.ts

import { useEffect } from 'react';

export function usePWAInstall() {
  useEffect(() => {
    // Track when app is installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      // Send analytics event
      // trackEvent('pwa_installed', { platform: navigator.platform });
    });
  }, []);
}