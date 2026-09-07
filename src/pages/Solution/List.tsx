import { useState } from 'react';
import { Card, Row, Col, Button, Tag, Input, Select, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSolutionStore } from '@/store/solution';
import { useThemeStore } from '@/store/theme';

const { Option } = Select;

const SolutionList: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const { solutions } = useSolutionStore();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterIndustry, setFilterIndustry] = useState<string>('all');
  const [searchText, setSearchText] = useState('');

  const filteredSolutions = solutions.filter((s) => {
    if (filterType !== 'all' && s.type !== filterType) return false;
    if (filterIndustry !== 'all' && s.industry !== filterIndustry) return false;
    if (searchText && !s.name.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: theme.colors.textPrimary }}>方案列表</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/solution/create')}>
          新建方案
        </Button>
      </div>

      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="搜索方案..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />
        <Select value={filterType} onChange={setFilterType} style={{ width: 120 }}>
          <Option value="all">全部类型</Option>
          <Option value="network">网络建设</Option>
          <Option value="security">网络安全</Option>
        </Select>
        <Select value={filterIndustry} onChange={setFilterIndustry} style={{ width: 120 }}>
          <Option value="all">全部行业</Option>
          <Option value="finance">金融</Option>
          <Option value="government">政务</Option>
          <Option value="healthcare">医疗</Option>
        </Select>
      </Space>

      <Row gutter={[16, 16]}>
        {filteredSolutions.map((solution) => (
          <Col key={solution.id} xs={24} sm={12} lg={8}>
            <Card
              hoverable
              onClick={() => navigate(`/solution/${solution.id}`)}
              style={{ borderRadius: 8 }}
            >
              <div style={{ fontSize: 16, fontWeight: 600, color: theme.colors.textPrimary, marginBottom: 8 }}>
                {solution.name}
              </div>
              <div style={{ color: theme.colors.textSecondary, marginBottom: 8 }}>
                {solution.customerName}
              </div>
              <Space>
                <Tag color={solution.type === 'network' ? 'blue' : 'red'}>
                  {solution.type === 'network' ? '网络建设' : '网络安全'}
                </Tag>
                <Tag>{solution.industry}</Tag>
                <Tag color={solution.status === 'completed' ? 'green' : 'orange'}>
                  {solution.status === 'completed' ? '已完成' : '草稿'}
                </Tag>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredSolutions.length === 0 && (
        <Card style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ color: theme.colors.textSecondary }}>暂无方案</div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/solution/create')} style={{ marginTop: 16 }}>
            新建方案
          </Button>
        </Card>
      )}
    </div>
  );
};

export default SolutionList;
