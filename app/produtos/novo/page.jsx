import MainLayout from "@/components/layout/main-layout"
import NovoProduto from "@/components/produtos/novo-produto"

export const metadata = {
  title: "Novo Produto - Alpha Sensores",
  description: "Cadastrar novo produto",
}

export default function NovoProdutoPage() {
  return (
    <MainLayout activeItem="produtos">
      {/* Aqui a gente puxa o seu componente gigante que tá lá na pasta components! */}
      <NovoProduto />
    </MainLayout>
  )
}