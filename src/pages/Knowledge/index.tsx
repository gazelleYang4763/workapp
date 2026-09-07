import { Card, Row, Col, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/theme';

const KnowledgeHome: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();

  const categories = [
    { title: '通识知识库', path: '/knowledge/common', icon: '📚', desc: '等保2.0、网络建设、安全技术等' },
    { title: '产品知识库', path: '/knowledge/products', icon: '📦', desc: '网络设备、安全设备产品信息' },
    { title: '竞品分析库', path: '/knowledge/competitors', icon: '📊', desc: '竞品品牌、功能对比分析' },
    { title: '行业案例库', path: '/knowledge/cases', icon: '🏢', desc: '各行业成功案例参考' },
    { title: '标准规范库', path: '/knowledge/standards', icon: '📋', desc: '国家标准、行业法规' },
    { title: '我的知识库', path: '/knowledge/custom', icon: '📝', desc: '自定义知识库管理' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24, color: theme.colors.textPrimary }}>知识库</h2>
      <Row gutter={[16, 16]}>
        {categories.map((cat, index) => (
          <Col key={index} xs={24} sm={12} lg={8}>
            <Card
              hoverable
              onClick={() => navigate(cat.path)}
              style={{ borderRadius: 8, height: '100%' }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>{cat.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: theme.colors.textPrimary, marginBottom: 8 }}>
                {cat.title}
              </div>
              <div style={{ color: theme.colors.textSecondary }}>{cat.desc}</div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default KnowledgeHome;
