import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/sendEmail"

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
    const id = params.id
    const body = await req.json()
    const { status } = body

    // Validation
    if (!status || !["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 })
    }

    // Fetch the request before updating to get email and name
    const requestToUpdate = await prisma.request.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, status: true },
    });

    if (!requestToUpdate) {
      return NextResponse.json({ error: "Demande non trouvée" }, { status: 404 });
    }

    // Only send email if status is changing to APPROVED or REJECTED
    if (requestToUpdate.status !== status && (status === "APPROVED" || status === "REJECTED")) {
      try {
        await prisma.request.update({
          where: { id },
          data: { status },
        });

        // Send email based on the new status
        if (status === "APPROVED") {
          await sendEmail({
            to: requestToUpdate.email,
            subject: "Votre demande de participation acceptée !",
            template: 'acceptance',
            templateProps: { name: requestToUpdate.name },
          });
        } else if (status === "REJECTED") {
          await sendEmail({
            to: requestToUpdate.email,
            subject: "Mise à jour concernant votre demande de participation",
            template: 'rejection',
            templateProps: { name: requestToUpdate.name },
          });
        }

        return NextResponse.json({ ...requestToUpdate, status });

      } catch (emailError) {
        console.error("Erreur lors de l'envoi de l'email:", emailError);
        // Decide how to handle email sending errors: return error or proceed?
        // For now, we'll log and return the successful status update response.
        return NextResponse.json({ ...requestToUpdate, status, email_error: "Erreur lors de l'envoi de l'email" });
      }
    } else {
       // If status is not changing or not to APPROVED/REJECTED, just update without sending email
       const updatedRequest = await prisma.request.update({
        where: { id },
        data: { status },
      });
       return NextResponse.json(updatedRequest);
    }

  } catch (error) {
    console.error("Erreur lors de la mise à jour de la demande:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour de la demande" }, { status: 500 })
  }
}

// DELETE /api/requests/[id] - Supprimer une demande
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    await prisma.request.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression de la demande:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression de la demande" }, { status: 500 })
  }
}
