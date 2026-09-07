import { Card, Row, Col, Typography, Tag, Space, Input, Tabs } from 'antd';
import { GlobalOutlined, SearchOutlined, LinkOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useThemeStore } from '@/store/theme';

const { Title, Text, Paragraph } = Typography;

const securitySites = {
  domestic: [
    { name: 'FreeBuf', url: 'https://www.freebuf.com', desc: '国内领先的网络安全媒体，提供安全资讯、技术文章、漏洞分析', tags: ['资讯', '技术'] },
    { name: '安全客', url: 'https://www.anquanke.com', desc: '奇安信旗下安全媒体平台，汇集安全资讯和技术分享', tags: ['资讯', '漏洞'] },
    { name: '先知社区', url: 'https://xz.aliyun.com', desc: '阿里云安全社区，分享安全技术文章和研究成果', tags: ['社区', '技术'] },
    { name: '吾爱破解', url: 'https://www.52pojie.cn', desc: '软件安全逆向分析社区，提供脱壳、破解技术交流', tags: ['逆向', '破解'] },
    { name: '看雪论坛', url: 'https://bbs.kanxue.com', desc: '知名安全技术论坛，专注于软件逆向和安全防护', tags: ['逆向', '论坛'] },
    { name: 'T00ls', url: 'https://www.t00ls.net', desc: '安全技术交流社区，提供渗透测试和安全工具分享', tags: ['渗透', '工具'] },
    { name: '棱角社区', url: 'https://www.rcing.me', desc: '安全技术社区，分享漏洞挖掘和安全研究内容', tags: ['漏洞', '研究'] },
    { name: '奇安信攻防社区', url: 'https://forum.qianxin.com', desc: '奇安信官方攻防技术社区，提供红蓝对抗技术分享', tags: ['攻防', '红蓝'] },
    { name: 'CNCERT', url: 'https://www.cert.org.cn', desc: '国家互联网应急中心，发布安全公告和威胁情报', tags: ['官方', '预警'] },
    { name: 'CNVD', url: 'https://www.cnvd.org.cn', desc: '国家信息安全漏洞共享平台，漏洞信息查询', tags: ['漏洞', '官方'] },
    { name: 'CNNVD', url: 'https://www.cnnvd.org.cn', desc: '国家信息安全漏洞库，提供漏洞评估和防护建议', tags: ['漏洞库', '官方'] },
    { name: 'SecWiki', url: 'https://www.sec-wiki.com', desc: '安全维基，汇集安全资讯和技术文章', tags: ['资讯', '维基'] },
  ],
  international: [
    { name: 'The Hacker News', url: 'https://thehackernews.com', desc: '全球知名安全新闻网站，报道最新安全事件和漏洞信息', tags: ['News', 'Vulnerability'] },
    { name: 'Exploit-DB', url: 'https://www.exploit-db.com', desc: '漏洞利用数据库，提供PoC代码和漏洞利用工具', tags: ['Exploit', 'PoC'] },
    { name: 'Krebs on Security', url: 'https://krebsonsecurity.com', desc: 'Brian Krebs的安全博客，深度调查安全事件', tags: ['Blog', 'Investigation'] },
    { name: 'SecurityWeek', url: 'https://www.securityweek.com', desc: '安全行业新闻和分析，企业安全资讯', tags: ['News', 'Enterprise'] },
    { name: 'BleepingComputer', url: 'https://www.bleepingcomputer.com', desc: '安全新闻和技术资讯，涵盖恶意软件和数据泄露', tags: ['News', 'Malware'] },
    { name: 'Dark Reading', url: 'https://www.darkreading.com', desc: '网络安全媒体，提供深度技术分析和行业报告', tags: ['Media', 'Analysis'] },
  ],
  official: [
    { name: 'Microsoft Security', url: 'https://www.microsoft.com/security', desc: '微软官方安全中心，安全产品和技术文档', tags: ['Microsoft', '官方'] },
    { name: 'Cisco Security', url: 'https://www.cisco.com/c/en/us/products/security/index.html', desc: '思科安全产品和技术资源', tags: ['Cisco', '官方'] },
    { name: 'Palo Alto', url: 'https://www.paloaltonetworks.com', desc: '帕洛阿尔托网络安全产品和威胁情报', tags: ['Palo Alto', '官方'] },
  ],
};

const SecuritySites: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('domestic');

  const filterSites = (sites: typeof securitySites.domestic) => {
    if (!searchText) return sites;
    const lower = searchText.toLowerCase();
    return sites.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        s.desc.toLowerCase().includes(lower) ||
        s.tags.some((t) => t.toLowerCase().includes(lower))
    );
  };

  const renderSiteCard = (site: typeof securitySites.domestic[0]) => (
    <Card
      key={site.name}
      hoverable
      onClick={() => window.open(site.url, '_blank')}
      style={{ borderRadius: 8, height: '100%' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <Title level={5} style={{ margin: 0, color: theme.colors.primary }}>{site.name}</Title>
          <Paragraph
            ellipsis={{ rows: 2 }}
            style={{ margin: '8px 0', color: theme.colors.textSecondary }}
          >
            {site.desc}
          </Paragraph>
          <Space wrap>
            {site.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </Space>
        </div>
        <LinkOutlined style={{ color: theme.colors.textTertiary, fontSize: 16 }} />
      </div>
    </Card>
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <GlobalOutlined style={{ fontSize: 28, color: theme.colors.primary }} />
        <div>
          <Title level={4} style={{ margin: 0 }}>安全站点导航</Title>
          <Text type="secondary">常用安全网站快捷访问</Text>
        </div>
      </div>

      <Input
        placeholder="搜索站点..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 400 }}
        allowClear
      />

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab={`国内站点 (${filterSites(securitySites.domestic).length})`} key="domestic">
          <Row gutter={[16, 16]}>
            {filterSites(securitySites.domestic).map((site) => (
              <Col key={site.name} xs={24} sm={12} lg={8}>
                {renderSiteCard(site)}
              </Col>
            ))}
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab={`国际站点 (${filterSites(securitySites.international).length})`} key="international">
          <Row gutter={[16, 16]}>
            {filterSites(securitySites.international).map((site) => (
              <Col key={site.name} xs={24} sm={12} lg={8}>
                {renderSiteCard(site)}
              </Col>
            ))}
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab={`厂商官方 (${filterSites(securitySites.official).length})`} key="official">
          <Row gutter={[16, 16]}>
            {filterSites(securitySites.official).map((site) => (
              <Col key={site.name} xs={24} sm={12} lg={8}>
                {renderSiteCard(site)}
              </Col>
            ))}
          </Row>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default SecuritySites;
