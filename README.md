# Interseguro Matrix API

API REST para análisis de matrices con factorización QR, implementada con arquitectura en capas

## 🏗️ Arquitectura

Este proyecto sigue una **arquitectura en capas** con separación de responsabilidades:

```
src/
├── entities/          # DTOs (Data Transfer Objects)
├── services/          # Lógica de negocio
├── controllers/       # Controladores de endpoints
├── routes/           # Definición de rutas con validación Joi
├── middleware/       # Context, error handling
└── utils/           # Logger, environment, utilidades
```

## 🚀 Tecnologías

- **Node.js 20.11.1** + **TypeScript**
- **Hapi.js** - Framework web
- **Joi** - Validación de datos
- **Boom** - Manejo de errores HTTP
- **Winston** - Sistema de logging estructurado
- **Jest** - Testing con >70% cobertura

## 📋 Características

✅ **Arquitectura en Capas**: Entities, Services, Controllers, Routes
✅ **Trazabilidad**: Context con `applicationId` y `transactionId` en todos los logs
✅ **Validación Obligatoria**: Joi en todas las rutas
✅ **Logging Estructurado**: Winston con contexto de trazabilidad
✅ **Manejo de Errores**: Centralizado con Boom
✅ **Sanitización de Datos**: Validación estricta de inputs
✅ **Tipado Fuerte**: TypeScript con strict mode
✅ **Pruebas Unitarias**: Jest con cobertura >70%
✅ **Docker Ready**: Dockerfile optimizado

## 🔧 Instalación

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Compilar TypeScript
npm run build

# Ejecutar en desarrollo
npm run dev

# Ejecutar en producción
npm start
```

## 📝 Variables de Entorno

```env
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug
APPLICATION_ID=interseguro-matrix-api
API_GO_URL=http://localhost:8080
```

## 📡 Endpoints

### POST /api/analyze
Analiza matrices Q y R, calcula estadísticas y verifica si son diagonales.

**Request:**
```json
{
  "rotated": [[1, 2], [3, 4]],
  "Q": [[1, 0], [0, 1]],
  "R": [[2, 0], [0, 3]]
}
```

**Response:**
```json
{
  "RotatedMatrix": [[1, 2], [3, 4]],
  "QMatrix": [[1, 0], [0, 1]],
  "RMatrix": [[2, 0], [0, 3]],
  "QStats": {
    "average": 0.5,
    "isDiagonal": true,
    "max": 1,
    "min": 0,
    "sum": 2
  },
  "RStats": {
    "average": 1.25,
    "isDiagonal": true,
    "max": 3,
    "min": 0,
    "sum": 5
  }
}
```

### GET /api/health
Health check del servicio.

**Response:**
```json
{
  "status": "OK",
  "service": "interseguro-matrix-api",
  "timestamp": "2026-06-17T21:00:00.000Z"
}
```

## 🧪 Pruebas

```bash
# Ejecutar pruebas
npm test

# Ejecutar con cobertura
npm test -- --coverage

# Modo watch
npm run test:watch
```

## 🐳 Docker

```bash
# Construir imagen
docker build -t interseguro-matrix-api .

# Ejecutar contenedor
docker run -p 3000:3000 --env-file .env interseguro-matrix-api
```

## 📊 Estructura de Logs

Todos los logs incluyen contexto de trazabilidad:

```json
{
  "timestamp": "2026-06-17T21:00:00.000Z",
  "level": "info",
  "message": "Análisis completado exitosamente",
  "applicationId": "interseguro-matrix-api",
  "transactionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## 🔒 Seguridad

- ✅ Validación Joi en todas las rutas
- ✅ Sanitización de datos de entrada
- ✅ Manejo seguro de errores (sin exponer detalles internos)
- ✅ TypeScript strict mode
- ✅ Validaciones de negocio

## 📚 Estándares de Código

- **Nomenclatura**: camelCase para variables/funciones, PascalCase para clases
- **Límites**: Máximo 50 líneas por función, 500 por clase
- **Imports**: Ordenados (nativos, externos, internos, relativos)
- **Early Returns**: Para validaciones
- **JSDoc**: En funciones públicas exportadas