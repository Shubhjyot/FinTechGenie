import { config } from '../config/config';

// ... in your API calls
const headers = {
  'Authorization': `Bearer ${config.indianStockApiKey}`,
  'Content-Type': 'application/json'
};