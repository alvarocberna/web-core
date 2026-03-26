import { Transform } from 'class-transformer';
import { stripHtml, sanitizeRichHtml, sanitizeUrl } from '../utils/sanitize.util';

/**
 * Strips all HTML tags from the value, leaving plain text.
 * Apply to names, titles, descriptions and other plain-text fields.
 */
export const Sanitize = () =>
  Transform(({ value }) =>
    typeof value === 'string' ? stripHtml(value.trim()) : value,
  );

/**
 * Allows a safe subset of HTML tags (headings, bold, links, images, etc.).
 * Blocks scripts, event handlers, and dangerous URL protocols.
 * Apply to rich-text fields like article section content.
 */
export const SanitizeRich = () =>
  Transform(({ value }) =>
    typeof value === 'string' ? sanitizeRichHtml(value) : value,
  );

/**
 * Removes dangerous URL protocols (javascript:, data:, vbscript:).
 * Apply to image URL and link URL fields.
 */
export const SanitizeUrl = () =>
  Transform(({ value }) =>
    typeof value === 'string' ? sanitizeUrl(value) : value,
  );
