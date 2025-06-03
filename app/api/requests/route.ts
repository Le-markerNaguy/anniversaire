import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/requests - Récupérer toutes les demandes (protégée par un header simple)
export async function GET(req: NextRequest) {
  // Vérifier le header de protection (exemple simple, non sécurisé pour production)
  const authHeader = req.headers.get('X-Admin-Proof');

  if (authHeader !== 'mysecretflag') { // Utiliser une valeur secrète partagée
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const requests = await prisma.request.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(requests)
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des demandes" }, { status: 500 })
  }
}

// POST /api/requests - Créer une nouvelle demande
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, message } = body

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Nom, email et message sont requis" }, { status: 400 })
    }

    const request = await prisma.request.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
      },
    })

    return NextResponse.json(request, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de la demande:", error)
    return NextResponse.json({ error: "Erreur lors de la création de la demande" }, { status: 500 })
  }
}  

