# Next Go Design System - Reglas UX/UI

## 🎨 PROBLEMA ACTUAL
- Componentes con colores inconsistentes
- Abuso de degradados (gradientes)
- Uso excesivo del morado
- Falta de jerarquía visual clara
- Elementos sin coherencia cromática

## 🎯 SOLUCIÓN: DESIGN SYSTEM CONSISTENTE

### 1. PALETA DE COLORES PRINCIPAL
```css
/* COLORES PRIMARIOS - Basados en confianza y seguridad para actividades */
--primary-blue: #2196F3;        /* Azul principal - confianza */
--primary-cyan: #00BCD4;        /* Cyan - frescura y dinamismo */
--primary-green: #4CAF50;       /* Verde - éxito y seguridad */

/* COLORES NEUTROS - Para textos y fondos */
--neutral-900: #212121;         /* Texto principal */
--neutral-700: #424242;         /* Texto secundario */
--neutral-500: #757575;         /* Texto terciario */
--neutral-300: #E0E0E0;         /* Bordes */
--neutral-100: #F5F5F5;         /* Fondos claros */
--neutral-50: #FAFAFA;          /* Fondos muy claros */
--white: #FFFFFF;

/* COLORES FUNCIONALES - Estados y acciones */
--success: #4CAF50;             /* Verde éxito */
--warning: #FF9800;             /* Naranja advertencia */
--error: #F44336;               /* Rojo error/crítico */
--info: #2196F3;                /* Azul información */
```

### 2. REGLAS DE USO DE COLORES

#### ❌ PROHIBIDO:
- Morado (#673AB7, #764ba2, #667eea)
- Magenta (#E91E63)
- Degradados complejos (más de 2 colores)
- Degradados en texto
- Colores saturados sin propósito

#### ✅ PERMITIDO:
- Azul (#2196F3) - Color principal para CTAs
- Cyan (#00BCD4) - Color secundario para acentos
- Verde (#4CAF50) - Estados positivos/éxito
- Degradados simples SOLO en: hero banner, CTAs principales
- Colores neutros para el 80% de la interfaz

### 3. JERARQUÍA CROMÁTICA

#### NIVEL 1 - Elementos principales:
- **CTAs primarios**: `primary-blue` sólido
- **Headers/títulos**: `neutral-900`
- **Links importantes**: `primary-cyan`

#### NIVEL 2 - Elementos secundarios:
- **CTAs secundarios**: `neutral-700` con border `primary-blue`
- **Subtítulos**: `neutral-700`
- **Links normales**: `primary-blue`

#### NIVEL 3 - Elementos terciarios:
- **Texto descriptivo**: `neutral-500`
- **Iconos decorativos**: `neutral-300`
- **Bordes**: `neutral-300`

### 4. ESTADOS VISUALES

#### Estados de Rifa:
- **Activa**: `primary-blue` + `neutral-100` background
- **Casi completa** (80%+): `warning` + `warning` background al 10%
- **Completa**: `success` + `success` background al 10%
- **Sorteo en curso**: `info` + animación pulse
- **Finalizada**: `neutral-500` + `neutral-100` background

#### Estados de Interacción:
- **Hover**: Color base + opacity 0.8
- **Active**: Color base + brightness 0.9
- **Disabled**: `neutral-300` + opacity 0.6
- **Focus**: Color base + box-shadow azul

### 5. TIPOGRAFÍA CONSISTENTE

```css
/* TAMAÑOS DE FUENTE */
--text-xs: 12px;    /* Labels pequeños */
--text-sm: 14px;    /* Texto secundario */
--text-base: 16px;  /* Texto principal */
--text-lg: 18px;    /* Subtítulos */
--text-xl: 24px;    /* Títulos sección */
--text-2xl: 32px;   /* Títulos página */
--text-3xl: 40px;   /* Hero título */

/* PESOS DE FUENTE */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### 6. ESPACIADO CONSISTENTE

```css
/* ESPACIADO BASE: 8px */
--space-1: 8px;     /* 8px */
--space-2: 16px;    /* 16px */
--space-3: 24px;    /* 24px */
--space-4: 32px;    /* 32px */
--space-5: 40px;    /* 40px */
--space-6: 48px;    /* 48px */
--space-8: 64px;    /* 64px */
```

### 7. COMPONENTES ESPECÍFICOS

#### Tarjetas de Rifa:
- **Fondo**: `white` con sombra sutil
- **Borde**: `neutral-300`
- **Título**: `neutral-900`, `text-lg`, `font-semibold`
- **Precio**: `primary-blue`, `text-xl`, `font-bold`
- **Progreso**: `primary-blue` para barra, `neutral-100` para fondo

#### Botones:
- **Primario**: `primary-blue` fondo, `white` texto
- **Secundario**: `white` fondo, `primary-blue` texto, `primary-blue` borde
- **Peligro**: `error` fondo, `white` texto
- **Hover**: Solo cambio de opacity, NO cambio de color

#### Headers:
- **Fondo**: `white` con opacity 95%
- **Logo**: Sin degradados, solo imagen
- **Links**: `neutral-700` normal, `primary-blue` hover
- **Botón soporte**: `success` fondo, `white` texto

### 8. REGLAS DE ANIMACIÓN

#### ✅ PERMITIDAS:
- Hover: `transform: translateY(-2px)` + `opacity: 0.9`
- Loading: `rotate` simple
- Fade in: `opacity` transition
- Scale: `transform: scale(1.05)` máximo

#### ❌ PROHIBIDAS:
- Animaciones de color complejas
- Rotaciones excesivas
- Múltiples propiedades animándose simultáneamente
- Animaciones que duren más de 300ms

### 9. RESPONSIVE CONSISTENCY

#### Breakpoints:
- **Mobile**: 0-768px
- **Tablet**: 768-1024px  
- **Desktop**: 1024px+

#### Reglas:
- Mismo color en todos los breakpoints
- Espaciado proporcional (mantener ratios)
- Jerarquía visual conservada
- Touch targets mínimo 44px en mobile

### 10. ACCESSIBILITY COMPLIANCE

#### Contraste:
- **Texto normal**: 4.5:1 mínimo
- **Texto grande**: 3:1 mínimo
- **Elementos interactivos**: 3:1 mínimo

#### Focus:
- **Visible**: `outline: 2px solid primary-blue`
- **Offset**: `outline-offset: 2px`

---

## 📋 IMPLEMENTACIÓN PRIORITARIA

1. **Crear nuevo `colors.css`** con variables CSS
2. **Refactorizar `App.css`** eliminando degradados excesivos
3. **Actualizar `RaffleCard.css`** con colores consistentes
4. **Modificar `HomePage.css`** removiendo morados
5. **Testing** de consistencia visual

## 🎯 RESULTADO ESPERADO

- **Visual cohesion**: Todos los componentes con misma paleta
- **Professional appearance**: Sin colores distractores
- **Better usability**: Jerarquía clara y predecible
- **Accessibility**: Contraste y legibilidad mejorados
- **Brand consistency**: Colores alineados con confianza y seguridad