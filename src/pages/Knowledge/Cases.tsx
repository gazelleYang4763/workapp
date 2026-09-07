import { useState } from 'react';
import { Card, Row, Col, Tag, Input, Select, Typography, Breadcrumb, Button, Drawer, Descriptions, List, Timeline, Divider, Space } from 'antd';
import { SearchOutlined, ArrowLeftOutlined, BankOutlined, DollarOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/theme';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const presetCases = [
  {
    id: '1', name: '某银行数据中心安全防护项目', industry: '金融', scale: '大型',
    type: '网络安全', budget: 850, duration: '3个月', completionDate: '2024-06',
    background: '某省级银行数据中心面临日益严峻的安全威胁，需要建设全方位的安全防护体系。',
    painPoints: '现有安全设备老旧，无法应对新型攻击；安全运维人员不足；等保合规压力大。',
    solution: '部署下一代防火墙集群，建设SOC安全运营中心，实现威胁检测与响应自动化。',
    products: [
      { type: '防火墙', brand: '华为', model: 'USG6625E', quantity: 4 },
      { type: 'IDS', brand: '华为', model: 'HiSec Insight', quantity: 2 },
      { type: 'SOC', brand: '奇安信', model: '态势感知', quantity: 1 },
    ],
    results: '安全事件响应时间缩短80%，等保三级测评一次通过，年度安全事件减少60%。',
    customerFeedback: '项目实施专业，方案贴合实际需求，有效提升了整体安全防护能力。',
    tags: ['金融', '等保合规', '数据中心'],
  },
  {
    id: '2', name: '某政务云平台网络安全建设', industry: '政务', scale: '大型',
    type: '网络安全', budget: 1200, duration: '4个月', completionDate: '2024-08',
    background: '某市政务云平台承载多个委办局业务系统，需要满足等保三级要求。',
    painPoints: '多租户安全隔离不足，安全策略不统一，缺乏统一安全管理平台。',
    solution: '建设云安全资源池，部署分布式防火墙，实现安全策略集中管理。',
    products: [
      { type: '云防火墙', brand: '深信服', model: 'NGAF云版', quantity: 8 },
      { type: 'WAF', brand: '安恒', model: 'WAF-5000', quantity: 4 },
      { type: '堡垒机', brand: '齐治', model: 'Shterm', quantity: 2 },
    ],
    results: '顺利通过等保三级测评，安全事件响应效率提升70%，运维成本降低40%。',
    customerFeedback: '方案设计合理，有效解决了多租户安全问题，平台稳定性显著提升。',
    tags: ['政务', '云安全', '等保三级'],
  },
  {
    id: '3', name: '某三甲医院信息安全体系建设', industry: '医疗', scale: '中型',
    type: '网络安全', budget: 380, duration: '2个月', completionDate: '2024-05',
    background: '某三甲医院HIS系统面临勒索病毒威胁，需要加强终端和网络安全防护。',
    painPoints: '终端安全防护薄弱，缺乏网络准入控制，数据安全风险高。',
    solution: '部署EDR终端防护，建设网络准入系统，实现终端安全统一管理。',
    products: [
      { type: 'EDR', brand: '深信服', model: 'EDR-2000', quantity: 1 },
      { type: 'NAC', brand: '联软', model: '安渡', quantity: 1 },
      { type: '防火墙', brand: '奇安信', model: 'NF-1200', quantity: 2 },
    ],
    results: '终端病毒检出率提升95%，勒索病毒感染事件归零，通过等保二级测评。',
    customerFeedback: '有效遏制了勒索病毒传播，保障了医院信息系统安全稳定运行。',
    tags: ['医疗', '终端安全', '勒索防护'],
  },
  {
    id: '4', name: '某高校校园网络升级改造', industry: '教育', scale: '超大型',
    type: '网络建设', budget: 2600, duration: '6个月', completionDate: '2024-09',
    background: '某万人高校校园网络设备老化，无线覆盖不足，需要全面升级改造。',
    painPoints: '网络带宽不足，无线覆盖盲区多，运维管理困难。',
    solution: '建设万兆骨干网络，部署WiFi6无线覆盖，实现智能运维管理。',
    products: [
      { type: '核心交换机', brand: '华为', model: 'CE12800', quantity: 2 },
      { type: '汇聚交换机', brand: 'H3C', model: 'S12500', quantity: 8 },
      { type: '无线AP', brand: '华为', model: 'AP7060DN', quantity: 500 },
      { type: 'AC控制器', brand: '华为', model: 'AC6605', quantity: 4 },
    ],
    results: '网络带宽提升10倍，无线覆盖率达到100%，运维效率提升60%。',
    customerFeedback: '网络性能大幅提升，师生上网体验明显改善，运维管理更加便捷。',
    tags: ['教育', '校园网', 'WiFi6'],
  },
  {
    id: '5', name: '某制造业企业广域网互联', industry: '制造', scale: '大型',
    type: '网络建设', budget: 580, duration: '3个月', completionDate: '2024-07',
    background: '某制造企业总部与5个分支机构之间需要建立安全可靠的广域网互联。',
    painPoints: '分支机构网络割裂，数据传输不安全，视频会议卡顿。',
    solution: '建设SD-WAN广域网，实现分支互联和应用加速。',
    products: [
      { type: 'SD-WAN', brand: '深信服', model: 'aSD-WAN', quantity: 6 },
      { type: '防火墙', brand: '深信服', model: 'NGAF', quantity: 6 },
      { type: 'VPN', brand: '华为', model: 'USG6300', quantity: 6 },
    ],
    results: '广域网带宽提升5倍，视频会议流畅度提升90%，运维成本降低50%。',
    customerFeedback: '有效解决了分支机构互联问题，大幅提升了协同办公效率。',
    tags: ['制造', 'SD-WAN', '分支互联'],
  },
];

