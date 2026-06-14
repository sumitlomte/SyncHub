import { redirect } from "@tanstack/react-router"
import { userStore } from "../store/Auth-store"

export default function requireAuth() {
    const { user } = userStore.get()
    if (!user) {
        throw redirect ({ 
            to: "/login",
            replace: true,
     })
    }
    return user
}