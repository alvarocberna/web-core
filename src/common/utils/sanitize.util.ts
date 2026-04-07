import sanitizeHtml from 'sanitize-html';

const DANGEROUS_URL_PROTOCOLS = /^(javascript|data|vbscript):/i;

/**
 * Strips all HTML tags from a string, leaving plain text only.
 * Use for names, titles, descriptions and any field that should not contain HTML.
 */
export function stripHtml(value: string): string {
  return sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'discard',
  });
}

/**
 * Sanitizes rich HTML content, allowing a safe subset of tags and attributes.
 * Blocks scripts, event handlers, and dangerous URL protocols.
 * Use for article section content (contenido_sec) from rich-text editors.
 */
export function sanitizeRichHtml(value: string): string {
  return sanitizeHtml(value, {
    allowedTags: [
      'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'strong', 'em', 'b', 'i', 'u', 's', 'mark', 'code', 'pre',
      'blockquote', 'ul', 'ol', 'li',
      'a', 'br', 'hr', 'span', 'div',
      'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
    ],
    allowedAttributes: {
      'a': ['href', 'target', 'rel', 'title'],
      'img': ['src', 'alt', 'width', 'height', 'title'],
      '*': ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      'img': ['http', 'https'],
      'a': ['http', 'https', 'mailto'],
    },
    disallowedTagsMode: 'discard',
    allowedIframeHostnames: [],
  });
}

/**
 * Sanitizes a URL by removing dangerous protocols (javascript:, data:, vbscript:).
 * Returns empty string if the URL uses a dangerous protocol.
 * Use for img_url and image_url fields.
 */
export function sanitizeUrl(value: string): string {
  const trimmed = value.trim();
  if (DANGEROUS_URL_PROTOCOLS.test(trimmed)) {
    return '';
  }
  return trimmed;
}
