import { ConfigProvider, theme as antdTheme } from 'antd';
import { RouterProvider } from 'react-router-dom';
import zhCN from 'antd/locale/zh_CN';
import { useThemeStore } from '@/store/theme';
import router from '@/router';

const App: React.FC = () => {
  const { mode, theme } = useThemeStore();

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: theme.colors.primary,
          colorBgBase: theme.colors.bgBase,
          colorBgContainer: theme.colors.bgContainer,
          colorBgLayout: theme.colors.bgLayout,
          colorText: theme.colors.textPrimary,
          colorTextSecondary: theme.colors.textSecondary,
          borderRadius: 8,
        },
        algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
