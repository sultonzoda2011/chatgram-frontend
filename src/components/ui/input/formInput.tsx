import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form'
import { useState } from 'react'
import { Eye, EyeOff, type LucideIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from './input'
import { Label } from '../label'
import { cn } from '../../../lib/utils/shadUtils'

interface IFormInputProps<T extends FieldValues> {
  name: Path<T>
  label: string
  control: Control<T>
  placeholder?: string
  type: 'text' | 'email' | 'password' | 'number' | 'file'
  icon?: LucideIcon
  accept?: string
}

const FormInput = <T extends FieldValues>({
  name,
  control,
  label,
  type,
  placeholder,
  icon: Icon,
  accept,
}: IFormInputProps<T>) => {
  const [eyeOpen, setEyeOpen] = useState(false)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Label htmlFor={name}>{label}</Label>

          <div className="relative">
            {Icon && type !== 'file' && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon size={20} />
              </div>
            )}

            {type === 'file' ? (
              <input
                type="file"
                name={field.name}
                ref={field.ref}
                accept={accept}
                onBlur={field.onBlur}
                onChange={(e) => field.onChange(e.target.files)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            ) : (
              <Input
                {...field}
                type={type === 'password' && eyeOpen ? 'text' : type}
                value={field.value ?? ''}
                aria-invalid={fieldState.invalid}
                placeholder={placeholder ? `Enter ${placeholder}` : undefined}
                className={cn(type === 'password' && 'pr-10', Icon && 'pl-10')}
              />
            )}

            {type === 'password' && (
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() => setEyeOpen((prev) => !prev)}
              >
                {eyeOpen ? <Eye size={20} /> : <EyeOff size={20} />}
              </div>
            )}
          </div>

          <AnimatePresence>
            {fieldState.error && (
              <motion.p
                className="text-sm text-red-600"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                {fieldState.error.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    />
  )
}

export default FormInput
