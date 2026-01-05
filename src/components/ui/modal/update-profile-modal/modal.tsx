import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { IProfileResponse, IUpdateProfile } from '../../../../types/auth'
import FormInput from '../../input/formInput'
import { Mail, User } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getProfile, updateProfile } from '../../../../api/authApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateProfileSchema } from '../../../../schemas/auth'

interface IUpdateProfileModalProps {
  updateProfileModalOpen: boolean
  setUpdateProfileModalOpen: (value: boolean) => void
}

const UpdateProfileModal = ({
  updateProfileModalOpen,
  setUpdateProfileModalOpen,
}: IUpdateProfileModalProps) => {
  const { control, handleSubmit, reset, setValue } = useForm<IUpdateProfile>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      username: '',
      fullname: '',
      email: '',
    },
  })

  const { data: profile } = useQuery<IProfileResponse>({
    queryKey: ['get-profile'],
    queryFn: getProfile,
  })

  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-profile'] })
    },
  })

  useEffect(() => {
    if (profile && updateProfileModalOpen) {
      setValue('username', profile.data.username)
      setValue('fullname', profile.data.fullname)
      setValue('email', profile.data.email)
    }
  }, [profile, updateProfileModalOpen, setValue])

  const onSubmit = (data: IUpdateProfile) => {
    mutate(data)
    setUpdateProfileModalOpen(false)
    reset()
  }

  if (!updateProfileModalOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Update Profile</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            type="text"
            control={control}
            name="username"
            label="Username"
            placeholder="username"
            icon={User}
          />

          <FormInput
            type="text"
            control={control}
            name="fullname"
            label="Full name"
            placeholder="full name"
            icon={User}
          />

          <FormInput
            control={control}
            name="email"
            label="Email"
            placeholder="email"
            type="email"
            icon={Mail}
          />

          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={() => setUpdateProfileModalOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateProfileModal
