import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Ghost } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { useTranslation } from 'react-i18next'

const NotFound = () => {
  const { t } = useTranslation()

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
        className="relative"
      >
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
        <Ghost size={120} className="text-primary relative z-10 animate-bounce" />
      </motion.div>

      <div className="space-y-2">
        <h1 className="text-6xl font-black text-primary">404</h1>
        <h2 className="text-2xl font-bold">{t('notFound.title')}</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          {t('notFound.description')}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button asChild variant="outline" className="rounded-xl px-6">
          <Link to={-1 as any} className="flex items-center gap-2">
            <ArrowLeft size={18} />
            {t('notFound.goBack')}
          </Link>
        </Button>
        <Button asChild className="rounded-xl px-6 shadow-lg shadow-primary/20">
          <Link to="/" className="flex items-center gap-2">
            <Home size={18} />
            {t('notFound.backHome')}
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default NotFound
