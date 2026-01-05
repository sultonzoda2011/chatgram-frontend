import { useForm } from 'react-hook-form'
import type { IChangePassword } from '../../../../types/auth'
import FormInput from '../../input/formInput'
import { Lock } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { changePassword } from '../../../../api/authApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChangePasswordSchema } from '../../../../schemas/auth'

interface IChangePasswordModalProps {
  changePasswordModalOpen: boolean
  setChangePasswordModalOpen: (value: boolean) => void
}

const ChangePasswordModal = ({
  changePasswordModalOpen,
  setChangePasswordModalOpen,
}: IChangePasswordModalProps) => {
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
        <h2>Change Password</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            type="password"
            control={control}
            name="oldPassword"
            label="Old Password"
            placeholder="old password"
            icon={Lock}
          />

          <FormInput
            type="password"
            control={control}
            name="newPassword"
            label="New Password"
            placeholder="new password"
            icon={Lock}
          />

          <FormInput
            control={control}
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="confirm password"
            icon={Lock}
          />

          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={() => setChangePasswordModalOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangePasswordModal
