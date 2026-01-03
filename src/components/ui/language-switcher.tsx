import { useState, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "../../lib/utils/shadUtils"

const flags = {
    en: (
        <svg viewBox="0 0 640 480" className="w-5 h-5 rounded-full object-cover shadow-sm">
            <path fill="#012169" d="M0 0h640v480H0z" />
            <path fill="#FFF" d="M75 0l244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z" />
            <path fill="#C8102E" d="M424 281l216 159v40L369 281h55zm-184 20l6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z" />
            <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z" />
            <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" />
        </svg>
    ),
    ru: (
        <svg viewBox="0 0 640 480" className="w-5 h-5 rounded-full object-cover shadow-sm">
            <path fill="#fff" d="M0 0h640v480H0z" />
            <path fill="#0039A6" d="M0 160h640v320H0z" />
            <path fill="#D52B1E" d="M0 320h640v160H0z" />
        </svg>
    ),
    tj: (
        <svg viewBox="0 0 640 480" className="w-5 h-5 rounded-full object-cover shadow-sm">
            <path fill="#fff" d="M0 0h640v480H0z" />
            <path fill="#c00" d="M0 0h640v140H0z" />
            <path fill="#060" d="M0 340h640v140H0z" />
            <circle cx="320" cy="240" r="88" fill="none" stroke="#fb0" strokeWidth="15" />
            <path fill="#fb0" d="M320 186.6l4.4 13.5h14.2l-11.5 8.4 4.4 13.5-11.5-8.4-11.5 8.4 4.4-13.5-11.5-8.4h14.2zM275.6 200.7l4.3 13.4h14.2l-11.5 8.4 4.4 13.5-11.5-8.4-11.5 8.4 4.4-13.5-11.5-8.4h14.2zM364.4 200.7l4.3 13.4h14.2l-11.5 8.4 4.4 13.5-11.5-8.4-11.5 8.4 4.4-13.5-11.5-8.4h14.2zM294.6 172.5l4.3 13.4h14.2l-11.5 8.4 4.4 13.5-11.5-8.4-11.5 8.4 4.4-13.5-11.5-8.4h14.2zM345.4 172.5l4.3 13.4h14.2l-11.5 8.4 4.4 13.5-11.5-8.4-11.5 8.4 4.4-13.5-11.5-8.4h14.2zM320 152l4.3 13.4h14.2l-11.5 8.4 4.4 13.5-11.5-8.4-11.5 8.4 4.4-13.5-11.5-8.4h14.2z" />
        </svg>
    ),
}

const languages = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
    { code: 'tj', label: 'Тоҷикӣ' },
]

export function LanguageSwitcher() {
    const { i18n } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const toggleDropdown = () => setIsOpen(!isOpen)

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng)
        setIsOpen(false)
    }

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0]

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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={toggleDropdown}
                className={cn(
                    "flex items-center gap-2 px-3 py-3 rounded-lg border border-border/50",
                    "bg-card/40 backdrop-blur-md shadow-sm",
                    "hover:bg-card/60 transition-colors duration-200",
                    "text-foreground text-sm font-medium"
                )}
            >
                {flags[currentLang.code as keyof typeof flags]}
                <span className="hidden sm:inline">{currentLang.label}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={14} className="text-muted-foreground" />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            "absolute right-0 top-full mt-2 w-48 rounded-xl border border-border/50",
                            "bg-card/80 backdrop-blur-xl shadow-xl overflow-hidden z-50"
                        )}
                    >
                        <div className="p-1">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => changeLanguage(lang.code)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                                        i18n.language === lang.code
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "hover:bg-muted/50 text-foreground"
                                    )}
                                >
                                    <span className="shrink-0">
                                        {flags[lang.code as keyof typeof flags]}
                                    </span>
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
