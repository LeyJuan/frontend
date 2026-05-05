#!/bin/bash

# Script de verificación de configuración - Notificaciones Frontend
# Uso: bash check-config.sh

echo "🔍 Verificando configuración de Notificaciones Frontend..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar archivo .env
echo "1️⃣  Verificando archivo .env..."
if [ -f .env ]; then
    echo -e "${GREEN}✓${NC} Archivo .env existe"
    
    # Leer variables
    DOMAIN=$(grep VITE_DOMAIN .env | cut -d'=' -f2 | tr -d '"')
    U_PORT=$(grep VITE_U_PORT .env | cut -d'=' -f2)
    R_PORT=$(grep VITE_R_PORT .env | cut -d'=' -f2)
    N_PORT=$(grep VITE_N_PORT .env | cut -d'=' -f2)
    
    echo "  VITE_DOMAIN=$DOMAIN"
    echo "  VITE_U_PORT=$U_PORT"
    echo "  VITE_R_PORT=$R_PORT"
    echo "  VITE_N_PORT=$N_PORT"
    
    # Verificar comillas
    if grep -q 'VITE_DOMAIN="' .env; then
        echo -e "${RED}✗${NC} ADVERTENCIA: VITE_DOMAIN tiene comillas (esto causa problemas)"
        echo "  Solución: Remover comillas"
    else
        echo -e "${GREEN}✓${NC} Variables sin comillas (correcto)"
    fi
else
    echo -e "${RED}✗${NC} Archivo .env NO existe"
    echo "  Solución: Copiar .env.example a .env"
fi

echo ""

# 2. Verificar archivos de configuración
echo "2️⃣  Verificando archivos de configuración..."
FILES=(
    "vite.config.js"
    "src/api/client.js"
    "src/api/notificaciones.js"
    "src/context/NotificationsContext.jsx"
    "src/main.jsx"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file FALTA"
    fi
done

echo ""

# 3. Verificar componentes
echo "3️⃣  Verificando componentes..."
COMPONENTS=(
    "src/components/NotificationItem.jsx"
    "src/components/NotificationList.jsx"
    "src/components/NotificationBadge.jsx"
)

for comp in "${COMPONENTS[@]}"; do
    if [ -f "$comp" ]; then
        echo -e "${GREEN}✓${NC} $comp"
    else
        echo -e "${RED}✗${NC} $comp FALTA"
    fi
done

echo ""

# 4. Verificar hooks
echo "4️⃣  Verificando hooks..."
if [ -f "src/hooks/useNotificaciones.js" ]; then
    echo -e "${GREEN}✓${NC} src/hooks/useNotificaciones.js"
else
    echo -e "${RED}✗${NC} src/hooks/useNotificaciones.js FALTA"
fi

echo ""

# 5. Verificar Node modules
echo "5️⃣  Verificando dependencias..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules existe"
    if [ -d "node_modules/react" ]; then
        echo -e "${GREEN}✓${NC} React instalado"
    fi
    if [ -d "node_modules/axios" ]; then
        echo -e "${GREEN}✓${NC} Axios instalado"
    fi
else
    echo -e "${RED}✗${NC} node_modules NO existe"
    echo "  Solución: npm install"
fi

echo ""

# 6. Verificar que puertos estén libres
echo "6️⃣  Verificando puertos..."
for port in 5173 8000 8001 8002; do
    if lsof -i :$port > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Puerto $port está en uso"
    else
        echo -e "${YELLOW}ℹ${NC} Puerto $port está disponible"
    fi
done

echo ""

# 7. Resumen
echo "📋 Resumen de verificación:"
echo "================================"
if [ -f .env ] && ! grep -q 'VITE_DOMAIN="' .env; then
    echo -e "${GREEN}✓${NC} Configuración parece correcta"
    echo ""
    echo "Próximos pasos:"
    echo "  1. npm run dev      # Iniciar Vite"
    echo "  2. Ver logs en consola de Vite para proxy"
    echo "  3. Ir a http://localhost:5173"
    echo "  4. Revisar Network tab en DevTools"
else
    echo -e "${RED}✗${NC} Hay problemas en la configuración"
    echo ""
    echo "Soluciones:"
    echo "  1. Verificar que .env NO tiene comillas"
    echo "  2. npm install   # Si falta node_modules"
    echo "  3. Reiniciar Vite"
fi

echo ""
echo "================================"
echo "✅ Verificación completada"
