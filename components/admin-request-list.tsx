"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CheckIcon, XIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Request {
  id: string
  name: string
  email: string
  phone: string | null
  date: string | null
  message: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: string
}

interface AdminRequestListProps {
  requests: Request[]
}

export function AdminRequestList({ requests: initialRequests }: AdminRequestListProps) {
  const [requests, setRequests] = useState<Request[]>(initialRequests)
  const [updating, setUpdating] = useState<string | null>(null)
  const { toast } = useToast()

  const handleUpdateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    setUpdating(id)
    try {
      const response = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du statut")
      }

      const updatedRequest = await response.json()
      setRequests(requests.map((request) => (request.id === id ? updatedRequest : request)))

      toast({
        title: "Statut mis à jour",
        description: `La demande a été ${status === "APPROVED" ? "approuvée" : "refusée"}.`,
      })
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer définitivement cet invité ?")) return
    try {
      const response = await fetch(`/api/requests/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la suppression")
      }
      setRequests(requests.filter((r) => r.id !== id))
      toast({
        title: "Invité supprimé",
        description: "La demande a été supprimée avec succès.",
      })
    } catch (error) {
      console.error("Erreur suppression:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la demande.",
        variant: "destructive",
      })
    }
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucune demande de participation pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600">
          En attente: {requests.filter((r) => r.status === "PENDING").length}
        </Badge>
        <Badge variant="secondary" className="bg-green-500/20 text-green-600">
          Approuvées: {requests.filter((r) => r.status === "APPROVED").length}
        </Badge>
        <Badge variant="secondary" className="bg-red-500/20 text-red-600">
          Refusées: {requests.filter((r) => r.status === "REJECTED").length}
        </Badge>
      </div>

      {requests.map((request) => (
        <Card key={request.id} className="overflow-hidden">
          <CardHeader className="relative">
            <div className="absolute top-4 right-4">
              {request.status === "PENDING" && (
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600">
                  En attente
                </Badge>
              )}
              {request.status === "APPROVED" && (
                <Badge variant="secondary" className="bg-green-500/20 text-green-600">
                  Approuvée
                </Badge>
              )}
              {request.status === "REJECTED" && (
                <Badge variant="secondary" className="bg-red-500/20 text-red-600">
                  Refusée
                </Badge>
              )}
            </div>
            <CardTitle>{request.name}</CardTitle>
            <div className="text-sm text-muted-foreground">
              <div className="flex flex-col gap-1 mt-1">
                <span>Email: {request.email}</span>
                {request.phone && <span>Téléphone: {request.phone}</span>}
                {request.date && (
                  <span>Date souhaitée: {format(new Date(request.date), "PPP", { locale: fr })}</span>
                )}
                <span>Demande faite le: {format(new Date(request.createdAt), "PPP", { locale: fr })}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-gray-700 whitespace-pre-wrap">{request.message}</div>
          </CardContent>

          <CardFooter className="bg-gray-50/50 flex justify-end gap-2">
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50"
              onClick={() => handleDelete(request.id)}
            >
              Supprimer
            </Button>
            {request.status === "PENDING" ? (
              <>
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  onClick={() => handleUpdateStatus(request.id, "REJECTED")}
                  disabled={updating === request.id}
                >
                  <XIcon className="h-4 w-4 mr-2" />
                  Refuser
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleUpdateStatus(request.id, "APPROVED")}
                  disabled={updating === request.id}
                >
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Approuver
                </Button>
              </>
            ) : (
              <div className="flex items-center text-sm text-gray-600">
                {request.status === "APPROVED" ? (
                  <span className="flex items-center">
                    <CheckIcon className="h-4 w-4 text-green-600 mr-1" />
                    Demande approuvée
                  </span>
                ) : (
                  <span className="flex items-center">
                    <XIcon className="h-4 w-4 text-red-600 mr-1" />
                    Demande refusée
                  </span>
                )}
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}