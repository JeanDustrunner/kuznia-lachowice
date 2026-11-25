/** Prefixes a root-relative path ("/img/logo.png") with the site's base path, so the app can live in a subfolder. */
export function assetUrl(path: string, base: string = import.meta.env.BASE_URL): string {
  return base.replace(/\/$/, '') + path
}
