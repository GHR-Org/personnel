/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ui/page-header.tsx
"use client"
import { cn } from "@/lib/utils"
import { RefreshCwIcon } from "lucide-react"
import { Button } from "./button"
import { getPlatsByEtablissement } from "@/func/api/plat/APIplat"


interface PageHeaderProps {
  title: string
  description?: string
  className?: string
}
const etablissement_id = 1
const FetchData = async() => {
  try{
    
    await getPlatsByEtablissement(etablissement_id)
    window.location.reload();
  }
  catch(error : any){
    console.error("Erreur lors de la récupération des plats :", error);
  }
}
export function PageHeader({ title, description, className }: PageHeaderProps) {
  const handleClick = async (e : any) => {
    e.preventDefault();
    await FetchData()
  }
  return (
    <div className={cn("space-y-1 flex align-center justify-between flex-row pb-8", className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      <div>
        <Button variant="default" className="flex justify-center items-center" onClick={handleClick}>
          <RefreshCwIcon className="w-4 h-4 "/>
          Rafraîchir
        </Button>
        
      </div>
      
    </div>
  )
}
