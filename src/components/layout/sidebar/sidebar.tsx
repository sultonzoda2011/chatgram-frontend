import { useQuery } from '@tanstack/react-query'
import { getContacts } from '../../../api/contactsApi'
import type { IContact } from '../../../types/contacts'

const Sidebar = () => {
  const { data } = useQuery<IContact[]>({
    queryKey: ['getContacts'],
    queryFn: () => getContacts(),
  })
  return (
    <div>
      {data?.map((contact) => (
        <p key={contact.userId}>{contact.username}</p>
      ))}
    </div>
  )
}

export default Sidebar
