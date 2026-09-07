import { useState } from 'react';
import { Card, Row, Col, List, Typography, Tag, Space, Button, Breadcrumb, Drawer } from 'antd';
import { ArrowLeftOutlined, FileTextOutlined, BookOutlined, ApartmentOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/theme';

const { Title, Text, Paragraph } = Typography;

const presetData: Record<string, { title: string; icon: string; desc: string; items: any[] }> = {
  networking: {
    title: '组网技术',
    icon: '🌐',
    desc: '网络组建与互联技术',
    items: [
      {
        id: '1', title: 'VLAN划分与Trunk配置',
        summary: '虚拟局域网（VLAN）技术将物理网络划分为多个逻辑子网，实现广播域隔离和安全分段。',
        principle: 'VLAN通过在交换机上配置VLAN ID，将端口划分到不同的虚拟网络中。同一VLAN内的设备可以互相通信，不同VLAN之间需要通过三层路由才能通信。Trunk链路用于在交换机之间传递多个VLAN的数据帧，通过802.1Q标签区分不同VLAN。',
        effect: '隔离广播风暴、提高网络安全、简化网络管理、灵活分组',
        scenario: '企业部门隔离、数据中心多租户隔离、校园网宿舍/教学楼分段',
        tags: ['二层网络', '交换技术', '网络安全'],
      },
      {
        id: '2', title: 'OSPF动态路由配置',
        summary: '开放最短路径优先（OSPF）是一种基于链路状态的内部网关协议，适用于中大型企业网络。',
        principle: 'OSPF通过HELLO协议发现邻居，交换LSA（链路状态通告）构建LSDB（链路状态数据库），使用SPF算法计算最短路径树，生成路由表。支持区域划分（Area 0为骨干区域），减少路由收敛时间。',
        effect: '快速收敛、无环路、支持CIDR、节省带宽',
        scenario: '企业园区网、数据中心内部路由、多分支机构互联',
        tags: ['路由协议', '三层网络', '动态路由'],
      },
      {
        id: '3', title: 'BGP路由策略',
        summary: '边界网关协议（BGP）是互联网的核心路由协议，用于在自治系统（AS）之间交换路由信息。',
        principle: 'BGP基于TCP 179端口建立邻居关系，通过UPDATE消息通告路由。支持路径属性（AS_PATH、NEXT_HOP、LOCAL_PREF等）进行路由选择。策略工具包括Route-Map、Prefix-List、Community等。',
        effect: '灵活路由控制、流量工程、多宿主接入',
        scenario: 'ISP互联、大型企业多出口、云平台多链路接入',
        tags: ['路由协议', '自治系统', '互联网'],
      },
      {
        id: '4', title: 'VPN隧道技术',
        summary: '虚拟专用网络（VPN）通过加密隧道在公共网络上建立安全的专用通信通道。',
        principle: 'VPN技术将原始数据包封装在新的数据包中，通过加密算法（如AES、SM4）保护数据机密性，通过哈希算法（如SHA、SM3）保证数据完整性，通过隧道协议（IPSec、SSL/TLS、GRE）建立安全通道。',
        effect: '数据加密传输、身份认证、防篡改、远程安全接入',
        scenario: '远程办公安全接入、站点间互联、移动办公VPN',
        tags: ['VPN', '加密技术', '远程接入'],
      },
      {
        id: '5', title: '网络冗余与高可用',
        summary: '通过冗余设计和高可用技术确保网络的持续可用性，减少单点故障。',
        principle: '冗余设计包括链路冗余（多条上行链路）、设备冗余（双机热备/堆叠/VRRP）、电源冗余（双电源模块）。高可用技术包括VRRP/HSRP（网关冗余）、MSTP/RSTP（生成树冗余）、ECMP（等价多路径）、BFD（双向转发检测）。',
        effect: '消除单点故障、自动故障切换、业务不中断',
        scenario: '核心网络、数据中心、金融交易系统',
        tags: ['高可用', '冗余设计', '故障切换'],
      },
      {
        id: '6', title: 'SD-WAN广域网技术',
        summary: '软件定义广域网（SD-WAN）通过软件定义方式管理广域网连接，实现智能选路和应用加速。',
        principle: 'SD-WAN通过集中控制器统一管理WAN边缘设备，基于应用需求（延迟、带宽、丢包率）智能选择最优链路（MPLS、互联网、4G/5G）。支持应用识别、流量调度、链路捆绑、故障自动切换。',
        effect: '降低WAN成本、提升应用体验、简化运维管理',
        scenario: '多分支互联、云应用加速、混合链路组网',
        tags: ['SD-WAN', '广域网', '智能选路'],
      },
    ],
  },
  security: {
    title: '安全技术',
    icon: '🔐',
    desc: '网络安全防护技术',
    items: [
      {
        id: '1', title: '防火墙策略配置',
        summary: '防火墙是网络安全的第一道防线，通过访问控制策略过滤网络流量。',
        principle: '防火墙基于五元组（源IP、目的IP、源端口、目的端口、协议）进行包过滤。下一代防火墙（NGFW）增加应用识别、用户识别、内容检测、入侵防御等功能。策略匹配顺序为自上而下，匹配即执行。',
        effect: '访问控制、流量过滤、攻击防护、应用管控',
        scenario: '网络边界防护、内网安全分段、数据中心防护',
        tags: ['防火墙', '访问控制', '网络安全'],
      },
      {
        id: '2', title: 'IPS特征库调优',
        summary: '入侵防御系统（IPS）通过特征匹配检测网络攻击，需要定期调优减少误报。',
        principle: 'IPS通过维护特征库（签名库）检测已知攻击，支持协议分析、异常检测、行为分析。调优包括：启用/禁用特定规则、调整敏感度阈值、添加自定义例外规则、分析误报日志、更新特征库。',
        effect: '精准检测攻击、降低误报率、减少运维负担',
        scenario: '核心服务器防护、Web应用防护、数据库防护',
        tags: ['IPS', '入侵防御', '特征检测'],
      },
      {
        id: '3', title: 'WAF防护规则配置',
        summary: 'Web应用防火墙（WAF）专门保护Web应用免受SQL注入、XSS等攻击。',
        principle: 'WAF工作在应用层（HTTP/HTTPS），通过正则匹配、语义分析、机器学习等方式检测攻击。防护OWASP Top 10威胁：SQL注入、XSS、CSRF、文件包含、命令注入等。支持虚拟补丁、Bot管理、API安全。',
        effect: 'Web应用防护、攻击拦截、合规要求',
        scenario: '网站防护、API网关、电商平台、政务门户',
        tags: ['WAF', 'Web安全', '应用防护'],
      },
      {
        id: '4', title: '日志审计分析',
        summary: '安全日志审计是安全运营的基础，通过收集分析日志发现安全事件。',
        principle: '日志审计系统（SIEM）收集网络设备、服务器、应用系统的日志，通过关联分析、规则匹配、行为基线等方式检测异常。支持日志归一化、存储、查询、报表、告警。遵循等保要求日志保存不少于6个月。',
        effect: '安全事件检测、合规审计、取证分析',
        scenario: '安全运营中心、等保合规、安全事件调查',
        tags: ['SIEM', '日志审计', '安全运营'],
      },
      {
        id: '5', title: '安全加固基线',
        summary: '安全加固基线是系统和设备的最小安全配置标准，减少攻击面。',
        principle: '安全加固包括：操作系统加固（关闭不必要服务、修改默认密码、最小化安装）、网络设备加固（启用SSH禁用Telnet、配置ACL、限制管理访问）、应用加固（禁用目录遍历、关闭调试模式、配置安全头）。',
        effect: '减少攻击面、提升安全基线、满足合规要求',
        scenario: '服务器上线前加固、等保测评准备、安全评估',
        tags: ['安全加固', '基线配置', '安全运维'],
      },
      {
        id: '6', title: '零信任网络架构',
        summary: '零信任架构基于"永不信任，始终验证"原则，不区分内外网，所有访问都需要验证。',
        principle: '零信任核心组件：身份认证（多因素MFA）、设备信任（终端安全检查）、网络微分段（最小权限访问）、持续验证（实时风险评估）。技术实现包括：SDP（软件定义边界）、IAM（身份访问管理）、UEBA（用户实体行为分析）。',
        effect: '精细化访问控制、降低内部威胁、适应远程办公',
        scenario: '远程办公安全、多云环境、混合办公',
        tags: ['零信任', '身份认证', '访问控制'],
      },
    ],
  },
};

const TechDocs: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const categories = [
    { key: 'networking', title: '组网技术', icon: <ApartmentOutlined style={{ fontSize: 32, color: theme.colors.primary }} />, desc: '网络组建与互联技术' },
    { key: 'security', title: '安全技术', icon: <SafetyOutlined style={{ fontSize: 32, color: '#ff4d4f' }} />, desc: '网络安全防护技术' },
  ];

  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/((?:^\|.+\|$\n?)+)/gm, (match) => {
        const rows = match.trim().split('\n').filter((r: string) => r.trim());
        if (rows.length < 2) return match;
        const headerCells = rows[0].split('|').filter((c: string) => c.trim() !== '');
        const isSeparator = (row: string) => row.split('|').filter((c: string) => c.trim() !== '').every((c: string) => /^[\s\-:]+$/.test(c));
        if (rows.length >= 2 && isSeparator(rows[1])) {
          const bodyRows = rows.slice(2);
          let table = '<table style="border-collapse:collapse;width:100%;margin:12px 0"><thead><tr>';
          headerCells.forEach((cell: string) => {
            table += `<th style="border:1px solid #d9d9d9;padding:6px 10px;background:#f0f5ff;font-weight:600;text-align:left">${cell.trim()}</th>`;
          });
          table += '</tr></thead><tbody>';
          bodyRows.forEach((row: string) => {
            const cells = row.split('|').filter((c: string) => c.trim() !== '');
            table += '<tr>';
            cells.forEach((cell: string) => {
              table += `<td style="border:1px solid #d9d9d9;padding:6px 10px">${cell.trim()}</td>`;
            });
            table += '</tr>';
          });
          table += '</tbody></table>';
          return table;
        }
        return match;
      })
      .replace(/\n/g, '<br/>');
  };

  const handleViewDetail = (item: any) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const categories2 = [
    { key: 'baojing', title: '等保2.0', icon: '🛡️', desc: '网络安全等级保护标准体系' },
    { key: 'wangluo', title: '网络建设', icon: '🌐', desc: '网络基础设施建设知识' },
    { key: 'anquan', title: '安全技术', icon: '🔐', desc: '网络安全防护技术' },
    { key: 'biaozhun', title: '标准法规', icon: '📋', desc: '国家标准与法律法规' },
  ];

  return (
    <div>
      <Breadcrumb
        items={[
          { title: <a onClick={() => navigate('/knowledge')}>知识库</a> },
          { title: '技术文档库' },
        ]}
        style={{ marginBottom: 16 }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/knowledge')} />
        <BookOutlined style={{ fontSize: 28, color: theme.colors.primary }} />
        <div>
          <Title level={4} style={{ margin: 0 }}>技术文档库</Title>
          <Text type="secondary">组网技术、安全技术文档</Text>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {categories.map((cat) => (
          <Col key={cat.key} xs={24} sm={12}>
            <Card hoverable style={{ borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {cat.icon}
                <div>
                  <Title level={5} style={{ margin: 0 }}>{cat.title}</Title>
                  <Text type="secondary">{cat.desc}</Text>
                  <div style={{ marginTop: 8 }}>
                    <Tag>{presetData[cat.key]?.items.length || 0} 篇文档</Tag>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {categories.map((cat) => (
        <div key={cat.key} style={{ marginTop: 24 }}>
          <Title level={4} style={{ marginBottom: 16 }}>
            <span style={{ marginRight: 8 }}>{cat.icon}</span>{cat.title}
          </Title>
          <List
            dataSource={presetData[cat.key]?.items || []}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                onClick={() => handleViewDetail(item)}
                style={{
                  cursor: 'pointer',
                  padding: '16px',
                  marginBottom: 8,
                  borderRadius: 8,
                  border: `1px solid ${theme.colors.border}`,
                  background: theme.colors.bgContainer,
                }}
              >
                <List.Item.Meta
                  avatar={<FileTextOutlined style={{ fontSize: 24, color: theme.colors.primary }} />}
                  title={
                    <Space>
                      <span style={{ fontWeight: 600 }}>{item.title}</span>
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
      ))}

      <Drawer
        title={selectedItem?.title}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={720}
      >
        {selectedItem && (
          <div>
            <Title level={5} style={{ color: '#1890ff', marginBottom: 8 }}>概述</Title>
            <Paragraph>{selectedItem.summary}</Paragraph>

            <Title level={5} style={{ color: '#1890ff', marginBottom: 8 }}>技术原理</Title>
            <Paragraph style={{ whiteSpace: 'pre-wrap' }}>{selectedItem.principle}</Paragraph>

            <Title level={5} style={{ color: '#1890ff', marginBottom: 8 }}>主要作用</Title>
            <Space wrap>
              {selectedItem.effect.split('、').map((e: string) => <Tag key={e} color="green">{e}</Tag>)}
            </Space>

            <Title level={5} style={{ color: '#1890ff', marginBottom: 8, marginTop: 16 }}>应用场景</Title>
            <Space wrap>
              {selectedItem.scenario.split('、').map((s: string) => <Tag key={s} color="blue">{s}</Tag>)}
            </Space>

            <Title level={5} style={{ color: '#1890ff', marginBottom: 8, marginTop: 16 }}>标签</Title>
            <Space wrap>
              {selectedItem.tags.map((t: string) => <Tag key={t}>{t}</Tag>)}
            </Space>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default TechDocs;
