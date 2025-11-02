"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconUpload, IconX, IconCheck } from "@tabler/icons-react";
import { toast } from "sonner";

interface CloudinaryUploadProps {
  onImagesChange: (images: string[]) => void;
  currentImages?: string[];
  maxImages?: number;
}

export function CloudinaryUpload({
  onImagesChange,
  currentImages = [],
  maxImages = 5,
}: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<string[]>(currentImages);

  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;

    const filesArray = Array.from(files);

    // Validar cantidad máxima
    if (images.length + filesArray.length > maxImages) {
      toast.error(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = filesArray.map(async (file) => {
        // Validar tipo de archivo
        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} no es una imagen válida`);
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} es muy grande. Máximo 5MB`);
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "yerbashop_products"); // Preset de Cloudinary

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Error al subir ${file.name}`);
        }

        const data = await response.json();
        return data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedUrls];

      setImages(newImages);
      onImagesChange(newImages);

      toast.success(`${uploadedUrls.length} imagen(es) subida(s) exitosamente`);
    } catch (error: any) {
      toast.error(error.message || "Error al subir las imágenes");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <Card>
        <CardContent className="p-6">
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <IconUpload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Subir Imágenes</h3>
            <p className="text-muted-foreground mb-4">
              Arrastra y suelta las imágenes aquí o haz clic para seleccionar
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Máximo {maxImages} imágenes, 5MB cada una
            </p>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleFileUpload(e.target.files)
              }
              className="hidden"
              id="image-upload"
              disabled={isUploading || images.length >= maxImages}
            />

            <Button
              asChild
              variant="outline"
              disabled={isUploading || images.length >= maxImages}
            >
              <label htmlFor="image-upload" className="cursor-pointer">
                {isUploading ? "Subiendo..." : "Seleccionar Imágenes"}
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview de imágenes */}
      {images.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">
              Imágenes ({images.length}/{maxImages})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {images.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={imageUrl}
                      alt={`Producto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Badge de imagen principal */}
                  {index === 0 && (
                    <Badge className="absolute top-2 left-2 text-xs">
                      Principal
                    </Badge>
                  )}

                  {/* Botón eliminar */}
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <IconX className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            {images.length > 1 && (
              <p className="text-xs text-muted-foreground mt-4">
                💡 La primera imagen será la imagen principal del producto
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
