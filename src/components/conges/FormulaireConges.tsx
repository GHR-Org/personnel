/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/conges/FormulaireConge.tsx

import React, { useState, useEffect } from 'react';
import { CongeType } from '@/types/conge';
import { CongeSchema } from '@/schemas/conge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, ArrowRight, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Check, User } from "lucide-react";
import { getPersonnelByIdEtab } from '@/func/api/personnel/apipersonnel';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";

// Le type du formulaire ne contient plus le fichier
const FormSchema = z.object({
  type: z.nativeEnum(CongeType),
  personnel_id: z.number().int().positive(),
  dateDebut: z.string().datetime(),
  dateFin: z.string().datetime(),
  raison: z.string(),
});

type FormFields = z.infer<typeof FormSchema>;

interface Personnel {
  id: number;
  nom: string;
  photoUrl?: string;
}

interface FormulaireCongeProps {
  initialData?: FormFields;
  onSave: (conge: FormData) => void; // La fonction onSave accepte maintenant FormData
  onCancel: () => void;
  etablissementId: number;
}

const FormulaireConge: React.FC<FormulaireCongeProps> = ({ onSave, onCancel, initialData, etablissementId }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [personnelList, setPersonnelList] = useState<Personnel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fichierJoint, setFichierJoint] = useState<File | null>(null);

  const form = useForm<FormFields>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: initialData?.type || CongeType.VACANCE,
      personnel_id: initialData?.personnel_id || 0,
      dateDebut: initialData?.dateDebut || '',
      dateFin: initialData?.dateFin || '',
      raison: initialData?.raison || '',
    }
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    watch
  } = form;

  const watchedPersonnelId = watch('personnel_id');
  const watchedDateDebut = watch('dateDebut');
  const watchedDateFin = watch('dateFin');

  useEffect(() => {
    const fetchPersonnel = async () => {
      setIsLoading(true);
      try {
        const data = await getPersonnelByIdEtab(etablissementId);
        setPersonnelList(data);
      } catch (error) {
        console.error("Échec du chargement de la liste du personnel:", error);
        setPersonnelList([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (etablissementId) {
      fetchPersonnel();
    }
  }, [etablissementId]);

  const handlePersonnelSelect = (personnelId: number) => {
    setValue('personnel_id', personnelId);
  };

  const handleNextStep = () => {
    if (watchedPersonnelId !== 0) {
      setCurrentStep(2);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFichierJoint(file);
  };

  const removeFile = () => {
    setFichierJoint(null);
  };
  
  // À l'intérieur de votre composant
const onSubmit: SubmitHandler<FormFields> = (data) => {
  const formData = new FormData();
  
  // Ajoutez les champs requis par le backend
  formData.append('type', data.type);
  formData.append('personnel_id', String(data.personnel_id));
  formData.append('dateDebut', data.dateDebut);
  formData.append('dateFin', data.dateFin);
  formData.append('raison', data.raison);
  formData.append('dateDmd', new Date().toISOString());
  
  // Ajoutez le fichier joint.
  // Le champ 'fichierJoin' est aussi attendu, même s'il n'est pas un fichier pour toutes les requêtes.
  // Si le fichier est facultatif sur le backend, il vous faudra le gérer.
  if (fichierJoint) {
    formData.append('fichierJoin', fichierJoint);
  }
  
  // Appelez votre fonction onSave avec le FormData
  onSave(formData as any);
};

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full border ${currentStep === 1 ? 'border-blue-500' : 'border-gray-300'}`}>
            <User className={`h-4 w-4 ${currentStep === 1 ? 'text-blue-500' : 'text-gray-500'}`} />
          </div>
          <p className="text-sm font-medium">Sélection du Personnel</p>
        </div>
        <div className="flex-grow h-px bg-gray-300"></div>
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full border ${currentStep === 2 ? 'border-blue-500' : 'border-gray-300'}`}>
            <CalendarIcon className={`h-4 w-4 ${currentStep === 2 ? 'text-blue-500' : 'text-gray-500'}`} />
          </div>
          <p className="text-sm font-medium">Demande de Congé</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500">Chargement de la liste du personnel...</div>
      ) : (
        <>
          {currentStep === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <p className="md:col-span-2 lg:col-span-4 text-muted-foreground">Veuillez sélectionner le personnel pour lequel vous souhaitez créer une demande de congé.</p>
                {personnelList.length > 0 ? (
                  personnelList.map((personnel) => (
                    <Card
                      key={personnel.id}
                      onClick={() => handlePersonnelSelect(personnel.id)}
                      className={cn("cursor-pointer hover:border-blue-500 transition-colors relative", watchedPersonnelId === personnel.id && 'border-blue-500 ring-2 ring-blue-500')}
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{personnel.nom}</CardTitle>
                        {watchedPersonnelId === personnel.id && (
                          <Check className="h-4 w-4 text-blue-500" />
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="text-xs text-muted-foreground">ID: {personnel.id}</div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="md:col-span-2 lg:col-span-4 text-center text-muted-foreground">Aucun personnel trouvé pour cet établissement.</p>
                )}
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={handleNextStep} disabled={watchedPersonnelId === 0}>
                  Suivant <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </>
      )}

      {currentStep === 2 && (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold">Demande de congé pour ID : {watchedPersonnelId}</h4>
            <CardDescription>Remplissez les informations ci-dessous pour ajouter un congé.</CardDescription>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type de Congé</Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(CongeType).map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateDebut">Date de Début</Label>
            <Controller
              control={control}
              name="dateDebut"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(new Date(field.value), "PPP") : <span>Sélectionner une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        field.onChange(date ? date.toISOString() : '');
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.dateDebut && <p className="text-red-500 text-sm">{errors.dateDebut.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateFin">Date de Fin</Label>
            <Controller
              control={control}
              name="dateFin"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(new Date(field.value), "PPP") : <span>Sélectionner une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? date.toISOString() : '')}
                      initialFocus
                      disabled={(date) => watchedDateDebut ? date < new Date(watchedDateDebut) : false}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.dateFin && <p className="text-red-500 text-sm">{errors.dateFin.message}</p>}
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="raison">Raison / Description</Label>
            <Textarea
              id="raison"
              {...register('raison')}
              placeholder="Détails de la demande (optionnel)"
            />
            {errors.raison && <p className="text-red-500 text-sm">{errors.raison.message}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="fichierJoin">Fichier joint</Label>
            <div className="flex items-center gap-2">
              <Input
                id="fichierJoin"
                type="file"
                onChange={handleFileChange}
              />
              {fichierJoint && (
                <div className="flex items-center gap-2 border p-2 rounded">
                  <p className="text-sm truncate">{fichierJoint.name}</p>
                  <Button type="button" variant="ghost" size="icon" onClick={removeFile}>
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              )}
            </div>
            {/* Les erreurs pour le fichier sont gérées par la validation back-end */}
          </div>

          <div className="md:col-span-2 flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>Précédent</Button>
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FormulaireConge;