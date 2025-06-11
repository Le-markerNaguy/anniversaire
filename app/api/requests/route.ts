import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/sendEmail"
import { AcceptanceEmail } from "@/emails/AcceptanceEmail"

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
    const body = await req.json();
    const { name, email, phone, message } = body;

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { error: "Le nom et l'email sont requis" },
        { status: 400 }
      );
    }

    // Générer un code d'accès aléatoire (ex: "ABC123")
    const accessCode = generateAccessCode();

    const request = await prisma.request.create({
      data: {
        name,
        email,
        phone: phone || null,
        message: message || null,
        accessCode, // Stocker le code dans la base de données
      },
    });

    // Envoyer l'email avec le code
    try {
      await sendEmail({
        to: email,
        subject: "Confirmation de participation - Votre code d'accès",
        template: "acceptance",
        templateProps: { 
          name,
          accessCode, // Passer le code au template
        },
      });
      console.log(`Email de confirmation envoyé à ${email}`);
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", emailError);
    }

    return NextResponse.json(request, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la demande:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la demande" },
      { status: 500 }
    );
  }
}

// Fonction pour générer un code d'accès aléatoire
function generateAccessCode() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  let code = '';
  // 3 lettres
  for (let i = 0; i < 3; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  // 3 chiffres
  for (let i = 0; i < 3; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return code;
}