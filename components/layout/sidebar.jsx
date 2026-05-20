"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  FileText,
  Users,
  Package,
  ShoppingCart,
  Settings,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: BarChart3, label: "INDICADORES", href: "/" },
  { icon: FileText, label: "PEDIDOS", href: "/pedidos" },
  { icon: Users, label: "CLIENTES", href: "/clientes" },
  { icon: Package, label: "PRODUTOS", href: "/produtos" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[180px] min-h-screen bg-white border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-foreground">ALPHA SENSORES</span>
            <svg className="w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-xs font-medium transition-colors",
                isActive
                  ? "text-primary border-l-4 border-primary bg-sidebar-accent"
                  : "text-sidebar-foreground hover:bg-muted border-l-4 border-transparent"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-border">

        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-xs font-medium text-sidebar-foreground hover:bg-muted"
        >
          <span>Ajuda</span>
        </Link>
        <Link
          href="/minha-conta"
          className="flex items-center gap-3 px-4 py-3 text-xs font-medium text-sidebar-foreground hover:bg-muted"
        >
          <Settings className="w-4 h-4" />
          <span>MINHA CONTA</span>
        </Link>
      </div>
    </aside>
  )
}
