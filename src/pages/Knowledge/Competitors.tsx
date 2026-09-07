import { useState } from 'react';
import { Card, Table, Tag, Input, Typography, Breadcrumb, Button, Drawer, Descriptions, Tabs, List, Space, Select } from 'antd';
import { SearchOutlined, ArrowLeftOutlined, BarChartOutlined, TrophyOutlined, WarningOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/theme';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const presetCompetitors = [
  {
    id: '1', name: '华为', englishName: 'Huawei',
    positioning: '全栈ICT解决方案提供商', headquarters: '深圳',
    website: 'https://www.huawei.com',
    category: '网络设备品牌',
    productLines: ['防火墙USG系列', '交换机S/CE系列', '路由器AR/NE系列', '安全态势感知HiSec'],
    advantages: ['品牌影响力大', '产品线齐全', '国产化自主可控', '渠道覆盖广', '研发投入大'],
    disadvantages: ['价格偏高', '部分功能复杂', '中小企业适配度一般', '售后服务响应慢'],
    pricingStrategy: '高端定价，品牌溢价',
    differentiationScripts: {
      '价格': '华为品牌溢价明显，同等功能价格高出20-30%',
      '服务': '渠道商服务，响应速度不如本地化厂商',
      '技术': '部分功能过于复杂，运维门槛高',
      '综合': '华为产品线齐全但价格高，适合预算充足的大型项目',
    },
    models: [
      { name: 'USG6625E', type: '防火墙', throughput: '180Gbps', sessions: '2000万', interfaces: '10GE/40GE', price: '高', highlight: '高性能、AI防护' },
      { name: 'CE12800', type: '核心交换机', throughput: '102.4Tbps', sessions: '-', interfaces: '100GE/400GE', price: '高', highlight: '超大容量、400GE' },
      { name: 'AR6280', type: '路由器', throughput: '10Gbps', sessions: '-', interfaces: 'GE/10GE', price: '中高', highlight: 'SD-WAN、智能选路' },
      { name: 'AP7060DN', type: '无线AP', throughput: '3.55Gbps', sessions: '512终端', interfaces: '2.5GE', price: '中', highlight: 'WiFi6、高密覆盖' },
    ],
  },
  {
    id: '2', name: '深信服', englishName: 'Sangfor',
    positioning: '专注安全与云计算的ICT厂商', headquarters: '深圳',
    website: 'https://www.sangfor.com',
    category: '安全设备品牌',
    productLines: ['防火墙NGAF', 'VPN SSL', 'EDR终端安全', '超融合aCloud', 'SD-WAN'],
    advantages: ['安全领域口碑好', '产品易用性强', '云安全融合方案', '性价比高', '本土化服务好'],
    disadvantages: ['网络设备线较弱', '品牌认知度待提升', '高端市场竞争力不足', '产品线聚焦安全'],
    pricingStrategy: '中端定价，主打性价比',
    differentiationScripts: {
      '价格': '深信服安全产品性价比高，但整体方案价格需综合评估',
      '品牌': '深信服在安全领域有优势，但网络设备不如专业厂商',
      '技术': '安全能力强，但整体网络架构能力有限',
      '综合': '深信服安全+云融合方案有优势，适合中型企业安全建设',
    },
    models: [
      { name: 'NGAF-2000', type: '防火墙', throughput: '160Gbps', sessions: '1800万', interfaces: 'GE/10GE', price: '中', highlight: '智能流量管控、云联动' },
      { name: 'aSSL-5000', type: 'VPN', throughput: '5Gbps', sessions: '5万并发', interfaces: 'GE', price: '中低', highlight: '远程接入、零信任' },
      { name: 'EDR-3000', type: '终端安全', throughput: '-', sessions: '10万终端', interfaces: '-', price: '中', highlight: '轻量Agent、云端管理' },
      { name: 'aSD-WAN', type: '广域网', throughput: '-', sessions: '-', interfaces: 'GE/4G', price: '中', highlight: '智能选路、应用加速' },
    ],
  },
  {
    id: '3', name: '奇安信', englishName: 'QiAnXin',
    positioning: '网络安全龙头厂商', headquarters: '北京',
    website: 'https://www.qianxin.com',
    category: '安全设备品牌',
    productLines: ['防火墙天眼', '态势感知', '零信任', '终端安全天擎', '数据库安全'],
    advantages: ['安全基因纯正', '政府客户资源', '等保合规经验丰富', '威胁情报能力强', '安全服务完善'],
    disadvantages: ['价格较高', '产品线相对聚焦安全', '中小企业适配度一般', '网络设备需外采'],
    pricingStrategy: '高端定价，安全专业溢价',
    differentiationScripts: {
      '价格': '奇安信专注安全，价格偏高，综合方案成本需考量',
      '品牌': '奇安信安全专业度高，但网络设备需外采',
      '技术': '安全能力强，但需配合其他厂商网络设备',
      '综合': '奇安信安全专业度最高，适合对安全要求极高的项目',
    },
    models: [
      { name: 'NF-5280', type: '防火墙', throughput: '160Gbps', sessions: '1500万', interfaces: '10GE/40GE', price: '高', highlight: '等保合规、态势感知联动' },
      { name: '天擎', type: '终端安全', throughput: '-', sessions: '20万终端', interfaces: '-', price: '高', highlight: '威胁检测、自动响应' },
      { name: '态势感知', type: '安全平台', throughput: '-', sessions: '-', interfaces: '-', price: '高', highlight: '全网可视、智能分析' },
      { name: '数据库审计', type: '数据安全', throughput: '10Gbps', sessions: '-', interfaces: 'GE', price: '中高', highlight: '数据库审计、合规' },
    ],
  },
  {
    id: '4', name: 'H3C', englishName: 'H3C',
    positioning: '数字化解决方案领导者', headquarters: '杭州',
    website: 'https://www.h3c.com',
    category: '网络设备品牌',
    productLines: ['防火墙SecPath', '交换机S系列', '路由器AR系列', '无线AP', '超融合'],
    advantages: ['网络产品线齐全', '渠道体系成熟', '教育行业优势', '性价比高', '技术文档完善'],
    disadvantages: ['安全能力相对薄弱', '品牌影响力不如华为', '高端市场竞争力有限', '生态不如华为'],
    pricingStrategy: '中端定价，渠道分利',
    differentiationScripts: {
      '价格': 'H3C价格适中，但安全产品需单独采购',
      '品牌': 'H3C网络产品成熟，安全领域专业度不足',
      '技术': '网络架构能力强，但整体安全方案需集成',
      '综合': 'H3C网络产品性价比高，适合网络建设为主的项目',
    },
    models: [
      { name: 'S12500', type: '核心交换机', throughput: '25.6Tbps', sessions: '-', interfaces: '100GE', price: '中', highlight: 'IRF2虚拟化、高可靠' },
      { name: 'SecPath F5000', type: '防火墙', throughput: '120Gbps', sessions: '1200万', interfaces: '10GE', price: '中', highlight: '等保合规、应用识别' },
      { name: 'MSR3600', type: '路由器', throughput: '8Gbps', sessions: '-', interfaces: 'GE', price: '中低', highlight: '多业务、SD-WAN' },
      { name: 'WA6620', type: '无线AP', throughput: '3.0Gbps', sessions: '512终端', interfaces: '2.5GE', price: '中低', highlight: 'WiFi6、智能射频' },
    ],
  },
  {
    id: '5', name: '思科', englishName: 'Cisco',
    positioning: '全球网络设备领导者', headquarters: '美国',
    website: 'https://www.cisco.com',
    category: '网络设备品牌',
    productLines: ['Firepower防火墙', 'Catalyst交换机', 'ISR路由器', 'Meraki无线', 'Duo安全'],
    advantages: ['技术领先', '品牌国际认可', '产品线齐全', '生态系统完善', '技术文档权威'],
    disadvantages: ['价格昂贵', '本地化服务有限', '国产化要求不满足', '运维复杂度高'],
    pricingStrategy: '高端定价，技术溢价',
    differentiationScripts: {
      '价格': '思科价格是国内厂商2-3倍，总拥有成本高',
      '品牌': '国际品牌技术强，但本地化服务和合规适配不足',
      '技术': '技术领先但价格门槛高，中小项目不适用',
      '综合': '思科适合对国际品牌有要求的跨国企业，国内项目性价比低',
    },
    models: [
      { name: 'Firepower 4120', type: '防火墙', throughput: '85Gbps', sessions: '1000万', interfaces: '10GE', price: '高', highlight: '高级威胁防护、AMP' },
      { name: 'Catalyst 9500', type: '核心交换机', throughput: '6.4Tbps', sessions: '-', interfaces: '100GE', price: '高', highlight: 'SD-Access、AI分析' },
      { name: 'ISR 4451', type: '路由器', throughput: '2Gbps', sessions: '-', interfaces: 'GE', price: '高', highlight: '多业务、安全集成' },
      { name: 'Meraki MR56', type: '无线AP', throughput: '5.9Gbps', sessions: '512终端', interfaces: '5GE', price: '高', highlight: '云管理、零接触部署' },
    ],
  },
  {
    id: '6', name: 'Palo Alto', englishName: 'Palo Alto Networks',
    positioning: '全球网络安全领导者', headquarters: '美国',
    website: 'https://www.paloaltonetworks.com',
    category: '安全设备品牌',
    productLines: ['NGFW防火墙', 'Prisma云安全', 'Cortex XDR', 'WildFire沙箱'],
    advantages: ['技术领先', '品牌国际认可', '创新能力强', '云安全融合好', '威胁情报强'],
    disadvantages: ['价格昂贵', '本地化服务有限', '国产化要求不满足', '技术门槛高'],
    pricingStrategy: '高端定价，技术溢价',
    differentiationScripts: {
      '价格': 'Palo Alto价格是国内厂商2-3倍，总拥有成本高',
      '品牌': '国际品牌技术强，但本地化服务和合规适配不足',
      '技术': '技术领先但价格门槛高，中小项目不适用',
      '综合': 'Palo Alto适合对安全技术要求极高的跨国企业',
    },
    models: [
      { name: 'PA-5260', type: '防火墙', throughput: '72Gbps', sessions: '6400万', interfaces: '10GE/40GE', price: '极高', highlight: 'ML防护、零信任' },
      { name: 'PA-3260', type: '防火墙', throughput: '18Gbps', sessions: '1600万', interfaces: '10GE', price: '高', highlight: '威胁防护、SD-WAN' },
      { name: 'Prisma Access', type: '云安全', throughput: '-', sessions: '-', interfaces: '-', price: '高', highlight: 'SASE、零信任接入' },
      { name: 'Cortex XDR', type: '终端安全', throughput: '-', sessions: '-', interfaces: '-', price: '高', highlight: 'XDR、AI分析' },
    ],
  },
];

const Competitors: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedCompetitor, setSelectedCompetitor] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const categories = [...new Set(presetCompetitors.map((c) => c.category))];

  const filteredCompetitors = presetCompetitors.filter((c) => {
    if (filterCategory !== 'all' && c.category !== filterCategory) return false;
    if (searchText) {
      const lower = searchText.toLowerCase();
      return c.name.toLowerCase().includes(lower) || c.englishName.toLowerCase().includes(lower);
    }
    return true;
  });

  const handleViewDetail = (competitor: any) => {
    setSelectedCompetitor(competitor);
    setDrawerOpen(true);
  };

  const columns = [
    {
      title: '厂商名称', dataIndex: 'name', key: 'name', width: 100,
      render: (text: string, record: any) => (
        <a onClick={() => handleViewDetail(record)} style={{ fontWeight: 600 }}>{text}</a>
      ),
    },
    { title: '英文名', dataIndex: 'englishName', key: 'englishName', width: 120 },
    { title: '分类', dataIndex: 'category', key: 'category', width: 120,
      render: (text: string) => <Tag color={text.includes('网络') ? 'blue' : 'orange'}>{text}</Tag>,
    },
    { title: '定位', dataIndex: 'positioning', key: 'positioning', ellipsis: true },
    { title: '总部', dataIndex: 'headquarters', key: 'headquarters', width: 80 },
    {
      title: '产品线', dataIndex: 'productLines', key: 'productLines', width: 200,
      render: (items: string[]) => items.slice(0, 2).map((p) => <Tag key={p}>{p}</Tag>),
    },
  ];

  const modelColumns = [
    { title: '型号', dataIndex: 'name', key: 'name', width: 140, render: (text: string) => <strong>{text}</strong> },
    { title: '类型', dataIndex: 'type', key: 'type', width: 100 },
    { title: '吞吐量', dataIndex: 'throughput', key: 'throughput', width: 100 },
    { title: '会话数', dataIndex: 'sessions', key: 'sessions', width: 120 },
    { title: '接口', dataIndex: 'interfaces', key: 'interfaces', width: 120 },
    { title: '价格', dataIndex: 'price', key: 'price', width: 60,
      render: (text: string) => {
        const color = text === '极高' ? 'red' : text === '高' ? 'orange' : text === '中' ? 'blue' : 'green';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    { title: '亮点', dataIndex: 'highlight', key: 'highlight', ellipsis: true },
  ];

  return (
    <div>
      <Breadcrumb
        items={[
          { title: <a onClick={() => navigate('/knowledge')}>知识库</a> },
          { title: '竞品分析库' },
        ]}
        style={{ marginBottom: 16 }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/knowledge')} />
        <BarChartOutlined style={{ fontSize: 28, color: theme.colors.primary }} />
        <div>
          <Title level={4} style={{ margin: 0 }}>竞品分析库</Title>
          <Text type="secondary">竞品品牌、产品参数对比分析</Text>
        </div>
      </div>

      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="搜索厂商..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <Select value={filterCategory} onChange={setFilterCategory} style={{ width: 150 }}>
          <Option value="all">全部分类</Option>
          {categories.map((c) => <Option key={c} value={c}>{c}</Option>)}
        </Select>
      </Space>

      <Card>
        <Table
          dataSource={filteredCompetitors}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Drawer
        title={selectedCompetitor?.name}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={800}
      >
        {selectedCompetitor && (
          <Tabs items={[
            {
              key: 'basic', label: '基本信息',
              children: (
                <Descriptions column={2} bordered size="small">
                  <Descriptions.Item label="厂商名称">{selectedCompetitor.name}</Descriptions.Item>
                  <Descriptions.Item label="英文名">{selectedCompetitor.englishName}</Descriptions.Item>
                  <Descriptions.Item label="分类"><Tag color={selectedCompetitor.category.includes('网络') ? 'blue' : 'orange'}>{selectedCompetitor.category}</Tag></Descriptions.Item>
                  <Descriptions.Item label="总部">{selectedCompetitor.headquarters}</Descriptions.Item>
                  <Descriptions.Item label="定位" span={2}>{selectedCompetitor.positioning}</Descriptions.Item>
                  <Descriptions.Item label="官网"><a href={selectedCompetitor.website} target="_blank" rel="noopener noreferrer">{selectedCompetitor.website}</a></Descriptions.Item>
                  <Descriptions.Item label="定价策略">{selectedCompetitor.pricingStrategy}</Descriptions.Item>
                </Descriptions>
              ),
            },
            {
              key: 'products', label: '产品线',
              children: (
                <List
                  dataSource={selectedCompetitor.productLines}
                  renderItem={(item) => <List.Item><Tag>{item}</Tag></List.Item>}
                />
              ),
            },
            {
              key: 'models', label: '产品参数',
              children: (
                <Table
                  dataSource={selectedCompetitor.models}
                  columns={modelColumns}
                  rowKey="name"
                  pagination={false}
                  size="small"
                />
              ),
            },
            {
              key: 'swot', label: '优劣势',
              children: (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <Title level={5} style={{ color: '#52c41a' }}><TrophyOutlined /> 优势</Title>
                    <List
                      size="small"
                      dataSource={selectedCompetitor.advantages}
                      renderItem={(item) => <List.Item style={{ color: '#52c41a' }}>✓ {item}</List.Item>}
                    />
                  </div>
                  <div>
                    <Title level={5} style={{ color: '#ff4d4f' }}><WarningOutlined /> 劣势</Title>
                    <List
                      size="small"
                      dataSource={selectedCompetitor.disadvantages}
                      renderItem={(item) => <List.Item style={{ color: '#ff4d4f' }}>✗ {item}</List.Item>}
                    />
                  </div>
                </>
              ),
            },
            {
              key: 'scripts', label: '差异化话术',
              children: (
                <List
                  dataSource={Object.entries(selectedCompetitor.differentiationScripts)}
                  renderItem={([key, value]) => (
                    <List.Item>
                      <List.Item.Meta
                        title={<Tag color="orange">{key}</Tag>}
                        description={value}
                      />
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

export default Competitors;
