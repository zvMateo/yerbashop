/**
 * Construye una URL a partir de una base y un camino opcional añadiendo parámetros de consulta.
 *
 * @param base - URL base, por ejemplo `"https://ejemplo.com"`.
 * @param path - Ruta relativa, por ejemplo `"/usuarios"`.
 * @param params - Objeto con parámetros de consulta.
 * @returns La URL resultante como cadena.
 *
 * @example
 * buildUrl("https://ejemplo.com", "/buscar", { q: "yerba", page: 2 });
 * // => "https://ejemplo.com/buscar?q=yerba&page=2"
 */
export function buildUrl(
  base: string | URL,
  path = "",
  params: Record<string, string | number | boolean | undefined> = {},
): string {
  const url = new URL(path, base);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}

/**
 * Normaliza una URL eliminando barras repetidas y la barra final innecesaria.
 *
 * @param input - La URL a normalizar.
 * @returns La URL normalizada como cadena.
 *
 * @example
 * normalizeUrl("https://ejemplo.com//foo/bar/");
 * // => "https://ejemplo.com/foo/bar"
 */
export function normalizeUrl(input: string | URL): string {
  const url = new URL(String(input));
  url.pathname = url.pathname.replace(/\/{2,}/g, "/");
  if (url.pathname !== "/" && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
  }
  return url.toString();
}
