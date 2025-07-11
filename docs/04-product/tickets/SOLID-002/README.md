# 🔓 TICKET SOLID-002: Open/Closed Principle (OCP)

## 📋 **Información del Ticket**

- **ID**: SOLID-002
- **Título**: Implementar Open/Closed Principle (OCP)
- **Prioridad**: 🔥 **CRÍTICA**
- **Agente**: Architecture Agent + Backend Agent
- **Duración**: 1 día
- **Dependencias**: SOLID-001 (SRP completado)
- **Fase**: 1 - Principios SOLID

## 🎯 **Objetivo**

Refactorizar el código para que esté **ABIERTO para extensión, CERRADO para modificación**. Las clases deben poder extenderse con nuevas funcionalidades sin modificar el código existente.

## 🚨 **Violaciones OCP Identificadas**

### **🔴 CRÍTICO: NotificationService Hardcoded Types**

```typescript
// ❌ VIOLACIÓN OCP - Modificación requerida para nuevos tipos
class NotificationService {
  async sendNotification(type: string, data: any) {
    // Modificar ESTE código para cada nuevo tipo
    switch (type) {
      case "email":
        return this.sendEmail(data);
      case "push":
        return this.sendPush(data);
      case "sms":
        return this.sendSMS(data);
      // ❌ Agregar 'slack' requiere modificar esta clase
      default:
        throw new Error("Unsupported notification type");
    }
  }
}
```

### **🔴 CRÍTICO: ValidationService Hardcoded Validators**

```typescript
// ❌ VIOLACIÓN OCP - No extensible sin modificación
class ValidationService {
  validate(type: string, data: any): boolean {
    // Modificar ESTE código para cada nueva validación
    switch (type) {
      case "email":
        return this.validateEmail(data);
      case "phone":
        return this.validatePhone(data);
      case "password":
        return this.validatePassword(data);
      // ❌ Agregar 'cpf' requiere modificar esta clase
      default:
        return false;
    }
  }
}
```

### **🔴 CRÍTICO: PaymentService Fixed Providers**

```typescript
// ❌ VIOLACIÓN OCP - No se pueden agregar providers sin modificar
class PaymentService {
  async processPayment(provider: string, amount: number) {
    // Modificar ESTE código para cada nuevo provider
    if (provider === "stripe") {
      return this.processStripePayment(amount);
    } else if (provider === "paypal") {
      return this.processPayPalPayment(amount);
    } else if (provider === "redsys") {
      return this.processRedsysPayment(amount);
    }
    // ❌ Agregar 'mercadopago' requiere modificar esta clase
    throw new Error("Unsupported payment provider");
  }
}
```

## ✅ **Solución Propuesta - Refactorización OCP**

### **🏗️ Notification System - Extensible Design**

```typescript
// ✅ OCP COMPLIANT - Extensible sin modificación

// 1. Base abstraction
abstract class NotificationChannel {
  abstract readonly type: string;
  abstract send(data: NotificationData): Promise<NotificationResult>;
  abstract supports(type: string): boolean;
}

// 2. Implementations (cerradas para modificación)
class EmailNotificationChannel extends NotificationChannel {
  readonly type = "email";

  async send(data: NotificationData): Promise<NotificationResult> {
    // Email implementation
  }

  supports(type: string): boolean {
    return type === "email";
  }
}

class PushNotificationChannel extends NotificationChannel {
  readonly type = "push";

  async send(data: NotificationData): Promise<NotificationResult> {
    // Push implementation
  }

  supports(type: string): boolean {
    return type === "push";
  }
}

// 3. Orchestrator (abierto para extensión)
class NotificationOrchestrator {
  private channels: NotificationChannel[] = [];

  registerChannel(channel: NotificationChannel): void {
    this.channels.push(channel);
  }

  async sendNotification(
    type: string,
    data: NotificationData
  ): Promise<NotificationResult> {
    const channel = this.channels.find((c) => c.supports(type));
    if (!channel) {
      throw new NotificationChannelNotFoundError(type);
    }
    return channel.send(data);
  }
}

// ✅ Extensión SIN modificación
class SlackNotificationChannel extends NotificationChannel {
  readonly type = "slack";

  async send(data: NotificationData): Promise<NotificationResult> {
    // Slack implementation
  }

  supports(type: string): boolean {
    return type === "slack";
  }
}

// ✅ Se registra sin modificar código existente
notificationOrchestrator.registerChannel(new SlackNotificationChannel());
```

### **🏗️ Validation System - Strategy Pattern**

