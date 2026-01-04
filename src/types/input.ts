import { type Control, type FieldValues, type Path } from 'react-hook-form'
import { type LucideIcon } from 'lucide-react'

export interface FormInputProps<T extends FieldValues> {
  name: Path<T>
  label: string
  control: Control<T>
  placeholder?: string
  type: 'text' | 'email' | 'password' | 'number' | 'file'
  icon?: LucideIcon
  accept?: string
}
