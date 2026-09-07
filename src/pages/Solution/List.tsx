import { useState } from 'react';
import { Card, Row, Col, Button, Tag, Input, Select, Space, Typography, Empty, Popconfirm, message } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, CopyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSolutionStore } from '@/store/solution';
import { useThemeStore } from '@/store/theme';

const { Option } = Select;
const { Title, Text } = Typography;

const SolutionList: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const { solutions, deleteSolution } = useSolutionStore();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterIndustry, setFilterIndustry] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchText, setSearchText] = useState('');

  const industries = [
    { value: 'finance', label: '金融' },
    { value: 'government', label: '政务' },
    { value: 'healthcare', label: '医疗' },
    { value: 'education', label: '教育' },
    { value: 'energy', label: '能源' },
    { value: 'telecom', label: '电信' },
  ];

  const filteredSolutions = solutions.filter((s) => {
    if (filterType !== 'all' && s.type !== filterType) return false;
    if (filterIndustry !== 'all' && s.industry !== filterIndustry) return false;
    if (filterStatus !== 'all' && s.status !== filterStatus) return false;
    if (searchText) {
      const lower = searchText.toLowerCase();
      return (
        s.name.toLowerCase().includes(lower) ||
        s.customerName.toLowerCase().includes(lower)
      );
    }
    return true;
  });

  const handleDelete = (id: string) => {
    deleteSolution(id);
    message.success('已删除');
  };

  const handleCopy = (solution: any) => {
    const newSolution = {
      ...solution,
      id: Date.now().toString(),
      name: `${solution.name} (副本)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    navigate('/solution/create', { state: { template: newSolution } });
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ marginBottom: 8 }}>方案列表</Title>
        <Text type="secondary">管理所有方案，支持新建、编辑、删除和导出</Text>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <Space wrap>
              <Input
                placeholder="搜索方案名称或客户..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 240 }}
                allowClear
              />
              <Select value={filterType} onChange={setFilterType} style={{ width: 120 }}>
                <Option value="all">全部类型</Option>
                <Option value="network">网络建设</Option>
                <Option value="security">网络安全</Option>
              </Select>
              <Select value={filterIndustry} onChange={setFilterIndustry} style={{ width: 120 }}>
                <Option value="all">全部行业</Option>
                {industries.map((ind) => (
                  <Option key={ind.value} value={ind.value}>{ind.label}</Option>
                ))}
              </Select>
              <Select value={filterStatus} onChange={setFilterStatus} style={{ width: 120 }}>
                <Option value="all">全部状态</Option>
                <Option value="draft">草稿</Option>
                <Option value="completed">已完成</Option>
              </Select>
            </Space>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/solution/create')} size="large">
              新建方案
            </Button>
          </Col>
        </Row>
      </Card>

      {filteredSolutions.length === 0 ? (
        <Card>
          <Empty description="暂无方案">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/solution/create')}>
              新建方案
            </Button>
          </Empty>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredSolutions.map((solution) => (
            <Col key={solution.id} xs={24} sm={12} lg={8} xl={6}>
              <Card
                hoverable
                style={{ borderRadius: 8, height: '100%' }}
                actions={[
                  <Tooltip title="查看" key="view">
                    <Button type="text" icon={<EyeOutlined />} onClick={() => navigate(`/solution/${solution.id}`)} />
                  </Tooltip>,
                  <Tooltip title="编辑" key="edit">
                    <Button type="text" icon={<EditOutlined />} onClick={() => navigate(`/solution/edit/${solution.id}`)} />
                  </Tooltip>,
                  <Tooltip title="复制" key="copy">
                    <Button type="text" icon={<CopyOutlined />} onClick={() => handleCopy(solution)} />
                  </Tooltip>,
                  <Popconfirm title="确定删除该方案？" onConfirm={() => handleDelete(solution.id)} okText="确定" cancelText="取消">
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Popconfirm>,
                ]}
              >
                <div style={{ marginBottom: 12 }}>
                  <Space>
                    <Tag color={solution.type === 'network' ? 'blue' : 'red'}>
                      {solution.type === 'network' ? '网络建设' : '网络安全'}
                    </Tag>
                    <Tag color={solution.status === 'completed' ? 'green' : 'orange'}>
                      {solution.status === 'completed' ? '已完成' : '草稿'}
                    </Tag>
                  </Space>
                </div>
                <Title level={5} style={{ marginBottom: 8 }} ellipsis={{ rows: 1 }}>
                  {solution.name}
                </Title>
                <div style={{ color: theme.colors.textSecondary, marginBottom: 8 }}>
                  <Text type="secondary">{solution.customerName}</Text>
                </div>
                <div style={{ color: theme.colors.textTertiary, fontSize: 12 }}>
                  {solution.industry && <Tag>{industries.find(i => i.value === solution.industry)?.label}</Tag>}
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {new Date(solution.updatedAt).toLocaleDateString()}
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default SolutionList;
