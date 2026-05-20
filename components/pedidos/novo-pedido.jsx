"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getProdutos, getClientes, createPedido, addItemPedido } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Mail, MessageCircle, FileText, ChevronDown, Edit, Building2, Package, Info, Search, Bot, Trash2 } from "lucide-react"

export default function NovoPedido() {
  const router = useRouter()
  const [salvando, setSalvando] = useState(false)

  // Estados dos Clientes
  const [clientes, setClientes] = useState([])
  const [buscaCliente, setBuscaCliente] = useState("")
  const [dropdownClienteAberto, setDropdownClienteAberto] = useState(false)
  const [clienteSelecionado, setClienteSelecionado] = useState(null)

  // Estados dos Produtos e Carrinho
  const [produtos, setProdutos] = useState([])
  const [buscaProduto, setBuscaProduto] = useState("")
  const [dropdownProdutoAberto, setDropdownProdutoAberto] = useState(false)
  const [carrinho, setCarrinho] = useState([]) // <- O nosso carrinho de compras!

  // Carrega os dados iniciais
  useEffect(() => {
    async function carregarDados() {
      try {
        const [dadosProdutos, dadosClientes] = await Promise.all([
          getProdutos(),
          getClientes()
        ])
        setProdutos(dadosProdutos || [])
        setClientes(dadosClientes || [])
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      }
    }
    carregarDados()
  }, [])

  // Filtros
  const clientesFiltrados = clientes.filter((c) => {
    const termo = buscaCliente.toLowerCase()
    return (c.razao_social?.toLowerCase() || "").includes(termo) || 
           (c.nome?.toLowerCase() || "").includes(termo) || 
           (c.cnpj || c.cpf || "").includes(termo)
  })

  const produtosFiltrados = produtos.filter((p) => 
    p.nome.toLowerCase().includes(buscaProduto.toLowerCase()) || 
    (p.codigo && p.codigo.toLowerCase().includes(buscaProduto.toLowerCase()))
  )

  // Função para adicionar produto ao carrinho
  const adicionarAoCarrinho = (produto) => {
    // Verifica se já está no carrinho
    const jaExiste = carrinho.find(item => item.produto.id === produto.id)
    if (jaExiste) {
      alert("Este produto já está no pedido!")
      return
    }
    
    setCarrinho([...carrinho, {
      produto: produto,
      quantidade: 1,
      preco_unitario: produto.preco_tabela
    }])
    
    setBuscaProduto("") // Limpa o campo para buscar o próximo
    setDropdownProdutoAberto(false)
  }

  // Atualiza quantidade no carrinho
  const atualizarQuantidade = (produtoId, novaQtd) => {
    setCarrinho(carrinho.map(item => 
      item.produto.id === produtoId ? { ...item, quantidade: Number(novaQtd) || 1 } : item
    ))
  }

  // Remove do carrinho
  const removerDoCarrinho = (produtoId) => {
    setCarrinho(carrinho.filter(item => item.produto.id !== produtoId))
  }

  // FUNÇÃO MESTRE: Salva o pedido no Supabase
  const handleGerarPedido = async () => {
    if (!clienteSelecionado) {
      alert("Por favor, selecione um cliente antes de gerar o pedido.")
      return
    }
    if (carrinho.length === 0) {
      alert("Por favor, adicione pelo menos um produto ao pedido.")
      return
    }

    try {
      setSalvando(true)

      // 1. Cria o "cabeçalho" do pedido na tabela 'pedidos'
      const novoPedido = await createPedido({
        cliente_id: clienteSelecionado.id,
        vendedor_nome: "Yan Gabriel Reis Oliveira", // Fixo por enquanto pra simular seu painel
        tipo_pedido: "Venda",
        status: "Em orçamento"
      })

      // 2. Insere os itens um por um na tabela 'itens_pedido'
      for (const item of carrinho) {
        await addItemPedido(novoPedido.id, {
          produto_id: item.produto.id,
          quantidade: item.quantidade,
          preco_unitario: item.preco_unitario,
        })
      }

      alert("Pedido gerado com sucesso!")
      router.push('/pedidos') // Volta pra listagem pra ver ele lá!

    } catch (error) {
      console.error("Erro ao salvar pedido:", error)
      alert("Deu erro ao salvar. Verifique o console.")
    } finally {
      setSalvando(false)
    }
  }

  // Calcula o total do pedido dinamicamente
  const valorTotalPedido = carrinho.reduce((total, item) => total + (item.quantidade * item.preco_unitario), 0)

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      
      {/* Header do Pedido */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 border-b">
        <div className="text-lg font-medium">Novo Orçamento</div>
        <span className="bg-[#FDE68A] text-[#92400E] text-xs font-medium px-3 py-1 rounded-sm">
          Rascunho
        </span>
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-2 mb-8">
        <Button 
          onClick={handleGerarPedido}
          disabled={salvando}
          className="bg-[#A48EEB] hover:bg-[#9079D6] text-white gap-2 rounded-sm border-0"
        >
          <Check className="w-4 h-4" />
          {salvando ? "Gerando..." : "Gerar pedido"}
        </Button>
        <Button variant="outline" className="gap-2 text-gray-700 bg-white border-gray-300 rounded-sm">
          <FileText className="w-4 h-4" /> Visualizar
        </Button>
        <Button variant="outline" className="gap-2 text-[#4F378B] bg-white border-gray-300 rounded-sm">
          <MessageCircle className="w-4 h-4" />
          Enviar<ChevronDown className="w-3 h-3 ml-1" />
        </Button>
        <Button variant="outline" className="gap-2 text-[#4F378B] bg-white border-gray-300 rounded-sm">
          Mais Opcoes<ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </div>

      <div className="space-y-6 relative">
        
        {/* SEÇÃO 1: CLIENTE */}
        <div className="relative pb-6 border-b border-gray-200 z-20">
          <div className="flex items-center gap-2 text-gray-500 mb-4">
            <Building2 className="w-5 h-5" />
            <h2 className="text-sm font-semibold tracking-wide uppercase">Cliente</h2>
          </div>
          
          <div className="relative max-w-2xl mb-2">
            <div className="bg-white border border-gray-300 p-1 flex items-center rounded-sm">
              <Input 
                placeholder="Digite o nome ou CNPJ/CPF do cliente e selecione" 
                className="border-0 shadow-none focus-visible:ring-0 rounded-none h-8 w-full"
                value={clienteSelecionado ? (clienteSelecionado.razao_social || clienteSelecionado.nome) : buscaCliente}
                onChange={(e) => {
                  setBuscaCliente(e.target.value)
                  setClienteSelecionado(null)
                  setDropdownClienteAberto(true)
                }}
                onFocus={() => setDropdownClienteAberto(true)}
                onBlur={() => setTimeout(() => setDropdownClienteAberto(false), 200)}
              />
            </div>

            {dropdownClienteAberto && (
              <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-sm shadow-lg max-h-60 overflow-y-auto">
                {clientesFiltrados.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500 text-center">Nenhum cliente encontrado.</div>
                ) : (
                  clientesFiltrados.map((cliente) => (
                    <div 
                      key={cliente.id} 
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                      onClick={() => {
                        setClienteSelecionado(cliente)
                        setDropdownClienteAberto(false)
                      }}
                    >
                      <div className="font-medium text-sm text-[#4F378B]">
                        {cliente.razao_social || cliente.nome}
                      </div>
                      <div className="text-sm text-gray-700">{cliente.cnpj || cliente.cpf}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <Link href="/clientes/novo">
              <Button variant="outline" className="h-8 px-3 rounded-sm text-gray-600">Novo cliente</Button>
            </Link>
          </div>
          
          <div className="absolute right-0 top-0 w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-xs text-gray-500 bg-white">1</div>
        </div>

        {/* SEÇÃO 2: REPRESENTADA */}
        <div className="relative pb-6 border-b border-gray-200 z-10">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Building2 className="w-5 h-5" />
            <h2 className="text-sm font-semibold tracking-wide uppercase">Representada</h2>
          </div>
          <div className="pl-7">
            <div className="text-[#4F378B] font-medium">Alpha Sensores <span className="text-gray-500 font-normal">- Alpha Sensores</span></div>
            <div className="text-gray-500 text-sm flex items-center gap-1 mt-1 border-l-2 border-[#4F378B] pl-2">📞 (42) 99156-5703</div>
          </div>
          <div className="absolute right-0 top-0 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white"><Check className="w-4 h-4" /></div>
        </div>

        {/* SEÇÃO 3: PRODUTOS (COM CARRINHO) */}
        <div className="relative pb-6 border-b border-gray-200 z-10">
          <div className="flex items-center gap-2 text-gray-500 mb-4">
            <Package className="w-5 h-5" />
            <h2 className="text-sm font-semibold tracking-wide uppercase">Produtos</h2>
          </div>
          
          <div className="relative max-w-2xl mb-4">
            <div className="bg-white border border-gray-300 p-1 flex items-center rounded-sm">
              <Input 
                placeholder="Busque um produto e clique para adicionar ao pedido..." 
                className="border-0 shadow-none focus-visible:ring-0 rounded-none h-8 w-full"
                value={buscaProduto}
                onChange={(e) => {
                  setBuscaProduto(e.target.value)
                  setDropdownProdutoAberto(true)
                }}
                onFocus={() => setDropdownProdutoAberto(true)}
                onBlur={() => setTimeout(() => setDropdownProdutoAberto(false), 200)} 
              />
            </div>
            
            {dropdownProdutoAberto && (
              <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-sm shadow-lg max-h-60 overflow-y-auto z-30">
                {produtosFiltrados.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500 text-center">Nenhum produto encontrado.</div>
                ) : (
                  produtosFiltrados.map((produto) => (
                    <div 
                      key={produto.id} 
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                      onClick={() => adicionarAoCarrinho(produto)}
                    >
                      <div className="font-medium text-sm text-[#4F378B]">{produto.codigo} - {produto.nome}</div>
                      <div className="text-xs text-gray-500 mt-1 flex gap-4">
                        <span>Estoque: <strong>{produto.estoque_atual}</strong></span>
                        <span>Preço: <strong>R$ {Number(produto.preco_tabela).toFixed(2).replace('.', ',')}</strong></span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* LISTA DO CARRINHO (A mágica acontece aqui) */}
          {carrinho.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-sm mb-4 max-w-4xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                  <tr>
                    <th className="px-4 py-2 font-medium">Produto</th>
                    <th className="px-4 py-2 font-medium w-24 text-center">Qtd</th>
                    <th className="px-4 py-2 font-medium w-32 text-right">Unitário (R$)</th>
                    <th className="px-4 py-2 font-medium w-32 text-right">Subtotal</th>
                    <th className="px-4 py-2 font-medium w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {carrinho.map((item) => (
                    <tr key={item.produto.id}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#4F378B]">{item.produto.codigo}</div>
                        <div className="text-gray-600 text-xs">{item.produto.nome}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Input 
                          type="number" 
                          min="1"
                          className="w-16 h-8 text-center mx-auto"
                          value={item.quantidade}
                          onChange={(e) => atualizarQuantidade(item.produto.id, e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {Number(item.preco_unitario).toFixed(2).replace('.', ',')}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {(item.quantidade * item.preco_unitario).toFixed(2).replace('.', ',')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => removerDoCarrinho(item.produto.id)} className="text-red-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end items-center gap-4">
                <span className="text-gray-500">Total dos produtos:</span>
                <span className="text-lg font-bold text-[#4F378B]">
                  R$ {valorTotalPedido.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Link href="/produtos/novo">
              <Button variant="outline" className="h-8 px-3 rounded-sm text-gray-600">Novo produto</Button>
            </Link>
          </div>
          
          <div className="absolute right-0 top-0 w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-xs text-gray-500 bg-white">3</div>
        </div>

        {/* SEÇÃO 4: DETALHES DO PEDIDO */}
        <div className="relative pb-6">
          <div className="flex items-center gap-2 text-gray-500 mb-4">
            <Info className="w-5 h-5" />
            <h2 className="text-sm font-semibold tracking-wide uppercase">Detalhes do pedido</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-y-4 gap-x-8 text-sm text-gray-600 max-w-4xl">
            <div className="flex items-center"><span className="w-32 text-gray-400">* Cond. de pagamento</span> ---</div>
            <div className="flex items-center"><span className="w-32 text-gray-400">Valor do frete</span> R$ 0,00</div>
            <div className="flex items-center font-bold text-[#4F378B]"><span className="w-32 text-gray-400 font-normal">Total Geral</span> R$ {valorTotalPedido.toFixed(2).replace('.', ',')}</div>
            
            <div className="flex items-center"><span className="w-32 text-gray-400">Vendedor</span> Yan Gabriel Reis Oliveira</div>
          </div>
          
          <div className="absolute right-0 top-0 w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-xs text-gray-500 bg-white">4</div>
        </div>

      </div>
    </div>
  )
}