```typescript
// ✅ OCP COMPLIANT - Strategy Pattern

// 1. Validation strategy interface
interface ValidationStrategy {
  readonly name: string;
  validate(data: any): ValidationResult;
  supports(type: string): boolean;
}

// 2. Specific validators (cerrados para modificación)
class EmailValidationStrategy implements ValidationStrategy {
  readonly name = "email";

  validate(data: string): ValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: emailRegex.test(data),
      errors: !emailRegex.test(data) ? ["Invalid email format"] : [],
    };
  }

  supports(type: string): boolean {
    return type === "email";
  }
}

class PhoneValidationStrategy implements ValidationStrategy {
  readonly name = "phone";

  validate(data: string): ValidationResult {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return {
      isValid: phoneRegex.test(data),
      errors: !phoneRegex.test(data) ? ["Invalid phone format"] : [],
    };
  }

  supports(type: string): boolean {
    return type === "phone";
  }
}

// 3. Validation orchestrator (abierto para extensión)
class ValidationOrchestrator {
  private strategies: ValidationStrategy[] = [];

  registerStrategy(strategy: ValidationStrategy): void {
    this.strategies.push(strategy);
  }

  validate(type: string, data: any): ValidationResult {
    const strategy = this.strategies.find((s) => s.supports(type));
    if (!strategy) {
      throw new ValidationStrategyNotFoundError(type);
    }
    return strategy.validate(data);
  }
}

// ✅ Extensión SIN modificación
class CPFValidationStrategy implements ValidationStrategy {
  readonly name = "cpf";

  validate(data: string): ValidationResult {
    // CPF validation logic
  }

  supports(type: string): boolean {
    return type === "cpf";
  }
}

// ✅ Se registra sin modificar código existente
validationOrchestrator.registerStrategy(new CPFValidationStrategy());
```

### **🏗️ Payment System - Provider Pattern**

```typescript
// ✅ OCP COMPLIANT - Provider Pattern

// 1. Payment provider interface
interface PaymentProvider {
  readonly name: string;
  processPayment(request: PaymentRequest): Promise<PaymentResult>;
  supports(provider: string): boolean;
  validatePaymentData(data: PaymentData): ValidationResult;
}

// 2. Specific providers (cerrados para modificación)
class StripePaymentProvider implements PaymentProvider {
  readonly name = "stripe";

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    // Stripe implementation
  }

  supports(provider: string): boolean {
    return provider === "stripe";
  }

  validatePaymentData(data: PaymentData): ValidationResult {
    // Stripe-specific validation
  }
}

class PayPalPaymentProvider implements PaymentProvider {
  readonly name = "paypal";

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    // PayPal implementation
  }

  supports(provider: string): boolean {
    return provider === "paypal";
  }

  validatePaymentData(data: PaymentData): ValidationResult {
    // PayPal-specific validation
  }
}

// 3. Payment orchestrator (abierto para extensión)
class PaymentOrchestrator {
  private providers: PaymentProvider[] = [];

  registerProvider(provider: PaymentProvider): void {
    this.providers.push(provider);
  }

  async processPayment(
    providerName: string,
    request: PaymentRequest
  ): Promise<PaymentResult> {
    const provider = this.providers.find((p) => p.supports(providerName));
    if (!provider) {
      throw new PaymentProviderNotFoundError(providerName);
    }

    const validation = provider.validatePaymentData(request.data);
    if (!validation.isValid) {
      throw new PaymentValidationError(validation.errors);
    }

    return provider.processPayment(request);
  }
}

// ✅ Extensión SIN modificación
class MercadoPagoPaymentProvider implements PaymentProvider {
  readonly name = "mercadopago";

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    // MercadoPago implementation
  }

  supports(provider: string): boolean {
    return provider === "mercadopago";
  }

  validatePaymentData(data: PaymentData): ValidationResult {
    // MercadoPago validation
  }
}

// ✅ Se registra sin modificar código existente
paymentOrchestrator.registerProvider(new MercadoPagoPaymentProvider());
```

## 📋 **Tareas Específicas**

### **🔧 Backend Refactoring**

- [ ] **Notification System**
  - [ ] Crear `NotificationChannel` abstract class
  - [ ] Refactorizar canales existentes (Email, Push, SMS)
  - [ ] Implementar `NotificationOrchestrator`
  - [ ] Crear registry pattern para canales
  - [ ] Migrar código existente

- [ ] **Validation System**
  - [ ] Crear `ValidationStrategy` interface
  - [ ] Refactorizar validadores existentes
  - [ ] Implementar `ValidationOrchestrator`
  - [ ] Crear factory pattern para estrategias
  - [ ] Integrar con DTOs existentes

