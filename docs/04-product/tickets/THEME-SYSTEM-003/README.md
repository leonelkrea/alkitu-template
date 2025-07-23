# THEME-SYSTEM-003: CSS Generation Pipeline

## 📋 **Resumen**
Crear el pipeline de generación de CSS que convierte los datos de tema desde la API a CSS custom properties, compatible con el formato OKLCH de tweakcn.

## 🎯 **Objetivos**
- [ ] Endpoint `/api/themes/:id/css` para generación dinámica
- [ ] Conversión de design tokens a CSS variables
- [ ] Soporte completo para OKLCH color format
- [ ] Sistema de theme rules con especificidad CSS

## 🔧 **Implementación Detallada**

### **1. API Endpoint para CSS Generation**

```typescript
// /packages/api/src/themes/controllers/theme-css.controller.ts
import { Controller, Get, Param, Query, Header } from '@nestjs/common';
import { ThemeCssService } from '../services/theme-css.service';

@Controller('api/themes')
export class ThemeCssController {
  constructor(private readonly themeCssService: ThemeCssService) {}

  @Get(':id/css')
  @Header('Content-Type', 'text/css')
  @Header('Cache-Control', 'public, max-age=3600') // 1 hour cache
  async generateThemeCSS(
    @Param('id') themeId: string,
    @Query('mode') mode?: 'light' | 'dark',
    @Query('minify') minify?: boolean,
  ): Promise<string> {
    return await this.themeCssService.generateCSS(themeId, {
      mode,
      minify: minify === true,
    });
  }

  @Get('company/:companyId/css')
  @Header('Content-Type', 'text/css')
  @Header('Cache-Control', 'public, max-age=1800') // 30 min cache
  async generateCompanyThemeCSS(
    @Param('companyId') companyId: string,
    @Query('mode') mode?: 'light' | 'dark',
  ): Promise<string> {
    const activeTheme = await this.themeCssService.getActiveCompanyTheme(companyId);
    return await this.themeCssService.generateCSS(activeTheme.id, { mode });
  }
}
```

### **2. CSS Generation Service**

```typescript
// /packages/api/src/themes/services/theme-css.service.ts
import { Injectable } from '@nestjs/common';
import { ThemeService } from './theme.service';
import { ThemeRuleService } from './theme-rule.service';
import { DesignToken } from '../types/design-tokens';

interface CSSGenerationOptions {
  mode?: 'light' | 'dark';
  minify?: boolean;
  includeFallbacks?: boolean;
}

@Injectable()
export class ThemeCssService {
  constructor(
    private readonly themeService: ThemeService,
    private readonly themeRuleService: ThemeRuleService,
  ) {}

  async generateCSS(themeId: string, options: CSSGenerationOptions = {}): Promise<string> {
    const theme = await this.themeService.findOne(themeId);
    if (!theme) {
      throw new Error(`Theme ${themeId} not found`);
    }

    const themeRules = await this.themeRuleService.findByTheme(themeId);

    // Generate base CSS variables
    const baseCSS = this.generateBaseCSSVariables(theme, options.mode);
    
    // Generate theme rules CSS
    const rulesCSS = this.generateThemeRulesCSS(themeRules);
    
    // Generate utility classes
    const utilitiesCSS = this.generateUtilityClasses(theme);

    // Combine and optionally minify
    let fullCSS = [baseCSS, rulesCSS, utilitiesCSS].join('\n\n');
    
    if (options.minify) {
      fullCSS = this.minifyCSS(fullCSS);
    }

    return fullCSS;
  }

  private generateBaseCSSVariables(theme: any, mode?: 'light' | 'dark'): string {
    const config = mode === 'dark' ? theme.darkModeConfig : theme.lightModeConfig;
    if (!config) return '';

    // Convert tokens to CSS variables
    const cssVariables = Object.entries(config)
      .map(([key, value]) => this.generateCSSVariable(key, value))
      .join('\n  ');

    const selector = mode === 'dark' ? '.dark' : ':root';

    return `${selector} {
  /* Generated from theme: ${theme.name} */
  ${cssVariables}
}`;
  }

  private generateCSSVariable(key: string, value: any): string {
    // Handle different value types
    if (typeof value === 'string') {
      // Check if it's already a valid CSS value
      if (this.isValidCSSValue(value)) {
        return `--${key}: ${value};`;
      }
      
      // Convert hex to OKLCH if needed
      if (this.isHexColor(value)) {
        const oklch = this.hexToOklch(value);
        return `--${key}: ${oklch};`;
      }
    }

    if (typeof value === 'object' && value.oklch) {
      return `--${key}: oklch(${value.oklch.l} ${value.oklch.c} ${value.oklch.h});`;
    }

    return `--${key}: ${String(value)};`;
  }

  private generateThemeRulesCSS(rules: any[]): string {
    // Sort rules by specificity (GLOBAL < COMPONENT < CONTEXTUAL < INSTANCE)
    const sortedRules = rules.sort((a, b) => 
      this.getSpecificityScore(a.specificity) - this.getSpecificityScore(b.specificity)
    );

    return sortedRules
      .map(rule => this.generateRuleCSS(rule))
      .join('\n\n');
  }

  private generateRuleCSS(rule: any): string {
    const selector = rule.selector || ':root';
    const properties = Object.entries(rule.properties || {})
      .map(([key, value]) => `  ${key}: ${value};`)
      .join('\n');

    return `/* Rule: ${rule.name} (${rule.specificity}) */
