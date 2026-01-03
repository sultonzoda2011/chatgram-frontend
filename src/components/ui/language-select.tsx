import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { CaretDown } from 'phosphor-react'

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
            <button
                onClick={toggleOpen}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card/50 hover:bg-card/80 backdrop-blur-md border border-border/50 text-foreground transition-all duration-200"
            >
                <img src={currentLang.flag} alt={currentLang.label} className="w-6 h-4 object-cover rounded-sm shadow-sm" />
                <span className="text-sm font-medium hidden sm:inline-block">{currentLang.label}</span>
                <CaretDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-card/90 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl overflow-hidden z-50 p-1"
                    >
                        {languages.map((lang) => (
                            <li key={lang.code}>
                                <button
                                    onClick={() => handleSelect(lang.code)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${i18n.language === lang.code
                                            ? 'bg-primary/20 text-primary'
                                            : 'hover:bg-primary/10 text-foreground hover:text-primary'
                                        }`}
                                >
                                    <img src={lang.flag} alt={lang.label} className="w-6 h-4 object-cover rounded-sm shadow-sm" />
                                    <span className="font-medium">{lang.label}</span>
                                </button>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    )
}
