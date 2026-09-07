import { Card, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/theme';

const KnowledgeHome: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();

  const categories = [
    { title: '通识知识库', path: '/knowledge/common', icon: '📚', desc: '系统预置，只读', count: '4个子库' },
    { title: '产品知识库', path: '/knowledge/products', icon: '📦', desc: '系统预置 + 用户可新增', count: '网络设备/安全设备' },
    { title: '技术文档库', path: '/knowledge/techdocs', icon: '📄', desc: '系统预置 + 用户可新增', count: '组网技术/安全技术' },
    { title: '竞品分析库', path: '/knowledge/competitors', icon: '📊', desc: '系统预置 + 用户可新增', count: '网络品牌/安全品牌' },
    { title: '行业案例库', path: '/knowledge/cases', icon: '🏢', desc: '系统预置 + 用户可新增', count: '网络建设/网络安全' },
    { title: '标准规范库', path: '/knowledge/standards', icon: '📋', desc: '系统预置 + 用户可新增', count: '国家标准/行业法规/技术标准' },
    { title: '我的知识库', path: '/knowledge/custom', icon: '📝', desc: '用户自定义，可编辑', count: '笔记/项目/学习' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24, color: theme.colors.textPrimary }}>知识库</h2>
      <Row gutter={[16, 16]}>
        {categories.map((cat, index) => (
          <Col key={index} xs={24} sm={12} lg={8} xl={8}>
            <Card
              hoverable
              onClick={() => navigate(cat.path)}
              style={{ borderRadius: 8, height: '100%' }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>{cat.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: theme.colors.textPrimary, marginBottom: 4 }}>
                {cat.title}
              </div>
              <div style={{ color: theme.colors.textSecondary, fontSize: 13, marginBottom: 8 }}>{cat.desc}</div>
              <div style={{ color: theme.colors.primary, fontSize: 12 }}>{cat.count}</div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default KnowledgeHome;
