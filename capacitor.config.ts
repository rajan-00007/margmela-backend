import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.melamarg.admin',
  appName: 'MelaMarg Admin',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
