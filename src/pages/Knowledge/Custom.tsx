import { useState } from 'react';
import { Card, Row, Col, List, Button, Input, Typography, Breadcrumb, Modal, Form, Tag, Space, Dropdown, Empty, Popconfirm } from 'antd';
import { ArrowLeftOutlined, PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined, MoreOutlined, FolderOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/theme';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface KBItem {
  id: string;
  title: string;
  content: string;
  parentId: string | null;
  children: KBItem[];
  createdAt: string;
  updatedAt: string;
}

const presetCustomData: KBItem[] = [
  {
    id: '1', title: '等保2.0学习笔记', content: '等保2.0是网络安全等级保护的升级版本...\n\n## 核心要点\n1. 五个安全等级\n2. 十大安全领域\n3. 测评要求', parentId: null,
    children: [
      { id: '1-1', title: '安全物理环境', content: '物理安全要求包括：\n- 机房位置选择\n- 物理访问控制\n- 防盗窃和防破坏', parentId: '1', children: [], createdAt: '2024-01-15', updatedAt: '2024-01-15' },
      { id: '1-2', title: '安全通信网络', content: '网络安全要求包括：\n- 网络架构\n- 通信传输\n- 可信验证', parentId: '1', children: [], createdAt: '2024-01-15', updatedAt: '2024-01-15' },
    ],
    createdAt: '2024-01-15', updatedAt: '2024-01-20',
  },
  {
    id: '2', title: '项目经验总结', content: '在方案设计和实施过程中的经验总结...', parentId: null,
    children: [
      { id: '2-1', title: '客户需求分析', content: '如何准确把握客户需求：\n1. 访谈调研\n2. 现场勘察\n3. 需求确认', parentId: '2', children: [], createdAt: '2024-02-01', updatedAt: '2024-02-01' },
    ],
    createdAt: '2024-02-01', updatedAt: '2024-02-10',
  },
  {
    id: '3', title: '竞品分析笔记', content: '记录各厂商产品的优缺点对比...', parentId: null, children: [],
    createdAt: '2024-03-01', updatedAt: '2024-03-05',
  },
];

