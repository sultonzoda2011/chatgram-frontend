import { useForm } from 'react-hook-form'
import type { ILogin } from '../../types/auth'
import { LoginSchema } from '../../schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { loginApi } from '../../api/authApi'
import FormInput from '../../components/ui/input/formInput'
import { Button } from '../../components/ui/button'
import { toast } from 'sonner'
import { setToken } from '../../lib/utils/cookie'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, User, ChatCircleDots } from 'phosphor-react'
import { motion } from 'framer-motion'

const Login = () => {
  const navigate = useNavigate()
  const { mutate, isPending } = useMutation({
    mutationFn: loginApi,
    onSuccess: (response) => {
      toast.success(response.message)
      setToken(response.data.token)
      navigate('/')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  })

  const { control, handleSubmit } = useForm<ILogin>({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: zodResolver(LoginSchema),
  })

  const onSubmit = (data: ILogin) => {
    mutate(data)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-primary via-primary/50 to-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-card/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-border"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <ChatCircleDots size={42} weight="fill" className="text-primary" />
            <span className="text-3xl font-extrabold text-primary">
              ChatGram
            </span>
          </div>
          <h2 className="text-2xl font-bold text-card-foreground">
            Welcome Back
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Please sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormInput
              name="username"
              control={control}
              label="Username"
              type="text"
              placeholder="username"
              icon={User}
            />
            <FormInput
              name="password"
              control={control}
              label="Password"
              type="password"
              placeholder="password"
              icon={Lock}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={isPending}
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-primary hover:text-primary/80 hover:underline transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default Login