const Cases: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [searchText, setSearchText] = useState('');
  const [filterIndustry, setFilterIndustry] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const industries = [...new Set(presetCases.map((c) => c.industry))];
  const types = [...new Set(presetCases.map((c) => c.type))];

  const filteredCases = presetCases.filter((c) => {
    if (filterIndustry !== 'all' && c.industry !== filterIndustry) return false;
    if (filterType !== 'all' && c.type !== filterType) return false;
    if (searchText) {
      const lower = searchText.toLowerCase();
      return c.name.toLowerCase().includes(lower) || c.tags.some((t) => t.toLowerCase().includes(lower));
    }
    return true;
  });

  return (
    <div>
      <Breadcrumb
        items={[
          { title: <a onClick={() => navigate('/knowledge')}>知识库</a> },
          { title: '行业案例库' },
        ]}
        style={{ marginBottom: 16 }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/knowledge')} />
        <BankOutlined style={{ fontSize: 28, color: theme.colors.primary }} />
        <div>
          <Title level={4} style={{ margin: 0 }}>行业案例库</Title>
          <Text type="secondary">各行业成功案例参考</Text>
        </div>
      </div>

      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="搜索案例..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <Select value={filterIndustry} onChange={setFilterIndustry} style={{ width: 120 }}>
          <Option value="all">全部行业</Option>
          {industries.map((i) => <Option key={i} value={i}>{i}</Option>)}
        </Select>
        <Select value={filterType} onChange={setFilterType} style={{ width: 120 }}>
          <Option value="all">全部类型</Option>
          {types.map((t) => <Option key={t} value={t}>{t}</Option>)}
        </Select>
      </Space>

      <Row gutter={[16, 16]}>
        {filteredCases.map((c) => (
          <Col key={c.id} xs={24} sm={12}>
            <Card
              hoverable
              onClick={() => { setSelectedCase(c); setDrawerOpen(true); }}
              style={{ borderRadius: 8 }}
            >
              <div style={{ marginBottom: 8 }}>
                <Tag color={c.type === '网络安全' ? 'red' : 'blue'}>{c.type}</Tag>
                <Tag>{c.industry}</Tag>
                <Tag>{c.scale}</Tag>
              </div>
              <Title level={5} style={{ marginBottom: 8 }}>{c.name}</Title>
              <div style={{ color: theme.colors.textSecondary, marginBottom: 8 }}>
                <Space>
                  <span><DollarOutlined /> {c.budget}万</span>
                  <span><CalendarOutlined /> {c.duration}</span>
                </Space>
              </div>
              <Space wrap>
                {c.tags.map((t) => <Tag key={t}>{t}</Tag>)}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Drawer
        title={selectedCase?.name}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={640}
      >
        {selectedCase && (
          <div>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="行业">{selectedCase.industry}</Descriptions.Item>
              <Descriptions.Item label="规模">{selectedCase.scale}</Descriptions.Item>
              <Descriptions.Item label="类型">{selectedCase.type}</Descriptions.Item>
              <Descriptions.Item label="预算">{selectedCase.budget}万元</Descriptions.Item>
              <Descriptions.Item label="工期">{selectedCase.duration}</Descriptions.Item>
              <Descriptions.Item label="完工日期">{selectedCase.completionDate}</Descriptions.Item>
            </Descriptions>

            <Title level={5} style={{ marginTop: 24, marginBottom: 12 }}>项目背景</Title>
            <Paragraph>{selectedCase.background}</Paragraph>

            <Title level={5} style={{ marginBottom: 12 }}>痛点问题</Title>
            <Paragraph>{selectedCase.painPoints}</Paragraph>

            <Title level={5} style={{ marginBottom: 12 }}>解决方案</Title>
            <Paragraph>{selectedCase.solution}</Paragraph>

            <Title level={5} style={{ marginBottom: 12 }}>设备清单</Title>
            <List
              size="small"
              dataSource={selectedCase.products}
              renderItem={(item: any) => (
                <List.Item>
                  <Text>{item.type} - {item.brand} {item.model} × {item.quantity}</Text>
                </List.Item>
              )}
            />

            <Title level={5} style={{ marginBottom: 12 }}>项目成果</Title>
            <Paragraph style={{ color: '#52c41a' }}>{selectedCase.results}</Paragraph>

            <Title level={5} style={{ marginBottom: 12 }}>客户评价</Title>
            <Paragraph italic>"{selectedCase.customerFeedback}"</Paragraph>

            <Divider />
            <Space wrap>
              {selectedCase.tags.map((t: string) => <Tag key={t}>{t}</Tag>)}
            </Space>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Cases;