${selector} {
${properties}
}`;
  }

  private generateUtilityClasses(theme: any): string {
    const config = theme.lightModeConfig || {};
    
    // Generate utility classes for common patterns
    const utilities = [];

    // Background utilities
    if (config.primary) {
      utilities.push('.bg-primary { background-color: var(--primary); }');
      utilities.push('.bg-primary\\/10 { background-color: color-mix(in oklch, var(--primary) 10%, transparent); }');
    }

    // Text utilities
    if (config.foreground) {
      utilities.push('.text-foreground { color: var(--foreground); }');
    }

    // Border utilities
    if (config.border) {
      utilities.push('.border-border { border-color: var(--border); }');
    }

    return `/* Utility Classes */
${utilities.join('\n')}`;
  }

  private getSpecificityScore(specificity: string): number {
    const scores = {
      'GLOBAL': 1,
      'COMPONENT': 2,
      'CONTEXTUAL': 3,
      'INSTANCE': 4,
    };
    return scores[specificity] || 0;
  }

  private isValidCSSValue(value: string): boolean {
    // Basic validation for CSS values
    return /^(oklch|hsl|rgb|#|var\(|calc\(|\d+px|\d+rem|\d+%)/i.test(value);
  }

  private isHexColor(value: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
  }

  private hexToOklch(hex: string): string {
    // Convert hex to OKLCH using color conversion library
    // This would use a library like 'culori' or similar
    const rgb = this.hexToRgb(hex);
    const oklch = this.rgbToOklch(rgb);
    return `oklch(${oklch.l} ${oklch.c} ${oklch.h})`;
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255,
    } : { r: 0, g: 0, b: 0 };
  }

  private rgbToOklch(rgb: { r: number; g: number; b: number }): { l: number; c: number; h: number } {
    // Simplified conversion - in real implementation use 'culori' library
    // This is a placeholder implementation
    const l = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
    const c = 0.5; // Simplified chroma
    const h = 0; // Simplified hue
    return { l: Number(l.toFixed(4)), c: Number(c.toFixed(4)), h: Number(h.toFixed(1)) };
  }

  private minifyCSS(css: string): string {
    return css
      .replace(/\/\*.*?\*\//gs, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/;\s*}/g, '}') // Remove last semicolon before }
      .replace(/\s*{\s*/g, '{') // Remove spaces around {
      .replace(/\s*}\s*/g, '}') // Remove spaces around }
      .replace(/;\s*/g, ';') // Remove spaces after ;
      .trim();
  }

  async getActiveCompanyTheme(companyId: string) {
    return await this.themeService.findActiveByCompany(companyId);
  }
}
```

### **3. Color Conversion Utilities**

```typescript
// /packages/api/src/themes/utils/color-converter.ts
import { converter } from 'culori';

export class ColorConverter {
  private static oklchConverter = converter('oklch');
  private static rgbConverter = converter('rgb');

  static hexToOklch(hex: string): string {
    const oklch = this.oklchConverter(hex);
    if (!oklch) return 'oklch(0 0 0)';
    
    return `oklch(${oklch.l.toFixed(4)} ${oklch.c.toFixed(4)} ${(oklch.h || 0).toFixed(1)})`;
  }

  static oklchToHex(l: number, c: number, h: number): string {
    const rgb = this.rgbConverter({ mode: 'oklch', l, c, h });
    if (!rgb) return '#000000';
    
    const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  }

  static isValidOklch(value: string): boolean {
    return /^oklch\(\s*[\d.]+\s+[\d.]+\s+[\d.]+\s*\)$/.test(value);
  }

  static parseOklch(value: string): { l: number; c: number; h: number } | null {
    const match = value.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
    if (!match) return null;
    
    return {
      l: parseFloat(match[1]),
      c: parseFloat(match[2]),
      h: parseFloat(match[3]),
    };
  }
}
```

