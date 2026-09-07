import { useState } from 'react';
import { Card, Table, Tag, Input, Select, Typography, Breadcrumb, Button, Drawer, Descriptions, List, Tabs, Space } from 'antd';
import { SearchOutlined, ArrowLeftOutlined, FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/theme';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const presetStandards = [
  {
    id: '1', code: 'GB/T 22239-2019', name: '信息安全技术 网络安全等级保护基本要求',
    status: '现行', publishDate: '2019-05-10', implementDate: '2019-12-01',
    levels: ['二级', '三级', '四级'],
    category: '等级保护',
    summary: '规定了网络安全等级保护的第一级到第五级的安全要求，是等保2.0体系的核心标准。',
    keyRequirements: ['安全物理环境', '安全通信网络', '安全区域边界', '安全计算环境', '安全管理中心'],
    relatedProducts: ['防火墙', 'IDS/IPS', 'WAF', 'SOC'],
    relatedCompetitors: ['华为', '深信服', '奇安信'],
    relatedCases: ['某银行等保三级', '某政务云等保三级'],
  },
  {
    id: '2', code: 'GB/T 25070-2019', name: '信息安全技术 网络安全等级保护安全设计技术要求',
    status: '现行', publishDate: '2019-05-10', implementDate: '2019-12-01',
    levels: ['二级', '三级', '四级'],
    category: '等级保护',
    summary: '针对等级保护系统安全设计的技术要求，指导安全方案设计。',
    keyRequirements: ['安全计算环境设计', '安全区域边界设计', '安全通信网络设计', '安全管理中心设计'],
    relatedProducts: ['安全设计服务', '安全架构咨询'],
    relatedCompetitors: ['安恒', '天融信'],
    relatedCases: ['某省电子政务安全设计'],
  },
  {
    id: '3', code: 'GB/T 28448-2019', name: '信息安全技术 网络安全等级保护测评要求',
    status: '现行', publishDate: '2019-05-10', implementDate: '2019-12-01',
    levels: ['二级', '三级', '四级'],
    category: '等级保护',
    summary: '规定了等级保护测评的具体要求和方法。',
    keyRequirements: ['测评指标', '测评方法', '测评流程', '结果判定'],
    relatedProducts: ['测评服务'],
    relatedCompetitors: ['中国信息安全测评中心', '各地测评机构'],
    relatedCases: ['等保三级测评项目'],
  },
  {
    id: '4', code: 'GB/T 35273-2020', name: '信息安全技术 个人信息安全规范',
    status: '现行', publishDate: '2020-03-06', implementDate: '2020-10-01',
    levels: ['推荐性标准'],
    category: '数据安全',
    summary: '规定了个人信息收集、存储、使用、共享、转让、披露等环节的安全要求。',
    keyRequirements: ['个人信息收集', '个人信息存储', '个人信息使用', '个人信息共享'],
    relatedProducts: ['数据脱敏', '隐私计算', '数据分类分级'],
    relatedCompetitors: ['阿里云', '腾讯云'],
    relatedCases: ['某互联网公司隐私合规'],
  },
  {
    id: '5', code: 'GB/T 39786-2021', name: '信息安全技术 信息系统密码应用基本要求',
    status: '现行', publishDate: '2021-10-11', implementDate: '2022-04-01',
    levels: ['二级', '三级', '四级'],
    category: '密码应用',
    summary: '规定了信息系统密码应用的基本要求，包括物理环境、网络通信等。',
    keyRequirements: ['物理和环境安全', '网络和通信安全', '设备和计算安全', '应用和数据安全'],
    relatedProducts: ['密码机', 'SSL VPN', '签名验签'],
    relatedCompetitors: ['卫士通', '三未信安'],
    relatedCases: ['某金融系统密码改造'],
  },
  {
    id: '6', code: 'GB/T 20271-2006', name: '信息安全技术 信息系统通用安全技术要求',
    status: '现行', publishDate: '2006-05-31', implementDate: '2006-12-01',
    levels: ['通用标准'],
    category: '通用标准',
    summary: '规定了信息系统安全的通用技术要求。',
    keyRequirements: ['身份鉴别', '访问控制', '安全审计', '数据完整性', '数据保密性'],
    relatedProducts: ['IAM', 'DLP', '加密系统'],
    relatedCompetitors: ['启明星辰', '绿盟'],
    relatedCases: ['某央企安全体系建设'],
  },
  {
    id: '7', code: '《网络安全法》', name: '中华人民共和国网络安全法',
    status: '现行', publishDate: '2016-11-07', implementDate: '2017-06-01',
    levels: ['法律'],
    category: '法律法规',
    summary: '我国网络安全的基本法律，规定了网络运营者的安全保护义务。',
    keyRequirements: ['网络安全等级保护', '关键信息基础设施保护', '网络信息安全', '监测预警与应急处置'],
    relatedProducts: ['合规咨询服务'],
    relatedCompetitors: [],
    relatedCases: ['所有网络安全项目'],
  },
  {
    id: '8', code: '《数据安全法》', name: '中华人民共和国数据安全法',
    status: '现行', publishDate: '2021-06-10', implementDate: '2021-09-01',
    levels: ['法律'],
    category: '法律法规',
    summary: '规范数据处理活动，保障数据安全，促进数据开发利用。',
    keyRequirements: ['数据分类分级', '数据安全保护', '数据安全审查', '数据跨境传输'],
    relatedProducts: ['数据分类分级', '数据脱敏', 'DLP'],
    relatedCompetitors: ['美创科技', '昂楷科技'],
    relatedCases: ['某银行数据安全治理'],
  },
];

