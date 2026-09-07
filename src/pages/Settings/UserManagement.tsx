import { useState } from 'react';
import { Card, Table, Button, Tag, Space, Typography, Switch, Input, Modal, Form, Select, message, Breadcrumb, Descriptions } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, LinkOutlined, CopyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/theme';

const { Title, Text } = Typography;
const { Option } = Select;

interface UserLink {
  id: string;
  name: string;
  url: string;
  role: 'admin' | 'guest';
  createdAt: string;
  lastAccess?: string;
  isActive: boolean;
}

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [links, setLinks] = useState<UserLink[]>([
    {
      id: '1',
      name: '管理员入口',
      url: `${window.location.origin}?role=admin&token=admin123`,
      role: 'admin',
      createdAt: '2024-01-01',
      lastAccess: '2024-03-15 14:30',
      isActive: true,
    },
    {
      id: '2',
      name: '访客入口',
      url: `${window.location.origin}?role=guest&token=guest456`,
      role: 'guest',
      createdAt: '2024-01-01',
      lastAccess: '2024-03-15 10:20',
      isActive: true,
    },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<UserLink | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingLink(null);
    form.resetFields();
    form.setFieldsValue({ role: 'guest', isActive: true });
    setModalOpen(true);
  };

  const handleEdit = (link: UserLink) => {
    setEditingLink(link);
    form.setFieldsValue(link);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
    message.success('已删除');
  };

  const handleToggleActive = (id: string, checked: boolean) => {
    setLinks(links.map((l) => l.id === id ? { ...l, isActive: checked } : l));
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const token = Math.random().toString(36).substring(2, 10);
      const newUrl = `${window.location.origin}?role=${values.role}&token=${token}`;

      if (editingLink) {
        setLinks(links.map((l) => l.id === editingLink.id ? { ...l, ...values, url: newUrl } : l));
        message.success('已更新');
      } else {
        const newLink: UserLink = {
          id: Date.now().toString(),
          ...values,
          url: newUrl,
          createdAt: new Date().toISOString().split('T')[0],
          isActive: true,
        };
        setLinks([...links, newLink]);
        message.success('已创建');
      }
      setModalOpen(false);
    });
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      message.success('链接已复制到剪贴板');
    });
  };

  const columns = [
    {
      title: '名称', dataIndex: 'name', key: 'name',
      render: (text: string) => <span style={{ fontWeight: 600 }}>{text}</span>,
    },
    {
      title: '角色', dataIndex: 'role', key: 'role', width: 100,
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'blue' : 'green'}>
          {role === 'admin' ? '管理员' : '访客'}
        </Tag>
      ),
    },
    {
      title: '访问链接', dataIndex: 'url', key: 'url',
      render: (url: string) => (
        <Space>
          <Text ellipsis style={{ maxWidth: 300, fontSize: 12 }}>{url}</Text>
          <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopyUrl(url)} />
        </Space>
      ),
    },
    {
      title: '状态', dataIndex: 'isActive', key: 'isActive', width: 80,
      render: (isActive: boolean, record: any) => (
        <Switch checked={isActive} onChange={(checked) => handleToggleActive(record.id, checked)} />
      ),
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 120 },
    { title: '最近访问', dataIndex: 'lastAccess', key: 'lastAccess', width: 160 },
    {
      title: '操作', key: 'action', width: 100,
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  const adminLinks = links.filter((l) => l.role === 'admin');
  const guestLinks = links.filter((l) => l.role === 'guest');

  return (
    <div>
      <Breadcrumb
        items={[
          { title: <a onClick={() => navigate('/')}>首页</a> },
          { title: '用户管理' },
        ]}
        style={{ marginBottom: 16 }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <UserOutlined style={{ fontSize: 28, color: theme.colors.primary }} />
        <div style={{ flex: 1 }}>
          <Title level={4} style={{ margin: 0 }}>用户管理</Title>
          <Text type="secondary">管理访问链接和权限</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新建链接
        </Button>
      </div>

      <Card title="访问链接说明" style={{ marginBottom: 16 }}>
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="管理员链接">
            <Text type="success">拥有全部权限：查看、编辑、新建、删除方案和知识库</Text>
          </Descriptions.Item>
          <Descriptions.Item label="访客链接">
            <Text type="warning">只读权限：查看方案和知识库，可生成方案、编辑知识库（本地），可导出文件</Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card>
        <Table
          dataSource={links}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Modal
        title={editingLink ? '编辑链接' : '新建链接'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="如：管理员入口" />
          </Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true }]}>
            <Select>
              <Option value="admin">管理员</Option>
              <Option value="guest">访客</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
