
import { Moon, Sun } from 'phosphor-react'
import { Button } from './button'
import { useTheme } from '../../lib/providers/theme-provider'
const ModeToggle = () => {
  const { setTheme } = useTheme()
  return (
    <div>
      <Button>
        <Moon onClick={() => setTheme('dark')} />
      </Button>
      <Button>
        <Sun onClick={() => setTheme('light')} />
      </Button>
    </div>
  )
}

export default ModeToggle
