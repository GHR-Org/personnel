"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Globe, Users, Eye, Search, Filter, TrendingUp, TrendingDown, MapPin } from 'lucide-react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

interface CountryData {
  country: string;
  clients: number;
  users: number;
  region: string;
  coordinates: [number, number];
}

interface WorldMapData {
  total_clients: number;
  total_users: number;
  countries: CountryData[];
  regions: {
    [key: string]: {
      clients: number;
      users: number;
      growth: number;
    };
  };
  cdn_providers: {
    [key: string]: {
      enabled: boolean;
      clients: number;
      users: number;
    };
  };
  time_periods: {
    quarter: string;
    month: string;
    week: string;
  };
}

interface WorldMapChartProps {
  data: WorldMapData;
  className?: string;
}

export function WorldMapChart({ data, className }: WorldMapChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<'clients' | 'users'>('clients');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('quarter');
  const [hoveredCountry, setHoveredCountry] = useState<CountryData | null>(null);

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}B`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getColorForValue = (value: number, maxValue: number): string => {
    const ratio = value / maxValue;
    if (ratio > 0.8) return '#dc2626'; // Red
    if (ratio > 0.6) return '#ea580c'; // Orange
    if (ratio > 0.4) return '#ca8a04'; // Yellow
    if (ratio > 0.2) return '#16a34a'; // Green
    return '#0ea5e9'; // Light blue
  };



  const getCountryData = (geoName: string) => {
    // Mapping des noms de pays pour correspondre aux données GeoJSON officielles
    const countryNameMapping: { [key: string]: string } = {
      'United States of America': 'United States',
      'Russian Federation': 'Russia',
      'United Kingdom': 'UK',
      'Czechia': 'Czech Republic',
      'Korea': 'South Korea',
      'Viet Nam': 'Vietnam',
      'Iran (Islamic Republic of)': 'Iran',
      'Syrian Arab Republic': 'Syria',
      'United Republic of Tanzania': 'Tanzania',
      'Democratic Republic of the Congo': 'DR Congo',
      'Republic of the Congo': 'Congo',
      'Central African Republic': 'Central African Republic',
      'South Sudan': 'South Sudan',
      'Equatorial Guinea': 'Equatorial Guinea',
      'Sao Tome and Principe': 'São Tomé and Príncipe',
      'Côte d\'Ivoire': 'Côte d\'Ivoire',
      'Guinea-Bissau': 'Guinea-Bissau',
      'Cabo Verde': 'Cape Verde',
      'Mauritania': 'Mauritania',
      'Western Sahara': 'Western Sahara',
      'Morocco': 'Morocco',
      'Algeria': 'Algeria',
      'Tunisia': 'Tunisia',
      'Libya': 'Libya',
      'Egypt': 'Egypt',
      'Sudan': 'Sudan',
      'Eritrea': 'Eritrea',
      'Djibouti': 'Djibouti',
      'Somalia': 'Somalia',
      'Ethiopia': 'Ethiopia',
      'Kenya': 'Kenya',
      'Uganda': 'Uganda',
      'Rwanda': 'Rwanda',
      'Burundi': 'Burundi',
      'Malawi': 'Malawi',
      'Zambia': 'Zambia',
      'Zimbabwe': 'Zimbabwe',
      'Botswana': 'Botswana',
      'Namibia': 'Namibia',
      'South Africa': 'South Africa',
      'Lesotho': 'Lesotho',
      'Eswatini': 'Eswatini',
      'Mozambique': 'Mozambique',
      'Madagascar': 'Madagascar',
      'Comoros': 'Comoros',
      'Mauritius': 'Mauritius',
      'Seychelles': 'Seychelles',
      'Chad': 'Chad',
      'Niger': 'Niger',
      'Mali': 'Mali',
      'Burkina Faso': 'Burkina Faso',
      'Ghana': 'Ghana',
      'Togo': 'Togo',
      'Benin': 'Benin',
      'Nigeria': 'Nigeria',
      'Cameroon': 'Cameroon',
      'Gabon': 'Gabon',
    };

    // Essayer de trouver le pays par nom exact ou par mapping
    const mappedName = countryNameMapping[geoName] || geoName;
    return data.countries.find(c => 
      c.country.toLowerCase() === geoName.toLowerCase() ||
      c.country.toLowerCase() === mappedName.toLowerCase()
    );
  };

  const maxValue = useMemo(() => Math.max(...data.countries.map(c => c[selectedMetric])), [data.countries, selectedMetric]);

  const regions = Object.keys(data.regions);
  const cdnProviders = Object.keys(data.cdn_providers);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Données Réseau Mondiales
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {formatNumber(data.total_clients)} clients
            </Badge>
            <Badge variant="outline">
              {formatNumber(data.total_users)} utilisateurs
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Controls */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={selectedMetric} onValueChange={(value: 'clients' | 'users') => setSelectedMetric(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clients">Clients</SelectItem>
                <SelectItem value="users">Utilisateurs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Rechercher un pays..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48"
            />
          </div>

          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les régions</SelectItem>
              {regions.map(region => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quarter">{data.time_periods.quarter}</SelectItem>
              <SelectItem value="month">{data.time_periods.month}</SelectItem>
              <SelectItem value="week">{data.time_periods.week}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* CDN Toggles */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-medium">CDN:</span>
          {cdnProviders.map(provider => (
            <div key={provider} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                data.cdn_providers[provider].enabled ? 'bg-red-500' : 'bg-orange-400'
              }`}></div>
              <span className="text-sm">{provider}</span>
            </div>
          ))}
        </div>

        {/* World Map - Version simple pour test */}
        <div className="relative">
          <div className="w-full h-96 border rounded-lg bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
            <ComposableMap
              projection="geoEqualEarth"
              projectionConfig={{
                scale: 140,
                center: [0, 0]
              }}
              style={{
                width: '100%',
                height: '100%'
              }}
            >
              <ZoomableGroup>
                <Geographies
                  geography="https://unpkg.com/world-atlas@2/countries-110m.json"
                >
                  {({ geographies }) =>
                    geographies.map(geo => {
                      const countryData = getCountryData(geo.properties.name);
                      const color = countryData && countryData[selectedMetric] > 0 
                        ? getColorForValue(countryData[selectedMetric], maxValue) 
                        : '#1f2937'; // Noir par défaut
                      
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={color}
                          stroke="#374151"
                          strokeWidth={0.5}
                          style={{
                            default: {
                              outline: 'none',
                              opacity: countryData && countryData[selectedMetric] > 0 ? 0.9 : 0.6,
                              transition: 'all 0.2s ease'
                            },
                            hover: {
                              outline: 'none',
                              opacity: 1,
                              filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.3))',
                              transform: 'scale(1.02)',
                              transformOrigin: 'center'
                            },
                            pressed: {
                              outline: 'none'
                            }
                          }}
                          onMouseEnter={() => setHoveredCountry(countryData || null)}
                          onMouseLeave={() => setHoveredCountry(null)}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </div>
          
          {/* Tooltip */}
          {hoveredCountry && (
            <div className="absolute bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-3 z-10 pointer-events-none"
                 style={{
                   left: `${Math.min(window.innerWidth - 250, window.innerWidth / 2)}px`,
                   top: '20px'
                 }}>
              <div className="font-semibold text-sm">{hoveredCountry.country}</div>
              <div className="text-xs text-muted-foreground">{hoveredCountry.region}</div>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3" />
                  <span className="text-xs">Clients: {formatNumber(hoveredCountry.clients)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-3 w-3" />
                  <span className="text-xs">Utilisateurs: {formatNumber(hoveredCountry.users)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span className="text-xs">{selectedMetric === 'clients' ? 'Clients' : 'Utilisateurs'}: {formatNumber(hoveredCountry[selectedMetric])}</span>
                </div>
              </div>
            </div>
          )}

          {/* Légende */}
          <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 border rounded-lg p-3 shadow-lg">
            <div className="text-sm font-medium mb-2">Légende</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-600"></div>
                <span className="text-xs">{formatNumber(maxValue * 0.8)} - {formatNumber(maxValue)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                <span className="text-xs">{formatNumber(maxValue * 0.6)} - {formatNumber(maxValue * 0.8)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span className="text-xs">{formatNumber(maxValue * 0.4)} - {formatNumber(maxValue * 0.6)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-600"></div>
                <span className="text-xs">{formatNumber(maxValue * 0.2)} - {formatNumber(maxValue * 0.4)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-xs">0 - {formatNumber(maxValue * 0.2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Regional Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {regions.map(region => {
            const regionData = data.regions[region];
            return (
              <div key={region} className="text-center p-3 border rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">{region}</div>
                <div className="text-lg font-bold">{formatNumber(regionData.clients)}</div>
                <div className="flex items-center justify-center gap-1 text-xs">
                  {regionData.growth > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={regionData.growth > 0 ? 'text-green-500' : 'text-red-500'}>
                    {regionData.growth > 0 ? '+' : ''}{regionData.growth}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 