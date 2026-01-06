import { useForm } from 'react-hook-form'
import type { IChangePassword } from '../../../../types/auth'
import FormInput from '../../input/formInput'
import { Lock } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { changePassword } from '../../../../api/authApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChangePasswordSchema } from '../../../../schemas/auth'

import { useTranslation } from 'react-i18next'

import { Button } from '../../button'

interface IChangePasswordModalProps {
  changePasswordModalOpen: boolean
  setChangePasswordModalOpen: (value: boolean) => void
}

const ChangePasswordModal = ({
  changePasswordModalOpen,
  setChangePasswordModalOpen,
}: IChangePasswordModalProps) => {
  const { t } = useTranslation()
  const { control, handleSubmit, reset } = useForm<IChangePassword>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-profile'] })
    },
  })

  const onSubmit = (data: IChangePassword) => {
    mutate(data)
    setChangePasswordModalOpen(false)
    reset()
  }

  if (!changePasswordModalOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{t('profile.changePassword')}</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            type="password"
            control={control}
            name="oldPassword"
            label={t('profile.oldPassword')}
            placeholder="••••••••"
            icon={Lock}
          />

          <FormInput
            type="password"
            control={control}
            name="newPassword"
            label={t('profile.newPassword')}
            placeholder="••••••••"
            icon={Lock}
          />

          <FormInput
            control={control}
            type="password"
            name="confirmPassword"
            label={t('profile.confirmPassword')}
            placeholder="••••••••"
            icon={Lock}
          />

          <div className="modal-actions">
            <Button type="submit">{t('profile.save')}</Button>
            <Button variant="ghost" type="button" onClick={() => setChangePasswordModalOpen(false)}>
              {t('profile.cancel')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangePasswordModal
