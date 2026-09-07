import { useState } from 'react';
import { Card, Row, Col, Table, Tag, Input, Select, Space, Typography, Breadcrumb, Button, Drawer, Descriptions, List, Tabs } from 'antd';
import { SearchOutlined, ArrowLeftOutlined, ProductOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/theme';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const presetProducts = [
  {
    id: '1', name: 'USG6000E系列', brand: '华为', category: '防火墙', parentCategory: '安全设备',
    type: '下一代防火墙', scenario: '企业边界防护、数据中心安全',
    specs: { throughput: '200Gbps', interfaces: '10GE/40GE', VPN: 'IPSec/SSL', sessions: '2000万', concurrentUsers: '5万' },
    features: ['应用识别', '用户识别', '入侵防御', '病毒防护', 'URL过滤', 'SSL解密', '威胁情报联动'],
    compliance: ['等保2.0三级', 'CC EAL4+', '公安部销售许可'],
    cases: ['某银行数据中心', '某政务云平台'],
    documents: [{ name: '产品白皮书', url: '#' }, { name: '配置指南', url: '#' }],
    description: '华为USG6000E系列是面向中大型企业的下一代防火墙，采用多核架构，支持200Gbps吞吐量。集成了传统防火墙、入侵防御、防病毒、URL过滤、应用识别等多种安全功能，实现一体化安全防护。',
    useScenario: '适用于企业网络边界防护、数据中心安全分区、等保合规建设、多分支安全互联等场景。',
  },
  {
    id: '2', name: 'SRG系列', brand: '深信服', category: '防火墙', parentCategory: '安全设备',
    type: '下一代防火墙', scenario: '企业安全防护、等保合规',
    specs: { throughput: '180Gbps', interfaces: 'GE/10GE', VPN: 'IPSec/SSL', sessions: '1800万', concurrentUsers: '3万' },
    features: ['智能流量管控', '应用安全防护', 'VPN接入', '病毒查杀', '僵尸网络检测', '云管联动'],
    compliance: ['等保2.0三级', 'CCC认证'],
    cases: ['某省政务外网', '某三甲医院'],
    documents: [{ name: '产品手册', url: '#' }],
    description: '深信服SRG系列防火墙基于创新的SINPF引擎，具备智能流量管控和应用安全防护能力。支持与深信服其他安全产品联动，形成完整的安全防护体系。',
    useScenario: '适用于政务、医疗、教育等行业的等保合规建设，以及企业总部与分支机构的安全互联。',
  },
  {
    id: '3', name: 'Firepower 2100/4100', brand: '思科', category: '防火墙', parentCategory: '安全设备',
    type: '入侵防御系统', scenario: '企业安全防护、数据中心',
    specs: { throughput: '85-200Gbps', interfaces: 'GE/10GE/40GE', VPN: 'IPSec/SSL', sessions: '1000万', concurrentUsers: '2万' },
    features: ['深度包检测', '应用可视性', '沙箱防护', '威胁情报', '网络可视性', '自动响应'],
    compliance: ['FIPS 140-2', 'CC EAL4+'],
    cases: ['某跨国企业', '某数据中心'],
    documents: [{ name: 'Tech Guide', url: '#' }],
    description: '思科Firepower系列是业界领先的下一代防火墙，基于Snort引擎提供卓越的威胁检测能力。支持高级恶意软件防护（AMP）、URL过滤、应用控制等高级安全功能。',
    useScenario: '适用于大型企业网络边界、数据中心安全防护、云环境安全等场景。',
  },
  {
    id: '4', name: 'NF-A系列', brand: '奇安信', category: '防火墙', parentCategory: '安全设备',
    type: '下一代防火墙', scenario: '等保合规建设、政务安全',
    specs: { throughput: '160Gbps', interfaces: '10GE/40GE', VPN: 'IPSec/SSL', sessions: '1500万', concurrentUsers: '4万' },
    features: ['等保合规', '应用防护', '入侵防御', '安全审计', '威胁情报', '态势感知联动'],
    compliance: ['等保2.0三级', '公安部销售许可'],
    cases: ['某市公安系统', '某电力公司'],
    documents: [{ name: '产品介绍', url: '#' }],
    description: '奇安信NF-A系列防火墙专注于等保合规和安全防护，具备完善的日志审计和安全分析能力。支持与奇安信态势感知平台联动，实现全网安全可视化。',
    useScenario: '适用于政务、公安、电力等关键行业的等保合规建设和安全防护。',
  },
  {
    id: '5', name: 'WAF-5000', brand: '安恒', category: 'WAF', parentCategory: '安全设备',
    type: 'Web应用防火墙', scenario: 'Web应用防护、API安全',
    specs: { throughput: '10Gbps', connections: '100万', latency: '<1ms', rps: '10万', sslTps: '2万' },
    features: ['SQL注入防护', 'XSS防护', 'CC攻击防护', 'Bot管理', 'API安全', '虚拟补丁'],
    compliance: ['等保2.0', '公安部销售许可'],
    cases: ['某电商平台', '某政府门户网站'],
    documents: [{ name: '部署指南', url: '#' }],
    description: '安恒WAF-5000是专业的Web应用防火墙，提供OWASP Top 10全覆盖防护。支持7层DDoS防护、Bot管理、API安全等高级功能，保障Web应用安全。',
    useScenario: '适用于网站防护、电商平台、API网关、移动应用后端等场景。',
  },
  {
    id: '6', name: 'HiSec Insight', brand: '华为', category: 'IDS/IPS', parentCategory: '安全设备',
    type: '入侵检测系统', scenario: '网络安全监控、威胁检测',
    specs: { throughput: '40Gbps', interfaces: '10GE', detection: '99.9%', sessions: '500万', logRate: '10万条/秒' },
    features: ['异常流量检测', '攻击行为分析', '威胁情报联动', '可视化展示', '关联分析', '自动化响应'],
    compliance: ['等保2.0', 'CCC认证'],
    cases: ['某运营商网络', '某省级政务云'],
    documents: [{ name: '产品文档', url: '#' }],
    description: '华为HiSec Insight是智能入侵检测系统，基于AI引擎和威胁情报，提供全方位的网络威胁检测和分析能力。支持与华为防火墙、交换机联动，实现自动化安全响应。',
    useScenario: '适用于核心网络监控、数据中心安全检测、等保合规要求的入侵检测部署。',
  },
  {
    id: '7', name: 'EDR-3000', brand: '深信服', category: '终端安全', parentCategory: '安全设备',
    type: '终端检测响应', scenario: '终端安全防护、勒索防护',
    specs: { agent: '轻量级<50MB', deployment: '云端管理', response: '<5min', coverage: '全平台', update: '实时' },
    features: ['恶意软件防护', '行为监控', '威胁狩猎', '自动响应', '勒索防护', '挖矿检测'],
    compliance: ['等保2.0', 'CC认证'],
    cases: ['某金融机构', '某大型企业'],
    documents: [{ name: '管理手册', url: '#' }],
    description: '深信服EDR-3000是终端检测与响应平台，采用轻量级Agent和云端智能分析，提供终端威胁的实时检测、自动响应和深度溯源能力。',
    useScenario: '适用于企业终端安全防护、勒索病毒防护、高级威胁检测、安全事件溯源。',
  },
  {
    id: '8', name: 'AC-6000', brand: '华为', category: '无线设备', parentCategory: '网络设备',
    type: '无线控制器', scenario: '无线网络管理、高密覆盖',
    specs: { maxAP: '4096', concurrency: '10万', protocol: 'WiFi6', ports: '10GE', redundancy: '1+1' },
    features: ['智能射频管理', '用户认证', '负载均衡', '安全接入', '漫游优化', '应用识别'],
    compliance: ['WiFi联盟认证'],
    cases: ['某大学校园', '某大型园区'],
    documents: [{ name: '配置手册', url: '#' }],
    description: '华为AC-6000是高性能无线控制器，支持WiFi6标准，可管理4096个AP。提供智能射频管理、用户认证、安全接入等功能，适用于高密度无线覆盖场景。',
    useScenario: '适用于校园、医院、酒店、大型园区等高密度无线覆盖和管理场景。',
  },
  {
    id: '9', name: 'S12500系列', brand: 'H3C', category: '交换机', parentCategory: '网络设备',
    type: '核心交换机', scenario: '数据中心、园区核心',
    specs: { throughput: '25.6Tbps', ports: '10GE/40GE/100GE', slots: '16', redundancy: '1+1', virtualization: 'IRF2' },
    features: ['高密度端口', '虚拟化IRF2', 'MPLS', 'IPv6', 'SDN', '网络可视化'],
    compliance: ['CCC认证'],
    cases: ['某高校核心网络', '某省级政务云'],
    documents: [{ name: '配置指南', url: '#' }],
    description: 'H3C S12500是高端核心交换机，支持25.6Tbps交换容量和100GE端口。采用IRF2虚拟化技术，简化网络管理，提升网络可靠性。',
    useScenario: '适用于大型园区核心、数据中心接入/汇聚、城域网核心等场景。',
  },
  {
    id: '10', name: 'CE12800系列', brand: '华为', category: '交换机', parentCategory: '网络设备',
    type: '数据中心交换机', scenario: '数据中心核心',
    specs: { throughput: '102.4Tbps', ports: '10GE/40GE/100GE/400GE', slots: '24', redundancy: 'N+1', virtualization: 'CSS2' },
    features: ['超大容量', '400GE支持', 'CSS2集群', 'SDN', '网络自动化', 'AI运维'],
    compliance: ['CCC认证', '国际认证'],
    cases: ['某互联网公司数据中心', '某银行同城双活'],
    documents: [{ name: '产品文档', url: '#' }],
    description: '华为CE12800是面向数据中心的高端交换机，支持102.4Tbps交换容量和400GE端口。采用CSS2集群技术，提供超大容量和高可靠性。',
    useScenario: '适用于大型数据中心核心、云计算网络、AI训练集群互联等场景。',
  },
  {
    id: '11', name: 'AR6280', brand: '华为', category: '路由器', parentCategory: '网络设备',
    type: '企业路由器', scenario: '企业广域网接入',
    specs: { throughput: '10Gbps', interfaces: 'GE/10GE', VPN: 'IPSec/DMVPN', slots: '4', redundancy: '双电源' },
    features: ['SD-WAN', '智能选路', '应用加速', 'VPN互联', '4G/5G接入', '统一管理'],
    compliance: ['CCC认证'],
    cases: ['某连锁企业总部', '某银行分支互联'],
    documents: [{ name: '配置手册', url: '#' }],
    description: '华为AR6280是面向企业的多业务路由器，支持SD-WAN和智能选路功能。可同时接入MPLS、互联网、4G/5G等多种链路，实现高可靠广域网互联。',
    useScenario: '适用于企业分支机构接入、SD-WAN组网、多分支互联等场景。',
  },
  {
    id: '12', name: 'AP7060DN', brand: '华为', category: '无线设备', parentCategory: '网络设备',
    type: 'WiFi6无线AP', scenario: '高密无线覆盖',
    specs: { standard: 'WiFi 6 (802.11ax)', speed: '3.55Gbps', mimo: '4x4 MIMO', clients: '512', poe: 'PoE+' },
    features: ['OFDMA', 'MU-MIMO', 'BSS Coloring', 'TWT', '智能天线', '云管理'],
    compliance: ['WiFi联盟认证'],
    cases: ['某大学图书馆', '某医院门诊楼'],
    documents: [{ name: '部署指南', url: '#' }],
    description: '华为AP7060DN是WiFi 6高密无线AP，支持OFDMA和MU-MIMO技术，单AP可接入512个终端。适用于高密度用户场景，提供极致的无线体验。',
    useScenario: '适用于学校教室、医院门诊、酒店大堂、会议中心等高密无线覆盖场景。',
  },
];

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [searchText, setSearchText] = useState('');
  const [filterBrand, setFilterBrand] = useState<string>('all');
  const [filterParentCategory, setFilterParentCategory] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const brands = [...new Set(presetProducts.map((p) => p.brand))];
  const parentCategories = [...new Set(presetProducts.map((p) => p.parentCategory))];
  const categories = [...new Set(presetProducts.map((p) => p.category))];

  const filteredProducts = presetProducts.filter((p) => {
    if (filterBrand !== 'all' && p.brand !== filterBrand) return false;
    if (filterParentCategory !== 'all' && p.parentCategory !== filterParentCategory) return false;
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (searchText) {
      const lower = searchText.toLowerCase();
      return p.name.toLowerCase().includes(lower) || p.type.toLowerCase().includes(lower) || p.description.toLowerCase().includes(lower);
    }
    return true;
  });

  const handleViewDetail = (product: any) => {
    setSelectedProduct(product);
    setDrawerOpen(true);
  };

  const columns = [
    {
      title: '产品名称', dataIndex: 'name', key: 'name', width: 160,
      render: (text: string, record: any) => (
        <a onClick={() => handleViewDetail(record)} style={{ fontWeight: 600 }}>{text}</a>
      ),
    },
    { title: '品牌', dataIndex: 'brand', key: 'brand', width: 80 },
    { title: '类型', dataIndex: 'type', key: 'type', width: 130 },
    { title: '分类', dataIndex: 'category', key: 'category', width: 80,
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    { title: '应用场景', dataIndex: 'scenario', key: 'scenario', ellipsis: true },
    {
      title: '合规认证', dataIndex: 'compliance', key: 'compliance', width: 180,
      render: (items: string[]) => items.slice(0, 2).map((c) => <Tag key={c} color="green">{c}</Tag>),
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

      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="搜索产品..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <Select value={filterParentCategory} onChange={setFilterParentCategory} style={{ width: 120 }}>
          <Option value="all">全部大类</Option>
          {parentCategories.map((c) => <Option key={c} value={c}>{c}</Option>)}
        </Select>
        <Select value={filterCategory} onChange={setFilterCategory} style={{ width: 120 }}>
          <Option value="all">全部分类</Option>
          {categories.map((c) => <Option key={c} value={c}>{c}</Option>)}
        </Select>
        <Select value={filterBrand} onChange={setFilterBrand} style={{ width: 100 }}>
          <Option value="all">全部品牌</Option>
          {brands.map((b) => <Option key={b} value={b}>{b}</Option>)}
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
        width={700}
      >
        {selectedProduct && (
          <Tabs items={[
            {
              key: 'basic', label: '基本信息',
              children: (
                <div>
                  <Descriptions column={2} bordered size="small">
                    <Descriptions.Item label="品牌">{selectedProduct.brand}</Descriptions.Item>
                    <Descriptions.Item label="类型">{selectedProduct.type}</Descriptions.Item>
                    <Descriptions.Item label="大类"><Tag color="orange">{selectedProduct.parentCategory}</Tag></Descriptions.Item>
                    <Descriptions.Item label="分类"><Tag color="blue">{selectedProduct.category}</Tag></Descriptions.Item>
                    <Descriptions.Item label="应用场景" span={2}>{selectedProduct.scenario}</Descriptions.Item>
                  </Descriptions>

                  <Title level={5} style={{ marginTop: 24, marginBottom: 8 }}>产品简介</Title>
                  <Paragraph>{selectedProduct.description}</Paragraph>

                  <Title level={5} style={{ marginTop: 24, marginBottom: 8 }}>适用场景</Title>
                  <Paragraph>{selectedProduct.useScenario}</Paragraph>

                  <Title level={5} style={{ marginTop: 24, marginBottom: 8 }}>功能特性</Title>
                  <Space wrap>
                    {selectedProduct.features.map((f: string) => <Tag key={f} color="blue">{f}</Tag>)}
                  </Space>

                  <Title level={5} style={{ marginTop: 24, marginBottom: 8 }}>合规认证</Title>
                  <Space wrap>
                    {selectedProduct.compliance.map((c: string) => <Tag key={c} color="green">{c}</Tag>)}
                  </Space>

                  <Title level={5} style={{ marginTop: 24, marginBottom: 8 }}>典型客户</Title>
                  <List
                    size="small"
                    dataSource={selectedProduct.cases}
                    renderItem={(item: string) => <List.Item>{item}</List.Item>}
                  />
                </div>
              ),
            },
            {
              key: 'specs', label: '技术参数',
              children: (
                <Descriptions column={2} bordered size="small">
                  {Object.entries(selectedProduct.specs).map(([key, value]) => (
                    <Descriptions.Item key={key} label={key}>
                      {String(value)}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              ),
            },
            {
              key: 'docs', label: '产品文档',
              children: (
                <List
                  size="small"
                  dataSource={selectedProduct.documents}
                  renderItem={(item: any) => (
                    <List.Item>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">{item.name}</a>
                    </List.Item>
                  )}
                />
              ),
            },
          ]} />
        )}
      </Drawer>
    </div>
  );
};

export default Products;
