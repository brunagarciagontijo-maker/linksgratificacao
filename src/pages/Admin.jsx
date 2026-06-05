import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { supabase } from '../services/supabase'

export default function Admin() {
  const navigate = useNavigate()

  const [usuarios, setUsuarios] = useState([])
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState(null)
  const [sortOrder, setSortOrder] = useState("asc")

  const [modalAberto, setModalAberto] = useState(false)
  const [editandoId, setEditandoId] = useState(null)

  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [tipo, setTipo] = useState('comum')

  const [linkDuvidas, setLinkDuvidas] = useState('')
  const [linkProducao, setLinkProducao] = useState('')

  async function buscarUsuarios() {
    const { data } = await supabase
      .from('usuarios')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      setUsuarios(data)
    }
  }

  useEffect(() => {
    async function carregar() {
      await buscarUsuarios()
    }

    carregar()
  }, [])

  function limparFormulario() {
    setNome('')
    setCpf('')
    setTipo('comum')
    setLinkDuvidas('')
    setLinkProducao('')
    setEditandoId(null)
    setModalAberto(false)
  }

  async function cadastrarUsuario(e) {
    e.preventDefault()

    const cpfLimpo = cpf.replace(/\D/g, '')
    const senha = cpfLimpo.slice(-4)

    if (editandoId) {
      const { error } = await supabase
        .from('usuarios')
        .update({
          nome,
          cpf: cpfLimpo,
          senha,
          tipo,
          link_duvidas: linkDuvidas,
          link_producao: linkProducao,
        })
        .eq('id', editandoId)

      if (error) {
        alert('Erro ao atualizar usuário')
        return
      }

      alert('Usuário atualizado com sucesso')
    } else {
      const { error } = await supabase
        .from('usuarios')
        .insert([
          {
            nome,
            cpf: cpfLimpo,
            senha,
            tipo,
            link_duvidas: linkDuvidas,
            link_producao: linkProducao,
          },
        ])

      if (error) {
        alert('Erro ao cadastrar usuário')
        return
      }

      alert('Usuário cadastrado com sucesso')
    }

    limparFormulario()
    buscarUsuarios()
  }

  function editarUsuario(usuario) {
    setEditandoId(usuario.id)

    setNome(usuario.nome)
    setCpf(usuario.cpf)
    setTipo(usuario.tipo)

    setLinkDuvidas(usuario.link_duvidas || '')
    setLinkProducao(usuario.link_producao || '')

    setModalAberto(true)
  }

  async function excluirUsuario(id) {
    const confirmar = confirm('Deseja realmente excluir este usuário?')
    if (!confirmar) return

    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Erro ao excluir usuário')
      return
    }

    alert('Usuário excluído')
    buscarUsuarios()
  }

  function logout() {
    localStorage.removeItem('usuario')
    navigate('/')
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const usuariosFiltrados = usuarios.filter((user) =>
    user.nome.toLowerCase().includes(search.toLowerCase()) ||
    user.cpf.includes(search)
  )

  const usuariosOrdenados = [...usuariosFiltrados].sort((a, b) => {
    if (!sortField) return 0

    const valueA = a[sortField]
    const valueB = b[sortField]

    if (valueA < valueB) return sortOrder === "asc" ? -1 : 1
    if (valueA > valueB) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  return (
    <div className="min-h-screen bg-[#f3f4f6]">

      <div className="border-b border-gray-300 bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-24 flex items-center justify-between">

          <div className="flex-1 text-center">
            <h1 className="text-3xl font-black text-gray-800">
              Painel Administrativo
            </h1>
            <p className="text-gray-500 mt-1">Painel de usuários</p>
          </div>

          <button
            onClick={logout}
            className="h-10 px-4 bg-gray-100 hover:bg-gray-700 text-gray-700 rounded-lg text-sm font-semibold transition-all"
          >
            Sair
          </button>

        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Usuários cadastrados
              </h2>
              <p className="text-gray-500 mt-1">
                Gerenciar cadastros
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Buscar por nome ou CPF..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 px-4 rounded-xl border border-gray-200 outline-none"
              />

              <button
                onClick={() => {
                  limparFormulario()
                  setModalAberto(true)
                }}
                className="h-12 px-5 bg-gray-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all"
              >
                + Novo usuário
              </button>
            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-50">
                <tr>
                  <th onClick={() => handleSort("nome")} className="text-left px-8 py-4 font-bold text-gray-500 cursor-pointer">
                    Nome {sortField === "nome" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                  </th>

                  <th onClick={() => handleSort("cpf")} className="text-left px-6 py-4 font-bold text-gray-500 cursor-pointer">
                    CPF {sortField === "cpf" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                  </th>

                  <th className="text-left px-6 py-4 font-bold text-gray-500">
                    Senha
                  </th>

                  <th onClick={() => handleSort("tipo")} className="text-left px-6 py-4 font-bold text-gray-500 cursor-pointer">
                    Tipo {sortField === "tipo" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                  </th>

                  <th className="text-left px-6 py-4 font-bold text-gray-500">
                    Produção
                  </th>

                  <th className="text-right px-20 py-4 font-bold text-gray-500">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {usuariosOrdenados.map((usuario) => (
                  <tr
                    key={usuario.id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-all"
                  >

                    <td className="px-8 py-5">
                      <p className="font-semibold text-gray-800">
                        {usuario.nome}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-gray-600">
                      {usuario.cpf}
                    </td>

                    <td className="px-6 py-5">
                      <div className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg inline-flex text-sm font-semibold">
                        {usuario.senha}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                        usuario.tipo === 'admin'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {usuario.tipo}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      {usuario.link_producao ? (
                        <a
                          href={usuario.link_producao}
                          target="_blank"
                          className="text-red-600 hover:underline font-medium"
                        >
                          Abrir link
                        </a>
                      ) : (
                        <span className="text-gray-400">
                          Não informado
                        </span>
                      )}
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-3">

                        <button
                          onClick={() => editarUsuario(usuario)}
                          className="h-10 px-4 bg-gray-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => excluirUsuario(usuario.id)}
                          className="h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
                        >
                          Excluir
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </div>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl p-8">

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {editandoId ? 'Editar usuário' : 'Novo usuário'}
                </h2>
                <p className="text-gray-500 mt-1">
                  Preencha os dados abaixo
                </p>
              </div>

              <button
                onClick={limparFormulario}
                className="w-11 h-11 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
              >
                ✕
              </button>
            </div>

            <form onSubmit={cadastrarUsuario} className="space-y-5">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome completo
                </label>

                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Digite o nome"
                  className="w-full h-14 px-5 rounded-2xl border border-gray-200 outline-none focus:border-red-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CPF
                  </label>

                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="Digite o CPF"
                    className="w-full h-14 px-5 rounded-2xl border border-gray-200 outline-none focus:border-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo
                  </label>

                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full h-14 px-5 rounded-2xl border border-gray-200 outline-none focus:border-red-500"
                  >
                    <option value="comum">Usuário comum</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link dúvidas
                </label>

                <input
                  type="text"
                  value={linkDuvidas}
                  onChange={(e) => setLinkDuvidas(e.target.value)}
                  placeholder="Cole o link"
                  className="w-full h-14 px-5 rounded-2xl border border-gray-200 outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link produção
                </label>

                <input
                  type="text"
                  value={linkProducao}
                  onChange={(e) => setLinkProducao(e.target.value)}
                  placeholder="Cole o link"
                  className="w-full h-14 px-5 rounded-2xl border border-gray-200 outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all"
              >
                {editandoId ? 'Atualizar usuário' : 'Cadastrar usuário'}
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  )
}