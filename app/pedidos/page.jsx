import MainLayout from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Filter, Building2 } from "lucide-react"
import Link from "next/link"
import { getPedidos } from "@/app/actions"

export const metadata = {
  title: "Pedidos - Alpha Sensores",
}

// Função auxiliar para formatar a data do banco para o padrão Mercos (ex: "quarta-feira, 20 de maio de 2026")
function formatarData(dataString) {
  if (!dataString) return "Data não informada"
  const data = new Date(dataString)
  return data.toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  }).toUpperCase()
}

export default async function PedidosPage() {
  // Puxa todos os pedidos do banco
  const todosPedidos = await getPedidos() || []
  
  // Corta o array para mostrar apenas os 3 primeiros (mais recentes)
  const pedidosMostrar = todosPedidos.slice(0, 3)

  return (
    <MainLayout activeItem="pedidos">
      <div className="p-6 max-w-6xl mx-auto">
        
        {/* Barra de Ações Topo */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-2">
            <Link href="/pedidos/novo">
              <Button className="bg-[#4F378B] hover:bg-[#4F378B]/90 text-white gap-2 rounded-sm">
                <Plus className="w-4 h-4" />
                Criar pedido / orçamento
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <Input
                type="search"
                placeholder="Pedido, cliente ou representada"
                className="pr-8 w-72 rounded-sm border-gray-300"
              />
              <Search className="absolute right-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            <Button variant="outline" className="gap-2 text-gray-700 border-gray-300 rounded-sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Lista de Pedidos Reais */}
        <div className="space-y-6">
          
          {pedidosMostrar.length === 0 ? (
            <div className="text-center py-12 text-gray-500 border rounded-sm bg-white">
              Nenhum pedido encontrado no banco de dados.
            </div>
          ) : (
            pedidosMostrar.map((pedido) => (
              <div key={pedido.id}>
                {/* Cabeçalho da Data (Simulando o padrão do Mercos) */}
                <h3 className="text-gray-500 font-medium mb-2 text-sm tracking-wide">
                  {formatarData(pedido.created_at)}
                </h3>
                
                {/* Card do Pedido */}
                <div className="bg-white border rounded-sm mb-4 hover:border-[#4F378B] transition-colors cursor-pointer">
                  <div className="p-4 flex justify-between items-start border-b border-gray-100">
                    <div className="text-sm space-y-1.5">
                      <div>
                        <span className="text-[#4F378B] font-medium">#{pedido.id}</span> emitido por <span className="font-medium">{pedido.vendedor_nome || 'Vendedor'}</span>
                      </div>
                      
                      {/* Se o pedido tiver um cliente atrelado, mostra a Razão Social ou Nome */}
                      {pedido.cliente && (
                        <div className="text-gray-500 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          {pedido.cliente.razao_social || pedido.cliente.nome}
                        </div>
                      )}
                    </div>
                    
                    <span className="bg-[#FDE68A] text-[#92400E] text-xs font-medium px-2.5 py-1 rounded-sm">
                      {pedido.status || 'Em orçamento'}
                    </span>
                  </div>
                  <div className="p-4 text-sm font-semibold text-gray-800">
                    R$ {Number(pedido.valor_total || 0).toFixed(2).replace('.', ',')}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Botão Ver Mais (Estático por enquanto) */}
          {todosPedidos.length > 3 && (
            <div className="text-center mt-8">
              <Button variant="outline" className="text-[#4F378B] border-[#4F378B] hover:bg-[#4F378B]/10 rounded-sm">
                Ver mais
              </Button>
            </div>
          )}

          <div className="text-center text-sm text-gray-500 mt-6">
            Nenhum outro pedido recente. <span className="text-[#4F378B] cursor-pointer hover:underline">Ver pedidos do ano anterior.</span>
          </div>

        </div>
      </div>
    </MainLayout>
  )
}