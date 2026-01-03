import { useForm } from 'react-hook-form'
import type { IRegister } from '../../types/auth'
import { RegisterSchema } from '../../schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import FormInput from '../../components/ui/input/formInput'
import ModeToggle from '../../components/ui/mode-toggle'

import { Button } from '../../components/ui/button'
import { toast } from 'sonner'
import { setToken } from '../../lib/utils/cookie'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { registerApi } from '../../api/authApi'
import { Lock, MessageCircle, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LanguageSelect } from '../../components/ui/language-select'

const Register = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { mutate, isPending } = useMutation({
    mutationFn: registerApi,
    onSuccess: (response) => {
      toast.success(response.message)
      setToken(response.data.token)
      navigate('/')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('something_wrong'))
    },
  })

  const { control, handleSubmit } = useForm<IRegister>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(RegisterSchema),
  })

  const onSubmit = (data: IRegister) => {
    mutate(data)
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="absolute right-4 top-4 flex gap-2 items-center">
        <LanguageSelect />
        <ModeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-card/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-border"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <MessageCircle size={42} className="text-primary" />
            <span className="text-3xl font-extrabold text-primary">ChatGram</span>
          </div>
          <h2 className="text-2xl font-bold text-card-foreground">{t('register.welcome')}</h2>
          <p className="text-muted-foreground mt-2 text-sm">{t('register.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormInput
              type="text"
              name="username"
              control={control}
              label={t('register.username')}
              placeholder={t('register.username')}
              icon={User}
            />
            <FormInput
              name="email"
              control={control}
              label={t('register.email')}
              type="email"
              placeholder={t('register.email')}
              icon={User}
            />
            <FormInput
              name="password"
              control={control}
              label={t('register.password')}
              type="password"
              placeholder={t('register.password')}
              icon={Lock}
            />
            <FormInput
              name="confirmPassword"
              control={control}
              label={t('register.confirmPassword')}
              type="password"
              placeholder={t('register.confirmPassword')}
              icon={Lock}
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-11 font-medium shadow-lg hover:shadow-xl transition-all"
          >
            {isPending ? t('register.submitting') : t('register.submit')}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {t('register.hasAccount')}{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                {t('register.signIn')}
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default Register
