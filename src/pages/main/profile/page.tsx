import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '../../../api/authApi'
import type { IProfileResponse } from '../../../types/auth'
import { useTranslation } from 'react-i18next'
import {
  User,
  Lock,
  Loader2,
  ChevronRight,
  LogOut,
  ArrowLeft,
  Settings,
  Globe,
  Palette,
  Mail
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { removeToken } from '../../../lib/utils/cookie'
import { useNavigate } from 'react-router-dom'
import { LanguageSelect } from '../../../components/ui/language-select'
import ModeToggle from '../../../components/ui/mode-toggle'
import UpdateProfileModal from '../../../components/ui/modal/update-profile-modal/modal'
import ChangePasswordModal from '../../../components/ui/modal/change-password-modal/modal'

const Profile = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [updateProfileModalOpen, setUpdateProfileModalOpen] = useState(false)
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false)

  const { data: profile, isLoading: isLoadingProfile } = useQuery<IProfileResponse>({
    queryKey: ['get-profile'],
    queryFn: getProfile,
  })

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
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6 md:space-y-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="rounded-full"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-2xl md:text-3xl font-black">{t('profile.title')}</h1>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="rounded-xl gap-2 shadow-lg shadow-destructive/20 active:scale-95 transition-all"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline font-bold">{t('sidebar.logout')}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
          <div className="lg:col-span-1 space-y-6">
            <div className="p-8 rounded-[2.5rem] bg-card/50 backdrop-blur-xl border border-border/50 text-center space-y-4 shadow-xl shadow-primary/5">
              <div className="relative inline-block mx-auto group">
                <div className="w-28 h-28 rounded-full bg-linear-to-br from-primary via-accent to-primary flex items-center justify-center border-4 border-background shadow-2xl overflow-hidden relative">
                  <span className="text-4xl font-black text-white drop-shadow-md">
                    {profile?.data.fullname.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-black text-xl leading-tight">{profile?.data.fullname}</h3>
                <p className="text-sm text-muted-foreground font-medium mt-1">@{profile?.data.username}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <Button
                variant="ghost"
                onClick={() => setUpdateProfileModalOpen(true)}
                className="w-full h-auto flex items-center justify-between p-4 rounded-2xl transition-all duration-300 font-bold text-sm hover:bg-secondary/80 text-foreground/70 hover:text-foreground shadow-none"
              >
                <div className="flex items-center gap-4">
                  <User size={18} strokeWidth={2.5} />
                  <span>{t('profile.editProfile')}</span>
                </div>
                <ChevronRight size={16} />
              </Button>
              <Button
                variant="ghost"
                onClick={() => setChangePasswordModalOpen(true)}
                className="w-full h-auto flex items-center justify-between p-4 rounded-2xl transition-all duration-300 font-bold text-sm hover:bg-secondary/80 text-foreground/70 hover:text-foreground shadow-none"
              >
                <div className="flex items-center gap-4">
                  <Lock size={18} strokeWidth={2.5} />
                  <span>{t('profile.changePassword')}</span>
                </div>
                <ChevronRight size={16} />
              </Button>
            </nav>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-primary/5 space-y-8">
              <div>
                <h2 className="text-xl font-black mb-2 flex items-center gap-2">
                  <Settings size={24} className="text-primary" />
                  {t('profile.settings')}
                </h2>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{t('profile.settingsSubtitle')}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <Globe size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{t('profile.language')}</p>
                      <p className="text-xs text-muted-foreground">{t('profile.languageSubtitle')}</p>
                    </div>
                  </div>
                  <LanguageSelect />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <Palette size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{t('profile.appearance')}</p>
                      <p className="text-xs text-muted-foreground">{t('profile.appearanceSubtitle')}</p>
                    </div>
                  </div>
                  <ModeToggle />
                </div>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 shadow-xl shadow-primary/5">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t('profile.fullName')}</p>
                    <p className="font-black">{profile?.data.fullname}</p>
                  </div>
                </div>
                <div className="h-px bg-border/50" />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t('profile.username')}</p>
                    <p className="font-black">@{profile?.data.username}</p>
                  </div>
                </div>
                <div className="h-px bg-border/50" />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t('profile.email')}</p>
                    <p className="font-black">{profile?.data.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UpdateProfileModal
        updateProfileModalOpen={updateProfileModalOpen}
        setUpdateProfileModalOpen={setUpdateProfileModalOpen}
      />
      <ChangePasswordModal
        changePasswordModalOpen={changePasswordModalOpen}
        setChangePasswordModalOpen={setChangePasswordModalOpen}
      />
    </div>
  )
}

export default Profile


