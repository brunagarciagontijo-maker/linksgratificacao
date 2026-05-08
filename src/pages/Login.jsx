import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { supabase } from '../services/supabase'

export default function Login() {
  const navigate = useNavigate()

  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')

  async function handleLogin(e) {
    e.preventDefault()

    const cpfLimpo = cpf.replace(/\D/g, '')

    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('cpf', cpfLimpo)
      .eq('senha', senha)
      .single()

    if (error || !data) {
      alert('CPF ou senha inválidos')
      return
    }

localStorage.setItem(
  'usuario',
  JSON.stringify(data)
)

if (data.tipo === 'admin') {
  navigate('/admin')
} else {
  navigate('/home')
}
  }

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray mb-2">
            Portal Produção
          </h1>

          <p className="text-gray-500 text-sm">
            Faça login para continuar
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-500 mb-2 font-medium">
              CPF
            </label>

            <input
              type="text"
              placeholder="Digite seu CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white/80 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-500 mb-2 font-medium">
              Senha
            </label>

            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white/80 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-500 text-white font-bold py-4 rounded-2xl transition-all"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}