import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'


import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, User, MessageCircle, ArrowRight, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { loginApi } from '../../../api/authApi'
import { setToken } from '../../../lib/utils/cookie'
import type { Login } from '../../../types/auth'
import { LoginSchema } from '../../../schemas/auth'
import { LanguageSelect } from '../../../components/ui/language-select'
import ModeToggle from '../../../components/ui/mode-toggle'
import FormInput from '../../../components/ui/input/formInput'
import { Button } from '../../../components/ui/button'

const Login = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { mutate, isPending } = useMutation({
    mutationFn: loginApi,
    onSuccess: (response) => {
      toast.success(response.message)
      setToken(response.data.token)
      navigate('/')
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || t('common.something_wrong'))
    },
  })

  const { control, handleSubmit } = useForm<Login>({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: zodResolver(LoginSchema),
  })

  const onSubmit = (data: Login) => {
    mutate(data)
  }

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-accent/10" />

      <motion.div
        className="absolute w-50 h-50 rounded-full bg-linear-to-br from-primary/15 to-accent/5 blur-3xl"
        style={{ left: '10%', top: '20%' }}
        animate={{ x: [0, 15, -10, 0], y: [0, -15, 10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-37.5 h-37.5 rounded-full bg-linear-to-br from-accent/15 to-primary/5 blur-3xl"
        style={{ right: '10%', bottom: '20%' }}
        animate={{ x: [0, -15, 10, 0], y: [0, 15, -10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      <motion.div
        className="absolute right-3 top-3 flex gap-2 items-center z-10"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <LanguageSelect />
        <ModeToggle />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-95 mx-3"
      >
        <div className="absolute -inset-0.5 bg-linear-to-r from-primary/30 via-accent/15 to-primary/30 rounded-2xl blur-md opacity-25" />

        <div className="relative bg-card/90 dark:bg-card/80 backdrop-blur-xl rounded-2xl shadow-xl border border-border/50 p-5 overflow-hidden">
          <motion.div
            className="text-center mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex justify-center items-center gap-2 mb-3">
              <motion.div
                className="p-2 rounded-xl bg-linear-to-br from-primary to-primary/80 shadow-md shadow-primary/20"
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.3 }}
              >
                <MessageCircle size={22} className="text-primary-foreground" />
              </motion.div>
              <span className="text-xl font-black bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                ChatGram
              </span>
            </div>

            <h2 className="text-lg font-bold text-card-foreground">
              {t('login.welcome')}
            </h2>
            <p className="text-muted-foreground text-xs mt-0.5">
              {t('login.subtitle')}
            </p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-2.5">
              <FormInput
                type="text"
                name="username"
                control={control}
                label={t('login.username')}
                placeholder={t('login.username')}
                icon={User}
              />
              <FormInput
                name="password"
                control={control}
                label={t('login.password')}
                type="password"
                placeholder={t('login.password')}
                icon={Lock}
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-10 font-semibold text-sm rounded-xl bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 transition-all duration-300 group"
            >
              <AnimatePresence mode="wait">
                {isPending ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('login.submitting')}
                  </motion.span>
                ) : (
                  <motion.span
                    key="submit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    {t('login.submit')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border/50" />
              <span className="text-xs text-muted-foreground">{t('login.or')}</span>
              <div className="flex-1 h-px bg-border/50" />
            </div>

            <p className="text-center text-sm text-muted-foreground">
              {t('login.noAccount')}{' '}
              <Link
                to="/register"
                className="font-semibold text-primary hover:text-primary/80 transition-colors hover:underline underline-offset-2"
              >
                {t('login.createAccount')}
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
