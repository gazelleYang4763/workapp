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
    levels: ['二级', '三级', '四级'], category: '国家标准',
    summary: '本标准是等保2.0体系的核心标准，规定了网络安全等级保护的第一级到第五级的安全要求。适用于指导运营使用单位开展等级保护工作，以及测评机构开展等级测评工作。',
    detail: `## 标准背景

GB/T 22239-2019 于2019年5月10日发布，2019年12月1日正式实施，替代了GB/T 22239-2008（等保1.0）。本标准是网络安全等级保护制度最重要的基础性标准。

## 适用范围

- 适用于新建、改建、扩建的信息系统
- 适用于运营使用单位的等级保护工作
- 适用于测评机构的等级测评工作
- 适用于监管部门的监督检查工作

## 五个安全等级

| 等级 | 名称 | 适用对象 | 受侵害客体 |
|------|------|----------|------------|
| 第一级 | 用户自主保护级 | 一般系统 | 公民、法人和其他组织的合法权益 |
| 第二级 | 系统审计保护级 | 一般系统 | 公民、法人和其他组织的合法权益；社会秩序和公共利益 |
| 第三级 | 安全标记保护级 | 重要系统 | 社会秩序和公共利益；国家安全 |
| 第四级 | 结构化保护级 | 关键系统 | 社会秩序和公共利益；国家安全 |
| 第五级 | 访问验证保护级 | 核心系统 | 国家安全 |

## 十大安全领域

### 技术要求（5个）
1. **安全物理环境**：机房位置选择、物理访问控制、防盗防破坏、防雷击、防火、防水防潮、温湿度控制、电力供应、电磁防护
2. **安全通信网络**：网络架构、通信传输、可信验证
3. **安全区域边界**：边界防护、访问控制、入侵防范、恶意代码防范、安全审计、可信验证
4. **安全计算环境**：身份鉴别、访问控制、安全审计、入侵防范、恶意代码防范、可信验证、数据完整性、数据保密性、数据备份恢复、剩余信息保护、个人信息保护
5. **安全管理中心**：系统管理、审计管理、安全管理、集中管控

### 管理要求（5个）
6. **安全管理制度**：制定、评审、修订
7. **安全管理机构**：岗位设置、人员配备、授权和审批、沟通和合作、审核和检查
8. **安全管理人员**：人员录用、人员离岗、安全意识教育和培训、外部人员访问管理
9. **安全建设管理**：定级和备案、安全方案设计、安全设备采购、自行软件开发、外包软件开发、工程实施、等级测评、服务商选择、系统交付、系统运维、应急响应、灾难恢复
10. **安全运维管理**：环境管理、资产管理、漏洞和风险管理、网络和系统安全管理、恶意代码防范管理、配置变更管理、安全事件处置、应急预案管理、外包运维管理

## 各级别核心要求对比

| 要求项 | 二级 | 三级 | 四级 |
|--------|------|------|------|
| 身份鉴别 | 基本身份鉴别 | 多因素鉴别 | 多因素+物理隔离 |
| 访问控制 | 自主访问控制 | 强制访问控制 | 基于标记的访问控制 |
| 安全审计 | 审计记录 | 审计保护+分析 | 审计+实时告警 |
| 入侵防范 | 基本检测 | 实时检测+告警 | 自动响应+溯源 |
| 数据完整性 | 本地备份 | 异地备份+校验 | 实时备份+恢复 |
| 数据保密性 | 基本加密 | 国密算法 | 多级加密 |`,
    keyRequirements: ['安全物理环境', '安全通信网络', '安全区域边界', '安全计算环境', '安全管理中心', '安全管理制度', '安全管理机构', '安全管理人员', '安全建设管理', '安全运维管理'],
    relatedProducts: ['防火墙', 'IDS/IPS', 'WAF', 'SOC', '堡垒机', '日志审计'],
    relatedCompetitors: ['华为', '深信服', '奇安信', '安恒'],
    relatedCases: ['某银行等保三级', '某政务云等保三级'],
  },
  {
    id: '2', code: 'GB/T 25070-2019', name: '信息安全技术 网络安全等级保护安全设计技术要求',
    status: '现行', publishDate: '2019-05-10', implementDate: '2019-12-01',
    levels: ['二级', '三级', '四级'], category: '国家标准',
    summary: '本标准针对等级保护系统安全设计的技术要求，指导安全方案设计人员进行等级保护系统安全方案的设计。',
    detail: `## 标准背景

GB/T 25070-2019 是等保2.0体系中专门针对安全设计的技术标准，为安全方案设计人员提供设计依据和方法。

## 适用范围

- 适用于新建信息系统的安全设计
- 适用于已建信息系统的安全改造设计
- 适用于安全方案评审和评估

## 安全设计框架

### 安全计算环境设计
- 身份鉴别机制设计
- 访问控制机制设计
- 安全审计机制设计
- 入侵防范机制设计
- 数据安全机制设计

### 安全区域边界设计
- 边界隔离设计
- 访问控制设计
- 入侵防范设计
- 安全审计设计

### 安全通信网络设计
- 网络架构安全设计
- 通信传输安全设计
- 通信可信验证设计

### 安全管理中心设计
- 集中管控设计
- 安全事件分析设计
- 安全策略管理设计

## 设计原则

1. **纵深防御**：多层次安全防护，不依赖单一安全措施
2. **最小特权**：用户和系统仅拥有完成工作所需的最小权限
3. **职责分离**：关键岗位相互制约，避免权力集中
4. **默认安全**：系统默认配置即满足安全要求
5. **可审计性**：所有安全相关操作可追溯`,
    keyRequirements: ['安全计算环境设计', '安全区域边界设计', '安全通信网络设计', '安全管理中心设计', '安全管理制度设计'],
    relatedProducts: ['安全设计服务', '安全架构咨询'],
    relatedCompetitors: ['安恒', '天融信'],
    relatedCases: ['某省电子政务安全设计'],
  },
  {
    id: '3', code: 'GB/T 28448-2019', name: '信息安全技术 网络安全等级保护测评要求',
    status: '现行', publishDate: '2019-05-10', implementDate: '2019-12-01',
    levels: ['二级', '三级', '四级'], category: '国家标准',
    summary: '本标准规定了网络安全等级保护测评的要求和方法，指导测评机构开展等级测评工作。',
    detail: `## 标准背景

GB/T 28448-2019 是等保2.0体系中的测评标准，为测评机构提供测评依据和方法。

## 测评流程

1. **测评准备**：受理委托、组建测评团队、编制测评方案
2. **方案编制**：确定测评指标、编制测评指导书
3. **现场测评**：技术测评 + 管理测评
4. **分析与报告**：测评结果分析、编制测评报告

## 测评方法

| 方法 | 说明 | 适用场景 |
|------|------|----------|
| 访谈 | 与相关人员交流了解情况 | 管理要求测评 |
| 检查 | 查看文档、配置、记录等 | 管理+技术要求测评 |
| 测试 | 对系统进行实际测试验证 | 技术要求测评 |

## 测评指标体系

### 技术测评指标
- 安全物理环境测评
- 安全通信网络测评
- 安全区域边界测评
- 安全计算环境测评
- 安全管理中心测评

### 管理测评指标
- 安全管理制度测评
- 安全管理机构测评
- 安全管理人员测评
- 安全建设管理测评
- 安全运维管理测评

## 结果判定

- **符合**：该项测评结果满足相应等级要求
- **部分符合**：该项测评结果部分满足要求，需整改
- **不符合**：该项测评结果不满足要求，需立即整改`,
    keyRequirements: ['测评指标', '测评方法', '测评流程', '结果判定', '测评报告编制'],
    relatedProducts: ['测评服务'],
    relatedCompetitors: ['中国信息安全测评中心', '各地测评机构'],
    relatedCases: ['等保三级测评项目'],
  },
  {
    id: '4', code: 'GB/T 35273-2020', name: '信息安全技术 个人信息安全规范',
    status: '现行', publishDate: '2020-03-06', implementDate: '2020-10-01',
    levels: ['推荐性标准'], category: '数据安全',
    summary: '本标准规定了个人信息收集、存储、使用、共享、转让、披露等环节的安全要求。',
    detail: `## 标准背景

GB/T 35273-2020 是个人信息保护领域最重要的推荐性国家标准，虽然不具有法律强制力，但在司法实践中被广泛引用。

## 个人信息定义

个人信息是以电子或者其他方式记录的与已识别或者可识别的自然人有关的各种信息。

### 敏感个人信息
- 生物识别、宗教信仰、特定身份、医疗健康、金融账户、行踪轨迹等
- 不满十四周岁未成年人的个人信息

## 核心要求

### 收集阶段
- 合法、正当、必要、诚信原则
- 明确告知收集目的、方式、范围
- 取得用户明确同意
- 最小必要原则

### 存储阶段
- 只存储实现目的所需的最少信息
- 存储期限为实现目的所需的最短时间
- 敏感信息加密存储

### 使用阶段
- 不得超出收集范围使用
- 个人信息脱敏后方可用于数据分析
- 定期审查个人信息使用情况

### 共享与转让
- 事先征得用户同意
- 进行个人信息安全影响评估
- 确保接收方具备足够的保护能力

### 披露
- 不得公开披露个人信息
- 确需公开的须经用户同意

## 违规后果

- 行政处罚：最高可处5000万元或上年度营业额5%的罚款
- 民事赔偿：承担损害赔偿责任
- 刑事责任：构成犯罪的依法追究刑事责任`,
    keyRequirements: ['个人信息收集规范', '个人信息存储规范', '个人信息使用规范', '个人信息共享规范', '个人信息权利保障'],
    relatedProducts: ['数据脱敏', '隐私计算', '数据分类分级'],
    relatedCompetitors: ['阿里云', '腾讯云'],
    relatedCases: ['某互联网公司隐私合规'],
  },
  {
    id: '5', code: 'GB/T 39786-2021', name: '信息安全技术 信息系统密码应用基本要求',
    status: '现行', publishDate: '2021-10-11', implementDate: '2022-04-01',
    levels: ['二级', '三级', '四级'], category: '国家标准',
    summary: '本标准规定了信息系统密码应用的基本要求，包括物理和环境、网络和通信、设备和计算、应用和数据四个层面。',
    detail: `## 标准背景

GB/T 39786-2021 是密码应用安全领域的核心标准，2022年4月1日起实施，对信息系统的密码应用提出了明确要求。

## 四个层面要求

### 物理和环境安全
- 电子门禁系统应采用密码技术进行身份鉴别
- 视频监控记录应采用密码技术保证完整性
- 机房出入口应有电子门禁系统

### 网络和通信安全
- 应采用密码技术保证通信过程中数据的完整性
- 应采用密码技术保证通信过程中数据的保密性
- 应在通信前基于密码技术对通信双方进行身份认证
- 可采用SSL/TLS、IPSec等协议

### 设备和计算安全
- 应采用密码技术保证重要设备自身信息的完整性
- 应采用密码技术保证重要设备管理信息的保密性
- 应使用密码技术对登录设备的用户进行身份鉴别

### 应用和数据安全
- 应采用密码技术保证重要数据在传输过程中的保密性
- 应采用密码技术保证重要数据在存储过程中的保密性
- 应采用密码技术保证重要数据在传输过程中的完整性
- 应采用密码技术保证重要数据在存储过程中的完整性

## 密码算法要求

| 类型 | 算法 | 说明 |
|------|------|------|
| 对称加密 | SM4 | 分组密码，128位密钥 |
| 非对称加密 | SM2 | 椭圆曲线密码，256位 |
| 杂凑算法 | SM3 | 密码杂凑算法，256位输出 |

## 密码产品要求

- 应使用经国家密码管理部门认可的密码产品
- 应采用商用密码产品（如密码机、SSL VPN、签名验签服务器等）`,
    keyRequirements: ['物理和环境安全', '网络和通信安全', '设备和计算安全', '应用和数据安全', '密钥管理'],
    relatedProducts: ['密码机', 'SSL VPN', '签名验签服务器', '服务器密码机'],
    relatedCompetitors: ['卫士通', '三未信安', '渔翁信息'],
    relatedCases: ['某金融系统密码改造', '某政务系统密评改造'],
  },
  {
    id: '6', code: 'GB/T 20271-2006', name: '信息安全技术 信息系统通用安全技术要求',
    status: '现行', publishDate: '2006-05-31', implementDate: '2006-12-01',
    levels: ['通用标准'], category: '国家标准',
    summary: '本标准规定了信息系统安全的通用技术要求，是各类信息系统安全建设的基础性参考标准。',
    detail: `## 标准背景

GB/T 20271-2006 是2006年发布的通用安全技术标准，为信息系统安全建设提供基础性技术指导。

## 核心技术要求

### 身份鉴别
- 支持多种身份鉴别机制（密码、证书、生物特征等）
- 鉴别信息应具有不可预测性
- 鉴别失败应有限制措施
- 应对鉴别信息进行保护

### 访问控制
- 实现最小权限原则
- 支持自主访问控制（DAC）
- 支持强制访问控制（MAC）
- 应对默认账户进行修改或删除

### 安全审计
- 应对安全相关事件进行审计
- 审计记录应包含事件时间、用户、类型、结果等
- 应保护审计记录不被篡改
- 审计记录保存时间不少于6个月

### 数据完整性
- 应采用校验码技术保证数据完整性
- 应采用数字签名技术保证数据完整性
- 传输和存储过程中的数据都应有完整性保护

### 数据保密性
- 应采用密码技术保证数据保密性
- 应对敏感数据进行加密存储
- 应对传输中的敏感数据进行加密

## 与其他标准的关系

本标准为GB/T 22239等标准提供技术基础支撑。`,
    keyRequirements: ['身份鉴别', '访问控制', '安全审计', '数据完整性', '数据保密性', '数据备份恢复'],
    relatedProducts: ['IAM', 'DLP', '加密系统', '堡垒机'],
    relatedCompetitors: ['启明星辰', '绿盟'],
    relatedCases: ['某央企安全体系建设'],
  },
  {
    id: '7', code: '《网络安全法》', name: '中华人民共和国网络安全法',
    status: '现行', publishDate: '2016-11-07', implementDate: '2017-06-01',
    levels: ['法律'], category: '行业法规',
    summary: '我国网络安全的基本法律，规定了网络运营者的安全保护义务，明确了网络安全的基本制度。',
    detail: `## 法律背景

《中华人民共和国网络安全法》于2016年11月7日通过，2017年6月1日起施行，是我国网络安全领域的基本法律。

## 核心制度

### 网络安全等级保护制度
- 国家实行网络安全等级保护制度
- 网络运营者应当按照要求履行安全保护义务
- 第三方测评机构定期进行安全检测评估

### 关键信息基础设施保护制度
- 对公共通信和信息服务、能源、交通等重要行业的网络设施和信息系统实行重点保护
- 设置专门安全管理机构和安全管理负责人
- 定期进行检测和风险评估

### 网络信息安全制度
- 网络运营者不得泄露、篡改、毁损其收集的个人信息
- 未经被收集者同意，不得向他人提供个人信息
- 采取技术措施和其他必要措施确保信息安全

### 监测预警与应急处置制度
- 建立网络安全监测预警和信息通报制度
- 制定网络安全事件应急预案
- 发生安全事件时立即启动应急预案

## 法律责任

| 违法行为 | 处罚 |
|----------|------|
| 未履行安全保护义务 | 警告+罚款1-10万；情节严重：罚款10-100万 |
| 网络信息含有违法信息 | 关闭网站+拘留+罚款 |
| 侵害个人信息 | 罚款+吊销许可 |
| 关基设施违法 | 罚款10-100万+责任人罚款1-10万 |`,
    keyRequirements: ['网络安全等级保护', '关键信息基础设施保护', '网络信息安全', '监测预警与应急处置', '密码应用安全'],
    relatedProducts: ['合规咨询服务', '安全评估服务'],
    relatedCompetitors: [],
    relatedCases: ['所有网络安全项目'],
  },
  {
    id: '8', code: '《数据安全法》', name: '中华人民共和国数据安全法',
    status: '现行', publishDate: '2021-06-10', implementDate: '2021-09-01',
    levels: ['法律'], category: '行业法规',
    summary: '规范数据处理活动，保障数据安全，促进数据开发利用，维护国家安全、公共利益。',
    detail: `## 法律背景

《中华人民共和国数据安全法》于2021年6月10日通过，2021年9月1日起施行，是我国数据安全领域的基本法律。

## 核心制度

### 数据分类分级保护制度
- 根据数据在经济社会发展中的重要程度及遭到篡改等对国家安全、公共利益或个人合法权益造成的危害程度进行分类分级
- 核心数据、重要数据、一般数据三个级别
- 不同级别采取不同的保护措施

### 数据安全审查制度
- 对影响或可能影响国家安全的数据处理活动进行国家安全审查
- 审查决定为最终决定

### 数据跨境提供规则
- 重要数据出境应经安全评估
- 关基运营者收集的重要数据出境应经安全评估
- 非关基运营者的重要数据出境安全评估办法由网信部门制定

### 数据安全保护义务
- 开展数据处理活动应当加强风险监测
- 发现安全缺陷、漏洞等风险时，应当立即采取补救措施
- 发生数据安全事件时，应当立即采取处置措施

## 法律责任

| 违法行为 | 处罚 |
|----------|------|
| 未履行数据安全保护义务 | 警告+罚款5-50万；情节严重：罚款50-200万 |
| 拒不配合数据安全审查 | 罚款10-100万+责任人罚款1-10万 |
| 未经授权出境数据 | 罚款10-100万+暂停业务+吊销许可 |
| 严重违法 | 罚款200-1000万+吊销许可 |`,
    keyRequirements: ['数据分类分级', '数据安全保护', '数据安全审查', '数据跨境传输', '数据安全事件处置'],
    relatedProducts: ['数据分类分级', '数据脱敏', 'DLP', '数据库审计'],
    relatedCompetitors: ['美创科技', '昂楷科技', '安华金和'],
    relatedCases: ['某银行数据安全治理', '某政府数据分类分级'],
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

  const renderMarkdown = (text: string) => {
    return text
      .replace(/^## (.*$)/gm, '<h2 style="color:#1890ff;margin-top:20px;margin-bottom:8px;border-left:4px solid #1890ff;padding-left:8px">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 style="color:#333;margin-top:16px;margin-bottom:8px">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width:100%"/>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/^> (.*$)/gm, '<blockquote style="border-left:4px solid #1890ff;padding-left:12px;color:#666;margin:8px 0;background:#f0f5ff;padding:8px 12px">$1</blockquote>')
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
      .replace(/((?:^\|.+\|$\n?)+)/gm, (match) => {
        const rows = match.trim().split('\n').filter((r: string) => r.trim());
        if (rows.length < 2) return match;
        const headerCells = rows[0].split('|').filter((c: string) => c.trim() !== '');
        const isSeparator = (row: string) => row.split('|').filter((c: string) => c.trim() !== '').every((c: string) => /^[\s\-:]+$/.test(c));
        if (rows.length >= 2 && isSeparator(rows[1])) {
          const bodyRows = rows.slice(2);
          let table = '<table style="border-collapse:collapse;width:100%;margin:12px 0"><thead><tr>';
          headerCells.forEach((cell: string) => {
            table += `<th style="border:1px solid #d9d9d9;padding:6px 10px;background:#f0f5ff;font-weight:600;text-align:left;font-size:13px">${cell.trim()}</th>`;
          });
          table += '</tr></thead><tbody>';
          bodyRows.forEach((row: string) => {
            const cells = row.split('|').filter((c: string) => c.trim() !== '');
            table += '<tr>';
            cells.forEach((cell: string) => {
              table += `<td style="border:1px solid #d9d9d9;padding:6px 10px;font-size:13px">${cell.trim()}</td>`;
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
          <Text type="secondary">国家标准、行业法规、技术标准</Text>
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
        title={
          <div>
            <div style={{ fontWeight: 600 }}>{selectedStandard?.code}</div>
            <div style={{ fontSize: 13, color: '#999', fontWeight: 400 }}>{selectedStandard?.name}</div>
          </div>
        }
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={720}
      >
        {selectedStandard && (
          <Tabs items={[
            {
              key: 'basic', label: '基本信息',
              children: (
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
              ),
            },
            {
              key: 'detail', label: '标准内容',
              children: (
                <div
                  style={{ lineHeight: 1.8, fontSize: 14 }}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedStandard.detail || '暂无详细内容') }}
                />
              ),
            },
          ]} />
        )}
      </Drawer>
    </div>
  );
};

export default Standards;
