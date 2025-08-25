import { SuperAdminGuard } from "@/components/auth-guard"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SuperAdminGuard>
      {children}
    </SuperAdminGuard>
  )
} 