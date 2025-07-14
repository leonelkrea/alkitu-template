# 📋 Templates - Plantillas para PRDs y Tickets

## 🎯 **Propósito**

Esta carpeta contiene las plantillas estandarizadas para crear PRDs (Product Requirements Documents) y tickets de desarrollo siguiendo la estructura establecida en el proyecto Alkitu Template.

## 📁 **Plantillas Disponibles**

### **Para PRDs:**

#### **`PRD-TEMPLATE.md`**

- **Uso**: Crear nuevos Product Requirements Documents
- **Destino**: `docs/04-product/prd/XX-feature-name.md`
- **Características**:
  - ✅ Stack tecnológico alineado (Prisma + MongoDB, NestJS, Next.js, tRPC)
  - ✅ Schemas de Prisma incluidos
  - ✅ Principios SOLID integrados
  - ✅ Criterios de aceptación estándar
  - ✅ Estructura completa de documentación técnica

### **Para Tickets:**

#### **`TICKET-README-TEMPLATE.md`**

- **Uso**: Archivo principal del ticket
- **Destino**: `docs/04-product/tickets/[TICKET-ID]/README.md`
- **Estructura**: Basada en CRITICAL-001
- **Incluye**: Objetivos, criterios de aceptación, dependencias, métricas

#### **`TICKET-NEXT-STEPS-TEMPLATE.md`**

- **Uso**: Instrucciones para el siguiente agente
- **Destino**: `docs/04-product/tickets/[TICKET-ID]/next-steps.md`
- **Propósito**: Handoff entre agentes, recomendaciones, bloqueos

#### **`TICKET-NOTES-TEMPLATE.md`**

- **Uso**: Notas de trabajo del agente
- **Destino**: `docs/04-product/tickets/[TICKET-ID]/notes.md`
- **Contenido**: Decisiones, principios SOLID aplicados, desafíos

#### **`TICKET-CHANGES-TEMPLATE.md`**

- **Uso**: Log detallado de cambios
- **Destino**: `docs/04-product/tickets/[TICKET-ID]/changes.md`
- **Tracking**: Cambios de código, validaciones, métricas

### **Para Workflow y Calidad:**

#### **`HEALTH-CHECK-TEMPLATE.md`** ✨ **NUEVO**

- **Uso**: Validación de salud del sistema pre/post trabajo
- **Destino**: `docs/04-product/tickets/[TICKET-ID]/health-check.md`
- **Incluye**: Validación SOLID, métricas de calidad, estado del sistema
- **Propósito**: Asegurar estabilidad antes y después de cambios

#### **`PEER-REVIEW-TEMPLATE.md`** ✨ **NUEVO**

- **Uso**: Revisión cruzada entre agentes
- **Destino**: `docs/04-product/tickets/[TICKET-ID]/peer-review.md`
- **Incluye**: Revisión SOLID, calidad de código, recomendaciones
- **Propósito**: Validación de calidad y mejores prácticas

#### **`IMPACT-ANALYSIS-TEMPLATE.md`** ✨ **NUEVO**

- **Uso**: Análisis de impacto de cambios
- **Destino**: `docs/04-product/tickets/[TICKET-ID]/impact-analysis.md`
- **Incluye**: Evaluación de riesgos, dependencias, timeline
- **Propósito**: Prevenir consecuencias no deseadas

#### **`DECISION-RECORD-TEMPLATE.md`** ✨ **NUEVO**

- **Uso**: Documentar decisiones técnicas y arquitectónicas
- **Destino**: `docs/03-ai-agents/decisions/[category]/DR-XXX.md`
- **Incluye**: Contexto, opciones, rationale, consecuencias
- **Propósito**: Rastrar decisiones importantes y su razonamiento

## 🔧 **Cómo Usar las Plantillas**

### **Crear PRD**

```bash
# 1. Copiar plantilla
cp docs/03-ai-agents/templates/PRD-TEMPLATE.md docs/04-product/prd/01-example-feature.md

# 2. Personalizar
# - Reemplazar [XX-feature-name] con ID real
# - Completar todas las secciones [...]
# - Validar schemas de Prisma
# - Asegurar alineación con stack
```

### **Crear Ticket Completo**

```bash
# 1. Crear estructura
mkdir -p docs/04-product/tickets/EXAMPLE-001

# 2. Copiar todas las plantillas
cp docs/03-ai-agents/templates/TICKET-README-TEMPLATE.md docs/04-product/tickets/EXAMPLE-001/README.md
cp docs/03-ai-agents/templates/TICKET-NEXT-STEPS-TEMPLATE.md docs/04-product/tickets/EXAMPLE-001/next-steps.md
cp docs/03-ai-agents/templates/TICKET-NOTES-TEMPLATE.md docs/04-product/tickets/EXAMPLE-001/notes.md
cp docs/03-ai-agents/templates/TICKET-CHANGES-TEMPLATE.md docs/04-product/tickets/EXAMPLE-001/changes.md

# 3. Personalizar README.md
# - Completar información del ticket
# - Asignar agente apropiado
# - Establecer dependencias
# - Definir criterios de aceptación
```

