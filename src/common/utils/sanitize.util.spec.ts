import { stripHtml, sanitizeRichHtml, sanitizeUrl } from './sanitize.util';

describe('sanitize.util', () => {

  describe('stripHtml', () => {

    it('should return plain text unchanged', () => {
      expect(stripHtml('Hola mundo')).toBe('Hola mundo');
    });

    it('should strip all HTML tags leaving only the text content', () => {
      expect(stripHtml('<p>Hola <strong>mundo</strong></p>')).toBe('Hola mundo');
    });

    it('should strip script tags and their content', () => {
      const malicious = '<script>alert("xss")</script>Hola';
      expect(stripHtml(malicious)).not.toContain('<script>');
      expect(stripHtml(malicious)).not.toContain('alert');
    });

    it('should strip inline event handler attributes along with the tag', () => {
      const malicious = '<img src="x" onerror="alert(1)">Hola';
      const result = stripHtml(malicious);
      expect(result).not.toContain('onerror');
      expect(result).not.toContain('<img');
    });
  });

  describe('sanitizeRichHtml', () => {

    it('should keep the allowed subset of tags', () => {
      const input = '<p>Hola <strong>mundo</strong></p><ul><li>item</li></ul>';
      expect(sanitizeRichHtml(input)).toBe(input);
    });

    it('should strip script tags and their content', () => {
      const malicious = '<p>Hola</p><script>alert("xss")</script>';
      const result = sanitizeRichHtml(malicious);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
      expect(result).toContain('<p>Hola</p>');
    });

    it('should strip inline event handler attributes', () => {
      const malicious = '<p onclick="alert(1)">Hola</p>';
      const result = sanitizeRichHtml(malicious);
      expect(result).not.toContain('onclick');
    });

    it('should strip tags that are not in the allowed list (e.g. iframe)', () => {
      const malicious = '<iframe src="https://evil.com"></iframe><p>Hola</p>';
      const result = sanitizeRichHtml(malicious);
      expect(result).not.toContain('<iframe');
      expect(result).toContain('<p>Hola</p>');
    });

    it('should block dangerous protocols in href attributes', () => {
      const malicious = '<a href="javascript:alert(1)">click</a>';
      const result = sanitizeRichHtml(malicious);
      expect(result).not.toContain('javascript:');
    });

    it('should allow safe http/https/mailto links', () => {
      const input = '<a href="https://example.com">link</a>';
      expect(sanitizeRichHtml(input)).toContain('href="https://example.com"');
    });

    it('should keep allowed class attribute on generic tags', () => {
      const input = '<div class="highlight">Hola</div>';
      expect(sanitizeRichHtml(input)).toBe(input);
    });
  });

  describe('sanitizeUrl', () => {

    it('should return safe http/https URLs unchanged (trimmed)', () => {
      expect(sanitizeUrl('https://example.com/image.jpg')).toBe('https://example.com/image.jpg');
      expect(sanitizeUrl('  http://example.com/image.jpg  ')).toBe('http://example.com/image.jpg');
    });

    it('should return an empty string for javascript: URLs', () => {
      expect(sanitizeUrl('javascript:alert(1)')).toBe('');
    });

    it('should return an empty string for data: URLs', () => {
      expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('');
    });

    it('should return an empty string for vbscript: URLs', () => {
      expect(sanitizeUrl('vbscript:msgbox(1)')).toBe('');
    });

    it('should block dangerous protocols regardless of letter casing', () => {
      expect(sanitizeUrl('JavaScript:alert(1)')).toBe('');
    });

    it('should allow relative paths', () => {
      expect(sanitizeUrl('/uploads/image.jpg')).toBe('/uploads/image.jpg');
    });
  });
});
