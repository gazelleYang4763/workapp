import { useState } from 'react';
import { Card, Row, Col, List, Typography, Tag, Space, Button, Empty, Breadcrumb } from 'antd';
import { ArrowLeftOutlined, FileTextOutlined, BookOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useThemeStore } from '@/store/theme';

const { Title, Text, Paragraph } = Typography;

const presetData: Record<string, { title: string; icon: string; desc: string; items: any[] }> = {
  'baojing': {
    title: '等保2.0',
    icon: '🛡️',
    desc: '网络安全等级保护2.0标准体系',
    items: [
      { id: '1', title: 'GB/T 22239-2019 信息安全技术 网络安全等级保护基本要求', level: '国标', status: '现行', summary: '等级保护的基础性标准，规定了不同安全等级的信息系统应具备的安全保护能力。包括安全通用要求和安全扩展要求。', tags: ['等保', '安全要求'] },
      { id: '2', title: 'GB/T 25070-2019 信息安全技术 网络安全等级保护安全设计技术要求', level: '国标', status: '现行', summary: '针对等级保护系统安全设计的技术要求，包括安全计算环境、安全区域边界、安全通信网络等。', tags: ['等保', '安全设计'] },
      { id: '3', title: 'GB/T 28448-2019 信息安全技术 网络安全等级保护测评要求', level: '国标', status: '现行', summary: '等级保护测评的具体要求和方法，指导测评机构开展等级测评工作。', tags: ['等保', '测评'] },
      { id: '4', title: '等级保护2.0五个安全等级', level: '知识', status: '通用', summary: '第一级（用户自主保护级）、第二级（系统审计保护级）、第三级（安全标记保护级）、第四级（结构化保护级）、第五级（访问验证保护级）。', tags: ['等保', '安全等级'] },
      { id: '5', title: '等保2.0十大安全领域', level: '知识', status: '通用', summary: '安全物理环境、安全通信网络、安全区域边界、安全计算环境、安全管理中心、安全管理制度、安全管理机构、安全管理人员、安全建设管理、安全运维管理。', tags: ['等保', '安全领域'] },
    ],
  },
  'wangluo': {
    title: '网络建设',
    icon: '🌐',
    desc: '网络基础设施建设知识体系',
    items: [
      { id: '1', title: '园区网络架构设计', level: '知识', status: '通用', summary: '典型的三层架构：核心层、汇聚层、接入层。核心层负责高速数据转发，汇聚层实现策略控制，接入层提供用户接入。', tags: ['园区网', '网络架构'] },
      { id: '2', title: '数据中心网络架构', level: '知识', status: '通用', summary: 'Spine-Leaf架构、传统三层架构、VSU/VSS虚拟化技术、SDN数据中心方案。', tags: ['数据中心', '网络架构'] },
      { id: '3', title: 'SD-WAN广域网方案', level: '知识', status: '通用', summary: '软件定义广域网，支持MPLS、互联网、4G/5G多种链路，实现智能选路和应用加速。', tags: ['SD-WAN', '广域网'] },
      { id: '4', title: 'WiFi6无线网络覆盖', level: '知识', status: '通用', summary: 'WiFi6 (802.11ax) 技术特点：OFDMA、MU-MIMO、BSS Coloring，支持高密度场景。', tags: ['WiFi6', '无线网络'] },
      { id: '5', title: 'IPv6网络改造', level: '知识', status: '通用', summary: 'IPv6地址规划、双栈部署、隧道技术、NAT64转换等改造方案。', tags: ['IPv6', '网络改造'] },
    ],
  },
  'anquan': {
    title: '安全技术',
    icon: '🔐',
    desc: '网络安全防护技术知识体系',
    items: [
      { id: '1', title: '防火墙技术', level: '知识', status: '通用', summary: '下一代防火墙(NGFW)功能：应用识别、用户识别、内容过滤、入侵防御、病毒防护。', tags: ['防火墙', '网络安全'] },
      { id: '2', title: '入侵检测与防御系统', level: '知识', status: '通用', summary: 'IDS/IPS工作原理、特征匹配、异常检测、行为分析等技术。', tags: ['IDS', 'IPS', '入侵防御'] },
      { id: '3', title: 'Web应用防火墙(WAF)', level: '知识', status: '通用', summary: 'OWASP Top 10防护、SQL注入防护、XSS防护、CC攻击防护、Bot管理。', tags: ['WAF', 'Web安全'] },
      { id: '4', title: '终端安全防护(EDR)', level: '知识', status: '通用', summary: '终端检测与响应，包括恶意软件防护、行为监控、威胁狩猎、自动响应。', tags: ['EDR', '终端安全'] },
      { id: '5', title: '安全运营中心(SOC)', level: '知识', status: '通用', summary: 'SIEM日志分析、威胁情报、SOAR自动化编排、安全态势感知。', tags: ['SOC', '安全运营'] },
    ],
  },
  'biaozhun': {
    title: '标准法规',
    icon: '📋',
    desc: '网络安全相关国家标准与法规',
    items: [
      { id: '1', title: '《网络安全法》', level: '法规', status: '现行', summary: '2017年6月1日实施，是我国网络安全的基本法律，规定了网络运营者的安全保护义务。', tags: ['法律', '网络安全'] },
      { id: '2', title: '《数据安全法》', level: '法规', status: '现行', summary: '2021年9月1日实施，规范数据处理活动，保障数据安全，促进数据开发利用。', tags: ['法律', '数据安全'] },
      { id: '3', title: '《个人信息保护法》', level: '法规', status: '现行', summary: '2021年11月1日实施，保护个人信息权益，规范个人信息处理活动。', tags: ['法律', '个人信息'] },
      { id: '4', title: '《关键信息基础设施安全保护条例》', level: '法规', status: '现行', summary: '2021年9月1日实施，保障关键信息基础设施安全运行。', tags: ['法规', '关基保护'] },
      { id: '5', title: 'GB/T 35273-2020 个人信息安全规范', level: '国标', status: '现行', summary: '规定了个人信息收集、存储、使用、共享、转让、披露等环节的安全要求。', tags: ['国标', '个人信息'] },
    ],
  },
};

