/* eslint-disable @next/next/no-img-element */
// components/ImageUpload.tsx
import React, { useCallback, useState, useEffect } from 'react'; // Importer useEffect
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { X, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';

interface ImageUploadProps {
  // La valeur peut être une URL (pour affichage initial) ou l'objet File (si sélectionné)
  // On accepte 'any' ici pour être flexible car onChange renverra un File ou null
  // Mais la logique de prévisualisation gérera la string ou l'objet File
  value?: File | string | null; 
  onChange: (value: File | null) => void; // <-- Changer ici pour File | null
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  // Mise à jour de l'aperçu lorsque la 'value' change (ex: édition de plat)
  useEffect(() => {
    if (value instanceof File) {
      // Si c'est un nouvel objet File, créer un URL de prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(value);
    } else if (typeof value === 'string') {
      // Si c'est une URL ou une chaîne Base64 existante
      setPreview(value);
    } else {
      setPreview(null);
    }

    // Nettoyage de l'URL de l'objet si elle a été créée
    return () => {
      if (value instanceof File && preview) {
        // Optionnel: si vous avez utilisé URL.createObjectURL, le libérer
        // Dans ce cas, nous utilisons FileReader qui crée une chaîne Base64, pas une URL objet.
        // Donc, pas de nettoyage spécifique pour URL.createObjectURL ici.
      }
    };
  }, [value]);


  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onChange(file); // <-- PASSER L'OBJET FILE DIRECTEMENT ICI
        // setPreview se fera via l'effet de bord dû au changement de 'value'
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    disabled: disabled,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    noKeyboard: true,
    maxSize: 5 * 1024 * 1024, // 5MB maximum (valeur correcte ici)
  });

  const errors = fileRejections.map(({ file, errors }) => (
    <li key={file.name}>
      {file.name} - {errors.map(e => e.message).join(', ')}
    </li>
  ));

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null); // Réinitialise la valeur à null
    setPreview(null); // Réinitialise l'aperçu
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center h-50 border-2 border-dashed rounded-lg cursor-pointer transition",
          "hover:border-primary-foreground/50",
          isDragActive ? "border-primary-foreground/70 bg-secondary" : "border-muted-foreground/30 bg-muted",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        {preview && ( // Si preview existe (URL ou Base64)
          <div className="relative inset-0 flex items-center justify-center h-50 w-full">
            <img
              src={
+                preview.startsWith('data:') || preview.startsWith('blob:') ? preview : `${process.env.NEXT_PUBLIC_IMAGE_URL}/${preview}` } 
              alt="Aperçu de l'image"
              className="object-cover w-full h-full rounded-lg"
            />
            {!disabled && (
              <Button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        {!preview && (
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Glissez et déposez une image ici, ou cliquez pour sélectionner
            </p>
            <p className="text-xs text-muted-foreground">
              (JPG, JPEG, PNG, WEBP - Max 5MB)
            </p>
          </div>
        )}
      </div>
      {fileRejections.length > 0 && (
        <aside className="mt-2 text-sm text-red-500">
          <p>Fichiers rejetés :</p>
          <ul>{errors}</ul>
        </aside>
      )}
    </div>
  );
};

export default ImageUpload;