"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Save, Settings, Bell, Shield, Zap, Palette, AlertTriangle, CheckCircle } from "lucide-react";
import { adminConfigAPI } from "@/lib/func/api/admin";

export default function ConfigurationPage() {
  // States pour chaque config
  const [system, setSystem] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [security, setSecurity] = useState(null);
  const [integrations, setIntegrations] = useState(null);
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [tab, setTab] = useState("system");
  const [error, setError] = useState(null);

  // Charger la configuration initiale
  const loadConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const configData = await adminConfigAPI.getSystemConfig();
      
      if (configData.status === "success" && configData.data) {
        setSystem(configData.data.system || {});
        setNotifications(configData.data.notifications || {});
        setSecurity(configData.data.security || {});
        setIntegrations(configData.data.integrations || {});
        setTheme(configData.data.theme || {});
      } else {
        throw new Error("Format de données invalide");
      }
      
      toast.success("Configuration chargée avec succès");
    } catch (error) {
      console.error("Erreur chargement config:", error);
      setError(error.message || "Erreur lors du chargement de la configuration");
      toast.error("Erreur lors du chargement de la configuration");
      
      // Fallback avec des valeurs par défaut
      setSystem({
        maintenance_mode: false,
        maintenance_message: "Système en maintenance",
        max_establishments_per_user: 5,
        auto_backup_enabled: true,
        backup_frequency_hours: 24,
        data_retention_days: 365,
        max_file_size_mb: 10,
        session_timeout_minutes: 30,
        password_policy_min_length: 8,
        password_policy_require_special: true,
        two_factor_required: false,
        api_rate_limit_per_minute: 100,
        email_notifications_enabled: true,
        sms_notifications_enabled: false,
        push_notifications_enabled: true
      });
      setNotifications({
        email_enabled: true,
        sms_enabled: false,
        push_enabled: true,
        new_establishment_notification: true,
        low_performance_alert: true,
        security_alert: true,
        system_maintenance_notification: true,
        weekly_report_enabled: true,
        monthly_report_enabled: true,
        alert_threshold_establishments: 10,
        alert_threshold_growth_rate: 5.0
      });
      setSecurity({
        password_expiry_days: 90,
        max_login_attempts: 5,
        lockout_duration_minutes: 30,
        ip_whitelist_enabled: false,
        ip_whitelist: [],
        session_encryption: true,
        audit_log_enabled: true,
        data_encryption_at_rest: true,
        ssl_required: true,
        api_key_rotation_days: 30
      });
      setIntegrations({
        payment_gateway_enabled: true,
        payment_gateway_provider: "stripe",
        sms_gateway_enabled: false,
        sms_gateway_provider: "twilio",
        email_service_enabled: true,
        email_service_provider: "sendgrid",
        analytics_enabled: true,
        analytics_provider: "google_analytics",
        backup_service_enabled: true,
        backup_service_provider: "aws_s3"
      });
      setTheme({
        primary_color: "#3B82F6",
        secondary_color: "#10B981",
        accent_color: "#F59E0B",
        dark_mode_enabled: true,
        custom_css_enabled: false,
        custom_css: "",
        logo_url: "/images/logo.png",
        favicon_url: "/favicon.ico"
      });
    } finally {
      setLoading(false);
    }
  };

  // Sauvegarder la configuration système
  const saveSystemConfig = async () => {
    if (!system) return;
    
    try {
      setSaving(prev => ({ ...prev, system: true }));
      
      const response = await adminConfigAPI.updateSystemConfig(system);
      
      if (response.status === "success") {
        toast.success("Configuration système sauvegardée");
      } else {
        throw new Error(response.message || "Erreur lors de la sauvegarde");
      }
    } catch (error) {
      console.error("Erreur sauvegarde système:", error);
      toast.error(error.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(prev => ({ ...prev, system: false }));
    }
  };

  // Sauvegarder la configuration des notifications
  const saveNotificationConfig = async () => {
    if (!notifications) return;
    
    try {
      setSaving(prev => ({ ...prev, notifications: true }));
      
      const response = await adminConfigAPI.updateNotificationConfig(notifications);
      
      if (response.status === "success") {
        toast.success("Configuration des notifications sauvegardée");
      } else {
        throw new Error(response.message || "Erreur lors de la sauvegarde");
      }
    } catch (error) {
      console.error("Erreur sauvegarde notifications:", error);
      toast.error(error.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(prev => ({ ...prev, notifications: false }));
    }
  };

  // Sauvegarder la configuration de sécurité
  const saveSecurityConfig = async () => {
    if (!security) return;
    
    try {
      setSaving(prev => ({ ...prev, security: true }));
      
      const response = await adminConfigAPI.updateSecurityConfig(security);
      
      if (response.status === "success") {
        toast.success("Configuration de sécurité sauvegardée");
      } else {
        throw new Error(response.message || "Erreur lors de la sauvegarde");
      }
    } catch (error) {
      console.error("Erreur sauvegarde sécurité:", error);
      toast.error(error.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(prev => ({ ...prev, security: false }));
    }
  };

  // Sauvegarder la configuration des intégrations
  const saveIntegrationConfig = async () => {
    if (!integrations) return;
    
    try {
      setSaving(prev => ({ ...prev, integrations: true }));
      
      const response = await adminConfigAPI.updateIntegrationConfig(integrations);
      
      if (response.status === "success") {
        toast.success("Configuration des intégrations sauvegardée");
      } else {
        throw new Error(response.message || "Erreur lors de la sauvegarde");
      }
    } catch (error) {
      console.error("Erreur sauvegarde intégrations:", error);
      toast.error(error.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(prev => ({ ...prev, integrations: false }));
    }
  };

  // Sauvegarder la configuration du thème
  const saveThemeConfig = async () => {
    if (!theme) return;
    
    try {
      setSaving(prev => ({ ...prev, theme: true }));
      
      const response = await adminConfigAPI.updateThemeConfig(theme);
      
      if (response.status === "success") {
        toast.success("Configuration du thème sauvegardée");
      } else {
        throw new Error(response.message || "Erreur lors de la sauvegarde");
      }
    } catch (error) {
      console.error("Erreur sauvegarde thème:", error);
      toast.error(error.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(prev => ({ ...prev, theme: false }));
    }
  };

  // Activer/désactiver le mode maintenance
  const toggleMaintenance = async () => {
    if (!system) return;
    
    try {
      const newMaintenanceMode = !system.maintenance_mode;
      const response = await adminConfigAPI.toggleMaintenanceMode(
        newMaintenanceMode, 
        system.maintenance_message
      );
      
      if (response.status === "success") {
        setSystem(prev => ({ ...prev, maintenance_mode: newMaintenanceMode }));
        toast.success(`Mode maintenance ${newMaintenanceMode ? 'activé' : 'désactivé'}`);
      } else {
        throw new Error(response.message || "Erreur lors du changement de mode");
      }
    } catch (error) {
      console.error("Erreur toggle maintenance:", error);
      toast.error(error.message || "Erreur lors du changement de mode");
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <h1 className="text-3xl font-bold tracking-tight">Chargement de la configuration...</h1>
        </div>
      </div>
    );
  }

  if (error && !system) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <div>
                <div className="font-semibold text-red-800 dark:text-red-200">Erreur de chargement</div>
                <div className="text-sm text-red-700 dark:text-red-300">{error}</div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={loadConfig}
                >
                  Réessayer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-2">
        <Settings className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Configuration Système</h1>
      </div>
      
      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Système
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Intégrations
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Thème
          </TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-6">
          <Card className="rounded-xl shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Paramètres Système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mode maintenance */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div>
                    <Label className="text-base font-medium">Mode Maintenance</Label>
                    <p className="text-sm text-muted-foreground">
                      Désactive temporairement l'accès à la plateforme
                    </p>
                  </div>
                  <Switch 
                    checked={system?.maintenance_mode || false}
                    onCheckedChange={toggleMaintenance}
                  />
                </div>
                
                {system?.maintenance_mode && (
                  <div className="space-y-2">
                    <Label htmlFor="maintenance-message">Message de maintenance</Label>
                    <Textarea
                      id="maintenance-message"
                      value={system?.maintenance_message || ""}
                      onChange={(e) => setSystem(prev => ({ ...prev, maintenance_message: e.target.value }))}
                      placeholder="Message affiché aux utilisateurs..."
                      rows={3}
                    />
                  </div>
                )}
              </div>

              {/* Paramètres généraux */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="max-establishments">Max établissements par utilisateur</Label>
                  <Input
                    id="max-establishments"
                    type="number"
                    min="1"
                    value={system?.max_establishments_per_user || 5}
                    onChange={(e) => setSystem(prev => ({ ...prev, max_establishments_per_user: parseInt(e.target.value) }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Timeout session (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    min="5"
                    value={system?.session_timeout_minutes || 30}
                    onChange={(e) => setSystem(prev => ({ ...prev, session_timeout_minutes: parseInt(e.target.value) }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Fréquence sauvegarde (heures)</Label>
                  <Input
                    id="backup-frequency"
                    type="number"
                    min="1"
                    value={system?.backup_frequency_hours || 24}
                    onChange={(e) => setSystem(prev => ({ ...prev, backup_frequency_hours: parseInt(e.target.value) }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="data-retention">Rétention données (jours)</Label>
                  <Input
                    id="data-retention"
                    type="number"
                    min="30"
                    value={system?.data_retention_days || 365}
                    onChange={(e) => setSystem(prev => ({ ...prev, data_retention_days: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              {/* Switches */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sauvegarde automatique</Label>
                    <p className="text-sm text-muted-foreground">Sauvegarde automatique des données</p>
                  </div>
                  <Switch 
                    checked={system?.auto_backup_enabled || false}
                    onCheckedChange={(checked) => setSystem(prev => ({ ...prev, auto_backup_enabled: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications email</Label>
                    <p className="text-sm text-muted-foreground">Activer les notifications par email</p>
                  </div>
                  <Switch 
                    checked={system?.email_notifications_enabled || false}
                    onCheckedChange={(checked) => setSystem(prev => ({ ...prev, email_notifications_enabled: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications SMS</Label>
                    <p className="text-sm text-muted-foreground">Activer les notifications par SMS</p>
                  </div>
                  <Switch 
                    checked={system?.sms_notifications_enabled || false}
                    onCheckedChange={(checked) => setSystem(prev => ({ ...prev, sms_notifications_enabled: checked }))}
                  />
                </div>
              </div>

              <Button 
                onClick={saveSystemConfig} 
                disabled={saving.system}
                className="w-full"
              >
                {saving.system ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder la configuration
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="rounded-xl shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Configuration des Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Canaux de notification */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Canaux de notification</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications Email</Label>
                    <p className="text-sm text-muted-foreground">Recevoir les notifications par email</p>
                  </div>
                  <Switch 
                    checked={notifications?.email_enabled || false}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email_enabled: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications SMS</Label>
                    <p className="text-sm text-muted-foreground">Recevoir les notifications par SMS</p>
                  </div>
                  <Switch 
                    checked={notifications?.sms_enabled || false}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms_enabled: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications Push</Label>
                    <p className="text-sm text-muted-foreground">Recevoir les notifications push</p>
                  </div>
                  <Switch 
                    checked={notifications?.push_enabled || false}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push_enabled: checked }))}
                  />
                </div>
              </div>

              {/* Types de notification */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Types de notification</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Nouveaux établissements</Label>
                    <p className="text-sm text-muted-foreground">Alerter lors de nouveaux établissements</p>
                  </div>
                  <Switch 
                    checked={notifications?.new_establishment_notification || false}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, new_establishment_notification: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Alertes de performance</Label>
                    <p className="text-sm text-muted-foreground">Alerter en cas de performance faible</p>
                  </div>
                  <Switch 
                    checked={notifications?.low_performance_alert || false}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, low_performance_alert: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Alertes de sécurité</Label>
                    <p className="text-sm text-muted-foreground">Alerter en cas d'incident de sécurité</p>
                  </div>
                  <Switch 
                    checked={notifications?.security_alert || false}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, security_alert: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance système</Label>
                    <p className="text-sm text-muted-foreground">Alerter lors de maintenances</p>
                  </div>
                  <Switch 
                    checked={notifications?.system_maintenance_notification || false}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, system_maintenance_notification: checked }))}
                  />
                </div>
              </div>

              {/* Rapports automatiques */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Rapports automatiques</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Rapport hebdomadaire</Label>
                    <p className="text-sm text-muted-foreground">Recevoir un rapport hebdomadaire</p>
                  </div>
                  <Switch 
                    checked={notifications?.weekly_report_enabled || false}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weekly_report_enabled: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Rapport mensuel</Label>
                    <p className="text-sm text-muted-foreground">Recevoir un rapport mensuel</p>
                  </div>
                  <Switch 
                    checked={notifications?.monthly_report_enabled || false}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, monthly_report_enabled: checked }))}
                  />
                </div>
              </div>

              <Button 
                onClick={saveNotificationConfig} 
                disabled={saving.notifications}
                className="w-full"
              >
                {saving.notifications ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder les notifications
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="rounded-xl shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Configuration de Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Politique de mots de passe */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Politique de mots de passe</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password-expiry">Expiration mot de passe (jours)</Label>
                    <Input
                      id="password-expiry"
                      type="number"
                      min="30"
                      value={security?.password_expiry_days || 90}
                      onChange={(e) => setSecurity(prev => ({ ...prev, password_expiry_days: parseInt(e.target.value) }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="min-length">Longueur minimale</Label>
                    <Input
                      id="min-length"
                      type="number"
                      min="6"
                      value={security?.password_policy_min_length || 8}
                      onChange={(e) => setSecurity(prev => ({ ...prev, password_policy_min_length: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Caractères spéciaux requis</Label>
                    <p className="text-sm text-muted-foreground">Exiger des caractères spéciaux</p>
                  </div>
                  <Switch 
                    checked={security?.password_policy_require_special || false}
                    onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, password_policy_require_special: checked }))}
                  />
                </div>
              </div>

              {/* Protection contre les attaques */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Protection contre les attaques</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="max-attempts">Max tentatives de connexion</Label>
                    <Input
                      id="max-attempts"
                      type="number"
                      min="3"
                      value={security?.max_login_attempts || 5}
                      onChange={(e) => setSecurity(prev => ({ ...prev, max_login_attempts: parseInt(e.target.value) }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lockout-duration">Durée de verrouillage (minutes)</Label>
                    <Input
                      id="lockout-duration"
                      type="number"
                      min="5"
                      value={security?.lockout_duration_minutes || 30}
                      onChange={(e) => setSecurity(prev => ({ ...prev, lockout_duration_minutes: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>

              {/* Chiffrement et sécurité */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Chiffrement et sécurité</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Chiffrement des sessions</Label>
                    <p className="text-sm text-muted-foreground">Chiffrer les données de session</p>
                  </div>
                  <Switch 
                    checked={security?.session_encryption || false}
                    onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, session_encryption: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Chiffrement au repos</Label>
                    <p className="text-sm text-muted-foreground">Chiffrer les données stockées</p>
                  </div>
                  <Switch 
                    checked={security?.data_encryption_at_rest || false}
                    onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, data_encryption_at_rest: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SSL requis</Label>
                    <p className="text-sm text-muted-foreground">Forcer les connexions HTTPS</p>
                  </div>
                  <Switch 
                    checked={security?.ssl_required || false}
                    onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, ssl_required: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Journal d'audit</Label>
                    <p className="text-sm text-muted-foreground">Enregistrer les actions utilisateurs</p>
                  </div>
                  <Switch 
                    checked={security?.audit_log_enabled || false}
                    onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, audit_log_enabled: checked }))}
                  />
                </div>
              </div>

              <Button 
                onClick={saveSecurityConfig} 
                disabled={saving.security}
                className="w-full"
              >
                {saving.security ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder la sécurité
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="rounded-xl shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Configuration des Intégrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Passerelle de paiement */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Passerelle de paiement</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Activer les paiements</Label>
                    <p className="text-sm text-muted-foreground">Permettre les paiements en ligne</p>
                  </div>
                  <Switch 
                    checked={integrations?.payment_gateway_enabled || false}
                    onCheckedChange={(checked) => setIntegrations(prev => ({ ...prev, payment_gateway_enabled: checked }))}
                  />
                </div>
                
                {integrations?.payment_gateway_enabled && (
                  <div className="space-y-2">
                    <Label htmlFor="payment-provider">Fournisseur de paiement</Label>
                    <Select 
                      value={integrations?.payment_gateway_provider || "stripe"}
                      onValueChange={(value) => setIntegrations(prev => ({ ...prev, payment_gateway_provider: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Service SMS */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Service SMS</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Activer les SMS</Label>
                    <p className="text-sm text-muted-foreground">Permettre l'envoi de SMS</p>
                  </div>
                  <Switch 
                    checked={integrations?.sms_gateway_enabled || false}
                    onCheckedChange={(checked) => setIntegrations(prev => ({ ...prev, sms_gateway_enabled: checked }))}
                  />
                </div>
                
                {integrations?.sms_gateway_enabled && (
                  <div className="space-y-2">
                    <Label htmlFor="sms-provider">Fournisseur SMS</Label>
                    <Select 
                      value={integrations?.sms_gateway_provider || "twilio"}
                      onValueChange={(value) => setIntegrations(prev => ({ ...prev, sms_gateway_provider: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twilio">Twilio</SelectItem>
                        <SelectItem value="nexmo">Nexmo</SelectItem>
                        <SelectItem value="aws-sns">AWS SNS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Service Email */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Service Email</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Activer les emails</Label>
                    <p className="text-sm text-muted-foreground">Permettre l'envoi d'emails</p>
                  </div>
                  <Switch 
                    checked={integrations?.email_service_enabled || false}
                    onCheckedChange={(checked) => setIntegrations(prev => ({ ...prev, email_service_enabled: checked }))}
                  />
                </div>
                
                {integrations?.email_service_enabled && (
                  <div className="space-y-2">
                    <Label htmlFor="email-provider">Fournisseur Email</Label>
                    <Select 
                      value={integrations?.email_service_provider || "sendgrid"}
                      onValueChange={(value) => setIntegrations(prev => ({ ...prev, email_service_provider: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                        <SelectItem value="mailgun">Mailgun</SelectItem>
                        <SelectItem value="aws-ses">AWS SES</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Analytics */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Analytics</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Activer les analytics</Label>
                    <p className="text-sm text-muted-foreground">Suivre les performances</p>
                  </div>
                  <Switch 
                    checked={integrations?.analytics_enabled || false}
                    onCheckedChange={(checked) => setIntegrations(prev => ({ ...prev, analytics_enabled: checked }))}
                  />
                </div>
                
                {integrations?.analytics_enabled && (
                  <div className="space-y-2">
                    <Label htmlFor="analytics-provider">Fournisseur Analytics</Label>
                    <Select 
                      value={integrations?.analytics_provider || "google_analytics"}
                      onValueChange={(value) => setIntegrations(prev => ({ ...prev, analytics_provider: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google_analytics">Google Analytics</SelectItem>
                        <SelectItem value="mixpanel">Mixpanel</SelectItem>
                        <SelectItem value="amplitude">Amplitude</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <Button 
                onClick={saveIntegrationConfig} 
                disabled={saving.integrations}
                className="w-full"
              >
                {saving.integrations ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder les intégrations
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="space-y-6">
          <Card className="rounded-xl shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Configuration du Thème
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Couleurs */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Couleurs</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Couleur principale</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={theme?.primary_color || "#3B82F6"}
                        onChange={(e) => setTheme(prev => ({ ...prev, primary_color: e.target.value }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={theme?.primary_color || "#3B82F6"}
                        onChange={(e) => setTheme(prev => ({ ...prev, primary_color: e.target.value }))}
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Couleur secondaire</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={theme?.secondary_color || "#10B981"}
                        onChange={(e) => setTheme(prev => ({ ...prev, secondary_color: e.target.value }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={theme?.secondary_color || "#10B981"}
                        onChange={(e) => setTheme(prev => ({ ...prev, secondary_color: e.target.value }))}
                        placeholder="#10B981"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accent-color">Couleur d'accent</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="accent-color"
                        type="color"
                        value={theme?.accent_color || "#F59E0B"}
                        onChange={(e) => setTheme(prev => ({ ...prev, accent_color: e.target.value }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={theme?.accent_color || "#F59E0B"}
                        onChange={(e) => setTheme(prev => ({ ...prev, accent_color: e.target.value }))}
                        placeholder="#F59E0B"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mode sombre */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Apparence</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mode sombre</Label>
                    <p className="text-sm text-muted-foreground">Activer le thème sombre</p>
                  </div>
                  <Switch 
                    checked={theme?.dark_mode_enabled || false}
                    onCheckedChange={(checked) => setTheme(prev => ({ ...prev, dark_mode_enabled: checked }))}
                  />
                </div>
              </div>

              {/* CSS personnalisé */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">CSS personnalisé</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Activer le CSS personnalisé</Label>
                    <p className="text-sm text-muted-foreground">Permettre des styles personnalisés</p>
                  </div>
                  <Switch 
                    checked={theme?.custom_css_enabled || false}
                    onCheckedChange={(checked) => setTheme(prev => ({ ...prev, custom_css_enabled: checked }))}
                  />
                </div>
                
                {theme?.custom_css_enabled && (
                  <div className="space-y-2">
                    <Label htmlFor="custom-css">CSS personnalisé</Label>
                    <Textarea
                      id="custom-css"
                      value={theme?.custom_css || ""}
                      onChange={(e) => setTheme(prev => ({ ...prev, custom_css: e.target.value }))}
                      placeholder="/* Votre CSS personnalisé ici */"
                      rows={6}
                      className="font-mono text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Assets */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Assets</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="logo-url">URL du logo</Label>
                    <Input
                      id="logo-url"
                      value={theme?.logo_url || "/images/logo.png"}
                      onChange={(e) => setTheme(prev => ({ ...prev, logo_url: e.target.value }))}
                      placeholder="/images/logo.png"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="favicon-url">URL du favicon</Label>
                    <Input
                      id="favicon-url"
                      value={theme?.favicon_url || "/favicon.ico"}
                      onChange={(e) => setTheme(prev => ({ ...prev, favicon_url: e.target.value }))}
                      placeholder="/favicon.ico"
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={saveThemeConfig} 
                disabled={saving.theme}
                className="w-full"
              >
                {saving.theme ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder le thème
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 