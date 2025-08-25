"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, XCircle, AlertTriangle, RefreshCw, 
  Server, Database, Wifi, Settings 
} from 'lucide-react';

interface ApiStatus {
  backend: 'checking' | 'online' | 'offline' | 'error';
  database: 'checking' | 'online' | 'offline' | 'error';
  endpoints: {
    etablissements: 'checking' | 'online' | 'offline' | 'error';
    stats: 'checking' | 'online' | 'offline' | 'error';
  };
}

export function ApiDiagnostic() {
  const [status, setStatus] = useState<ApiStatus>({
    backend: 'checking',
    database: 'checking',
    endpoints: {
      etablissements: 'checking',
      stats: 'checking'
    }
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkBackend = async () => {
    try {
      const response = await fetch('http://localhost:8000/docs', { 
        method: 'GET',
        mode: 'no-cors' // Pour éviter les erreurs CORS
      });
      return 'online';
    } catch (error) {
      console.error('Backend check failed:', error);
      return 'offline';
    }
  };

  const checkEndpoint = async (endpoint: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        return 'online';
      } else {
        return 'error';
      }
    } catch (error) {
      console.error(`Endpoint ${endpoint} check failed:`, error);
      return 'offline';
    }
  };

  const runDiagnostic = async () => {
    setIsChecking(true);
    
    // Vérifier le backend
    const backendStatus = await checkBackend();
    setStatus(prev => ({ ...prev, backend: backendStatus }));
    
    if (backendStatus === 'online') {
      // Vérifier les endpoints
      const [etablissementsStatus, statsStatus] = await Promise.all([
        checkEndpoint('/etablissement'),
        checkEndpoint('/typeEtab')
      ]);
      
      setStatus(prev => ({
        ...prev,
        endpoints: {
          etablissements: etablissementsStatus,
          stats: statsStatus
        }
      }));
    }
    
    setIsChecking(false);
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'offline':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      online: 'bg-green-100 text-green-800',
      offline: 'bg-red-100 text-red-800',
      error: 'bg-orange-100 text-orange-800',
      checking: 'bg-blue-100 text-blue-800'
    };
    
    const labels = {
      online: 'En ligne',
      offline: 'Hors ligne',
      error: 'Erreur',
      checking: 'Vérification...'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Diagnostic API
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Statut du backend */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(status.backend)}
            <div>
              <div className="font-medium flex items-center gap-2">
                <Server className="h-4 w-4" />
                Serveur Backend
              </div>
              <div className="text-sm text-muted-foreground">
                http://localhost:8000
              </div>
            </div>
          </div>
          {getStatusBadge(status.backend)}
        </div>

        {/* Endpoints */}
        {status.backend === 'online' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(status.endpoints.etablissements)}
                <div>
                  <div className="font-medium">API Établissements</div>
                  <div className="text-sm text-muted-foreground">
                    /api/etablissement
                  </div>
                </div>
              </div>
              {getStatusBadge(status.endpoints.etablissements)}
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(status.endpoints.stats)}
                <div>
                  <div className="font-medium">API Statistiques</div>
                  <div className="text-sm text-muted-foreground">
                    /api/typeEtab
                  </div>
                </div>
              </div>
              {getStatusBadge(status.endpoints.stats)}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            onClick={runDiagnostic} 
            disabled={isChecking}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Vérification...' : 'Vérifier à nouveau'}
          </Button>
        </div>

        {/* Conseils de dépannage */}
        {status.backend === 'offline' && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Le serveur backend n'est pas accessible.</strong>
              <br />
              • Vérifiez que le serveur est démarré sur le port 8000
              <br />
              • Exécutez <code className="bg-gray-100 px-1 rounded">cd backend && python start_server.py</code>
              <br />
              • Ou utilisez <code className="bg-gray-100 px-1 rounded">start_server.bat</code> sur Windows
            </AlertDescription>
          </Alert>
        )}

        {status.backend === 'online' && (status.endpoints.etablissements === 'offline' || status.endpoints.stats === 'offline') && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Le serveur est en ligne mais certains endpoints ne répondent pas.</strong>
              <br />
              • Vérifiez les logs du serveur backend
              <br />
              • Assurez-vous que la base de données PostgreSQL est accessible
              <br />
              • Vérifiez la configuration dans le fichier .env
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
} 