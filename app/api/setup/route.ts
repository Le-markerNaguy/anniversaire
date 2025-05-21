import { type NextRequest, NextResponse } from "next/server"
import  {prisma} from "@/lib/prisma"
import bcrypt from "bcryptjs"

// POST /api/setup - Créer un compte admin initial
export async function POST(req: NextRequest) {
  try {
    // Vérifier si un admin existe déjà
    const adminCount = await prisma.admin.count()

    if (adminCount > 1) {
      return NextResponse.json({ error: "Un compte admin existe déjà" }, { status: 400 })
    }

    const body = await req.json()
    const { username, password } = body

    // Validation
    if (!username || !password || password.length < 6) {
      return NextResponse.json(
        { error: "Nom d'utilisateur et mot de passe (6 caractères min.) requis" },
        { status: 400 },
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Créer l'admin
    const admin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
      },
    })

    return NextResponse.json({ success: true, id: admin.id }, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création du compte admin:", error)
    return NextResponse.json({ error: "Erreur lors de la création du compte admin" }, { status: 500 })
  }
}
