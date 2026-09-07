import { Button, Tooltip } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useThemeStore } from '@/store/theme';

const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme } = useThemeStore();

  return (
    <Tooltip title={mode === 'light' ? '切换到夜间模式' : '切换到日间模式'}>
      <Button
        type="text"
        icon={mode === 'light' ? <MoonOutlined /> : <SunOutlined />}
        onClick={toggleTheme}
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          background: 'rgba(24, 144, 255, 0.1)',
          border: '1px solid rgba(24, 144, 255, 0.3)',
          color: '#1890ff',
          transition: 'all 0.3s ease',
        }}
      />
    </Tooltip>
  );
};

export default ThemeToggle;
