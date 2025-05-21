"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast" 

export function RegistrationForm() {
  const [date, setDate] = useState<Date>()
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const formValues = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      date: date ? date.toISOString() : null,
      message: formData.get("message") as string,
    }

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Une erreur est survenue")
      }

      setSubmitted(true)
      toast({
        title: "Demande envoyée",
        description: "Votre demande a été envoyée avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors de la soumission:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="p-6 bg-green-50 rounded-lg border border-green-200">
        <h3 className="text-xl font-semibold text-green-800 mb-2">Demande envoyée !</h3>
        <p className="text-green-700">
          Votre demande de participation a été envoyée avec succès. L'organisateur examinera votre demande et vous
          recevrez une notification lorsqu'elle sera acceptée ou refusée.
        </p>
      </div>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet</Label>
          <Input id="name" name="name" placeholder="Votre nom" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="votre@email.com" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" name="phone" placeholder="Votre numéro de téléphone" />
        </div>

        <div className="space-y-2">
          <Label>Date d'arrivée souhaitée</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: fr }) : "Sélectionnez une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar 
                mode="single" 
                selected={date} 
                onSelect={setDate} 
                initialFocus 
                locale={fr} 
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Pourquoi souhaitez-vous participer ?</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Partagez quelques mots sur vous et pourquoi vous souhaitez participer..."
            required
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#e5ff00] to-[#a3ff00] text-gray-900 hover:from-[#d9f000] hover:to-[#97e800]"
        >
          {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
        </Button>
      </form>
    </>
  )
}