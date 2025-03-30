/**
 * Types for news data used in the earthquake relief website
 */

export interface NewsItem {
  /**
   * Unique identifier for the news item
   */
  id: string;



  /**
   * Main content/body text of the news article
   */
  content: string;

  /**
   * URL to the original news article or related resource
   */
  url: string;

  /**
   * Publication date of the news item (in string format)
   */
  date: string;

  /**
   * URL or base64 string for the news item image
   */
  image: string;
}

/**
 * Type for the entire news collection
 */
export type NewsCollection = NewsItem[];
