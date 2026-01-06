import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils/cn'

interface LogoProps {
  className?: string
  isCollapsed?: boolean
  showText?: boolean
}

export const Logo = ({
  className,
  isCollapsed = false,
  showText = true,
}: LogoProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2 sm:gap-3 select-none',
        className
      )}
    >
      <motion.img
        src="/favicon.ico"
        alt="ChatApp logo"
        className="
          w-8 h-8
          sm:w-10 sm:h-10
          md:w-12 md:h-12
          object-contain
        "
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />

      <AnimatePresence>
        {showText && !isCollapsed && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="
              text-lg
              sm:text-xl
              md:text-2xl
              font-extrabold tracking-tight
              text-foreground
              whitespace-nowrap
            "
          >
            ChatGram
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}
