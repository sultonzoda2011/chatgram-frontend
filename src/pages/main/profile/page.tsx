import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProfile, updateProfile, changePassword } from '../../../api/authApi'
import type { IProfileResponse, IUpdateProfile, IChangePassword } from '../../../types/auth'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateProfileSchema, ChangePasswordSchema } from '../../../schemas/auth'
import {
  User,
  Mail,
  Lock,
  Camera,
  Loader2,
  CheckCircle2,
  ChevronRight,
  LogOut,
  ArrowLeft
} from 'lucide-react'
import { toast } from 'sonner'
import FormInput from '../../../components/ui/input/formInput'
import { Button } from '../../../components/ui/button'
import { removeToken } from '../../../lib/utils/cookie'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../../lib/utils/cn'

const Profile = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeSection, setActiveSection] = useState<'info' | 'password'>('info')

  const { data: profile, isLoading: isLoadingProfile } = useQuery<IProfileResponse>({
    queryKey: ['get-profile'],
    queryFn: getProfile,
  })

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success(t('profile.save'))
      queryClient.invalidateQueries({ queryKey: ['get-profile'] })
    },
    onError: () => toast.error(t('common.error'))
  })

  const { mutate: changePass, isPending: isChangingPass } = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success(t('profile.changePassword'))
      resetPassword()
    },
    onError: (err: any) => toast.error(err.response?.data?.message || t('common.error'))
  })

  const { control: infoControl, handleSubmit: handleInfoSubmit, setValue: setInfoValue } = useForm<IUpdateProfile>({
    resolver: zodResolver(UpdateProfileSchema),
  })

  const { control: passControl, handleSubmit: handlePassSubmit, reset: resetPassword } = useForm<IChangePassword>({
    resolver: zodResolver(ChangePasswordSchema),
  })

  useEffect(() => {
    if (profile) {
      setInfoValue('username', profile.data.username)
      setInfoValue('fullname', profile.data.fullname)
      setInfoValue('email', profile.data.email)
    }
  }, [profile, setInfoValue])

  const onUpdateInfo = (data: IUpdateProfile) => update(data)
  const onChangePass = (data: IChangePassword) => changePass(data)

  const handleLogout = () => {
    removeToken()
    navigate('/login')
    window.location.reload()
  }

  if (isLoadingProfile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex-1 bg-background overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-black">{t('profile.title')}</h1>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="rounded-xl gap-2"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">{t('sidebar.logout')}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-6 rounded-3xl bg-card border border-border/50 text-center space-y-4 shadow-sm">
              <div className="relative inline-block mx-auto">
                <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-border/50 shadow-inner">
                  <span className="text-3xl font-black text-primary/70">
                    {profile?.data.fullname.charAt(0).toUpperCase()}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform">
                  <Camera size={14} />
                </button>
              </div>
              <div>
                <h3 className="font-bold text-lg">{profile?.data.fullname}</h3>
                <p className="text-sm text-muted-foreground">@{profile?.data.username}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {[
                { id: 'info', label: t('profile.editProfile'), icon: User },
                { id: 'password', label: t('profile.changePassword'), icon: Lock },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-200",
                    activeSection === item.id
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "hover:bg-secondary text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                  <ChevronRight size={16} className={cn(activeSection === item.id ? "opacity-100" : "opacity-0")} />
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activeSection === 'info' ? (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-bold mb-1">{t('profile.editProfile')}</h2>
                    <p className="text-sm text-muted-foreground">Keep your profile information up to date.</p>
                  </div>

                  <form onSubmit={handleInfoSubmit(onUpdateInfo)} className="space-y-4">
                    <FormInput
                      type='text'
                      name="fullname"
                      control={infoControl}
                      label={t('profile.fullName')}
                      placeholder="Enter your full name"
                      icon={User}
                    />
                    <FormInput
                      type='text'
                      name="username"
                      control={infoControl}
                      label={t('profile.username')}
                      placeholder="Choose a unique username"
                      icon={User}
                    />
                    <FormInput
                      name="email"
                      control={infoControl}
                      label={t('profile.email')}
                      placeholder="your@email.com"
                      icon={Mail}
                      type="email"
                    />
                    <div className="pt-4 flex justify-end">
                      <Button
                        type="submit"
                        disabled={isUpdating}
                        className="rounded-xl px-8 h-12"
                      >
                        {isUpdating ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                        )}
                        {t('profile.save')}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-bold mb-1">{t('profile.changePassword')}</h2>
                    <p className="text-sm text-muted-foreground">Secure your account with a strong password.</p>
                  </div>

                  <form onSubmit={handlePassSubmit(onChangePass)} className="space-y-4">
                    <FormInput
                      type="password"
                      name="oldPassword"
                      control={passControl}
                      label="Current Password"
                      placeholder="••••••••"
                      icon={Lock}
                    />
                    <div className="h-px bg-border/50 my-2" />
                    <FormInput
                      type="password"
                      name="newPassword"
                      control={passControl}
                      label="New Password"
                      placeholder="••••••••"
                      icon={Lock}
                    />
                    <FormInput
                      type="password"
                      name="confirmPassword"
                      control={passControl}
                      label="Confirm New Password"
                      placeholder="••••••••"
                      icon={Lock}
                    />
                    <div className="pt-4 flex justify-end">
                      <Button
                        type="submit"
                        disabled={isChangingPass}
                        className="rounded-xl px-8 h-12"
                      >
                        {isChangingPass ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Lock className="w-4 h-4 mr-2" />
                        )}
                        {t('profile.changePassword')}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
