"use client"

import { useState, useEffect } from "react"
import { getPedidos, getClientes } from "@/app/actions" // Ajuste o caminho se necessário
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical, Plus, Phone, Settings, BarChart3, FileText } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPanel() {
  const [salesData, setSalesData] = useState([])
  const [vendidoNoMes, setVendidoNoMes] = useState(0)
  const [vendidoHoje, setVendidoHoje] = useState(0)
  const [carteiraClientes, setCarteiraClientes] = useState(0)
  const [positivacao, setPositivacao] = useState(0)
  
  const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
  const dataAtual = new Date()
  const mesAtualNome = nomesMeses[dataAtual.getMonth()]
  const anoAtual = dataAtual.getFullYear().toString()

  useEffect(() => {
    async function carregarEProcessarDados() {
      try {
        const [pedidosRaw, clientesRaw] = await Promise.all([
          getPedidos(),
          getClientes()
        ])
        
        const pedidos = pedidosRaw || []
        const clientes = clientesRaw || []

        setCarteiraClientes(clientes.length)

        const hoje = new Date()
        const mesAtual = hoje.getMonth()
        const anoAtual = hoje.getFullYear()
        const diaHoje = hoje.getDate()
        const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate()

        let totalMes = 0
        let totalHoje = 0
        const vendasPorDia = {}
        const clientesQueCompraram = new Set()

        for (let i = 1; i <= diasNoMes; i++) {
          vendasPorDia[i] = 0
        }

        pedidos.forEach(pedido => {
          const dataPedido = new Date(pedido.created_at)
          const valorPedido = Number(pedido.valor_total) || 0

          if (dataPedido.getMonth() === mesAtual && dataPedido.getFullYear() === anoAtual) {
            totalMes += valorPedido
            vendasPorDia[dataPedido.getDate()] += valorPedido
            
            if (pedido.cliente_id) {
              clientesQueCompraram.add(pedido.cliente_id)
            }

            if (dataPedido.getDate() === diaHoje) {
              totalHoje += valorPedido
            }
          }
        })

        const dadosGraficoFormatados = Object.keys(vendasPorDia).map(dia => ({
          day: dia,
          vendas: vendasPorDia[dia],
          objetivo: 0,
          previsao: 0
        }))

        setSalesData(dadosGraficoFormatados)
        setVendidoNoMes(totalMes)
        setVendidoHoje(totalHoje)
        setPositivacao(clientesQueCompraram.size)

      } catch (error) {
        console.error("Erro ao processar dados do dashboard:", error)
      }
    }

    carregarEProcessarDados()
  }, [])

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex items-center justify-between mb-6">
        
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-[#4F378B] border-[#4F378B]">
            <Plus className="w-4 h-4 mr-1" />
            Adicionar Indicador
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm text-muted-foreground">FILTRAR POR:</span>
        <Select defaultValue={mesAtualNome.toLowerCase()}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Mês" />
          </SelectTrigger>
          <SelectContent>
            {nomesMeses.map(mes => (
              <SelectItem key={mes} value={mes.toLowerCase()}>{mes}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select defaultValue={anoAtual}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2026">2026</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="todos">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Vendedor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os vendedores</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sales Evolution Chart */}
      <Card className="mb-6 rounded-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              EVOLUÇÃO DE VENDA
            </CardTitle>
            <span className="text-xs text-muted-foreground cursor-help">ⓘ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground uppercase">{mesAtualNome} DE {anoAtual}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            
            {/* Chart Area - AQUI FOI A ALTERAÇÃO PRINCIPAL */}
            <div className="flex-1 flex flex-col h-[320px]">
              
              {/* O gráfico em si pega todo o espaço flexível livre (flex-1) */}
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData} margin={{ top: 5, right: 20, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#999' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#999' }}
                    />
                    <Tooltip 
                      formatter={(value) => `R$ ${Number(value).toFixed(2).replace('.', ',')}`}
                      labelFormatter={(label) => `Dia ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="vendas" 
                      name="Vendas no dia"
                      stroke="#22c55e" 
                      strokeWidth={2}
                      dot={{ fill: '#22c55e', strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legenda - Agora fica apertadinha no final da coluna, mas DENTRO da div principal */}
              <div className="flex items-center justify-center gap-6 pt-4 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-xs text-muted-foreground">Vendas no mês</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-gray-400"></span>
                  <span className="text-xs text-muted-foreground">Objetivo</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-orange-400"></span>
                  <span className="text-xs text-muted-foreground">Previsão de vendas</span>
                </div>
              </div>

            </div>

            {/* Side Stats */}
            <div className="w-[250px] space-y-6 border-l pl-6 flex flex-col justify-center">
              <div>
                <p className="text-xs text-muted-foreground mb-1">VENDIDO NO MÊS</p>
                <p className="text-2xl font-semibold text-gray-800">R$ {vendidoNoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-muted-foreground mt-1">Hoje R$ {vendidoHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground mb-1">OBJETIVO DO MÊS</p>
                  <Button variant="link" className="text-[#4F378B] text-xs p-0 h-auto font-semibold">
                    Definir metas
                  </Button>
                </div>
                <p className="text-2xl font-semibold text-gray-800">R$ 0,00</p>
                <Progress value={0} className="h-1 mt-2 bg-gray-100" />
                <p className="text-xs text-muted-foreground mt-1">%</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">NECESSÁRIO VENDER</p>
                <p className="text-xl font-semibold text-gray-800">R$ por dia útil</p>
                <p className="text-xs text-muted-foreground mt-1">Nenhuma meta definida</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Cards */}
      <div className="grid grid-cols-3 gap-6">
        
        {/* Carteira de Clientes */}
        <Card className="rounded-sm flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-50 mb-4">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xs font-semibold text-gray-500">
                CARTEIRA DE CLIENTES
              </CardTitle>
              <span className="text-xs text-gray-400 cursor-help">ⓘ</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 uppercase">{mesAtualNome} DE {anoAtual}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center flex-1 py-6">
            <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-[10px] border-gray-100 mb-6">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-light text-gray-700">{carteiraClientes}</span>
                <span className="text-xs text-gray-400 mt-1">Clientes</span>
              </div>
            </div>
            
            <div className="w-full flex justify-between px-4 mt-2">
               <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                  <span className="text-xs text-gray-600 font-medium">0 ativos</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></span>
                  <span className="text-xs text-gray-600 font-medium">0 inativos recentes</span>
               </div>
            </div>
            <div className="w-full flex justify-between px-4 mt-2 mb-4">
               <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                  <span className="text-xs text-gray-600 font-medium">0 inativos antigos</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gray-300 rounded-full"></span>
                  <span className="text-xs text-gray-400 font-medium">0 prospects</span>
               </div>
            </div>

            <Button variant="ghost" className="w-full border-t border-gray-100 text-[#4F378B] rounded-none pt-4 pb-0 h-auto font-semibold text-sm mt-auto">
              <BarChart3 className="w-4 h-4 mr-2" />
              Detalhar carteira
            </Button>
          </CardContent>
        </Card>

        {/* Positivação */}
        <Card className="rounded-sm flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-50 mb-4">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xs font-semibold text-gray-500">
                POSITIVAÇÃO
              </CardTitle>
              <span className="text-xs text-gray-400 cursor-help">ⓘ</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 uppercase">{mesAtualNome} DE {anoAtual}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center flex-1 py-6">
            <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-[10px] border-gray-100 mb-6">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-light text-gray-700">{positivacao}</span>
                <span className="text-xs text-gray-400 mt-1">Clientes</span>
                <span className="text-xs text-gray-400">positivados</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 text-center mb-4">Nenhum cliente foi positivado neste mês</p>

            <div className="w-full flex justify-between px-4 mt-2">
               <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-purple-500 rounded-full"></span>
                  <span className="text-xs text-gray-600 font-medium">0 novos</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                  <span className="text-xs text-gray-600 font-medium">0 ativos</span>
               </div>
            </div>
            <div className="w-full flex justify-between px-4 mt-2 mb-4">
               <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></span>
                  <span className="text-xs text-gray-600 font-medium">0 inativos recentes</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                  <span className="text-xs text-gray-600 font-medium">0 inativos antigos</span>
               </div>
            </div>

            <Button variant="ghost" className="w-full border-t border-gray-100 text-[#4F378B] rounded-none pt-4 pb-0 h-auto font-semibold text-sm mt-auto">
              <BarChart3 className="w-4 h-4 mr-2" />
              Detalhar positivação
            </Button>
          </CardContent>
        </Card>

        {/* Curva ABC de Clientes */}
        <Card className="rounded-sm flex flex-col h-full relative">
          

          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-50 mb-4">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xs font-semibold text-gray-500">
                CURVA ABC DE CLIENTES
              </CardTitle>
              <span className="text-xs text-gray-400 cursor-help">ⓘ</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 uppercase">ÚLT. 12 MESES</span>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center flex-1 py-6">
            <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-[10px] border-gray-100 mb-6">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-light text-gray-700">0</span>
                <span className="text-xs text-gray-400 mt-1">Clientes</span>
              </div>
            </div>

            <div className="w-full flex flex-col gap-2 px-8 mt-2 mb-9">
               <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-purple-600 rounded-full"></span>
                  <span className="text-xs text-gray-600 font-medium">0 clientes na Curva A</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-purple-400 rounded-full"></span>
                  <span className="text-xs text-gray-600 font-medium">0 clientes na Curva B</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-purple-200 rounded-full"></span>
                  <span className="text-xs text-gray-400 font-medium">0 clientes na Curva C</span>
               </div>
            </div>

            <Button variant="ghost" className="w-full border-t border-gray-100 text-[#4F378B] rounded-none pt-4 pb-0 h-auto font-semibold text-sm mt-auto">
              <BarChart3 className="w-4 h-4 mr-2" />
              Detalhar curva ABC
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}