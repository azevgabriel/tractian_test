import { ConfigProvider } from 'antd';
import ptBR from 'antd/lib/locale/pt_BR';
import 'antd/dist/antd.css';

import { AppRoutes } from './routes';
import { AppProvider } from './hooks';

const App: React.FC = () => {
  return (
    <>
      <ConfigProvider locale={ptBR}>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </ConfigProvider>
    </>
  );
};

export default App;
