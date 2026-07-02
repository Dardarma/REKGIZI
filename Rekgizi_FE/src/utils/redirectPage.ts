import type { Router } from "vue-router"

export const roleRoutes: Record<string, string> = {
  ahli_gizi: "/ahligizi",
  admin: "/admin/user",
  pasien: "/user"
}

export const redirectPage = (router: Router, role: string) => {
  const path = roleRoutes[role] || "/login"
  router.push(path)
}