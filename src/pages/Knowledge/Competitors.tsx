import { useState } from 'react';
import { Card, Row, Col, Table, Tag, Input, Typography, Breadcrumb, Button, Drawer, Descriptions, Tabs, List, Progress } from 'antd';
import { SearchOutlined, ArrowLeftOutlined, BarChartOutlined, TrophyOutlined, WarningOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/theme';

const { Title, Text, Paragraph } = Typography;

const presetCompetitors = [
  {
    id: '1', name: '华为', englishName: 'Huawei',
    positioning: '全栈ICT解决方案提供商', headquarters: '深圳',
    website: 'https://www.huawei.com',
    productLines: ['防火墙USG系列', '交换机S系列', '路由器AR/NE系列', '安全态势感知'],
    advantages: ['品牌影响力大', '产品线齐全', '国产化自主可控', '渠道覆盖广'],
    disadvantages: ['价格偏高', '部分功能复杂', '中小企业适配度一般'],
    pricingStrategy: '高端定价，品牌溢价',
    differentiationScripts: {
      '价格': '华为品牌溢价明显，同等功能价格高出20-30%',
      '服务': '渠道商服务，响应速度不如本地化厂商',
      '技术': '部分功能过于复杂，运维门槛高',
    },
  },
  {
    id: '2', name: '深信服', englishName: 'Sangfor',
    positioning: '专注安全与云计算的ICT厂商', headquarters: '深圳',
    website: 'https://www.sangfor.com',
    productLines: ['防火墙NGAF', 'VPN SSL', 'EDR终端安全', '超融合aCloud'],
    advantages: ['安全领域口碑好', '产品易用性强', '云安全融合方案', '性价比高'],
    disadvantages: ['网络设备线较弱', '品牌认知度待提升', '高端市场竞争力不足'],
    pricingStrategy: '中端定价，主打性价比',
    differentiationScripts: {
      '价格': '深信服安全产品性价比高，但整体方案价格需综合评估',
      '品牌': '深信服在安全领域有优势，但网络设备不如专业厂商',
      '技术': '安全能力强，但整体网络架构能力有限',
    },
  },
  {
    id: '3', name: '奇安信', englishName: 'QiAnXin',
    positioning: '网络安全龙头厂商', headquarters: '北京',
    website: 'https://www.qianxin.com',
    productLines: ['防火墙天眼', '态势感知', '零信任', '终端安全天擎'],
    advantages: ['安全基因纯正', '政府客户资源', '等保合规经验丰富', '威胁情报能力强'],
    disadvantages: ['价格较高', '产品线相对聚焦安全', '中小企业适配度一般'],
    pricingStrategy: '高端定价，安全专业溢价',
    differentiationScripts: {
      '价格': '奇安信专注安全，价格偏高，综合方案成本需考量',
      '品牌': '奇安信安全专业度高，但网络设备需外采',
      '技术': '安全能力强，但需配合其他厂商网络设备',
    },
  },
  {
    id: '4', name: 'H3C', englishName: 'H3C',
    positioning: '数字化解决方案领导者', headquarters: '杭州',
    website: 'https://www.h3c.com',
    productLines: ['防火墙SecPath', '交换机S系列', '路由器AR系列', '无线AP'],
    advantages: ['网络产品线齐全', '渠道体系成熟', '教育行业优势', '性价比高'],
    disadvantages: ['安全能力相对薄弱', '品牌影响力不如华为', '高端市场竞争力有限'],
    pricingStrategy: '中端定价，渠道分利',
    differentiationScripts: {
      '价格': 'H3C价格适中，但安全产品需单独采购',
      '品牌': 'H3C网络产品成熟，安全领域专业度不足',
      '技术': '网络架构能力强，但整体安全方案需集成',
    },
  },
  {
    id: '5', name: 'Palo Alto', englishName: 'Palo Alto Networks',
    positioning: '全球网络安全领导者', headquarters: '美国',
    website: 'https://www.paloaltonetworks.com',
    productLines: ['NGFW防火墙', 'Prisma云安全', 'Cortex XDR', 'WildFire沙箱'],
    advantages: ['技术领先', '品牌国际认可', '创新能力强', '云安全融合好'],
    disadvantages: ['价格昂贵', '本地化服务有限', '国产化要求不满足'],
    pricingStrategy: '高端定价，技术溢价',
    differentiationScripts: {
      '价格': 'Palo Alto价格是国内厂商2-3倍，总拥有成本高',
      '品牌': '国际品牌技术强，但本地化服务和合规适配不足',
      '技术': '技术领先但价格门槛高，中小项目不适用',
    },
  },
];

const Competitors: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [searchText, setSearchText] = useState('');
  const [selectedCompetitor, setSelectedCompetitor] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredCompetitors = presetCompetitors.filter((c) => {
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
      title: '厂商名称', dataIndex: 'name', key: 'name',
      render: (text: string, record: any) => (
        <a onClick={() => handleViewDetail(record)} style={{ fontWeight: 600 }}>{text}</a>
      ),
    },
    { title: '英文名', dataIndex: 'englishName', key: 'englishName', width: 120 },
    { title: '定位', dataIndex: 'positioning', key: 'positioning' },
    { title: '总部', dataIndex: 'headquarters', key: 'headquarters', width: 80 },
    {
      title: '产品线', dataIndex: 'productLines', key: 'productLines',
      render: (items: string[]) => items.slice(0, 2).map((p) => <Tag key={p}>{p}</Tag>),
    },
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
          <Text type="secondary">竞品品牌、功能对比分析</Text>
        </div>
      </div>

      <Input
        placeholder="搜索厂商..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 300 }}
        allowClear
      />

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
        width={640}
      >
        {selectedCompetitor && (
          <Tabs items={[
            {
              key: 'basic', label: '基本信息',
              children: (
                <Descriptions column={2} bordered size="small">
                  <Descriptions.Item label="厂商名称">{selectedCompetitor.name}</Descriptions.Item>
                  <Descriptions.Item label="英文名">{selectedCompetitor.englishName}</Descriptions.Item>
                  <Descriptions.Item label="定位" span={2}>{selectedCompetitor.positioning}</Descriptions.Item>
                  <Descriptions.Item label="总部">{selectedCompetitor.headquarters}</Descriptions.Item>
                  <Descriptions.Item label="官网"><a href={selectedCompetitor.website} target="_blank" rel="noopener noreferrer">{selectedCompetitor.website}</a></Descriptions.Item>
                  <Descriptions.Item label="定价策略" span={2}>{selectedCompetitor.pricingStrategy}</Descriptions.Item>
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
              key: 'scripts', label: '话术',
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
