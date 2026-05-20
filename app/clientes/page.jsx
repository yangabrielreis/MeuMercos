import MainLayout from "@/components/layout/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Package, Filter } from "lucide-react" 
import Link from "next/link"
import { getProdutos } from "@/app/actions"

export const metadata = {
  title: "Produtos - Alpha Sensores",
  description: "Listagem de produtos",
}

export default async function ListaProdutosPage() {
  // Puxa todos os produtos do banco
  const todosProdutos = await getProdutos() || []
  
  // Limita a exibição aos 3 primeiros produtos
  const produtosMostrar = todosProdutos.slice(0, 3)

  return (
    <MainLayout activeItem="produtos">
      <div className="p-6 max-w-6xl mx-auto">
        
        {/* Cabeçalho da Tela */}
        <div className="flex justify-between items-center mb-6">
          
          <Link href="/produtos/novo">
            <Button className="bg-[#4F378B] hover:bg-[#4F378B]/90 text-white gap-2 rounded-sm">
              <Plus className="w-4 h-4" />
              Cadastrar produto
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <Input
                type="search"
                placeholder="Pesquise por nome ou código"
                className="pr-8 w-72 rounded-sm border-gray-300 focus-visible:ring-[#4F378B]"
              />
              <Search className="absolute right-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            <Button variant="outline" className="gap-2 text-gray-700 border-gray-300 rounded-sm px-3">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

        </div>

        {/* Tabela de Produtos */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 border-b">
                  <tr>
                    <th className="px-6 py-4 font-medium">CÓDIGO / NOME</th>
                    <th className="px-6 py-4 font-medium">MARCA</th>
                    <th className="px-6 py-4 font-medium text-right">ESTOQUE</th>
                    <th className="px-6 py-4 font-medium text-right">PREÇO TABELA</th>
                    <th className="px-6 py-4 font-medium text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {produtosMostrar.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        Nenhum produto cadastrado.
                      </td>
                    </tr>
                  ) : (
                    produtosMostrar.map((produto) => (
                      <tr key={produto.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-[#4F378B]">{produto.codigo}</div>
                          <div className="text-gray-600">{produto.nome}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {produto.marca || '-'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`font-medium ${produto.estoque_atual <= produto.estoque_minimo ? 'text-red-500' : 'text-gray-700'}`}>
                            {produto.estoque_atual} {produto.unidade_medida}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-gray-700">
                          {produto.moeda === 'BRL' ? 'R$' : produto.moeda} {Number(produto.preco_tabela).toFixed(2).replace('.', ',')}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {produto.ativo ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Ativo
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Inativo
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Botão de mostrar mais */}
        {todosProdutos.length > 3 && (
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