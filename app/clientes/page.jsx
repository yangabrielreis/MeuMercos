import MainLayout from "@/components/layout/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Filter, MapPin, Edit, Trash2, Users } from "lucide-react"
import Link from "next/link"
import { getClientes } from "@/app/actions"

export const metadata = {
  title: "Clientes - Alpha Sensores",
}

export default async function ListaClientesPage() {
  // Puxa todos os clientes do banco
  const todosClientes = await getClientes() || []
  
  // Limita a exibição aos 3 primeiros
  const clientesMostrar = todosClientes.slice(0, 3)

  return (
    <MainLayout activeItem="clientes">
      <div className="p-6 max-w-6xl mx-auto">
        
        {/* Cabeçalho da Tela de Clientes */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/clientes/novo">
            <Button className="bg-[#4F378B] hover:bg-[#4F378B]/90 text-white gap-2 rounded-sm">
              <Plus className="w-4 h-4" />
              Cadastrar cliente
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <Input
                type="search"
                placeholder="Pesquise por nome ou CNPJ"
                className="pr-8 w-72 rounded-sm border-gray-300 focus-visible:ring-[#4F378B]"
              />
              <Search className="absolute right-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            <Button variant="outline" className="gap-2 text-gray-700 border-gray-300 rounded-sm px-3">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Lista de Clientes */}
        <Card>
          <CardContent className="p-0">
            {clientesMostrar.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                Nenhum cliente cadastrado.
              </div>
            ) : (
              <div className="divide-y">
                {clientesMostrar.map((cliente) => (
                  <div key={cliente.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <div className="space-y-1">
                      <div className="font-medium text-[#4F378B]">{cliente.razao_social || cliente.nome}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {cliente.cidade || 'Sem cidade'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 rounded-sm text-[#4F378B]">
                        <Edit className="w-3 h-3 mr-1" /> Alterar
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 rounded-sm text-red-500">
                        <Trash2 className="w-3 h-3 mr-1" /> Excluir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botão de mostrar mais */}
        {todosClientes.length > 3 && (
          <div className="w-full flex justify-center mt-6">
            <Button variant="outline" className="text-[#4F378B] border-[#4F378B] hover:bg-[#4F378B]/10 rounded-sm px-8">
              Mostrar mais
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  )
}