import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { MessageSquareText } from 'lucide-react'

const Home = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-transparent px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: 'easeOut',
        }}
        className="flex flex-col items-center text-center"
      >
        <div className="relative mb-6">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-xl shadow-primary/5 ring-1 ring-primary/20 backdrop-blur-sm"
          >
            <MessageSquareText size={48} strokeWidth={1.5} />
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-primary ring-4 ring-background"
          />
        </div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-md text-2xl font-semibold tracking-tight text-foreground/90 sm:text-3xl"
        >
          {t('home.selectUser')}
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 max-w-sm text-sm text-muted-foreground/70 sm:text-base"
        >
          {t('home.subtitle')}
        </motion.p>
      </motion.div>
    </div>
  )
}

export default Home