- [ ] **Payment System**
  - [ ] Crear `PaymentProvider` interface
  - [ ] Preparar estructura para Stripe/PayPal/Redsys
  - [ ] Implementar `PaymentOrchestrator`
  - [ ] Crear configuration management
  - [ ] Establecer error handling

- [ ] **Plugin Architecture**
  - [ ] Crear `PluginManager` para extensiones
  - [ ] Implementar dependency injection
  - [ ] Configurar NestJS modules dinámicos
  - [ ] Establecer plugin lifecycle

### **🧪 Testing Strategy**

- [ ] **Unit Tests**
  - [ ] Tests para cada strategy/provider
  - [ ] Tests para orchestrators
  - [ ] Verificar extensibilidad
  - [ ] Mock external dependencies

- [ ] **Integration Tests**
  - [ ] Tests de registration de plugins
  - [ ] Tests de flujo completo
  - [ ] Tests de error handling
  - [ ] Performance tests

### **📚 Documentation**

- [ ] **Extension Guides**
  - [ ] Cómo crear nuevos notification channels
  - [ ] Cómo agregar validation strategies
  - [ ] Cómo implementar payment providers
  - [ ] Plugin development guide

## 🧪 **Criterios de Aceptación**

### **✅ Validación OCP**

- [ ] **Extensibilidad**: Nuevas funcionalidades sin modificar código existente
- [ ] **Plugin Architecture**: Sistema de plugins funcional
- [ ] **Strategy Pattern**: Implementado correctamente
- [ ] **Factory Pattern**: Configuración dinámica

### **✅ Quality Gates**

- [ ] **Zero Modification**: Código existente no modificado para extensiones
- [ ] **Dynamic Registration**: Plugins se registran en runtime
- [ ] **Error Handling**: Manejo robusto de providers no encontrados
- [ ] **Performance**: Sin degradación por architecture flexible

### **✅ Verificación Automática**

```typescript
// Tests que verifican OCP compliance
describe("OCP Compliance", () => {
  it("should allow adding new notification channels without modification", () => {
    const orchestrator = new NotificationOrchestrator();
    const initialChannelCount = orchestrator.getRegisteredChannels().length;

    // Add new channel without modifying existing code
    orchestrator.registerChannel(new CustomNotificationChannel());

    expect(orchestrator.getRegisteredChannels().length).toBe(
      initialChannelCount + 1
    );
  });

  it("should process payments with dynamically registered providers", () => {
    const paymentOrchestrator = new PaymentOrchestrator();

    // Register new provider without modifying existing code
    paymentOrchestrator.registerProvider(new CustomPaymentProvider());

    expect(() =>
      paymentOrchestrator.processPayment("custom", request)
    ).not.toThrow();
  });
});
```

## 📊 **Métricas de Éxito**

### **Extensibility Metrics**

- **Plugin Registration Time**: < 1ms por plugin
- **Dynamic Loading**: Support para carga en runtime
- **Memory Footprint**: Sin incremento significativo
- **Configuration Complexity**: Configuración simple

### **Maintenance Metrics**

- **Code Modification**: 0 modificaciones para nuevas extensiones
- **Extension Development Time**: < 2 horas por nueva extension
- **Testing Effort**: Tests aislados por extension

## 🔗 **Enlaces y Referencias**

### **Código Existente**

- `packages/api/src/notification/` - Para refactorizar
- `packages/api/src/auth/validation/` - Para extensibilidad
- `packages/api/src/billing/` - Para payment providers

### **Documentación**

- [Open/Closed Principle](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle)
- [Strategy Pattern](https://refactoring.guru/design-patterns/strategy)
- [Plugin Architecture](https://martinfowler.com/articles/plugins.html)

## 🚀 **Próximos Pasos**

1. **Completar SOLID-002** (OCP)
2. **Continuar con SOLID-003** (LSP)
3. **Validar extensibilidad** con plugins de prueba
4. **Documentar arquitectura** extensible

---

## 💡 **Notas Importantes**

### **⚠️ Consideraciones Críticas**

- **Performance**: Arquitectura flexible no debe impactar rendimiento
- **Complexity**: Balance entre extensibilidad y simplicidad
- **Security**: Validar plugins antes de registration
- **Configuration**: Gestión centralizada de extensiones

### **🎯 Impacto Esperado**

- ✅ **Extensibilidad sin límites** para nuevas funcionalidades
- ✅ **Reduced coupling** entre componentes
- ✅ **Plugin ecosystem** preparado
- ✅ **Future-proof architecture** establecida

---

**Este ticket establece la base extensible para todo el sistema.**
