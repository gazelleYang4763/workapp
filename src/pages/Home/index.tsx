import { useState, useEffect } from 'react';
import { Input, Button, Row, Col, Typography } from 'antd';
import {
  SearchOutlined,
  FileTextOutlined,
  BookOutlined,
  BarChartOutlined,
  BankOutlined,
  SafetyOutlined,
  SettingOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/theme';
import { useSolutionStore } from '@/store/solution';
import ThemeToggle from '@/components/ThemeToggle';

const { Title } = Typography;
const { Search } = Input;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const { solutions } = useSolutionStore();
  const [background, setBackground] = useState<string>(
    localStorage.getItem('homeBackground') || ''
  );
  const [searchValue, setSearchValue] = useState('');
  const [recentAccess, setRecentAccess] = useState<any[]>([]);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recentAccess') || '[]');
    setRecentAccess(recent.slice(0, 6));
  }, []);

  const quickLinks = [
    { icon: <FileTextOutlined />, title: '方案中心', path: '/solution' },
    { icon: <BookOutlined />, title: '知识库', path: '/knowledge' },
    { icon: <BarChartOutlined />, title: '竞品分析', path: '/knowledge/competitors' },
    { icon: <BankOutlined />, title: '行业案例', path: '/knowledge/cases' },
    { icon: <SafetyOutlined />, title: '标准规范', path: '/knowledge/standards' },
    { icon: <GlobalOutlined />, title: '安全资源', path: '/security-sites' },
  ];

  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  const handleChangeBackground = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          setBackground(url);
          localStorage.setItem('homeBackground', url);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: background
        ? `url(${background}) center/cover no-repeat`
        : `linear-gradient(135deg, ${theme.colors.bgLayout} 0%, ${theme.colors.border} 50%, ${theme.colors.primary}20 100%)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      transition: 'background 0.3s ease',
    }}>
      <div style={{ position: 'fixed', top: 24, right: 24 }}>
        <ThemeToggle />
      </div>

      <div style={{ textAlign: 'center', padding: 40, maxWidth: 900, width: '100%' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
        <Title level={2} style={{ color: theme.colors.primary, marginBottom: 32 }}>
          工作台
        </Title>

        <div style={{ marginBottom: 48 }}>
          <Search
            placeholder="搜索方案、知识库、产品、标准..."
            size="large"
            enterButton="搜索一下"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            style={{ maxWidth: 600 }}
          />
        </div>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 16, color: theme.colors.textSecondary, marginBottom: 16 }}>
            快捷入口
          </div>
          <Row gutter={[16, 16]} justify="center">
            {quickLinks.map((link, index) => (
              <Col key={index}>
                <Button
                  onClick={() => navigate(link.path)}
                  style={{
                    width: 120,
                    height: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 12,
                    background: theme.colors.cardBg,
                    border: `1px solid ${theme.colors.cardBorder}`,
                    boxShadow: theme.colors.shadowCard,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ fontSize: 32, color: theme.colors.primary, marginBottom: 8 }}>
                    {link.icon}
                  </div>
                  <div style={{ fontSize: 14, color: theme.colors.textPrimary }}>
                    {link.title}
                  </div>
                </Button>
              </Col>
            ))}
          </Row>
        </div>

        {recentAccess.length > 0 && (
          <div>
            <div style={{ fontSize: 16, color: theme.colors.textSecondary, marginBottom: 16 }}>
              最近访问
            </div>
            <Row gutter={[16, 16]} justify="center">
              {recentAccess.map((item, index) => (
                <Col key={index}>
                  <Button
                    onClick={() => {
                      if (item.type === 'solution') {
                        navigate(`/solution/${item.id}`);
                      } else {
                        navigate(`/knowledge/${item.type}/${item.id}`);
                      }
                    }}
                    style={{
                      width: 160,
                      height: 80,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 8,
                      background: theme.colors.cardBg,
                      border: `1px solid ${theme.colors.cardBorder}`,
                      boxShadow: theme.colors.shadowCard,
                    }}
                  >
                    <div style={{ fontSize: 14, color: theme.colors.textPrimary, fontWeight: 500 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 12, color: theme.colors.textTertiary, marginTop: 4 }}>
                      {new Date(item.timestamp).toLocaleDateString()}
                    </div>
                  </Button>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>

      <Button
        onClick={handleChangeBackground}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          borderRadius: 20,
          background: 'rgba(255, 255, 255, 0.8)',
          border: `1px solid ${theme.colors.primary}`,
          color: theme.colors.primary,
        }}
      >
        更换背景
      </Button>
    </div>
  );
};

export default Home;
