"use client"

import { Sidebar } from "./sidebar"

export default function MainLayout({ children }) {
  return (
    // Trocamos min-h-screen por h-screen e adicionamos overflow-hidden
    <div className="flex h-screen overflow-hidden bg-background">
      
      {/* A sidebar fica estática aqui na esquerda */}
      <Sidebar />
      
      {/* O container principal ocupa o resto do espaço */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Como o pai travou a altura, o overflow-y-auto cria a barra de rolagem SÓ AQUI dentro */}
        <main className="flex-1 overflow-y-auto p-0">
          {children}
        </main>
        
      </div>
    </div>
  )
}