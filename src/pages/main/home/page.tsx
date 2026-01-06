import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { MessageCircle, Search, Users, Shield } from 'lucide-react'

const Home = () => {
  const { t } = useTranslation()

  const features = [
    {
      icon: MessageCircle,
      title: t('home.features.messaging.title'),
      desc: t('home.features.messaging.desc')
    },
    {
      icon: Search,
      title: t('home.features.search.title'),
      desc: t('home.features.search.desc')
    },
    {
      icon: Users,
      title: t('home.features.groups.title'),
      desc: t('home.features.groups.desc')
    },
    {
      icon: Shield,
      title: t('home.features.secure.title'),
      desc: t('home.features.secure.desc')
    }
  ]

  return (
    <div className="flex-1 flex flex-col items-center px-3 py-6 sm:px-4 sm:py-8 text-center overflow-y-auto custom-scrollbar">
      <div className="my-auto flex flex-col items-center space-y-6 sm:space-y-10 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-xl space-y-3 sm:space-y-5"
        >

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
            {t('home.welcome')}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            {t('home.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 max-w-3xl w-full text-left"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4, scale: 1.015 }}
              className="p-4 sm:p-5 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md hover:border-primary/50 hover:bg-card/60 transition-all duration-300 group shadow-sm hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="p-2.5 rounded-xl bg-secondary/50 w-fit mb-3 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:rotate-12" />
              </div>

              <h3 className="font-bold text-base sm:text-lg mb-1.5">
                {feature.title}
              </h3>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="pt-6 opacity-40 hover:opacity-100 transition-opacity"
        >
          <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">
            <div className="h-px w-6 sm:w-10 bg-linear-to-r from-transparent to-muted-foreground/30" />
            <span>Powered by ChatGram Engine</span>
            <div className="h-px w-6 sm:w-10 bg-linear-to-l from-transparent to-muted-foreground/30" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Home
