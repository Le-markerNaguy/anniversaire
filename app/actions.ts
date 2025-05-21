"use server"

import { revalidatePath } from "next/cache"
import fs from "fs"
import path from "path"

// Dans un vrai projet, on utiliserait une base de données
// Ici, on utilise un fichier JSON pour stocker les demandes
const DATA_FILE = path.join(process.cwd(), "data", "requests.json")

// Assurer que le dossier data existe
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]))
  }
}

// Type pour les demandes
export type Request = {
  id: string
  name: string
  email: string
  phone: string
  date: string
  message: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

// Récupérer toutes les demandes
export async function getRequests(): Promise<Request[]> {
  ensureDataDir()

  try {
    const data = fs.readFileSync(DATA_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Erreur lors de la lecture des demandes:", error)
    return []
  }
}

// Soumettre une nouvelle demande
export async function submitRequest(formData: FormData) {
  ensureDataDir()

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const date = formData.get("date") as string
  const message = formData.get("message") as string

  if (!name || !email || !message) {
    throw new Error("Informations manquantes")
  }

  try {
    const requests = await getRequests()

    const newRequest: Request = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      date,
      message,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    requests.push(newRequest)

    fs.writeFileSync(DATA_FILE, JSON.stringify(requests, null, 2))
    revalidatePath("/admin")

    return { success: true }
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la demande:", error)
    throw new Error("Erreur lors de l'enregistrement de la demande")
  }
}

// Mettre à jour le statut d'une demande
export async function updateRequestStatus(id: string, status: "approved" | "rejected") {
  try {
    const requests = await getRequests()
    const updatedRequests = requests.map((request) => (request.id === id ? { ...request, status } : request))

    fs.writeFileSync(DATA_FILE, JSON.stringify(updatedRequests, null, 2))
    revalidatePath("/admin")

    return { success: true }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error)
    throw new Error("Erreur lors de la mise à jour du statut")
  }
}
