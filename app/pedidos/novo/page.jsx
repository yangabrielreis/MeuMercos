import MainLayout from "@/components/layout/main-layout"
import NovoPedido from "@/components/pedidos/novo-pedido"

export const metadata = {
  title: "Novo Pedido - Alpha Sensores",
}

export default function NovoPedidoPage() {
  return (
    <MainLayout activeItem="pedidos">
      <NovoPedido />
    </MainLayout>
  )
}