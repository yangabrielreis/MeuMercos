import MainLayout from "@/components/layout/main-layout"
import DashboardPanel from "@/components/dashboard/dashboard-panel"

export const metadata = {
  title: "Alpha Sensores - Painel de Indicadores",
  description: "Sistema de força de vendas B2B",
}

export default function Home() {
  return (
    <MainLayout activeItem="indicadores">
      <DashboardPanel />
    </MainLayout>
  )
}
