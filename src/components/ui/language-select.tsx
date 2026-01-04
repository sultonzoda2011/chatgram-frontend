import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, Globe } from 'lucide-react'

import enFlag from '../../assets/flags/gb.svg'
import ruFlag from '../../assets/flags/ru.svg'
import tjFlag from '../../assets/flags/tj.svg'

const languages = [
    { code: 'en', label: 'English', flag: enFlag },
    { code: 'ru', label: 'Русский', flag: ruFlag },
    { code: 'tj', label: 'Тоҷикӣ', flag: tjFlag },
]

export const LanguageSelect = () => {
    const { i18n } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0]

    const toggleOpen = () => setIsOpen(!isOpen)

    const handleSelect = (code: string) => {
        i18n.changeLanguage(code)
        setIsOpen(false)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={containerRef}>
            <motion.button
                onClick={toggleOpen}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-background/50 hover:bg-background/80 backdrop-blur-xl border-2 border-border/50 hover:border-primary/50 text-foreground shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
            >
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                    initial={{ x: '-200%' }}
                    animate={{ x: isHovered ? '200%' : '-200%' }}
                    transition={{ duration: 0.6 }}
                />

                <motion.div
                    className="sm:hidden relative"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Globe size={18} className="text-primary" />
                </motion.div>

                <motion.div
                    className="relative hidden sm:block"
                    animate={{ scale: isHovered ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <img
                        src={currentLang.flag}
                        alt={currentLang.label}
                        className="w-6 h-4 object-cover rounded-sm shadow-md ring-1 ring-black/10"
                    />
                    <motion.div
                        className="absolute inset-0 rounded-sm bg-primary/20 blur-sm -z-10"
                        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1.2 : 1 }}
                        transition={{ duration: 0.2 }}
                    />
                </motion.div>

                <span className="text-sm font-semibold hidden sm:inline-block relative z-10">
                    {currentLang.label}
                </span>

                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                    <ChevronDown size={16} className="text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.ul
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{
                                duration: 0.25,
                                ease: [0.16, 1, 0.3, 1]
                            }}
                            className="absolute right-0 top-full mt-2 w-52 bg-card/95 backdrop-blur-2xl border-2 border-border/50 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 overflow-hidden z-50 p-2"
                        >
                            <div className="px-3 py-2 mb-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Select Language
                                </p>
                            </div>

                            {languages.map((lang, index) => {
                                const isSelected = i18n.language === lang.code

                                return (
                                    <motion.li
                                        key={lang.code}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05, duration: 0.2 }}
                                    >
                                        <motion.button
                                            onClick={() => handleSelect(lang.code)}
                                            whileHover={{ x: 4 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative overflow-hidden ${isSelected
                                                ? 'bg-primary/15 text-primary'
                                                : 'hover:bg-primary/10 text-foreground hover:text-primary'
                                                }`}
                                        >
                                            {isSelected && (
                                                <motion.div
                                                    layoutId="language-indicator"
                                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-full"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                />
                                            )}

                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: [-2, 2, 0] }}
                                                transition={{ duration: 0.2 }}
                                                className="relative"
                                            >
                                                <img
                                                    src={lang.flag}
                                                    alt={lang.label}
                                                    className="w-7 h-5 object-cover rounded shadow-md ring-1 ring-black/10"
                                                />
                                            </motion.div>

                                            <span className={`font-semibold flex-1 text-left ${isSelected ? 'text-primary' : ''}`}>
                                                {lang.label}
                                            </span>

                                            <AnimatePresence>
                                                {isSelected && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0 }}
                                                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                                    >
                                                        <Check size={16} className="text-primary" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.button>
                                    </motion.li>
                                )
                            })}

                            <div className="mt-2 pt-2 border-t border-border/50">
                                <p className="text-xs text-center text-muted-foreground/60 flex items-center justify-center gap-1">
                                    <Globe size={12} />
                                    Powered by Abdulloh
                                </p>
                            </div>
                        </motion.ul>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
