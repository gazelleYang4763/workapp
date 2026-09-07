import { useState } from 'react';
import { Table, Button, Tag, Input, Select, Space, Typography, message, Popconfirm, Card } from 'antd';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const industries: Record<string, string> = {
    finance: '金融', government: '政务', healthcare: '医疗', education: '教育',
    energy: '能源', transport: '交通', telecom: '电信', manufacturing: '制造业',
    internet: '互联网', retail: '零售',
  };

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

  const handleCopy = (record: any) => {
    const newSolution = {
      ...record,
      id: Date.now().toString(),
      name: `${record.name} (副本)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    navigate('/solution/create', { state: { template: newSolution } });
  };

  const columns = [
    {
      title: '序号',
      key: 'index',
      width: 70,
      render: (_: any, __: any, index: number) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: '方案类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => (
        <Tag color={type === 'network' ? 'blue' : 'red'}>
          {type === 'network' ? '网络建设' : '网络安全'}
        </Tag>
      ),
    },
    {
      title: '方案名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <a onClick={() => navigate(`/solution/${record.id}`)} style={{ fontWeight: 500 }}>
          {text}
        </a>
      ),
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
    },
    {
      title: '所属行业',
      dataIndex: 'industry',
      key: 'industry',
      width: 100,
      render: (industry: string) => industries[industry] || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'green' : 'orange'}>
          {status === 'completed' ? '已完成' : '草稿'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (text: string) => text ? new Date(text).toLocaleString() : '-',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 160,
      render: (text: string) => text ? new Date(text).toLocaleString() : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/solution/${record.id}`)}
          >
            打开
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/solution/edit/${record.id}`)}
          >
            修改
          </Button>
          <Popconfirm
            title="确定要删除该方案吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>方案列表</Title>
          <Text type="secondary">共 {filteredSolutions.length} 个方案</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/solution/create')}>
          新建方案
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
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
              {Object.entries(industries).map(([value, label]) => (
                <Option key={value} value={value}>{label}</Option>
              ))}
            </Select>
            <Select value={filterStatus} onChange={setFilterStatus} style={{ width: 120 }}>
              <Option value="all">全部状态</Option>
              <Option value="draft">草稿</Option>
              <Option value="completed">已完成</Option>
            </Select>
          </Space>
        </div>

        <Table
          dataSource={filteredSolutions}
          columns={columns}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: filteredSolutions.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
        />
      </Card>
    </div>
  );
};

export default SolutionList;