### **4. Theme Rules Specificity System**

```typescript
// /packages/api/src/themes/utils/specificity-calculator.ts
export class SpecificityCalculator {
  static calculateSpecificity(selector: string): number {
    // CSS specificity calculation
    let specificity = 0;
    
    // Count IDs
    const ids = (selector.match(/#[^\s+>~.[:]+/g) || []).length;
    specificity += ids * 100;
    
    // Count classes, attributes, pseudo-classes
    const classes = (selector.match(/(\.[^\s+>~.[:]+|:\w+|\[.*?\])/g) || []).length;
    specificity += classes * 10;
    
    // Count elements and pseudo-elements
    const elements = (selector.match(/[^\s+>~.[:]+/g) || []).length - ids - classes;
    specificity += elements;
    
    return specificity;
  }

  static compareSpecificity(a: string, b: string): number {
    return this.calculateSpecificity(a) - this.calculateSpecificity(b);
  }
}
```

### **5. Caching Strategy**

```typescript
// /packages/api/src/themes/services/theme-cache.service.ts
import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ThemeCacheService {
  constructor(private readonly redis: RedisService) {}

  private getCacheKey(themeId: string, options: any): string {
    const optionsHash = this.hashOptions(options);
    return `theme-css:${themeId}:${optionsHash}`;
  }

  async getCachedCSS(themeId: string, options: any): Promise<string | null> {
    const key = this.getCacheKey(themeId, options);
    return await this.redis.get(key);
  }

  async setCachedCSS(themeId: string, options: any, css: string): Promise<void> {
    const key = this.getCacheKey(themeId, options);
    // Cache for 1 hour
    await this.redis.setex(key, 3600, css);
  }

  async invalidateThemeCache(themeId: string): Promise<void> {
    const pattern = `theme-css:${themeId}:*`;
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  private hashOptions(options: any): string {
    return Buffer.from(JSON.stringify(options)).toString('base64');
  }
}
```

## 🧪 **Testing Strategy**

### **Unit Tests**
```typescript
describe('ThemeCssService', () => {
  test('generates valid CSS from theme data', async () => {
    const mockTheme = {
      id: '1',
      name: 'Test Theme',
      lightModeConfig: {
        primary: '#F2AB27',
        secondary: 'oklch(0.6735 0.1851 146.7724)',
      },
    };

    const css = await service.generateCSS('1');
    expect(css).toContain('--primary: oklch(');
    expect(css).toContain('--secondary: oklch(0.6735 0.1851 146.7724);');
  });

  test('handles theme rules with correct specificity', async () => {
    const css = await service.generateCSS('1');
    expect(css).toMatchSnapshot();
  });
});
```

### **Integration Tests**
```typescript
describe('Theme CSS Endpoint', () => {
  test('GET /api/themes/:id/css returns valid CSS', async () => {
    const response = await request(app)
      .get('/api/themes/1/css')
      .expect(200)
      .expect('Content-Type', /text\/css/);

    expect(response.text).toContain(':root {');
    expect(response.text).toContain('--primary:');
  });
});
```

## 📊 **Performance Benchmarks**

- **CSS Generation**: < 100ms for standard theme
- **Cache Hit Ratio**: > 90% for repeated requests  
- **Gzip Compression**: ~70% size reduction
- **CDN Compatible**: Proper cache headers set

## ✅ **Criterios de Aceptación**

- [ ] Endpoint `/api/themes/:id/css` genera CSS válido
- [ ] Soporte completo para OKLCH color format
- [ ] Theme rules aplicadas con especificidad correcta
- [ ] Cache funcionando correctamente
- [ ] Performance < 100ms para generación
- [ ] CSS minificado opcional
- [ ] Manejo de errores robusto
- [ ] Tests unitarios e integración completos

---

**Estimación**: 4-6 días
**Prioridad**: Alta
**Dependencias**: API de temas existente