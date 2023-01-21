// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';
import { AuthWrapper } from './context/Auth';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <AuthWrapper>
      <ThemeProvider>
        <ScrollToTop />
        <StyledChart />
        <Router />
      </ThemeProvider>
    </AuthWrapper>
  );
}
