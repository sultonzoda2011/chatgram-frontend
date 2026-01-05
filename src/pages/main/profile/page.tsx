import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '../../../api/authApi'
import type { IProfileResponse } from '../../../types/auth'
import UpdateProfileModal from '../../../components/ui/modal/update-profile-modal/modal'
import ChangePasswordModal from '../../../components/ui/modal/change-password-modal/modal'

const Profile = () => {
  const [updateProfileModalOpen, setUpdateProfileModalOpen] = useState(false)
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false)
  const { data: profile } = useQuery<IProfileResponse>({
    queryKey: ['get-profile'],
    queryFn: getProfile,
  })

  if (!profile) return null

  return (
    <div>
      <h1>Profile</h1>
      <p>{profile.data.username}</p>
      <p>{profile.data.fullname}</p>
      <p>{profile.data.email}</p>

      <button onClick={() => setUpdateProfileModalOpen(true)}>Edit profile</button>
      <button
        onClick={() =>
          setChangePasswordModalOpen(true)
        }
      >Change password</button>
      <UpdateProfileModal
        setUpdateProfileModalOpen={setUpdateProfileModalOpen}
        updateProfileModalOpen={updateProfileModalOpen}
      />
      <ChangePasswordModal
        setChangePasswordModalOpen={setChangePasswordModalOpen}
        changePasswordModalOpen={changePasswordModalOpen}
      />
    </div>
  )
}

export default Profile
