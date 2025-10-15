"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Client } from "@/types/client";
import { useQuery } from "@tanstack/react-query";
import { IconUserPlus, IconSearch } from "@tabler/icons-react";
import { getClientByEmail } from "@/func/api/clients/apiclient";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface ClientSelectorProps {
  onSelectClient: (clientId: number) => void;
  onNewClient: () => void;
}

const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export function ClientSelector({ onSelectClient, onNewClient }: ClientSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const isSearchEnabled = isEmailValid(searchTerm);

  const { data, isLoading, isError } = useQuery<Client[]>({
    queryKey: ['clientByEmail', searchTerm],
    queryFn: () => getClientByEmail(searchTerm),
    enabled: isSearchEnabled,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 shadow-lg space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        1. Sélectionner ou créer un client
      </h2>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Input
            placeholder="Rechercher par email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/30 dark:bg-gray-700/30 placeholder-gray-400"
          />
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <Button
          onClick={onNewClient}
          variant="outline"
          className="flex items-center gap-2 border border-gray-300 hover:bg-white/20 transition-colors"
        >
          <IconUserPlus className="h-5 w-5" /> Nouveau client
        </Button>
      </div>

      {isSearchEnabled && isLoading && (
        <p className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Recherche en cours...
        </p>
      )}

      {isError && (
        <p className="text-red-500 font-medium">Une erreur s&apos;est produite lors de la recherche.</p>
      )}

      {data && data.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          <p className="font-medium text-sm text-gray-600 dark:text-gray-300">Client(s) trouvé(s) :</p>
          {data.map((client) => (
            <motion.div
              key={client.id}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer bg-white/40 dark:bg-gray-700/40 hover:bg-white/60 dark:hover:bg-gray-600/40 transition-colors shadow-sm"
              onClick={() => onSelectClient(client.id)}
            >
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{client.first_name} {client.last_name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{client.email}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {isSearchEnabled && !isLoading && data?.length === 0 && (
        <p className="text-gray-500">Aucun client trouvé pour cet email. Créez un nouveau client.</p>
      )}

      {!isSearchEnabled && searchTerm.length > 0 && (
        <p className="text-gray-500">Veuillez entrer une adresse email valide pour rechercher.</p>
      )}
    </motion.div>
  );
}