const Standards: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedStandard, setSelectedStandard] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const categories = [...new Set(presetStandards.map((s) => s.category))];

  const filteredStandards = presetStandards.filter((s) => {
    if (filterCategory !== 'all' && s.category !== filterCategory) return false;
    if (searchText) {
      const lower = searchText.toLowerCase();
      return s.code.toLowerCase().includes(lower) || s.name.toLowerCase().includes(lower);
    }
    return true;
  });

  const columns = [
    {
      title: '标准编号', dataIndex: 'code', key: 'code', width: 180,
      render: (text: string, record: any) => (
        <a onClick={() => { setSelectedStandard(record); setDrawerOpen(true); }} style={{ fontWeight: 600 }}>{text}</a>
      ),
    },
    { title: '标准名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '分类', dataIndex: 'category', key: 'category', width: 100,
      render: (text: string) => <Tag>{text}</Tag>,
    },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80,
      render: (text: string) => <Tag color="green">{text}</Tag>,
    },
    { title: '实施日期', dataIndex: 'implementDate', key: 'implementDate', width: 120 },
    {
      title: '适用级别', dataIndex: 'levels', key: 'levels',
      render: (items: string[]) => items.map((l) => <Tag key={l} color="blue">{l}</Tag>),
    },
  ];

  return (
    <div>
      <Breadcrumb
        items={[
          { title: <a onClick={() => navigate('/knowledge')}>知识库</a> },
          { title: '标准规范库' },
        ]}
        style={{ marginBottom: 16 }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/knowledge')} />
        <FileTextOutlined style={{ fontSize: 28, color: theme.colors.primary }} />
        <div>
          <Title level={4} style={{ margin: 0 }}>标准规范库</Title>
          <Text type="secondary">国家标准、行业法规</Text>
        </div>
      </div>

      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="搜索标准..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <Select value={filterCategory} onChange={setFilterCategory} style={{ width: 120 }}>
          <Option value="all">全部分类</Option>
          {categories.map((c) => <Option key={c} value={c}>{c}</Option>)}
        </Select>
      </Space>

      <Card>
        <Table
          dataSource={filteredStandards}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Drawer
        title={selectedStandard?.code}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={640}
      >
        {selectedStandard && (
          <div>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="标准编号">{selectedStandard.code}</Descriptions.Item>
              <Descriptions.Item label="分类"><Tag>{selectedStandard.category}</Tag></Descriptions.Item>
              <Descriptions.Item label="标准名称" span={2}>{selectedStandard.name}</Descriptions.Item>
              <Descriptions.Item label="发布日期">{selectedStandard.publishDate}</Descriptions.Item>
              <Descriptions.Item label="实施日期">{selectedStandard.implementDate}</Descriptions.Item>
              <Descriptions.Item label="状态"><Tag color="green">{selectedStandard.status}</Tag></Descriptions.Item>
              <Descriptions.Item label="适用级别">
                <Space wrap>{selectedStandard.levels.map((l: string) => <Tag key={l} color="blue">{l}</Tag>)}</Space>
              </Descriptions.Item>
            </Descriptions>

            <Title level={5} style={{ marginTop: 24, marginBottom: 12 }}>标准概述</Title>
            <Paragraph>{selectedStandard.summary}</Paragraph>

            <Title level={5} style={{ marginBottom: 12 }}>核心要求</Title>
            <List
              size="small"
              dataSource={selectedStandard.keyRequirements}
              renderItem={(item: string) => <List.Item>• {item}</List.Item>}
            />

            <Title level={5} style={{ marginBottom: 12 }}>相关产品</Title>
            <Space wrap>
              {selectedStandard.relatedProducts.map((p: string) => <Tag key={p} color="blue">{p}</Tag>)}
            </Space>

            {selectedStandard.relatedCompetitors.length > 0 && (
              <>
                <Title level={5} style={{ marginTop: 16, marginBottom: 12 }}>相关厂商</Title>
                <Space wrap>
                  {selectedStandard.relatedCompetitors.map((c: string) => <Tag key={c}>{c}</Tag>)}
                </Space>
              </>
            )}

            {selectedStandard.relatedCases.length > 0 && (
              <>
                <Title level={5} style={{ marginTop: 16, marginBottom: 12 }}>相关案例</Title>
                <List
                  size="small"
                  dataSource={selectedStandard.relatedCases}
                  renderItem={(item: string) => <List.Item>{item}</List.Item>}
                />
              </>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Standards;
