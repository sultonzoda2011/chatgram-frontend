import { Button } from './button'
import { useTheme } from '../../lib/providers/theme-provider'
import { Moon, Sun } from 'lucide-react'

const ModeToggle = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-1 rounded-full border p-1">
      <Button
        size="icon"
        variant={theme === 'dark' ? 'default' : 'ghost'}
        className="rounded-full"
        onClick={() => setTheme('dark')}
      >
        <Moon className="h-4 w-4" />
      </Button>

      <Button
        size="icon"
        variant={theme === 'light' ? 'default' : 'ghost'}
        className="rounded-full"
        onClick={() => setTheme('light')}
      >
        <Sun className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default ModeToggle
