import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/sendEmail"
import { render } from "@react-email/render"
import { AcceptanceEmail } from "@/emails/AcceptanceEmail"
import * as React from "react"

// GET /api/requests/[id] - Récupérer une demande spécifique
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const request = await prisma.request.findUnique({
      where: { id },
    })

    if (!request) {
      return NextResponse.json({ error: "Demande non trouvée" }, { status: 404 })
    }

    return NextResponse.json(request)
  } catch (error) {
    console.error("Erreur lors de la récupération de la demande:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération de la demande" }, { status: 500 })
  }
}

// PATCH /api/requests/[id] - Mettre à jour le statut d'une demande
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await req.json();
    const { status } = body;

    // Validation: Seuls "APPROVED" et "PENDING" sont autorisés
    if (!status || !["APPROVED", "PENDING"].includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    const requestToUpdate = await prisma.request.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, status: true },
    });

    if (!requestToUpdate) {
      return NextResponse.json({ error: "Demande non trouvée" }, { status: 404 });
    }

    // Mise à jour du statut d'abord
    const updatedRequest = await prisma.request.update({
      where: { id },
      data: { status },
    });

    // Envoi d'email seulement si le statut change vers APPROVED
    if (requestToUpdate.status !== status && status === "APPROVED") {
      try {
        await sendEmail({
          to: requestToUpdate.email,
          subject: "Votre demande de participation acceptée !",
          template: "acceptance",
          templateProps: { name: requestToUpdate.name },
        });
      } catch (emailError) {
        console.error("Erreur d'envoi d'email:", emailError);
        // On retourne quand même la mise à jour mais avec un avertissement
        return NextResponse.json({
          ...updatedRequest,
          warning: "Statut mis à jour mais échec d'envoi de l'email"
        });
      }
    }

    return NextResponse.json(updatedRequest);

  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
    return NextResponse.json(
      { error: "Échec de la mise à jour du statut" },
      { status: 500 }
    );
  }
}

// DELETE /api/requests/[id] - Supprimer une demande
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 })
    }

    const deleted = await prisma.request.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, deleted })
  } catch (error: any) {
    let message = "Erreur lors de la suppression de la demande"
    if (error.code === "P2025") {
      message = "La demande n'existe plus ou a déjà été supprimée."
    }
    console.error("Erreur lors de la suppression de la demande:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
