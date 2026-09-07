import { useState } from 'react';
import { Card, Row, Col, Table, Tag, Input, Select, Space, Typography, Breadcrumb, Button, Drawer, Descriptions, List } from 'antd';
import { SearchOutlined, ArrowLeftOutlined, ProductOutlined, ExpandOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/theme';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const presetProducts = [
  {
    id: '1', name: 'USG6000E系列', brand: '华为', category: '防火墙',
    type: '下一代防火墙', scenario: '企业边界防护',
    specs: { throughput: '200Gbps', interfaces: '10GE/40GE', VPN: 'IPSec/SSL' },
    features: ['应用识别', '用户识别', '入侵防御', '病毒防护', 'URL过滤'],
    compliance: ['等保2.0三级', 'CC EAL4+'],
    cases: ['某银行数据中心', '某政务云平台'],
    documents: [{ name: '产品白皮书', url: '#' }, { name: '配置指南', url: '#' }],
  },
  {
    id: '2', name: 'SRG系列', brand: '深信服', category: '防火墙',
    type: '下一代防火墙', scenario: '企业安全防护',
    specs: { throughput: '180Gbps', interfaces: 'GE/10GE', VPN: 'IPSec/SSL' },
    features: ['智能流量管控', '应用安全防护', 'VPN接入', '病毒查杀'],
    compliance: ['等保2.0三级', 'CCC认证'],
    cases: ['某省政务外网', '某三甲医院'],
    documents: [{ name: '产品手册', url: '#' }],
  },
  {
    id: '3', name: 'Firepower 2100', brand: '思科', category: '防火墙',
    type: '入侵防御系统', scenario: '企业安全防护',
    specs: { throughput: '85Gbps', interfaces: 'GE/10GE', VPN: 'IPSec/SSL' },
    features: ['深度包检测', '应用可视性', '沙箱防护', '威胁情报'],
    compliance: ['FIPS 140-2', 'CC EAL4+'],
    cases: ['某跨国企业', '某数据中心'],
    documents: [{ name: 'Tech Guide', url: '#' }],
  },
  {
    id: '4', name: 'NF-A系列', brand: '奇安信', category: '防火墙',
    type: '下一代防火墙', scenario: '等保合规建设',
    specs: { throughput: '160Gbps', interfaces: '10GE/40GE', VPN: 'IPSec/SSL' },
    features: ['等保合规', '应用防护', '入侵防御', '安全审计'],
    compliance: ['等保2.0三级', '公安部销售许可'],
    cases: ['某市公安系统', '某电力公司'],
    documents: [{ name: '产品介绍', url: '#' }],
  },
  {
    id: '5', name: 'WAF-1000', brand: '安恒', category: 'WAF',
    type: 'Web应用防火墙', scenario: 'Web应用防护',
    specs: { throughput: '10Gbps', connections: '100万', latency: '<1ms' },
    features: ['SQL注入防护', 'XSS防护', 'CC攻击防护', 'Bot管理'],
    compliance: ['等保2.0', '公安部销售许可'],
    cases: ['某电商平台', '某政府门户网站'],
    documents: [{ name: '部署指南', url: '#' }],
  },
  {
    id: '6', name: 'HiSec Insight', brand: '华为', category: 'IDS/IPS',
    type: '入侵检测系统', scenario: '网络安全监控',
    specs: { throughput: '40Gbps', interfaces: '10GE', detection: '99.9%' },
    features: ['异常流量检测', '攻击行为分析', '威胁情报联动', '可视化展示'],
    compliance: ['等保2.0', 'CCC认证'],
    cases: ['某运营商网络', '某省级政务云'],
    documents: [{ name: '产品文档', url: '#' }],
  },
  {
    id: '7', name: 'EDR-3000', brand: '深信服', category: 'EDR',
    type: '终端检测响应', scenario: '终端安全防护',
    specs: { agent: '轻量级', deployment: '云端管理', response: '<5min' },
    features: ['恶意软件防护', '行为监控', '威胁狩猎', '自动响应'],
    compliance: ['等保2.0', 'CC认证'],
    cases: ['某金融机构', '某大型企业'],
    documents: [{ name: '管理手册', url: '#' }],
  },
  {
    id: '8', name: 'AC-6000', brand: '华为', category: 'AC',
    type: '无线控制器', scenario: '无线网络管理',
    specs: { maxAP: '4096', concurrency: '10万', protocol: 'WiFi6' },
    features: ['智能射频管理', '用户认证', '负载均衡', '安全接入'],
    compliance: ['WiFi联盟认证'],
    cases: ['某大学校园', '某大型园区'],
    documents: [{ name: '配置手册', url: '#' }],
  },
];

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [searchText, setSearchText] = useState('');
  const [filterBrand, setFilterBrand] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const brands = [...new Set(presetProducts.map((p) => p.brand))];
  const categories = [...new Set(presetProducts.map((p) => p.category))];

  const filteredProducts = presetProducts.filter((p) => {
    if (filterBrand !== 'all' && p.brand !== filterBrand) return false;
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (searchText) {
      const lower = searchText.toLowerCase();
      return p.name.toLowerCase().includes(lower) || p.type.toLowerCase().includes(lower);
    }
    return true;
  });

  const handleViewDetail = (product: any) => {
    setSelectedProduct(product);
    setDrawerOpen(true);
  };

  const columns = [
    {
      title: '产品名称', dataIndex: 'name', key: 'name',
      render: (text: string, record: any) => (
        <a onClick={() => handleViewDetail(record)} style={{ fontWeight: 600 }}>{text}</a>
      ),
    },
    { title: '品牌', dataIndex: 'brand', key: 'brand', width: 100 },
    { title: '类型', dataIndex: 'type', key: 'type', width: 150 },
    { title: '分类', dataIndex: 'category', key: 'category', width: 100,
      render: (text: string) => <Tag>{text}</Tag>,
    },
    { title: '应用场景', dataIndex: 'scenario', key: 'scenario' },
    {
      title: '合规认证', dataIndex: 'compliance', key: 'compliance',
      render: (items: string[]) => items.slice(0, 2).map((c) => <Tag key={c} color="blue">{c}</Tag>),
    },
  ];

  return (
    <div>
      <Breadcrumb
        items={[
          { title: <a onClick={() => navigate('/knowledge')}>知识库</a> },
          { title: '产品知识库' },
        ]}
        style={{ marginBottom: 16 }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/knowledge')} />
        <ProductOutlined style={{ fontSize: 28, color: theme.colors.primary }} />
        <div>
          <Title level={4} style={{ margin: 0 }}>产品知识库</Title>
          <Text type="secondary">网络设备、安全设备产品信息</Text>
        </div>
      </div>

      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="搜索产品..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <Select value={filterBrand} onChange={setFilterBrand} style={{ width: 120 }}>
          <Option value="all">全部品牌</Option>
          {brands.map((b) => <Option key={b} value={b}>{b}</Option>)}
        </Select>
        <Select value={filterCategory} onChange={setFilterCategory} style={{ width: 120 }}>
          <Option value="all">全部分类</Option>
          {categories.map((c) => <Option key={c} value={c}>{c}</Option>)}
        </Select>
      </Space>

      <Card>
        <Table
          dataSource={filteredProducts}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Drawer
        title={selectedProduct?.name}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={600}
      >
        {selectedProduct && (
          <div>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="品牌">{selectedProduct.brand}</Descriptions.Item>
              <Descriptions.Item label="类型">{selectedProduct.type}</Descriptions.Item>
              <Descriptions.Item label="分类"><Tag>{selectedProduct.category}</Tag></Descriptions.Item>
              <Descriptions.Item label="应用场景">{selectedProduct.scenario}</Descriptions.Item>
              <Descriptions.Item label="吞吐量">{selectedProduct.specs.throughput || selectedProduct.specs.agent}</Descriptions.Item>
              <Descriptions.Item label="接口">{selectedProduct.specs.interfaces || selectedProduct.specs.deployment}</Descriptions.Item>
            </Descriptions>

            <Title level={5} style={{ marginTop: 24, marginBottom: 12 }}>功能特性</Title>
            <Space wrap>
              {selectedProduct.features.map((f: string) => <Tag key={f} color="blue">{f}</Tag>)}
            </Space>

            <Title level={5} style={{ marginTop: 24, marginBottom: 12 }}>合规认证</Title>
            <Space wrap>
              {selectedProduct.compliance.map((c: string) => <Tag key={c} color="green">{c}</Tag>)}
            </Space>

            <Title level={5} style={{ marginTop: 24, marginBottom: 12 }}>典型客户</Title>
            <List
              size="small"
              dataSource={selectedProduct.cases}
              renderItem={(item: string) => <List.Item>{item}</List.Item>}
            />

            <Title level={5} style={{ marginTop: 24, marginBottom: 12 }}>产品文档</Title>
            <List
              size="small"
              dataSource={selectedProduct.documents}
              renderItem={(item: any) => (
                <List.Item>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">{item.name}</a>
                </List.Item>
              )}
            />
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Products;
