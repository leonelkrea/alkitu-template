# Health Check System

## 📋 Propósito

Este directorio contiene el sistema de health checks para validar la salud de los agentes y del sistema en general.

## 🏥 Tipos de Health Checks

### 🔍 Pre-Work Health Checks

- Validar dependencias disponibles
- Verificar herramientas funcionando
- Confirmar entorno de trabajo listo
- Detectar conflictos antes de empezar

### 🏁 Post-Work Health Checks

- Validar que tests siguen pasando
- Verificar builds exitosos
- Confirmar no hay regresiones
- Validar handoff para siguiente agente

### 📊 System-Wide Health Checks

- Estado general del sistema
- Métricas de rendimiento
- Alertas de problemas críticos
- Dashboard de salud general

## 📝 Formato de Health Checks

Cada health check sigue el formato: `HEALTH-AGENT-DATE.md`

Ver template en: `docs/03-ai-agents/HEALTH-CHECK-TEMPLATE.md`

## 🚨 Estados de Salud

- **✅ HEALTHY**: Todo funcionando correctamente
- **⚠️ DEGRADED**: Problemas menores, puede continuar
- **❌ FAILED**: Problemas críticos, trabajo bloqueado

## 🔄 Proceso de Health Check

1. **Ejecutar** health check pre-work
2. **Documentar** estado actual
3. **Resolver** problemas críticos
4. **Proceder** con trabajo si está HEALTHY
5. **Ejecutar** health check post-work
6. **Actualizar** dashboard de salud

## 📊 Dashboard Central

El dashboard de salud se mantiene en:

- `docs/03-ai-agents/SYSTEM-HEALTH.md` (a crear)

## 🚨 Escalación

Si health check marca **FAILED**:

1. Documentar problema específico
2. Buscar solución en knowledge base
3. Escalar a Documentation Agent si necesario
4. Resolver antes de continuar trabajo
