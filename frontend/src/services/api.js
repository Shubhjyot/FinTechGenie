import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Report API
// Update the generateReport function to include the usePinecone flag

export const generateReport = async (data) => {
  try {
    // Check if the endpoint should be different based on your backend
    const response = await api.post('/reports', {  // Changed from '/reports/generate'
      ...data,
      use_pinecone: data.use_pinecone || false
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Data Indexing API
export const indexTextData = async (data) => {
  try {
    const response = await api.post('/data/index/text', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const indexCsvData = async (formData) => {
  try {
    const response = await api.post('/data/index/csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const indexJsonData = async (formData) => {
  try {
    const response = await api.post('/data/index/json', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Reports API
export const getReports = async (query = '') => {
  try {
    const response = await api.get(`/reports?query=${query}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReportById = async (id) => {
  try {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// News API
// Update the News API function to use the correct endpoint
// Update the fetchNews function to include required parameters
// Update the fetchNews function to handle parameters more flexibly
// News API
export const fetchNews = async (params = {}) => {
  try {
    // Only include non-empty parameters
    const cleanParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        cleanParams[key] = value;
      }
    });
    
    console.log('API request params:', cleanParams);
    
    // Use the fetch-indian-stock endpoint with the correct parameter names
    const response = await api.get('/fetch-indian-stock', { 
      params: cleanParams
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

// Indian Stock News API
export const fetchIndianStockNews = async (params = {}) => {
  try {
    const response = await api.get('/fetch-indian-stock-news', { 
      params: params 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Indian stock news:', error);
    throw error;
  }
};

const INDIAN_STOCK_API_KEY = process.env.REACT_APP_INDIAN_STOCK_API_KEY;

export const fetchIndianStockData = async (stockName) => {
  try {
    const response = await axios.get(`/api/stock-data`, {
      headers: {
        'Authorization': `Bearer ${INDIAN_STOCK_API_KEY}`,
      },
      params: {
        symbol: stockName
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};
export default api;