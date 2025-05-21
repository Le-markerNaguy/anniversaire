import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { getIronSession } from "iron-session"
import { sessionOptions, IronSessionData } from "@/lib/session"

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

    // Authentication successful - Create session
    const response = NextResponse.json({ success: true })
    const session = await getIronSession<IronSessionData>(req, response, sessionOptions)
    session.adminId = admin.id // Store admin ID
    await session.save() // Save the session

    return response // Return the response with the session cookie
  } catch (error) {
    console.error("Erreur lors de l'authentification:", error)
    return NextResponse.json({ error: "Erreur lors de l'authentification" }, { status: 500 })
  }
}

// GET /api/auth - Verify Authentication (Check session)
export async function GET(req: NextRequest) {
  const response = new NextResponse()
  const session = await getIronSession<IronSessionData>(req, response, sessionOptions)

  if (session.adminId) {
    // Session exists and contains adminId, user is authenticated
    return NextResponse.json({ authenticated: true, user: { id: session.adminId } })
  } else {
    // No session or adminId not set, user is not authenticated
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}

// DELETE /api/auth - Logout (Destroy session)
export async function DELETE(req: NextRequest) {
  const response = new NextResponse()
  const session = await getIronSession<IronSessionData>(req, response, sessionOptions)
  await session.destroy() // Destroy the session
  return NextResponse.json({ success: true })
}
