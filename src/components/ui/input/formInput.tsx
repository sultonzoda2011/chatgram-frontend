import { Controller, type FieldValues } from 'react-hook-form'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from './input'
import { Label } from '../label'
import type { FormInputProps } from '../../../types/input'
import { cn } from '../../../lib/utils/cn'
import { useTranslation } from 'react-i18next'

import { Button } from '../button'

const FormInput = <T extends FieldValues>({
  name,
  control,
  label,
  type,
  placeholder,
  icon: Icon,
  accept,
}: FormInputProps<T>) => {
  const [eyeOpen, setEyeOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const { t } = useTranslation()
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div animate={{ x: isFocused ? 4 : 0 }} transition={{ duration: 0.2 }}>
            <Label
              htmlFor={name}
              className={cn(
                'text-sm font-medium transition-colors duration-300',
                isFocused ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              {label}
            </Label>
          </motion.div>

          <motion.div className="relative group" whileTap={{ scale: 0.995 }}>
            {Icon && type !== 'file' && (
              <motion.div
                className={cn(
                  'absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 z-10',
                  isFocused ? 'text-primary' : 'text-muted-foreground/60',
                  fieldState.error && 'text-destructive',
                )}
                animate={{
                  scale: isFocused ? 1.1 : 1,
                  rotate: isFocused ? [0, -5, 5, 0] : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <Icon size={20} strokeWidth={2} />
              </motion.div>
            )}

            {type === 'file' ? (
              <motion.div
                className="relative"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <Input
                  type="file"
                  name={field.name}
                  ref={field.ref}
                  accept={accept}
                  onBlur={() => {
                    field.onBlur()
                    setIsFocused(false)
                  }}
                  onFocus={() => setIsFocused(true)}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    field.onChange(file)
                  }}
                  className="w-full h-12 px-4 py-2 border-2 border-dashed border-input/50 rounded-xl bg-background/50 backdrop-blur-sm hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 cursor-pointer file:cursor-pointer"
                />
              </motion.div>
            ) : (
              <Input
                {...field}
                type={type === 'password' && eyeOpen ? 'text' : type}
                value={field.value ?? ''}
                aria-invalid={fieldState.invalid}
                placeholder={placeholder ? `${t('common.enter')} ${placeholder}` : undefined}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  field.onBlur()
                  setIsFocused(false)
                }}
                className={cn(
                  type === 'password' && 'pr-12',
                  Icon && 'pl-12',
                  fieldState.error &&
                    'border-destructive focus:border-destructive focus:ring-destructive/10',
                )}
              />
            )}

            {type === 'password' && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className={cn(
                  'absolute right-2 top-1/2 -translate-y-1/2 transition-all duration-300 shadow-none hover:bg-primary/10',
                  isFocused ? 'text-primary' : 'text-muted-foreground/60',
                )}
                onClick={() => setEyeOpen((prev) => !prev)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={eyeOpen ? 'open' : 'closed'}
                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {eyeOpen ? <Eye size={20} /> : <EyeOff size={20} />}
                  </motion.div>
                </AnimatePresence>
              </Button>
            )}

            <motion.div
              className="absolute inset-0 rounded-xl bg-primary/5 -z-10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: isFocused ? 1 : 0,
                scale: isFocused ? 1.02 : 0.95,
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          <AnimatePresence>
            {fieldState.error && (
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="w-1 h-1 rounded-full bg-destructive"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <p className="text-sm text-destructive font-medium">{fieldState.error.message}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    />
  )
}

export default FormInput
