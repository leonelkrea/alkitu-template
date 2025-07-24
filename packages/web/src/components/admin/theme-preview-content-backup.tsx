// Aquí tienes el componente CompactColorPalette ya integrado en el lugar correcto.
// Solo necesitas reemplazar desde la línea que dice "Color de ShadCN Block" hasta el final de ese Card

{/* Compact Color Palette */}
<div className="flex items-center justify-between mb-4">
  <div className="flex items-center gap-2">
    <ThemeToggle />
    <ContrastCheckerDialog compact />
  </div>
</div>
<CompactColorPalette
  title="🎨 Color de ShadCN"
  description="Sistema de colores ShadCN con paleta principal, neutros y semánticos"
  colorGroups={colorGroups}
/>

{/* Color de Material Design Block */}
<MaterialDesignColorSystem currentThemeColors={tokens} />