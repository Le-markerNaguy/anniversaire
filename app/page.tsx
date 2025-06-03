"use client"

import Image from "next/image"
import { RegistrationForm } from "@/components/registration-form"
import { PinkFlowerButton } from "@/components/pink-flower-button"

// === Configuration personnalisable pour l'anniversaire ===
const ANNIV_CONFIG = {
  title: "Invitation à mon anniversaire",
  intro: "Faites une demande pour participer à cet événement spécial !",
  formTitle: "Demande de participation",
  formSubtitle: "Remplissez le formulaire ci-dessous pour demander à participer à l'événement",
  backgroundImage: "/birthday-cake-fr.webp", // à adapter selon l'événement
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Fleurs décoratives positionnées */}
      <PinkFlowerButton className="fixed top-6 right-6 z-30 shadow-lg" onClick={() => window.location.href = '/admin/login'} />
      {/* 10 fleurs décoratives */}
      <Image src="/fleur-rose.svg" alt="Fleur décorative" width={40} height={40} className="absolute top-8 left-8 opacity-80 rotate-12" style={{zIndex: 10}} />
      <Image src="/fleur-rose.svg" alt="Fleur décorative" width={32} height={32} className="absolute top-1/4 left-1/3 opacity-70 -rotate-6" style={{zIndex: 10}} />
      <Image src="/fleur-rose.svg" alt="Fleur décorative" width={36} height={36} className="absolute top-1/2 left-10 opacity-60 rotate-3" style={{zIndex: 10}} />
      <Image src="/fleur-rose.svg" alt="Fleur décorative" width={28} height={28} className="absolute bottom-8 left-1/4 opacity-80 rotate-45" style={{zIndex: 10}} />
      <Image src="/fleur-rose.svg" alt="Fleur décorative" width={34} height={34} className="absolute bottom-16 right-1/3 opacity-70 -rotate-12" style={{zIndex: 10}} />
      <Image src="/fleur-rose.svg" alt="Fleur décorative" width={30} height={30} className="absolute top-1/3 right-12 opacity-60 rotate-6" style={{zIndex: 10}} />
      <Image src="/fleur-rose.svg" alt="Fleur décorative" width={38} height={38} className="absolute bottom-1/4 right-8 opacity-80 -rotate-24" style={{zIndex: 10}} />
      <Image src="/fleur-rose.svg" alt="Fleur décorative" width={26} height={26} className="absolute top-20 right-1/2 opacity-70 rotate-12" style={{zIndex: 10}} />
      <Image src="/fleur-rose.svg" alt="Fleur décorative" width={42} height={42} className="absolute bottom-10 left-1/2 opacity-60 -rotate-8" style={{zIndex: 10}} />
      <Image src="/fleur-rose.svg" alt="Fleur décorative" width={36} height={36} className="absolute bottom-1/3 right-1/4 opacity-70 rotate-18" style={{zIndex: 10}} />
      <Image src="/fleur-rose.svg" alt="Fleur décorative" width={30} height={30} className="absolute top-1/2 right-1/3 opacity-60 -rotate-6" style={{zIndex: 10}} />

      {/* Gradient section */}
      <div
        className="w-full md:w-1/2 relative flex flex-col justify-center items-center p-6 md:p-12"
        style={{
          backgroundImage: `linear-gradient(to bottom right, rgba(135,206,235,0.85), rgba(255,255,255,0.85)), url('${ANNIV_CONFIG.backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="max-w-md mx-auto text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{ANNIV_CONFIG.title}</h1>
          <p className="text-xl md:text-2xl text-gray-800 mb-8">
            {ANNIV_CONFIG.intro}
          </p>
        </div>
      </div>

      {/* White section with form */}
      <div className="w-full md:w-1/2 bg-white p-6 md:p-12 flex items-center">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{ANNIV_CONFIG.formTitle}</h2>
          <p className="text-gray-600 mb-8">
            {ANNIV_CONFIG.formSubtitle}
          </p>
          <RegistrationForm />
        </div>
      </div>
    </div>
  )
}
