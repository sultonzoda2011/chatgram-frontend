import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
	appId: 'com.chatgram.app',
	appName: 'Chatgram',

	webDir: 'dist',
	server: {
		androidScheme: 'https'
	}
}

export default config
