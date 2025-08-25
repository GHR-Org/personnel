"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { EquipmentDetailsModal } from "./EquipmentDetailsModal";
import { Equipment } from "@/lib/stores/maintenance_store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

interface EquipmentTableProps {
  equipments: Equipment[];
  columns: readonly { key: keyof Equipment; label: string }[];
}

const statusColorMap: Record<Equipment["status"], string> = {
  Fonctionnel: "bg-green-500",
  "En Maintenance": "bg-yellow-500",
  "Hors service": "bg-blue-800",
  "En panne": "bg-red-700",
};

export function EquipmentTable({ equipments, columns }: EquipmentTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  const handleOpenDetails = (equip: Equipment) => {
    setSelectedEquipment(equip);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEquipment(null);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            Liste des équipements
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          {equipments.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12">
              <p className="mt-4 text-lg font-medium text-gray-500 dark:text-gray-400">
                Aucun équipement trouvé.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-600">
                Commencez par ajouter votre premier équipement.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead
                      key={`head-${column.key}`}
                      className="text-gray-500 dark:text-gray-400 font-normal"
                    >
                      {column.label}
                    </TableHead>
                  ))}
                  <TableHead
                    key="actions-head"
                    className="text-right text-gray-500 dark:text-gray-400 font-normal"
                  >
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipments.map((equip) => (
                  <TableRow key={equip.id} className="hover:bg-muted/50">
                    <TableCell key={`${equip.id}-id`} className="font-mono text-sm">
                      {equip.id}
                    </TableCell>
                    <TableCell key={`${equip.id}-nom`} className="font-medium">
                      {equip.nom}
                    </TableCell>
                    <TableCell key={`${equip.id}-loc`}>
                      {equip.localisation}
                    </TableCell>
                    <TableCell key={`${equip.id}-status`}>
                      <Badge
                        key={`${equip.id}-badge`}
                        className={statusColorMap[equip.status]}
                      >
                        {equip.status}
                      </Badge>
                    </TableCell>
                    <TableCell key={`${equip.id}-actions`} className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            key={`${equip.id}-details`}
                            onClick={() => handleOpenDetails(equip)}
                          >
                            Voir les détails
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedEquipment && (
        <EquipmentDetailsModal
          equipment={selectedEquipment}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
