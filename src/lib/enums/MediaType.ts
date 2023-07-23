/**
 * Hypertext Transfer Protocol (HTTP) MIME types.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types}
 */
enum MediaType {
  /**
   * HyperText Markup Language (HTML)
   */
  HTML = 'text/html',

  /**
   * JSON format
   */
  JSON = 'application/json',

  /**
   * Adobe Portable Document Format (PDF)
   */
  PDF = 'application/pdf',

  /**
   * Text, (generally ASCII or ISO 8859-n)
   */
  TEXT = 'text/plain'
}

export default MediaType;
