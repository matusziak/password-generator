import { useState } from 'react'

import './App.css'
import '../app/globals.css'

import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'

function App() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [params, setParams] = useState({
    length: 10,
    isLowercase: true,
    isUppercase: true,
    isNumbers: true,
    isSymbols: true,
  })

  const generatePassword = async () => {
    setLoading(true)

    // For UX effect to see the loading
    setTimeout(async () => {
      try {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) =>
          searchParams.append(key, value.toString())
        )

        const res = await fetch(
          'http://localhost:5000/generate?' + searchParams.toString()
        )

        setPassword(await res.text())
      } catch (e) {
        console.log(e)
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }, 500)
  }

  const setParam = (paramName: string, value: boolean | number) => {
    setParams({ ...params, [paramName]: value })
  }

  return (
    <div className="flex flex-col min-w-[450px] space-y-6 p-8 pb-4 shadow rounded-lg">
      <div className="w-full min-h-[52px] bg-slate-100 p-3 rounded-md">
        <h1 className=" text-xl">{password || 'Password generator'}</h1>
      </div>

      <div className="flex flex-col items-start space-y-2">
        <span className="">Password length: {params.length}</span>
        <Slider
          value={[params.length]}
          max={32}
          min={4}
          step={1}
          onValueChange={(value) =>
            setParam('length', value.length ? value[0] : 10)
          }
        />
      </div>

      <div className="flex justify-between">
        <span>Lowercase letters</span>
        <Switch
          checked={params.isLowercase}
          onCheckedChange={(value) => setParam('isLowercase', value)}
        />
      </div>

      <div className="flex justify-between">
        <span>Uppercase letters</span>
        <Switch
          checked={params.isUppercase}
          onCheckedChange={(value) => setParam('isUppercase', value)}
        />
      </div>

      <div className="flex justify-between">
        <span>Numbers</span>
        <Switch
          checked={params.isNumbers}
          onCheckedChange={(value) => setParam('isNumbers', value)}
        />
      </div>

      <div className="flex justify-between">
        <span>Special characters</span>
        <Switch
          checked={params.isSymbols}
          onCheckedChange={(value) => setParam('isSymbols', value)}
        />
      </div>

      <Button loading={loading} onClick={generatePassword}>
        Generate password
      </Button>

      <p>{error?.message}</p>
    </div>
  )
}

export default App
