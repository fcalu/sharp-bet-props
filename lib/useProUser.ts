import { useState } from "react"

export function useProUser() {
  // 🔒 Por ahora simulado
  const [isProUser, setIsProUser] = useState(false)

  return {
    isProUser,
    upgradeToPro: () => setIsProUser(true),
  }
}
