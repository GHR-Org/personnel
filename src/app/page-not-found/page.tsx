"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, AlertTriangle } from "lucide-react";

/**
 * 🌌 Page 404 immersive avec animation 3D et design moderne.
 * Inspirée par des interfaces futuristes et des transitions fluides.
 */
export default function NotFoundPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[100vh] overflow-hidden bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-950 text-center px-6 transition-colors duration-500">
      
      {/* Fond animé subtil */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Illustration 3D / Robot */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: [0, -10, 0], opacity: 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 mb-10"
      >
        <Image
          src="https://img.icons8.com/3d-fluency/400/robot-2.png"
          alt="Robot assistant perdu"
          width={200}
          height={200}
          className="drop-shadow-2xl"
        />
      </motion.div>

      {/* Titre principal */}
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-[8rem] sm:text-[10rem] font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 drop-shadow-lg select-none"
      >
        404
      </motion.h1>

      {/* Sous-titre */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="flex items-center gap-3 mt-4 mb-4"
      >
        <AlertTriangle className="w-6 h-6 text-red-500" />
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100">
          Oups, page introuvable
        </h2>
      </motion.div>

      {/* Message d’erreur */}
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed"
      >
        Le robot a perdu la connexion... ou peut-être que la page a été déplacée.
        <br />
        Pas de panique — tu peux toujours revenir à la base.
      </motion.p>

      {/* Bouton de retour */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-10"
      >
        <Link href="/" passHref>
          <Button
            variant="default"
            className="group relative px-6 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.05] hover:shadow-xl"
          >
            <Home className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
            Retourner à l’accueil
          </Button>
        </Link>
      </motion.div>

      {/* Message de bas de page */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.5, duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-8 text-sm text-gray-400 dark:text-gray-600"
      >
        Besoin d’aide ? <a href="/contact" className="underline hover:text-blue-400">Contactez le support</a>
      </motion.p>
    </div>
  );
}
