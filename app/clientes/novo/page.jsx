import MainLayout from "@/components/layout/main-layout"
import NovoCliente from "@/components/clientes/novo-cliente"

export const metadata = {
  title: "Novo Cliente - Alpha Sensores",
}

export default function NovoClientePage() {
  return (
    <MainLayout activeItem="clientes">
      <NovoCliente />
    </MainLayout>
  )
}