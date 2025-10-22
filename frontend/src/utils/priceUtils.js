/**
 * Utility functions for price formatting and handling
 */

/**
 * Format price with Rs. prefix for display
 * @param {string|number} price - The price value to format
 * @returns {string} - Formatted price with Rs. prefix (e.g., "Rs. 49.99")
 */
export const formatPrice = (price) => {
  if (!price) return "Rs. 0.00";
  
  // Remove any existing Rs prefix and clean the price
  const cleanPrice = price.toString().replace(/[Rs.,\s]/g, '');
  const numericPrice = parseFloat(cleanPrice);
  
  // Return formatted price with Rs prefix
  if (isNaN(numericPrice)) return "Rs. 0.00";
  return `Rs. ${numericPrice.toFixed(2)}`;
};

/**
 * Clean price for database storage (numeric value only)
 * @param {string|number} price - The price value to clean
 * @returns {number} - Clean numeric price value
 */
export const parsePrice = (price) => {
  if (!price) return 0;
  
  const cleanPrice = price.toString().replace(/[Rs.,\s]/g, '');
  const numericPrice = parseFloat(cleanPrice);
  
  return isNaN(numericPrice) ? 0 : numericPrice;
};

/**
 * Clean price for database storage (numeric value only)
 * @param {string|number} price - The price value to clean
 * @returns {number} - Clean numeric price value for database storage
 */
export const cleanPriceForDB = (price) => {
  if (!price) return 0;
  
  const cleanPrice = price.toString().replace(/[Rs.,\s]/g, '');
  const numericPrice = parseFloat(cleanPrice);
  
  return isNaN(numericPrice) ? 0 : numericPrice;
};

/**
 * Format price with Rs. prefix and locale formatting for display
 * @param {string|number} price - The price value to format
 * @returns {string} - Formatted price with Rs. prefix and thousand separators
 */
export const formatPriceWithLocale = (price) => {
  if (!price) return "Rs. 0.00";
  
  const cleanPrice = price.toString().replace(/[Rs.,\s]/g, '');
  const numericPrice = parseFloat(cleanPrice);
  
  if (isNaN(numericPrice)) return "Rs. 0.00";
  return `Rs. ${numericPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Validate if a price string is in valid format
 * @param {string} price - The price string to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidPrice = (price) => {
  if (!price) return false;
  
  const cleanPrice = price.toString().replace(/[Rs.,\s]/g, '');
  const numericPrice = parseFloat(cleanPrice);
  
  return !isNaN(numericPrice) && numericPrice >= 0;
};