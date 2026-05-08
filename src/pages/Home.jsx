import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  const [usuario, setUsuario] = useState(null)

useEffect(() => {
  async function carregarUsuario() {
    const usuarioStorage = localStorage.getItem('usuario')

    if (!usuarioStorage) {
      navigate('/')
      return
    }

    setUsuario(JSON.parse(usuarioStorage))
  }

  carregarUsuario()
}, [])

  function logout() {
    localStorage.removeItem('usuario')

    navigate('/')
  }

  if (!usuario) return null

  return (
    <div className="min-h-screen bg-gray-300 via-red-500 to-red-300 p-4 flex items-center justify-center">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-1000">
            Olá,
          </h1>

          <p className="text-gray-700 font-medium mt-2">
            {usuario.nome}
          </p>
        </div>

        <div className="space-y-4">

          <button
            onClick={() =>
              window.open(usuario.link_duvidas, '_blank')
            }
            className="w-full bg-gray-400 text-white p-5 rounded-2xl font-bold text-lg"
          >
            ❓ Dúvidas
          </button>

          <button
            onClick={() =>
              window.open(usuario.link_producao, '_blank')
            }
            className="w-full bg-green-500 text-white p-5 rounded-2xl font-bold text-lg"
          >
            📊 Produção
          </button>

          <button
            onClick={logout}
            className="w-full bg-gray-200 text-gray-700 p-4 rounded-2xl font-medium mt-6"
          >
            Sair
          </button>

        </div>
      </div>
    </div>
  )
}