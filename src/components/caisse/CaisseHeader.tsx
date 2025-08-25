// src/components/caisse/CaisseHeader.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconSearch } from "@tabler/icons-react";

interface CaisseHeaderProps {
  onSearchReservation: (query: string) => void;
  isLoading?: boolean;
}

export function CaisseHeader({ onSearchReservation, isLoading }: CaisseHeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = () => {
    onSearchReservation(searchQuery);
  };

  return (
    <div className="flex items-center justify-between space-x-4 p-4 border-b">
      <h1 className="text-2xl font-bold">Caisse</h1>
      <div className="flex space-x-2">
        <Input
          placeholder="Rechercher réservation (ID, Nom client)"
          className="w-80"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          <IconSearch className="mr-2 h-4 w-4" /> Rechercher
        </Button>
      </div>
    </div>
  );
}