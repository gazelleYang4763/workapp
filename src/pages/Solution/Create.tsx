import { useState } from 'react';
import { Card, Steps, Button, Form, Input, Select, Row, Col, Switch, Table, Space, message, Tag, Divider, Typography } from 'antd';
import { SaveOutlined, ExportOutlined, ArrowLeftOutlined, ArrowRightOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/theme';
import { useSolutionStore } from '@/store/solution';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

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
    chapters: [
      { id: '1', title: '项目概述', enabled: true, content: {} },
      { id: '2', title: '需求分析', enabled: true, content: {} },
      { id: '3', title: '方案设计', enabled: true, content: {} },
      { id: '4', title: '产品配置', enabled: true, content: {} },
      { id: '5', title: '实施计划', enabled: true, content: {} },
      { id: '6', title: '售后服务', enabled: true, content: {} },
    ],
    products: [] as any[],
    status: 'draft' as 'draft' | 'completed',
  });

  const networkTypes = [
    { value: 'campus', label: '园区网络', desc: '企业园区网络建设' },
    { value: 'datacenter', label: '数据中心', desc: '数据中心网络架构' },
    { value: 'wan', label: '广域网', desc: '广域网互联方案' },
    { value: 'wireless', label: '无线网络', desc: '无线覆盖方案' },
  ];

  const securityTypes = [
    { value: 'compliance', label: '等保合规', desc: '等保2.0合规建设' },
    { value: 'security-arch', label: '安全架构', desc: '整体安全架构设计' },
    { value: 'soc', label: '安全运营', desc: 'SOC安全运营中心' },
    { value: 'incident', label: '应急响应', desc: '安全事件应急处置' },
  ];

  const industries = ['金融', '政务', '医疗', '教育', '能源', '交通', '电信', '制造业', '互联网'];
  const scales = ['小型(<100人)', '中型(100-500人)', '大型(500-2000人)', '超大型(>2000人)'];
  const protectionLevels = ['二级', '三级', '四级'];
  const standardOptions = ['GB/T 22239-2019', 'GB/T 25070-2019', 'GB/T 28448-2019', 'GB/T 20271-2006'];

  const handleNext = () => {
    if (currentStep === 0 && !solutionData.type) {
      message.warning('请选择方案类型');
      return;
    }
    if (currentStep === 1) {
      if (!solutionData.name || !solutionData.customerName) {
        message.warning('请填写方案名称和客户名称');
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
    message.info(`导出${format}功能开发中...`);
  };

  const step1Content = (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>选择方案类型</Title>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card
            hoverable
            onClick={() => setSolutionData({ ...solutionData, type: 'network', subType: '' })}
            style={{
              borderColor: solutionData.type === 'network' ? theme.colors.primary : theme.colors.border,
              borderWidth: solutionData.type === 'network' ? 2 : 1,
            }}
          >
            <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 16 }}>🌐</div>
            <Title level={4} style={{ textAlign: 'center' }}>网络建设</Title>
            <Text type="secondary" style={{ display: 'block', textAlign: 'center' }}>网络基础设施建设方案</Text>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            hoverable
            onClick={() => setSolutionData({ ...solutionData, type: 'security', subType: '' })}
            style={{
              borderColor: solutionData.type === 'security' ? theme.colors.primary : theme.colors.border,
              borderWidth: solutionData.type === 'security' ? 2 : 1,
            }}
          >
            <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 16 }}>🛡️</div>
            <Title level={4} style={{ textAlign: 'center' }}>网络安全</Title>
            <Text type="secondary" style={{ display: 'block', textAlign: 'center' }}>网络安全防护建设方案</Text>
          </Card>
        </Col>
      </Row>

      {solutionData.type && (
        <div style={{ marginTop: 24 }}>
          <Title level={5} style={{ marginBottom: 16 }}>选择子类型</Title>
          <Row gutter={[16, 16]}>
            {(solutionData.type === 'network' ? networkTypes : securityTypes).map((item) => (
              <Col span={6} key={item.value}>
                <Card
                  hoverable
                  size="small"
                  onClick={() => setSolutionData({ ...solutionData, subType: item.value })}
                  style={{
                    borderColor: solutionData.subType === item.value ? theme.colors.primary : theme.colors.border,
                    borderWidth: solutionData.subType === item.value ? 2 : 1,
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                  <Text type="secondary" style={{ fontSize: 12 }}>{item.desc}</Text>
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
      <Title level={4} style={{ marginBottom: 24 }}>基本信息</Title>
      <Form layout="vertical">
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="方案名称" required>
              <Input
                value={solutionData.name}
                onChange={(e) => setSolutionData({ ...solutionData, name: e.target.value })}
                placeholder="请输入方案名称"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="客户名称" required>
              <Input
                value={solutionData.customerName}
                onChange={(e) => setSolutionData({ ...solutionData, customerName: e.target.value })}
                placeholder="请输入客户名称"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="所属行业">
              <Select
                value={solutionData.industry || undefined}
                onChange={(v) => setSolutionData({ ...solutionData, industry: v })}
                placeholder="请选择行业"
              >
                {industries.map((ind) => (
                  <Option key={ind} value={ind}>{ind}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="项目规模">
              <Select
                value={solutionData.scale || undefined}
                onChange={(v) => setSolutionData({ ...solutionData, scale: v })}
                placeholder="请选择规模"
              >
                {scales.map((s) => (
                  <Option key={s} value={s}>{s}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {solutionData.type === 'security' && (
            <Col span={12}>
              <Form.Item label="等保级别">
                <Select
                  value={solutionData.protectionLevel || undefined}
                  onChange={(v) => setSolutionData({ ...solutionData, protectionLevel: v })}
                  placeholder="请选择等保级别"
                >
                  {protectionLevels.map((l) => (
                    <Option key={l} value={l}>{l}</Option>
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
                placeholder="请选择参考标准"
              >
                {standardOptions.map((s) => (
                  <Option key={s} value={s}>{s}</Option>
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
                placeholder="请描述项目背景..."
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="项目目标">
              <TextArea
                rows={3}
                value={solutionData.goals}
                onChange={(e) => setSolutionData({ ...solutionData, goals: e.target.value })}
                placeholder="请描述项目目标..."
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );

  const step3Content = (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>章节配置</Title>
        <Button icon={<PlusOutlined />} onClick={() => {
          setSolutionData({
            ...solutionData,
            chapters: [...solutionData.chapters, {
              id: Date.now().toString(),
              title: '新章节',
              enabled: true,
              content: {},
            }],
          });
        }}>添加章节</Button>
      </div>
      <Table
        dataSource={solutionData.chapters}
        rowKey="id"
        pagination={false}
        columns={[
          { title: '章节名称', dataIndex: 'title', key: 'title',
            render: (text: string, record: any) => (
              <Input
                value={text}
                onChange={(e) => {
                  const chapters = solutionData.chapters.map((c) =>
                    c.id === record.id ? { ...c, title: e.target.value } : c
                  );
                  setSolutionData({ ...solutionData, chapters });
                }}
              />
            ),
          },
          { title: '启用', dataIndex: 'enabled', key: 'enabled', width: 80,
            render: (enabled: boolean, record: any) => (
              <Switch
                checked={enabled}
                onChange={(checked) => {
                  const chapters = solutionData.chapters.map((c) =>
                    c.id === record.id ? { ...c, enabled: checked } : c
                  );
                  setSolutionData({ ...solutionData, chapters });
                }}
              />
            ),
          },
          { title: '操作', key: 'action', width: 80,
            render: (_: any, record: any) => (
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  setSolutionData({
                    ...solutionData,
                    chapters: solutionData.chapters.filter((c) => c.id !== record.id),
                  });
                }}
              />
            ),
          },
        ]}
      />
    </div>
  );

  const step4Content = (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>补充内容</Title>
      <Form layout="vertical">
        <Form.Item label="预算（万元）">
          <Input
            type="number"
            value={solutionData.budget || ''}
            onChange={(e) => setSolutionData({ ...solutionData, budget: Number(e.target.value) })}
            placeholder="请输入预算金额"
            style={{ width: 200 }}
          />
        </Form.Item>
      </Form>

      <Divider />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0 }}>设备清单</Title>
        <Button
          icon={<PlusOutlined />}
          onClick={() => {
            setSolutionData({
              ...solutionData,
              products: [...solutionData.products, {
                id: Date.now().toString(),
                type: '',
                brand: '',
                model: '',
                quantity: 1,
                location: '',
                notes: '',
              }],
            });
          }}
        >
          添加设备
        </Button>
      </div>

      <Table
        dataSource={solutionData.products}
        rowKey="id"
        pagination={false}
        columns={[
          { title: '设备类型', dataIndex: 'type', key: 'type', width: 120,
            render: (text: string, record: any) => (
              <Input value={text} onChange={(e) => {
                const products = solutionData.products.map((p) =>
                  p.id === record.id ? { ...p, type: e.target.value } : p
                );
                setSolutionData({ ...solutionData, products });
              }} placeholder="类型" />
            ),
          },
          { title: '品牌', dataIndex: 'brand', key: 'brand', width: 100,
            render: (text: string, record: any) => (
              <Input value={text} onChange={(e) => {
                const products = solutionData.products.map((p) =>
                  p.id === record.id ? { ...p, brand: e.target.value } : p
                );
                setSolutionData({ ...solutionData, products });
              }} placeholder="品牌" />
            ),
          },
          { title: '型号', dataIndex: 'model', key: 'model', width: 120,
            render: (text: string, record: any) => (
              <Input value={text} onChange={(e) => {
                const products = solutionData.products.map((p) =>
                  p.id === record.id ? { ...p, model: e.target.value } : p
                );
                setSolutionData({ ...solutionData, products });
              }} placeholder="型号" />
            ),
          },
          { title: '数量', dataIndex: 'quantity', key: 'quantity', width: 80,
            render: (text: number, record: any) => (
              <Input type="number" value={text} onChange={(e) => {
                const products = solutionData.products.map((p) =>
                  p.id === record.id ? { ...p, quantity: Number(e.target.value) } : p
                );
                setSolutionData({ ...solutionData, products });
              }} placeholder="数量" />
            ),
          },
          { title: '部署位置', dataIndex: 'location', key: 'location',
            render: (text: string, record: any) => (
              <Input value={text} onChange={(e) => {
                const products = solutionData.products.map((p) =>
                  p.id === record.id ? { ...p, location: e.target.value } : p
                );
                setSolutionData({ ...solutionData, products });
              }} placeholder="位置" />
            ),
          },
          { title: '操作', key: 'action', width: 60,
            render: (_: any, record: any) => (
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  setSolutionData({
                    ...solutionData,
                    products: solutionData.products.filter((p) => p.id !== record.id),
                  });
                }}
              />
            ),
          },
        ]}
      />
    </div>
  );

  const step5Content = (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>预览方案</Title>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={8}><Text type="secondary">方案类型：</Text><Tag color={solutionData.type === 'network' ? 'blue' : 'red'}>{solutionData.type === 'network' ? '网络建设' : '网络安全'}</Tag></Col>
          <Col span={8}><Text type="secondary">方案名称：</Text>{solutionData.name || '-'}</Col>
          <Col span={8}><Text type="secondary">客户名称：</Text>{solutionData.customerName || '-'}</Col>
          <Col span={8}><Text type="secondary">所属行业：</Text>{solutionData.industry || '-'}</Col>
          <Col span={8}><Text type="secondary">项目规模：</Text>{solutionData.scale || '-'}</Col>
          {solutionData.protectionLevel && (
            <Col span={8}><Text type="secondary">等保级别：</Text>{solutionData.protectionLevel}</Col>
          )}
          <Col span={8}><Text type="secondary">预算：</Text>{solutionData.budget ? `${solutionData.budget}万元` : '-'}</Col>
        </Row>
      </Card>

      {solutionData.standards.length > 0 && (
        <Card title="参考标准" style={{ marginBottom: 16 }}>
          <Space wrap>
            {solutionData.standards.map((s) => <Tag key={s}>{s}</Tag>)}
          </Space>
        </Card>
      )}

      {solutionData.background && (
        <Card title="项目背景" style={{ marginBottom: 16 }}>
          <Text>{solutionData.background}</Text>
        </Card>
      )}

      {solutionData.goals && (
        <Card title="项目目标" style={{ marginBottom: 16 }}>
          <Text>{solutionData.goals}</Text>
        </Card>
      )}

      <Card title="章节结构" style={{ marginBottom: 16 }}>
        {solutionData.chapters.filter(c => c.enabled).map((c, i) => (
          <Tag key={c.id} style={{ marginBottom: 4 }}>{i + 1}. {c.title}</Tag>
        ))}
      </Card>

      {solutionData.products.length > 0 && (
        <Card title="设备清单">
          <Table
            dataSource={solutionData.products}
            rowKey="id"
            pagination={false}
            size="small"
            columns={[
              { title: '类型', dataIndex: 'type' },
              { title: '品牌', dataIndex: 'brand' },
              { title: '型号', dataIndex: 'model' },
              { title: '数量', dataIndex: 'quantity' },
              { title: '位置', dataIndex: 'location' },
            ]}
          />
        </Card>
      )}
    </div>
  );

  const steps = [
    { title: '类型选择', content: step1Content },
    { title: '基本信息', content: step2Content },
    { title: '章节配置', content: step3Content },
    { title: '补充内容', content: step4Content },
    { title: '预览导出', content: step5Content },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/solution')}>返回</Button>
          <Title level={4} style={{ margin: 0 }}>新建方案</Title>
        </Space>
        <Space>
          <Button icon={<SaveOutlined />} onClick={handleSave}>保存</Button>
          <Button icon={<ExportOutlined />} onClick={() => handleExport('Word')}>导出Word</Button>
          <Button onClick={() => handleExport('PDF')}>导出PDF</Button>
          <Button onClick={() => handleExport('MD')}>导出MD</Button>
        </Space>
      </div>

      <Card>
        <Steps
          current={currentStep}
          style={{ marginBottom: 32 }}
          items={steps.map((step) => ({ title: step.title }))}
        />

        <div style={{ minHeight: 400, padding: '0 16px' }}>
          {steps[currentStep].content}
        </div>

        <Divider />

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={currentStep === 0}
            onClick={handlePrev}
          >
            上一步
          </Button>
          <Space>
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={handleNext}>
                下一步
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="primary" onClick={handleSave}>
                保存方案
              </Button>
            )}
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default SolutionCreate;
