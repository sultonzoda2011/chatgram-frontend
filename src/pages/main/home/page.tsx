import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { MessageCircle, Search, Users, Shield } from 'lucide-react'

const Home = () => {
  const { t } = useTranslation()

  const features = [
    {
      icon: MessageCircle,
      title: 'Fast Messaging',
      desc: 'Real-time communication with your friends and colleagues.'
    },
    {
      icon: Search,
      title: 'Easy Search',
      desc: 'Find anyone by their username or full name instantly.'
    },
    {
      icon: Users,
      title: 'Group Chats',
      desc: 'Stay connected with multiple people at once (Coming Soon).'
    },
    {
      icon: Shield,
      title: 'Secure',
      desc: 'Your privacy is our priority. Encrypted and safe.'
    }
  ]

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl space-y-4"
      >
        <div className="inline-flex p-4 rounded-2xl bg-primary/10 text-primary mb-4">
          <MessageCircle size={48} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
          {t('home.welcome')}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t('home.subtitle')}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full"
      >
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors text-left group"
          >
            <feature.icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.desc}</p>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="pt-8"
      >
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-widest">
          <div className="h-px w-8 bg-border" />
          <span>Powered by ChatGram Engine</span>
          <div className="h-px w-8 bg-border" />
        </div>
      </motion.div>
    </div>
  )
}

export default Home
