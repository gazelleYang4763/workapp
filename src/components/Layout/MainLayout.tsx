import { useState } from 'react';
import { Layout, Menu, Input, Button, Breadcrumb, Space } from 'antd';
import {
  HomeOutlined,
  FileTextOutlined,
  BookOutlined,
  SearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SaveOutlined,
  PlusOutlined,
  UndoOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useThemeStore } from '@/store/theme';
import ThemeToggle from '../ThemeToggle';

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useThemeStore();
  const isHome = location.pathname === '/';

  const getOpenKeys = () => {
    const path = location.pathname;
    if (path.startsWith('/solution')) return ['solution'];
    if (path.startsWith('/knowledge')) return ['knowledge'];
    return [];
  };

  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path === '/solution' || path.startsWith('/solution/list')) return ['solution-list'];
    if (path === '/solution/create') return ['solution-create'];
    if (path.startsWith('/knowledge/common')) return ['knowledge-common'];
    if (path.startsWith('/knowledge/products')) return ['knowledge-products'];
    if (path.startsWith('/knowledge/competitors')) return ['knowledge-competitors'];
    if (path.startsWith('/knowledge/cases')) return ['knowledge-cases'];
    if (path.startsWith('/knowledge/standards')) return ['knowledge-standards'];
    if (path.startsWith('/knowledge/custom')) return ['knowledge-custom'];
    return [];
  };

  const menuItems = [
    {
      key: 'solution',
      icon: <FileTextOutlined />,
      label: '方案中心',
      children: [
        { key: 'solution-list', label: '方案列表' },
        { key: 'solution-create', label: '新建方案' },
      ],
    },
    {
      key: 'knowledge',
      icon: <BookOutlined />,
      label: '知识库',
      children: [
        { key: 'knowledge-common', label: '通识知识库' },
        { key: 'knowledge-products', label: '产品知识库' },
        { key: 'knowledge-competitors', label: '竞品分析库' },
        { key: 'knowledge-cases', label: '行业案例库' },
        { key: 'knowledge-standards', label: '标准规范库' },
        { key: 'knowledge-custom', label: '我的知识库' },
      ],
    },
  ];

  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'solution-list':
        navigate('/solution');
        break;
      case 'solution-create':
        navigate('/solution/create');
        break;
      case 'knowledge-common':
        navigate('/knowledge/common');
        break;
      case 'knowledge-products':
        navigate('/knowledge/products');
        break;
      case 'knowledge-competitors':
        navigate('/knowledge/competitors');
        break;
      case 'knowledge-cases':
        navigate('/knowledge/cases');
        break;
      case 'knowledge-standards':
        navigate('/knowledge/standards');
        break;
      case 'knowledge-custom':
        navigate('/knowledge/custom');
        break;
    }
  };

  const getBreadcrumbItems = () => {
    const path = location.pathname;
    const items: { title: string; href?: string }[] = [{ title: '首页', href: '/' }];

    if (path.startsWith('/solution')) {
      items.push({ title: '方案中心', href: '/solution' });
      if (path.includes('/create')) {
        items.push({ title: '新建方案' });
      } else if (path.match(/\/solution\/[^/]+$/)) {
        items.push({ title: '方案详情' });
      }
    } else if (path.startsWith('/knowledge')) {
      items.push({ title: '知识库', href: '/knowledge' });
      if (path.includes('/common')) items.push({ title: '通识知识库' });
      if (path.includes('/products')) items.push({ title: '产品知识库' });
      if (path.includes('/competitors')) items.push({ title: '竞品分析库' });
      if (path.includes('/cases')) items.push({ title: '行业案例库' });
      if (path.includes('/standards')) items.push({ title: '标准规范库' });
      if (path.includes('/custom')) items.push({ title: '我的知识库' });
    } else if (path.includes('/security-sites')) {
      items.push({ title: '安全站点' });
    }

    return items;
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/solution')) return '方案中心';
    if (path.startsWith('/knowledge')) return '知识库';
    return '工作台';
  };

  if (isHome) {
    return (
      <Layout style={{ minHeight: '100vh', background: theme.colors.bgLayout }}>
        <Outlet />
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: theme.colors.bgLayout }}>
      <Sider
        width={240}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        style={{
          background: theme.colors.menuBg,
          borderRight: `1px solid ${theme.colors.border}`,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <div style={{ padding: '16px', textAlign: 'center', borderBottom: `1px solid ${theme.colors.border}` }}>
          <div style={{ fontSize: 24, color: theme.colors.primary }}>📋</div>
          {!collapsed && (
            <div style={{ marginTop: 8, fontWeight: 600, color: theme.colors.textPrimary }}>工作台</div>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ background: 'transparent', border: 'none' }}
        />
        <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: theme.colors.textSecondary }}
          />
        </div>
      </Sider>

      <Layout>
        <Header style={{
          background: theme.colors.bgContainer,
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: `1px solid ${theme.colors.border}`,
          height: 60,
        }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: theme.colors.textPrimary }}>
            {getPageTitle()}
          </span>
        </Header>

        <div style={{
          background: theme.colors.bgContainer,
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.colors.border}`,
        }}>
          <Space>
            <Button icon={<PlusOutlined />} style={{ borderRadius: 8 }}>新建</Button>
            <Button icon={<SaveOutlined />} type="primary" style={{ borderRadius: 8 }}>保存</Button>
            <Button icon={<UndoOutlined />} style={{ borderRadius: 8 }}>撤销</Button>
            <Button icon={<RedoOutlined />} style={{ borderRadius: 8 }}>重做</Button>
          </Space>
          <Space>
            <span style={{ color: theme.colors.textSecondary, fontSize: 12 }}>✓ 已保存</span>
            <Search
              placeholder="搜索..."
              onSearch={handleSearch}
              style={{ width: 250 }}
            />
          </Space>
        </div>

        <Content style={{ padding: 24, minHeight: 'calc(100vh - 120px)' }}>
          <Breadcrumb items={getBreadcrumbItems()} style={{ marginBottom: 16 }} />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