const CustomKnowledge: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [knowledgeTree, setKnowledgeTree] = useState<KBItem[]>(presetCustomData);
  const [selectedItem, setSelectedItem] = useState<KBItem | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [parentIds, setParentIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setParentIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelect = (item: KBItem) => {
    setSelectedItem(item);
    setEditContent(item.content);
    setEditMode(false);
  };

  const handleSave = () => {
    if (!selectedItem) return;
    const updateTree = (items: KBItem[]): KBItem[] =>
      items.map((item) => {
        if (item.id === selectedItem.id) {
          return { ...item, content: editContent, updatedAt: new Date().toISOString().split('T')[0] };
        }
        return { ...item, children: updateTree(item.children) };
      });
    setKnowledgeTree(updateTree(knowledgeTree));
    setSelectedItem({ ...selectedItem, content: editContent });
    setEditMode(false);
  };

  const handleAdd = (parentId: string | null) => {
    form.resetFields();
    setModalOpen(true);
    if (parentId) {
      form.setFieldsValue({ parentId });
    }
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const newItem: KBItem = {
        id: Date.now().toString(),
        title: values.title,
        content: values.content || '',
        parentId: values.parentId || null,
        children: [],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };

      if (values.parentId) {
        const addToParent = (items: KBItem[]): KBItem[] =>
          items.map((item) => {
            if (item.id === values.parentId) {
              return { ...item, children: [...item.children, newItem] };
            }
            return { ...item, children: addToParent(item.children) };
          });
        setKnowledgeTree(addToParent(knowledgeTree));
      } else {
        setKnowledgeTree([...knowledgeTree, newItem]);
      }
      setModalOpen(false);
    });
  };

  const handleDelete = (id: string) => {
    const removeFromTree = (items: KBItem[]): KBItem[] =>
      items.filter((item) => item.id !== id).map((item) => ({
        ...item,
        children: removeFromTree(item.children),
      }));
    setKnowledgeTree(removeFromTree(knowledgeTree));
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const renderTreeItem = (item: KBItem, level: number = 0) => {
    const hasChildren = item.children.length > 0;
    const isExpanded = parentIds[item.id];

    return (
      <div key={item.id}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 12px',
            paddingLeft: 12 + level * 24,
            cursor: 'pointer',
            background: selectedItem?.id === item.id ? theme.colors.bgLayout : 'transparent',
            borderRadius: 4,
            marginBottom: 2,
          }}
          onClick={() => handleSelect(item)}
        >
          {hasChildren ? (
            <span
              onClick={(e) => { e.stopPropagation(); toggleExpand(item.id); }}
              style={{ marginRight: 8, cursor: 'pointer' }}
            >
              {isExpanded ? <FolderOpenOutlined /> : <FolderOutlined />}
            </span>
          ) : (
            <FileTextOutlined style={{ marginRight: 8, color: theme.colors.textTertiary }} />
          )}
          <span style={{ flex: 1, fontSize: 14 }}>{item.title}</span>
          <Dropdown
            menu={{
              items: [
                { key: 'add', label: '添加子项', icon: <PlusOutlined />, onClick: () => handleAdd(item.id) },
                { key: 'delete', label: '删除', icon: <DeleteOutlined />, danger: true, onClick: () => handleDelete(item.id) },
              ],
            }}
            trigger={['click']}
          >
            <MoreOutlined onClick={(e) => e.stopPropagation()} />
          </Dropdown>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {item.children.map((child) => renderTreeItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { title: <a onClick={() => navigate('/knowledge')}>知识库</a> },
          { title: '我的知识库' },
        ]}
        style={{ marginBottom: 16 }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/knowledge')} />
        <EditOutlined style={{ fontSize: 28, color: theme.colors.primary }} />
        <div style={{ flex: 1 }}>
          <Title level={4} style={{ margin: 0 }}>我的知识库</Title>
          <Text type="secondary">自定义知识库管理</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd(null)}>
          新建文档
        </Button>
      </div>

      <Row gutter={16}>
        <Col span={8}>
          <Card title="文档目录" style={{ height: 'calc(100vh - 250px)' }}>
            {knowledgeTree.length > 0 ? (
              knowledgeTree.map((item) => renderTreeItem(item))
            ) : (
              <Empty description="暂无文档" />
            )}
          </Card>
        </Col>
        <Col span={16}>
          <Card
            title={selectedItem?.title || '选择文档'}
            extra={selectedItem && (
              <Space>
                {editMode ? (
                  <>
                    <Button onClick={() => setEditMode(false)}>取消</Button>
                    <Button type="primary" onClick={handleSave}>保存</Button>
                  </>
                ) : (
                  <Button icon={<EditOutlined />} onClick={() => setEditMode(true)}>编辑</Button>
                )}
              </Space>
            )}
            style={{ height: 'calc(100vh - 250px)' }}
          >
            {selectedItem ? (
              editMode ? (
                <TextArea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  style={{ height: '100%', fontSize: 14 }}
                  autoSize={{ minRows: 20 }}
                />
              ) : (
                <div>
                  <div style={{ color: theme.colors.textTertiary, marginBottom: 16 }}>
                    创建于 {selectedItem.createdAt} | 更新于 {selectedItem.updatedAt}
                  </div>
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                    {selectedItem.content || '暂无内容'}
                  </div>
                </div>
              )
            ) : (
              <Empty description="请选择左侧文档查看内容" />
            )}
          </Card>
        </Col>
      </Row>

      <Modal
        title="新建文档"
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="请输入文档标题" />
          </Form.Item>
          <Form.Item name="parentId" label="父级文档" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="内容">
            <TextArea rows={6} placeholder="请输入内容（可选）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomKnowledge;
