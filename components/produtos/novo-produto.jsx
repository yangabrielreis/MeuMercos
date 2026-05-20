"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createProduto } from "@/app/actions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Image, Check } from "lucide-react"

export default function NovoProduto() {
  const router = useRouter()
  
  // Estados do formulário
  const [nome, setNome] = useState("")
  const [codigo, setCodigo] = useState("")
  const [unidadeMedida, setUnidadeMedida] = useState("")
  const [vendaMultiplos, setVendaMultiplos] = useState("1")
  const [categoria, setCategoria] = useState("")
  const [moeda, setMoeda] = useState("BRL")
  const [precoMinimo, setPrecoMinimo] = useState("")
  const [precoTabela, setPrecoTabela] = useState("")
  
  // Estado para controlar o loading do botão
  const [salvando, setSalvando] = useState(false)

  // Função que faz o envio para o banco
  const handleSave = async () => {
    // Validação básica para não quebrar o banco
    if (!nome) {
      alert("Por favor, preencha o Nome do produto.")
      return
    }
    if (!precoTabela) {
      alert("Por favor, preencha o Preço de Tabela.")
      return
    }

    try {
      setSalvando(true)
      
      // Monta o objeto formatando os dados
      const formData = {
        nome: nome,
        codigo: codigo,
        unidade_medida: unidadeMedida || 'UN',
        venda_multiplos: Number(vendaMultiplos) || 1,
        // Evita mandar 'sem-categoria' como ID pro banco
        categoria_id: null,
        moeda: moeda,
        preco_minimo: Number(precoMinimo.replace(',', '.')) || 0,
        preco_tabela: Number(precoTabela.replace(',', '.')) || 0,
        ativo: true
      }

      // Chama a Server Action
      await createProduto(formData)
      
      alert("Produto cadastrado com sucesso!")
      router.push('/produtos') // Volta pra lista de produtos
      
    } catch (error) {
      console.error("Erro ao salvar:", error)
      alert("Deu erro ao salvar o produto. Verifique o console.")
    } finally {
      setSalvando(false)
    }
  }

  const handleCancel = () => {
    router.push('/produtos')
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-lg font-semibold mb-6">NOVO PRODUTO</h1>

      <Card className="mb-6">
        <CardContent className="p-6">
          {/* Product Image and Name */}
          <div className="flex gap-4 mb-6">
            <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
              <Image className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="flex-1 grid grid-cols-4 gap-4">
              <div className="col-span-3">
                <Label htmlFor="nome" className="text-sm">
                  * Nome
                </Label>
                <Input
                  id="nome"
                  placeholder="Ex: Sensor Magnético"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="codigo" className="text-sm text-muted-foreground">
                  Código
                </Label>
                <Input
                  id="codigo"
                  placeholder="SKU ou referência"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="unidade" className="text-sm text-muted-foreground">
                Unidade de medida
              </Label>
              <Input
                id="unidade"
                placeholder="Kg, Cx, Un, Pç, etc."
                value={unidadeMedida}
                onChange={(e) => setUnidadeMedida(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="multiplos" className="text-sm text-muted-foreground">
                Venda em múltiplos de
              </Label>
              <Input
                id="multiplos"
                type="number"
                value={vendaMultiplos}
                onChange={(e) => setVendaMultiplos(e.target.value)}
                className="mt-1 text-right"
              />
            </div>
            <div>
              <Label htmlFor="categoria" className="text-sm text-muted-foreground">
                Categoria
              </Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sem categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sem-categoria">Sem categoria</SelectItem>
                  <SelectItem value="eletronicos">Eletrônicos</SelectItem>
                  <SelectItem value="sensores">Sensores</SelectItem>
                  <SelectItem value="acessorios">Acessórios</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="tabelas-preco" className="w-full">
            <TabsList className="bg-transparent p-0 h-auto gap-0 border-b w-full justify-start rounded-none">
              <TabsTrigger 
                value="tabelas-preco" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 text-sm font-medium"
              >
                TABELAS DE PREÇO
              </TabsTrigger>
              <TabsTrigger 
                value="info-gerais" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 text-sm font-medium text-muted-foreground"
              >
                INFORMAÇÕES GERAIS
              </TabsTrigger>
              <TabsTrigger 
                value="variacoes" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 text-sm font-medium text-muted-foreground"
              >
                VARIAÇÕES
              </TabsTrigger>
              <TabsTrigger 
                value="peso-dimensoes" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 text-sm font-medium text-muted-foreground"
              >
                PESO E DIMENSÕES
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tabelas-preco" className="mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="moeda" className="text-sm text-muted-foreground">
                      Moeda
                    </Label>
                    <Select value={moeda} onValueChange={setMoeda}>
                      <SelectTrigger className="mt-1 w-32">
                        <SelectValue placeholder="R$" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRL">R$</SelectItem>
                        <SelectItem value="USD">US$</SelectItem>
                        <SelectItem value="EUR">€</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <Label htmlFor="preco-minimo" className="text-sm text-muted-foreground">
                        Preço Mínimo
                      </Label>
                      <span className="text-xs text-muted-foreground cursor-help">ⓘ</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">R$</span>
                      <Input
                        id="preco-minimo"
                        type="text"
                        placeholder="0,00"
                        value={precoMinimo}
                        onChange={(e) => setPrecoMinimo(e.target.value)}
                        className="w-32 text-right"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="preco-tabela" className="text-sm">
                    * Preço de Tabela
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">R$</span>
                    <Input
                      id="preco-tabela"
                      type="text"
                      placeholder="0,00"
                      value={precoTabela}
                      onChange={(e) => setPrecoTabela(e.target.value)}
                      className="w-32 text-right"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="info-gerais" className="mt-6">
              <p className="text-sm text-muted-foreground">Informações gerais do produto...</p>
            </TabsContent>

            <TabsContent value="variacoes" className="mt-6">
              <p className="text-sm text-muted-foreground">Variações do produto...</p>
            </TabsContent>

            <TabsContent value="peso-dimensoes" className="mt-6">
              <p className="text-sm text-muted-foreground">Peso e dimensões do produto...</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button 
          onClick={handleSave} 
          disabled={salvando}
          className="bg-primary hover:bg-primary/90 text-white gap-2"
        >
          <Check className="w-4 h-4" />
          {salvando ? "Salvando..." : "Salvar"}
        </Button>
        <Button variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}