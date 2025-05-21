"use client"

import { useEffect, useState } from "react"
import { AdminRequestList } from "@/components/admin-request-list"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function AdminPage() {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/requests", {
          headers: {
            'X-Admin-Proof': 'mysecretflag',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/admin");
            return;
          }
          throw new Error("Erreur lors de la récupération des demandes");
        }

        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error("Erreur:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les demandes",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [toast, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", {
        method: "DELETE",
      })

      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      console.error("Erreur de déconnexion:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Chargement des demandes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Gestion des demandes</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Déconnexion
          </Button>
        </div>

        <AdminRequestList requests={requests} />
      </div>
    </div>
  )
}
