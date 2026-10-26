# Toolkit Kiowa · Gestión de portafolio (sitio estático)

Páginas: 1a Despliegue, 1b Inventario, 2 Mapa por zonas, 3 Priorización y «sí condicionado».

## Subir a Vercel
1. Dashboard de Vercel > Add New > Project > subir esta carpeta (o `vercel --prod` dentro de ella).
2. Framework: Other. Sin build command. Output/Root: la carpeta raíz (donde está index.html).
3. `vercel.json` ya activa URLs limpias (/1a-despliegue, /2-mapa...).

Los datos se guardan solo en el navegador de cada persona (localStorage). Usar "Guardar archivo" / "Abrir archivo" para compartir y "Imprimir / PDF" (A3 horizontal).
