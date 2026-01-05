import { Button } from './button'
import { useTheme } from '../../lib/providers/theme-provider'
import { Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ModeToggle = () => {
  const { theme, setTheme } = useTheme()

  return (
    <motion.div
      className="flex items-center gap-1 rounded-full border-2 border-border/50 p-1 bg-background/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        size="icon-sm"
        variant={theme === 'dark' ? 'default' : 'ghost'}
        className="rounded-full relative overflow-hidden"
        onClick={() => setTheme('dark')}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key="moon"
            initial={{ rotate: -90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: 90, scale: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Moon className="h-4 w-4" />
          </motion.div>
        </AnimatePresence>
        {theme === 'dark' && (
          <motion.div
            className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </Button>

      <Button
        size="icon-sm"
        variant={theme === 'light' ? 'default' : 'ghost'}
        className="rounded-full relative overflow-hidden"
        onClick={() => setTheme('light')}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key="sun"
            initial={{ rotate: 90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: -90, scale: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Sun className="h-4 w-4" />
          </motion.div>
        </AnimatePresence>
        {theme === 'light' && (
          <motion.div
            className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </Button>
    </motion.div>
  )
}

export default ModeToggle
