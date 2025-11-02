"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconRefresh, IconHome } from "@tabler/icons-react";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">¡Oops! Algo salió mal</CardTitle>
          <CardDescription className="text-center">
            Ha ocurrido un error inesperado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-6xl mb-4">😵</div>
            <p className="text-muted-foreground">
              No te preocupes, nuestros desarrolladores ya están trabajando en
              solucionarlo.
            </p>
          </div>

          <div className="space-y-2">
            <Button onClick={reset} className="w-full">
              <IconRefresh className="h-4 w-4 mr-2" />
              Intentar de nuevo
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <a href="/">
                <IconHome className="h-4 w-4 mr-2" />
                Volver al inicio
              </a>
            </Button>
          </div>

          {process.env.NODE_ENV === "development" && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-muted-foreground">
                Detalles del error (desarrollo)
              </summary>
              <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