## 🎯 **Asignación de Agentes**

### **Por Prefijo de Ticket:**

```yaml
SOLID-*: Architecture Agent # Principios SOLID
REFACTOR-*: Backend Agent # Refactorización de código
UI-*: Frontend Agent # Componentes y interfaces
TEST-*: Testing Agent # Testing y validación
DOC-*: Documentation Agent # Documentación y PRDs
ARCH-*: Architecture Agent # Diseño arquitectónico
API-*: Backend Agent # APIs y servicios
VALIDATION-*: Testing Agent # Validación y compliance
```

### **Por Tipo de Trabajo:**

```yaml
Database & Schema: Architecture Agent
Business Logic: Backend Agent
User Interface: Frontend Agent
Testing & QA: Testing Agent
Documentation: Documentation Agent
```

## ✅ **Criterios de Calidad**

### **Para PRDs:**

- [ ] **Stack Alignment**: Tecnologías coinciden con proyecto
- [ ] **Prisma Schemas**: Schemas válidos y compilables
- [ ] **SOLID Principles**: Principios considerados en diseño
- [ ] **Complete Sections**: Todas las secciones completadas
- [ ] **Acceptance Criteria**: Criterios claros y medibles
- [ ] **Dependencies**: Dependencias válidas documentadas

### **Para Tickets:**

- [ ] **Structure Complete**: Los 4 archivos presentes
- [ ] **Clear Objective**: Objetivo específico y medible
- [ ] **Proper Agent**: Agente apropiado asignado
- [ ] **Valid Dependencies**: Dependencias factibles
- [ ] **SOLID Considerations**: Principios SOLID incluidos
- [ ] **Acceptance Criteria**: Criterios completos y testables

## 🔄 **Flujo de Trabajo**

### **Lifecycle de un Ticket:**

1. **Creation** (Documentation Agent)
   - Copiar plantillas
   - Completar README.md
   - Asignar agente apropiado

2. **Implementation** (Assigned Agent)
   - Trabajar siguiendo README.md
   - Documentar en notes.md
   - Registrar cambios en changes.md

3. **Completion** (Assigned Agent)
   - Completar next-steps.md
   - Validar todos los criterios
   - Hacer handoff al siguiente agente

4. **Validation** (Next Agent/Testing Agent)
   - Verificar entregables
   - Validar calidad
   - Confirmar integración

## 📋 **Validación de Plantillas**

### **Checklist de Uso Correcto:**

#### **Al Crear PRD:**

- [ ] Plantilla copiada correctamente
- [ ] Todos los `[...]` reemplazados
- [ ] Schemas de Prisma válidos
- [ ] Stack tecnológico alineado
- [ ] Criterios de aceptación específicos

#### **Al Crear Ticket:**

- [ ] Estructura de 4 archivos completa
- [ ] README.md totalmente completado
- [ ] Agente apropiado asignado
- [ ] Dependencias verificadas
- [ ] Estimación de tiempo realista

#### **Durante Implementación:**

- [ ] notes.md actualizado con decisiones
- [ ] changes.md registra todos los cambios
- [ ] Principios SOLID aplicados y documentados
- [ ] Criterios de aceptación validados

#### **Al Completar:**

- [ ] next-steps.md completado
- [ ] Handoff claro para siguiente agente
- [ ] Todos los entregables listos
- [ ] Validación final pasada

## 🚀 **Best Practices**

### **Para Documentation Agent:**

1. **Siempre usar plantillas** - No crear desde cero
2. **Personalizar completamente** - Llenar todos los campos
3. **Validar estructura** - Verificar que sigue el formato
4. **Asignar correctamente** - Agente apropiado para el trabajo
5. **Establecer dependencias** - Orden lógico de implementación

### **Para Agentes Implementadores:**

1. **Leer completamente** - Entender todo el contexto
2. **Documentar decisiones** - Registrar en notes.md
3. **Aplicar SOLID** - Seguir principios en todo momento
4. **Registrar cambios** - Cada modificación en changes.md
5. **Preparar handoff** - next-steps.md claro y útil

### **Para Todos los Agentes:**

1. **Seguir estructura** - Mantener consistencia
2. **Comunicar claramente** - Documentación clara
3. **Validar calidad** - Cumplir todos los criterios
4. **Pensar en futuro** - Considerar mantenibilidad
5. **Colaborar efectivamente** - Handoffs claros

---

## 📞 **Soporte y Dudas**

Para dudas sobre el uso de estas plantillas:

1. **Revisar** este README completamente
2. **Consultar** `docs/03-ai-agents/05-documentation-agent.md`
3. **Examinar** ejemplos en `docs/04-product/tickets/CRITICAL-001/`
4. **Seguir** estructura establecida sin desviaciones

---

**Estas plantillas son el estándar del proyecto. Su uso correcto garantiza consistencia, calidad y mantenibilidad en toda la documentación y desarrollo.**
