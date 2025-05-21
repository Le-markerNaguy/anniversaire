"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export function AdminLogin() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Appel à l'API d'authentification
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
        credentials: 'include' // Important pour les cookies
      })

      if (response.ok) {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté en tant qu'administrateur.",
        })
        router.push('/admin')
        router.refresh() // Force l'actualisation du statut d'authentification
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Échec de la connexion")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Une erreur est survenue")
      toast({
        title: "Erreur de connexion",
        description: error instanceof Error ? error.message : "Erreur inconnue",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe administrateur</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Entrez le mot de passe"
          required
          autoComplete="current-password"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-[#e5ff00] to-[#a3ff00] text-gray-900"
        disabled={loading}
      >
        {loading ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  )
}