import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { lightTheme, darkTheme } from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';
import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';
import Header from './components/Header';
import Footer from './components/Footer';
import GeminiChat from './components/GeminiChat';

// Import all page components
import Home from './pages/Home';
import ReportGenerator from './pages/ReportGenerator';
import DataIndexer from './pages/DataIndexer';
import ViewReports from './pages/ViewReports';
import News from './pages/News';
import About from './pages/About';
import StockComparison from './pages/StockComparison';
import Reports from './pages/Reports';

const ThemedApp = () => {
  const { isDarkMode } = useContext(ThemeContext);
  
  return (
    <StyledThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/generate-report" element={<ReportGenerator />} />
            <Route path="/index-data" element={<DataIndexer />} />
            <Route path="/view-reports" element={<ViewReports />} />
            <Route path="/news" element={<News />} />
            <Route path="/about" element={<About />} />
            <Route path="/compare" element={<StockComparison />} />
            <Route path="/chat" element={<GeminiChat />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </StyledThemeProvider>
  );
};

// Wrap ThemedApp with ThemeProvider
const App = () => {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
};

export default App;
