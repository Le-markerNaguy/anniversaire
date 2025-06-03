import jwt from "jsonwebtoken"
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// POST /api/auth - Authentification admin
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password } = body

    // Validation
    if (!username || !password) {
      return NextResponse.json({ error: "Nom d'utilisateur et mot de passe requis" }, { status: 400 })
    }

    // Rechercher l'admin
    const admin = await prisma.admin.findFirst({
      where: { username },
    })

    if (!admin) {
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 })
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, admin.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 })
    }

    // Générer un JWT
    const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1d",
    })

    // Retourner le JWT dans la réponse JSON
    return NextResponse.json({ success: true, token })
  } catch (error) {
    console.error("Erreur lors de l'authentification:", error)
    return NextResponse.json({ error: "Erreur lors de l'authentification" }, { status: 500 })
  }
}

// GET /api/auth - Vérifie le JWT envoyé dans le header Authorization
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  const token = authHeader.replace("Bearer ", "")
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret")
    return NextResponse.json({ authenticated: true, user: decoded })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}

// DELETE /api/auth - Déconnexion (stateless, rien à faire)
export async function DELETE() {
  // Le client doit juste supprimer le JWT de son localStorage
  return NextResponse.json({ success: true })
}
