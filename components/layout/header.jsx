"use client"

import { Search, HelpCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Header({ userName = "YO" }) {
  return (
    <header className="h-14 bg-white border-b border-border flex items-center justify-between px-6">
      {/* Left side - can be used for breadcrumbs or page title */}
      <div></div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">MEU PLANO</span>
        <span className="text-sm text-muted-foreground">GUIA INICIAL</span>
        <span className="text-sm text-muted-foreground">AJUDA</span>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Busca rápida" 
            className="pl-9 w-48 h-9 text-sm bg-muted/50"
          />
        </div>

        <Avatar className="h-9 w-9 bg-primary">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
            {userName}
          </AvatarFallback>
        </Avatar>

        <button className="text-muted-foreground hover:text-foreground">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </header>
  )
}
