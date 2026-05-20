"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createCliente } from "@/app/actions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ChevronDown } from "lucide-react"

export default function NovoCliente() {
  const router = useRouter()
  
  // Controle de Loading
  const [salvando, setSalvando] = useState(false)

  // Estados do formulário
  const [tipoPessoa, setTipoPessoa] = useState("juridica")
  const [cnpj, setCnpj] = useState("")
  const [cpf, setCpf] = useState("")
  const [razaoSocial, setRazaoSocial] = useState("")
  const [nome, setNome] = useState("")
  const [nomeFantasia, setNomeFantasia] = useState("")
  const [apelido, setApelido] = useState("")
  
  // Estados simplificados para 1 único campo
  const [telefone, setTelefone] = useState("")
  
  // E-mails mantidos em array caso você queira deixar como estava, 
  // mas com a função de adicionar já pronta caso precise no futuro.
  const [emails, setEmails] = useState([""])
  const [showCompleto, setShowCompleto] = useState(false)

  const addEmail = () => {
    setEmails([...emails, ""])
  }

  const updateEmail = (index, value) => {
    const newEmails = [...emails]
    newEmails[index] = value
    setEmails(newEmails)
  }

  const handleSave = async () => {
    // Validação básica dependendo do tipo de pessoa
    if (tipoPessoa === "juridica" && !razaoSocial) {
      alert("Por favor, preencha a Razão Social.")
      return
    }
    if (tipoPessoa === "fisica" && !nome) {
      alert("Por favor, preencha o Nome.")
      return
    }

    try {
      setSalvando(true)

      const emailsLimpos = emails.filter(e => e.trim() !== "")

      const formData = {
        tipo_pessoa: tipoPessoa === "juridica" ? "Juridica" : "Fisica",
        cnpj: tipoPessoa === "juridica" ? cnpj : null,
        razao_social: tipoPessoa === "juridica" ? razaoSocial : null,
        nome_fantasia: tipoPessoa === "juridica" ? nomeFantasia : null,
        cpf: tipoPessoa === "fisica" ? cpf : null,
        nome: tipoPessoa === "fisica" ? nome : null,
        apelido: tipoPessoa === "fisica" ? apelido : null,
        
        telefone: telefone.trim() !== "" ? telefone : null,
        telefones_adicionais: [], // Enviando vazio já que removemos múltiplos telefones
        
        email: emailsLimpos.length > 0 ? emailsLimpos[0] : null,
        emails_adicionais: emailsLimpos.slice(1),
      }

      await createCliente(formData)
      
      alert("Cliente cadastrado com sucesso!")
      router.push('/clientes') // Agora volta para a lista de clientes!
      
    } catch (error) {
      console.error("Erro ao salvar cliente:", error)
      alert("Deu erro ao salvar o cliente. Verifique o console.")
    } finally {
      setSalvando(false)
    }
  }

  const handleCancel = () => {
    router.push('/clientes') // Agora o cancelar também volta pra lista
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-lg font-semibold mb-6">NOVO CLIENTE</h1>

      <Card className="mb-6">
        <CardContent className="p-6">
          {/* Tipo de Pessoa */}
          <RadioGroup 
            value={tipoPessoa} 
            onValueChange={setTipoPessoa}
            className="flex items-center gap-6 mb-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="juridica" id="juridica" />
              <Label htmlFor="juridica" className="text-sm font-normal cursor-pointer">
                Pessoa Jurídica
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fisica" id="fisica" />
              <Label htmlFor="fisica" className="text-sm font-normal cursor-pointer">
                Pessoa Física
              </Label>
            </div>
          </RadioGroup>

          {/* Campos dinâmicos baseados no tipo */}
          {tipoPessoa === "juridica" ? (
            <>
              <div className="mb-4">
                <Label htmlFor="cnpj" className="text-sm text-muted-foreground">
                  CNPJ
                </Label>
                <Input
                  id="cnpj"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  className="mt-1 max-w-xs"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="razao" className="text-sm">
                  * Razão social
                </Label>
                <Input
                  id="razao"
                  placeholder="obrigatório"
                  value={razaoSocial}
                  onChange={(e) => setRazaoSocial(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="fantasia" className="text-sm text-muted-foreground">
                  Nome fantasia
                </Label>
                <Input
                  id="fantasia"
                  value={nomeFantasia}
                  onChange={(e) => setNomeFantasia(e.target.value)}
                  className="mt-1"
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <Label htmlFor="cpf" className="text-sm text-muted-foreground">
                  CPF
                </Label>
                <Input
                  id="cpf"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  className="mt-1 max-w-xs"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="nome" className="text-sm">
                  * Nome
                </Label>
                <Input
                  id="nome"
                  placeholder="obrigatório"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="apelido" className="text-sm text-muted-foreground">
                  Apelido
                </Label>
                <Input
                  id="apelido"
                  value={apelido}
                  onChange={(e) => setApelido(e.target.value)}
                  className="mt-1"
                />
              </div>
            </>
          )}

          {/* Telefone (Simplificado para 1 campo) */}
          <div className="mb-4">
            <Label htmlFor="telefone" className="text-sm text-muted-foreground">Telefone</Label>
            <Input
              id="telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="mt-1 max-w-xs"
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <Label className="text-sm text-muted-foreground">E-mail</Label>
            {emails.map((email, index) => (
              <Input
                key={index}
                type="email"
                value={email}
                onChange={(e) => updateEmail(index, e.target.value)}
                className="mt-1 max-w-xs"
              />
            ))}
          </div>

          {/* Cadastro Completo */}
          <Button
            variant="ghost"
            onClick={() => setShowCompleto(!showCompleto)}
            className="text-[#4F378B] p-0 h-auto hover:bg-transparent hover:text-[#4F378B]/80"
          >
            <ChevronDown className={`w-4 h-4 mr-1 transition-transform ${showCompleto ? 'rotate-180' : ''}`} />
            Preencher cadastro completo: contatos, endereço e informações adicionais
          </Button>

          {showCompleto && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Campos adicionais de contatos, endereço e informações serão exibidos aqui...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button 
          onClick={handleSave} 
          disabled={salvando}
          className="bg-[#4F378B] hover:bg-[#4F378B]/90 text-white min-w-[100px]"
        >
          {salvando ? "Salvando..." : "Salvar"}
        </Button>
        <Button variant="outline" onClick={handleCancel} className="border-gray-300 text-gray-700 hover:bg-gray-50">
          Cancelar
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#4F378B] rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">M</span>
            </div>
            <span className="font-semibold text-[#4F378B]">mercos</span>
          </div>
          <span className="hover:underline cursor-pointer">Guia Inicial</span>
          <span className="hover:underline cursor-pointer">Central de ajuda</span>
        </div>
        <div className="flex items-center gap-4">
          <span>ID Empresa: 433739</span>
          <span className="text-[#4F378B] cursor-pointer hover:underline">Liberar acesso Mercos</span>
          <span className="hover:underline cursor-pointer">Aviso de privacidade</span>
        </div>
      </div>
    </div>
  )
}