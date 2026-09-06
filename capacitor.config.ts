import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.chatgram.app',
  appName: 'ChatGram',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
}

export default config