const KnowledgeCommon: React.FC = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const { theme } = useThemeStore();
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const categories = [
    { key: 'baojing', title: '等保2.0', icon: '🛡️', desc: '网络安全等级保护标准体系' },
    { key: 'wangluo', title: '网络建设', icon: '🌐', desc: '网络基础设施建设知识' },
    { key: 'anquan', title: '安全技术', icon: '🔐', desc: '网络安全防护技术' },
    { key: 'biaozhun', title: '标准法规', icon: '📋', desc: '国家标准与法律法规' },
  ];

  const currentData = type && presetData[type] ? presetData[type] : null;

  if (currentData) {
    return (
      <div>
        <Breadcrumb
          items={[
            { title: <a onClick={() => navigate('/knowledge')}>知识库</a> },
            { title: '通识知识库' },
            { title: currentData.title },
          ]}
          style={{ marginBottom: 16 }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/knowledge/common')} />
          <span style={{ fontSize: 32 }}>{currentData.icon}</span>
          <div>
            <Title level={4} style={{ margin: 0 }}>{currentData.title}</Title>
            <Text type="secondary">{currentData.desc}</Text>
          </div>
        </div>

        <List
          dataSource={currentData.items}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              onClick={() => setSelectedItem(item)}
              style={{
                cursor: 'pointer',
                padding: '16px',
                marginBottom: 8,
                borderRadius: 8,
                border: `1px solid ${theme.colors.border}`,
                background: selectedItem?.id === item.id ? theme.colors.bgLayout : theme.colors.bgContainer,
              }}
            >
              <List.Item.Meta
                avatar={<FileTextOutlined style={{ fontSize: 24, color: theme.colors.primary }} />}
                title={
                  <Space>
                    <span style={{ fontWeight: 600 }}>{item.title}</span>
                    <Tag color="blue">{item.level}</Tag>
                  </Space>
                }
                description={
                  <Paragraph
                    ellipsis={{ rows: 2, expandable: true, symbol: '展开' }}
                    style={{ marginBottom: 0, color: theme.colors.textSecondary }}
                  >
                    {item.summary}
                  </Paragraph>
                }
              />
            </List.Item>
          )}
        />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { title: <a onClick={() => navigate('/knowledge')}>知识库</a> },
          { title: '通识知识库' },
        ]}
        style={{ marginBottom: 16 }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/knowledge')} />
        <BookOutlined style={{ fontSize: 28, color: theme.colors.primary }} />
        <div>
          <Title level={4} style={{ margin: 0 }}>通识知识库</Title>
          <Text type="secondary">等保2.0、网络建设、安全技术、标准法规</Text>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {categories.map((cat) => (
          <Col key={cat.key} xs={24} sm={12}>
            <Card
              hoverable
              onClick={() => navigate(`/knowledge/common/${cat.key}`)}
              style={{ borderRadius: 8 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 48 }}>{cat.icon}</span>
                <div>
                  <Title level={5} style={{ margin: 0 }}>{cat.title}</Title>
                  <Text type="secondary">{cat.desc}</Text>
                  <div style={{ marginTop: 8 }}>
                    <Tag>{presetData[cat.key]?.items.length || 0} 条内容</Tag>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default KnowledgeCommon;
