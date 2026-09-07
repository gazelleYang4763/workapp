import { useState, useCallback } from 'react';
import { Card, Steps, Button, Form, Input, Select, Row, Col, Switch, Table, Space, message, Tag, Divider, Typography, Modal, InputNumber, Tooltip, Empty } from 'antd';
import {
  SaveOutlined, ExportOutlined, ArrowLeftOutlined, PlusOutlined, DeleteOutlined,
  DragOutlined, UpOutlined, DownOutlined, FileTextOutlined, EyeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/theme';
import { useSolutionStore } from '@/store/solution';
import { exportMarkdown, exportHtml, printSolution } from '@/utils/export';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

interface Chapter {
  id: string;
  title: string;
  enabled: boolean;
  content: string;
  order: number;
}

interface ProductItem {
  id: string;
  category: string;
  brand: string;
  model: string;
  quantity: number;
  unit: string;
  location: string;
  remark: string;
}

const defaultChapters: Chapter[] = [
  { id: '1', title: '项目概述', enabled: true, content: '', order: 1 },
  { id: '2', title: '需求分析', enabled: true, content: '', order: 2 },
  { id: '3', title: '现状分析', enabled: true, content: '', order: 3 },
  { id: '4', title: '方案设计', enabled: true, content: '', order: 4 },
  { id: '5', title: '产品配置', enabled: true, content: '', order: 5 },
  { id: '6', title: '实施计划', enabled: true, content: '', order: 6 },
  { id: '7', title: '项目管理', enabled: true, content: '', order: 7 },
  { id: '8', title: '售后服务', enabled: true, content: '', order: 8 },
  { id: '9', title: '投资概算', enabled: true, content: '', order: 9 },
  { id: '10', title: '典型案例', enabled: false, content: '', order: 10 },
];

const SolutionCreate: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const { addSolution } = useSolutionStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  const [solutionData, setSolutionData] = useState({
    type: '' as 'network' | 'security' | '',
    subType: '',
    name: '',
    customerName: '',
    industry: '',
    scale: '',
    protectionLevel: '',
    standards: [] as string[],
    budget: 0,
    background: '',
    goals: '',
    chapters: [...defaultChapters],
    products: [] as ProductItem[],
    status: 'draft' as 'draft' | 'completed',
  });

  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [chapterModalOpen, setChapterModalOpen] = useState(false);
  const [chapterContent, setChapterContent] = useState('');

  const networkTypes = [
    { value: 'campus', label: '园区网络', desc: '企业园区网络建设，包括核心、汇聚、接入三层架构', icon: '🏢' },
    { value: 'datacenter', label: '数据中心', desc: '数据中心网络架构，Spine-Leaf架构设计', icon: '🖥️' },
    { value: 'wan', label: '广域网', desc: '广域网互联方案，SD-WAN/MPLS专线', icon: '🌐' },
    { value: 'wireless', label: '无线网络', desc: '无线覆盖方案，WiFi6高密度部署', icon: '📡' },
    { value: 'cloud', label: '云网络', desc: '混合云/多云网络架构设计', icon: '☁️' },
    { value: 'iot', label: '物联网', desc: 'IoT网络接入与安全方案', icon: '🔗' },
  ];

  const securityTypes = [
    { value: 'compliance', label: '等保合规', desc: '等保2.0合规建设，二级/三级/四级', icon: '🛡️' },
    { value: 'security-arch', label: '安全架构', desc: '整体安全架构设计，纵深防御体系', icon: '🏰' },
    { value: 'soc', label: '安全运营', desc: 'SOC安全运营中心，威胁检测响应', icon: '📊' },
    { value: 'incident', label: '应急响应', desc: '安全事件应急处置，溯源分析', icon: '🚨' },
    { value: 'data-security', label: '数据安全', desc: '数据安全治理，分类分级保护', icon: '🔐' },
    { value: 'cloud-security', label: '云安全', desc: '云环境安全防护方案', icon: '☁️' },
  ];

  const industries = [
    { value: 'finance', label: '金融', desc: '银行/证券/保险' },
    { value: 'government', label: '政务', desc: '政府/事业单位' },
    { value: 'healthcare', label: '医疗', desc: '医院/卫生机构' },
    { value: 'education', label: '教育', desc: '高校/中小学' },
    { value: 'energy', label: '能源', desc: '电力/石油/煤炭' },
    { value: 'transport', label: '交通', desc: '航空/铁路/公路' },
    { value: 'telecom', label: '电信', desc: '运营商/通信' },
    { value: 'manufacturing', label: '制造业', desc: '工厂/制造企业' },
    { value: 'internet', label: '互联网', desc: '互联网/科技公司' },
    { value: 'retail', label: '零售', desc: '零售/电商' },
  ];

  const scales = [
    { value: 'small', label: '小型', desc: '<100人，≤50终端' },
    { value: 'medium', label: '中型', desc: '100-500人，50-200终端' },
    { value: 'large', label: '大型', desc: '500-2000人，200-500终端' },
    { value: 'xlarge', label: '超大型', desc: '>2000人，>500终端' },
  ];

  const protectionLevels = [
    { value: 'level2', label: '二级', desc: '一般网络系统' },
    { value: 'level3', label: '三级', desc: '重要网络系统' },
    { value: 'level4', label: '四级', desc: '关键信息基础设施' },
  ];

  const standardOptions = [
    { value: 'GB/T 22239-2019', label: 'GB/T 22239-2019 等保基本要求' },
    { value: 'GB/T 25070-2019', label: 'GB/T 25070-2019 等保设计要求' },
    { value: 'GB/T 28448-2019', label: 'GB/T 28448-2019 等保测评要求' },
    { value: 'GB/T 20271-2006', label: 'GB/T 20271-2006 通用安全技术要求' },
    { value: 'GB/T 35273-2020', label: 'GB/T 35273-2020 个人信息安全规范' },
    { value: 'GB/T 39786-2021', label: 'GB/T 39786-2021 密码应用要求' },
  ];

  const productCategories = ['防火墙', '交换机', '路由器', 'WAF', 'IDS/IPS', 'VPN', '服务器', '存储', '无线AP', 'AC控制器', '堡垒机', '日志审计'];

  const handleNext = () => {
    if (currentStep === 0 && !solutionData.type) {
      message.warning('请选择方案类型');
      return;
    }
    if (currentStep === 1) {
      if (!solutionData.name) {
        message.warning('请输入方案名称');
        return;
      }
      if (!solutionData.customerName) {
        message.warning('请输入客户名称');
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSave = () => {
    if (!solutionData.name) {
      message.warning('请填写方案名称');
      return;
    }
    const newSolution = {
      ...solutionData,
      id: Date.now().toString(),
      type: solutionData.type as 'network' | 'security',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addSolution(newSolution as any);
    message.success('方案已保存');
    navigate('/solution');
  };

  const handleExport = (format: string) => {
    const solution = {
      ...solutionData,
      id: Date.now().toString(),
      type: solutionData.type as 'network' | 'security',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    switch (format) {
      case 'Markdown':
        exportMarkdown(solution as any);
        message.success('已导出Markdown文件');
        break;
      case 'HTML':
        exportHtml(solution as any);
        message.success('已导出HTML文件');
        break;
      case '打印':
        printSolution(solution as any);
        break;
      default:
        message.info(`导出${format}功能开发中...`);
    }
  };

  const handleMoveChapter = (index: number, direction: 'up' | 'down') => {
    const newChapters = [...solutionData.chapters];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newChapters.length) return;
    [newChapters[index], newChapters[targetIndex]] = [newChapters[targetIndex], newChapters[index]];
    newChapters.forEach((c, i) => c.order = i + 1);
    setSolutionData({ ...solutionData, chapters: newChapters });
  };

  const handleEditChapterContent = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setChapterContent(chapter.content);
    setChapterModalOpen(true);
  };

  const handleSaveChapterContent = () => {
    if (editingChapter) {
      const newChapters = solutionData.chapters.map((c) =>
        c.id === editingChapter.id ? { ...c, content: chapterContent } : c
      );
      setSolutionData({ ...solutionData, chapters: newChapters });
      setChapterModalOpen(false);
      message.success('章节内容已保存');
    }
  };

  const handleAddProduct = () => {
    const newProduct: ProductItem = {
      id: Date.now().toString(),
      category: '',
      brand: '',
      model: '',
      quantity: 1,
      unit: '台',
      location: '',
      remark: '',
    };
    setSolutionData({ ...solutionData, products: [...solutionData.products, newProduct] });
  };

  const handleDeleteProduct = (id: string) => {
    setSolutionData({ ...solutionData, products: solutionData.products.filter((p) => p.id !== id) });
  };

  const handleUpdateProduct = (id: string, field: keyof ProductItem, value: any) => {
    const newProducts = solutionData.products.map((p) =>
      p.id === id ? { ...p, [field]: value } : p
    );
    setSolutionData({ ...solutionData, products: newProducts });
  };

  const step1Content = (
    <div>
      <Title level={4} style={{ marginBottom: 8 }}>选择方案类型</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>请选择方案的主类型，后续将根据类型提供相应的模板和配置选项</Text>

      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card
            hoverable
            onClick={() => setSolutionData({ ...solutionData, type: 'network', subType: '' })}
            style={{
              borderColor: solutionData.type === 'network' ? theme.colors.primary : theme.colors.border,
              borderWidth: solutionData.type === 'network' ? 2 : 1,
              background: solutionData.type === 'network' ? theme.colors.primary + '08' : theme.colors.bgContainer,
            }}
          >
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🌐</div>
              <Title level={3} style={{ marginBottom: 8 }}>网络建设</Title>
              <Paragraph type="secondary">
                网络基础设施建设方案，包括园区网络、数据中心、广域网、无线网络等
              </Paragraph>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            hoverable
            onClick={() => setSolutionData({ ...solutionData, type: 'security', subType: '' })}
            style={{
              borderColor: solutionData.type === 'security' ? theme.colors.primary : theme.colors.border,
              borderWidth: solutionData.type === 'security' ? 2 : 1,
              background: solutionData.type === 'security' ? theme.colors.primary + '08' : theme.colors.bgContainer,
            }}
          >
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🛡️</div>
              <Title level={3} style={{ marginBottom: 8 }}>网络安全</Title>
              <Paragraph type="secondary">
                网络安全防护建设方案，包括等保合规、安全架构、安全运营等
              </Paragraph>
            </div>
          </Card>
        </Col>
      </Row>

      {solutionData.type && (
        <div style={{ marginTop: 32 }}>
          <Title level={4} style={{ marginBottom: 8 }}>选择子类型</Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>请选择具体的方案子类型</Text>
          <Row gutter={[16, 16]}>
            {(solutionData.type === 'network' ? networkTypes : securityTypes).map((item) => (
              <Col span={8} key={item.value}>
                <Card
                  hoverable
                  size="small"
                  onClick={() => setSolutionData({ ...solutionData, subType: item.value })}
                  style={{
                    borderColor: solutionData.subType === item.value ? theme.colors.primary : theme.colors.border,
                    borderWidth: solutionData.subType === item.value ? 2 : 1,
                    background: solutionData.subType === item.value ? theme.colors.primary + '08' : theme.colors.bgContainer,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 28 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{item.label}</div>
                      <Text type="secondary" style={{ fontSize: 12 }}>{item.desc}</Text>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );

  const step2Content = (
    <div>
      <Title level={4} style={{ marginBottom: 8 }}>基本信息</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>请填写方案的基本信息，带 * 为必填项</Text>

      <Form layout="vertical">
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label={<span>方案名称 <Text type="danger">*</Text></span>} required>
              <Input
                value={solutionData.name}
                onChange={(e) => setSolutionData({ ...solutionData, name: e.target.value })}
                placeholder="请输入方案名称，如：XX银行网络安全防护方案"
                maxLength={50}
                showCount
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={<span>客户名称 <Text type="danger">*</Text></span>} required>
              <Input
                value={solutionData.customerName}
                onChange={(e) => setSolutionData({ ...solutionData, customerName: e.target.value })}
                placeholder="请输入客户名称"
                maxLength={50}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="所属行业">
              <Select
                value={solutionData.industry || undefined}
                onChange={(v) => setSolutionData({ ...solutionData, industry: v })}
                placeholder="请选择行业"
                allowClear
              >
                {industries.map((ind) => (
                  <Option key={ind.value} value={ind.value}>
                    <div>
                      <span>{ind.label}</span>
                      <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>{ind.desc}</Text>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="项目规模">
              <Select
                value={solutionData.scale || undefined}
                onChange={(v) => setSolutionData({ ...solutionData, scale: v })}
                placeholder="请选择规模"
                allowClear
              >
                {scales.map((s) => (
                  <Option key={s.value} value={s.value}>
                    <div>
                      <span>{s.label}</span>
                      <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>{s.desc}</Text>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="预算（万元）">
              <InputNumber
                value={solutionData.budget || undefined}
                onChange={(v) => setSolutionData({ ...solutionData, budget: v || 0 })}
                placeholder="请输入预算"
                min={0}
                precision={2}
                style={{ width: '100%' }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
          </Col>

          {solutionData.type === 'security' && (
            <Col span={8}>
              <Form.Item label="等保级别">
                <Select
                  value={solutionData.protectionLevel || undefined}
                  onChange={(v) => setSolutionData({ ...solutionData, protectionLevel: v })}
                  placeholder="请选择等保级别"
                  allowClear
                >
                  {protectionLevels.map((l) => (
                    <Option key={l.value} value={l.value}>
                      <div>
                        <span>{l.label}</span>
                        <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>{l.desc}</Text>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}

          <Col span={24}>
            <Form.Item label="参考标准">
              <Select
                mode="multiple"
                value={solutionData.standards}
                onChange={(v) => setSolutionData({ ...solutionData, standards: v })}
                placeholder="请选择参考标准，可多选"
                allowClear
                maxTagCount={3}
              >
                {standardOptions.map((s) => (
                  <Option key={s.value} value={s.value}>{s.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="项目背景">
              <TextArea
                rows={4}
                value={solutionData.background}
                onChange={(e) => setSolutionData({ ...solutionData, background: e.target.value })}
                placeholder="请描述项目背景，包括客户当前状况、面临的问题等..."
                maxLength={2000}
                showCount
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="项目目标">
              <TextArea
                rows={3}
                value={solutionData.goals}
                onChange={(e) => setSolutionData({ ...solutionData, goals: e.target.value })}
                placeholder="请描述项目目标，包括期望达到的效果、解决的核心问题等..."
                maxLength={1000}
                showCount
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );

  const step3Content = (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>章节配置</Title>
          <Text type="secondary">拖拽排序章节，点击编辑按钮填写章节内容</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            const newChapter: Chapter = {
              id: Date.now().toString(),
              title: '新章节',
              enabled: true,
              content: '',
              order: solutionData.chapters.length + 1,
            };
            setSolutionData({ ...solutionData, chapters: [...solutionData.chapters, newChapter] });
          }}
        >
          添加章节
        </Button>
      </div>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>共 {solutionData.chapters.length} 个章节，{solutionData.chapters.filter(c => c.enabled).length} 个启用</Text>

      <div style={{ border: `1px solid ${theme.colors.border}`, borderRadius: 8, overflow: 'hidden' }}>
        {solutionData.chapters.map((chapter, index) => (
          <div
            key={chapter.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              borderBottom: index < solutionData.chapters.length - 1 ? `1px solid ${theme.colors.border}` : 'none',
              background: chapter.enabled ? theme.colors.bgContainer : theme.colors.bgLayout,
              opacity: chapter.enabled ? 1 : 0.6,
            }}
          >
            <div style={{ width: 40, textAlign: 'center', color: theme.colors.textTertiary }}>
              {chapter.order}
            </div>
            <div style={{ flex: 1, marginLeft: 8 }}>
              <Input
                value={chapter.title}
                onChange={(e) => {
                  const newChapters = solutionData.chapters.map((c) =>
                    c.id === chapter.id ? { ...c, title: e.target.value } : c
                  );
                  setSolutionData({ ...solutionData, chapters: newChapters });
                }}
                style={{ border: 'none', boxShadow: 'none', background: 'transparent' }}
              />
            </div>
            <Space>
              <Tooltip title="编辑内容">
                <Button
                  type="text"
                  icon={<FileTextOutlined />}
                  onClick={() => handleEditChapterContent(chapter)}
                  style={{ color: theme.colors.primary }}
                />
              </Tooltip>
              <Tooltip title="上移">
                <Button
                  type="text"
                  icon={<UpOutlined />}
                  disabled={index === 0}
                  onClick={() => handleMoveChapter(index, 'up')}
                />
              </Tooltip>
              <Tooltip title="下移">
                <Button
                  type="text"
                  icon={<DownOutlined />}
                  disabled={index === solutionData.chapters.length - 1}
                  onClick={() => handleMoveChapter(index, 'down')}
                />
              </Tooltip>
              <Switch
                checked={chapter.enabled}
                onChange={(checked) => {
                  const newChapters = solutionData.chapters.map((c) =>
                    c.id === chapter.id ? { ...c, enabled: checked } : c
                  );
                  setSolutionData({ ...solutionData, chapters: newChapters });
                }}
                checkedChildren="启用"
                unCheckedChildren="禁用"
              />
              <Tooltip title="删除">
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    setSolutionData({
                      ...solutionData,
                      chapters: solutionData.chapters.filter((c) => c.id !== chapter.id),
                    });
                  }}
                />
              </Tooltip>
            </Space>
          </div>
        ))}
      </div>

      <Modal
        title={`编辑章节: ${editingChapter?.title}`}
        open={chapterModalOpen}
        onOk={handleSaveChapterContent}
        onCancel={() => setChapterModalOpen(false)}
        width={700}
        okText="保存"
        cancelText="取消"
      >
        <TextArea
          value={chapterContent}
          onChange={(e) => setChapterContent(e.target.value)}
          rows={15}
          placeholder="请输入章节内容..."
          style={{ fontSize: 14, lineHeight: 1.8 }}
        />
      </Modal>
    </div>
  );

  const step4Content = (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>设备清单</Title>
          <Text type="secondary">添加方案所需的产品设备信息</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProduct}>
          添加设备
        </Button>
      </div>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>共 {solutionData.products.length} 项设备</Text>

      <div style={{ border: `1px solid ${theme.colors.border}`, borderRadius: 8, overflow: 'hidden' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '60px 1fr 1fr 1fr 80px 80px 1fr 120px 60px',
          gap: 0,
          padding: '12px 16px',
          background: theme.colors.bgLayout,
          borderBottom: `1px solid ${theme.colors.border}`,
          fontWeight: 600,
          fontSize: 13,
        }}>
          <div>序号</div>
          <div>设备类型</div>
          <div>品牌</div>
          <div>型号</div>
          <div>数量</div>
          <div>单位</div>
          <div>部署位置</div>
          <div>备注</div>
          <div>操作</div>
        </div>

        {solutionData.products.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <Empty description="暂无设备，点击上方按钮添加" />
          </div>
        ) : (
          solutionData.products.map((product, index) => (
            <div
              key={product.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr 1fr 1fr 80px 80px 1fr 120px 60px',
                gap: 0,
                padding: '8px 16px',
                borderBottom: index < solutionData.products.length - 1 ? `1px solid ${theme.colors.border}` : 'none',
                alignItems: 'center',
              }}
            >
              <div style={{ color: theme.colors.textTertiary }}>{index + 1}</div>
              <div>
                <Select
                  value={product.category || undefined}
                  onChange={(v) => handleUpdateProduct(product.id, 'category', v)}
                  placeholder="类型"
                  size="small"
                  style={{ width: '100%' }}
                >
                  {productCategories.map((cat) => (
                    <Option key={cat} value={cat}>{cat}</Option>
                  ))}
                </Select>
              </div>
              <div>
                <Input
                  value={product.brand}
                  onChange={(e) => handleUpdateProduct(product.id, 'brand', e.target.value)}
                  placeholder="品牌"
                  size="small"
                />
              </div>
              <div>
                <Input
                  value={product.model}
                  onChange={(e) => handleUpdateProduct(product.id, 'model', e.target.value)}
                  placeholder="型号"
                  size="small"
                />
              </div>
              <div>
                <InputNumber
                  value={product.quantity}
                  onChange={(v) => handleUpdateProduct(product.id, 'quantity', v || 1)}
                  min={1}
                  size="small"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <Select
                  value={product.unit}
                  onChange={(v) => handleUpdateProduct(product.id, 'unit', v)}
                  size="small"
                  style={{ width: '100%' }}
                >
                  <Option value="台">台</Option>
                  <Option value="套">套</Option>
                  <Option value="个">个</Option>
                  <Option value="块">块</Option>
                  <Option value="组">组</Option>
                </Select>
              </div>
              <div>
                <Input
                  value={product.location}
                  onChange={(e) => handleUpdateProduct(product.id, 'location', e.target.value)}
                  placeholder="位置"
                  size="small"
                />
              </div>
              <div>
                <Input
                  value={product.remark}
                  onChange={(e) => handleUpdateProduct(product.id, 'remark', e.target.value)}
                  placeholder="备注"
                  size="small"
                />
              </div>
              <div>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  onClick={() => handleDeleteProduct(product.id)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const step5Content = (
    <div>
      <Title level={4} style={{ marginBottom: 8 }}>预览方案</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>请检查方案信息，确认无误后可导出或保存</Text>

      <Card title="基本信息" style={{ marginBottom: 16 }}>
        <Row gutter={[24, 16]}>
          <Col span={8}>
            <Text type="secondary">方案类型：</Text>
            <Tag color={solutionData.type === 'network' ? 'blue' : 'red'} style={{ marginLeft: 8 }}>
              {solutionData.type === 'network' ? '网络建设' : '网络安全'}
            </Tag>
          </Col>
          <Col span={8}>
            <Text type="secondary">子类型：</Text>
            <Text>{solutionData.subType || '-'}</Text>
          </Col>
          <Col span={8}>
            <Text type="secondary">方案名称：</Text>
            <Text strong>{solutionData.name || '-'}</Text>
          </Col>
          <Col span={8}>
            <Text type="secondary">客户名称：</Text>
            <Text>{solutionData.customerName || '-'}</Text>
          </Col>
          <Col span={8}>
            <Text type="secondary">所属行业：</Text>
            <Text>{industries.find(i => i.value === solutionData.industry)?.label || '-'}</Text>
          </Col>
          <Col span={8}>
            <Text type="secondary">项目规模：</Text>
            <Text>{scales.find(s => s.value === solutionData.scale)?.label || '-'}</Text>
          </Col>
          {solutionData.protectionLevel && (
            <Col span={8}>
              <Text type="secondary">等保级别：</Text>
              <Text>{protectionLevels.find(l => l.value === solutionData.protectionLevel)?.label || '-'}</Text>
            </Col>
          )}
          <Col span={8}>
            <Text type="secondary">预算：</Text>
            <Text>{solutionData.budget ? `${solutionData.budget.toLocaleString()}万元` : '-'}</Text>
          </Col>
        </Row>
      </Card>

      {solutionData.standards.length > 0 && (
        <Card title="参考标准" style={{ marginBottom: 16 }}>
          <Space wrap>
            {solutionData.standards.map((s) => <Tag key={s} color="blue">{s}</Tag>)}
          </Space>
        </Card>
      )}

      {solutionData.background && (
        <Card title="项目背景" style={{ marginBottom: 16 }}>
          <Paragraph>{solutionData.background}</Paragraph>
        </Card>
      )}

      {solutionData.goals && (
        <Card title="项目目标" style={{ marginBottom: 16 }}>
          <Paragraph>{solutionData.goals}</Paragraph>
        </Card>
      )}

      <Card title="章节结构" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 8]}>
          {solutionData.chapters.filter(c => c.enabled).map((c, i) => (
            <Col key={c.id} span={8}>
              <Tag style={{ width: '100%', textAlign: 'center', padding: '8px 12px' }}>
                {i + 1}. {c.title}
              </Tag>
            </Col>
          ))}
        </Row>
      </Card>

      {solutionData.products.length > 0 && (
        <Card title={`设备清单 (${solutionData.products.length}项)`}>
          <Table
            dataSource={solutionData.products}
            rowKey="id"
            pagination={false}
            size="small"
            columns={[
              { title: '类型', dataIndex: 'category', width: 100 },
              { title: '品牌', dataIndex: 'brand', width: 100 },
              { title: '型号', dataIndex: 'model', width: 120 },
              { title: '数量', dataIndex: 'quantity', width: 60 },
              { title: '单位', dataIndex: 'unit', width: 60 },
              { title: '位置', dataIndex: 'location' },
              { title: '备注', dataIndex: 'remark' },
            ]}
          />
        </Card>
      )}
    </div>
  );

  const steps = [
    { title: '类型选择', content: step1Content, icon: <FileTextOutlined /> },
    { title: '基本信息', content: step2Content, icon: <FileTextOutlined /> },
    { title: '章节配置', content: step3Content, icon: <FileTextOutlined /> },
    { title: '设备清单', content: step4Content, icon: <FileTextOutlined /> },
    { title: '预览导出', content: step5Content, icon: <EyeOutlined /> },
  ];

  return (
    <div>
      <Card>
        <Steps
          current={currentStep}
          style={{ marginBottom: 32 }}
          items={steps.map((step, index) => ({
            title: step.title,
            status: index === currentStep ? 'process' : index < currentStep ? 'finish' : 'wait',
          }))}
        />

        <div style={{ minHeight: 500, padding: '0 16px' }}>
          {steps[currentStep].content}
        </div>

        <Divider />

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={currentStep === 0}
            onClick={handlePrev}
            size="large"
          >
            上一步
          </Button>
          <Space>
            <Button onClick={handleSave} size="large">
              保存草稿
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button type="primary" onClick={handleNext} size="large">
                下一步
              </Button>
            ) : (
              <Space>
                <Button icon={<ExportOutlined />} onClick={() => handleExport('Markdown')} size="large">
                  导出MD
                </Button>
                <Button onClick={() => handleExport('HTML')} size="large">
                  导出HTML
                </Button>
                <Button onClick={() => handleExport('打印')} size="large">
                  打印预览
                </Button>
                <Button type="primary" onClick={handleSave} size="large">
                  保存方案
                </Button>
              </Space>
            )}
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default SolutionCreate;
