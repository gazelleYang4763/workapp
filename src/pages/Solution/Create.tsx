import { useState, useRef } from 'react';
import { Card, Steps, Button, Form, Input, Select, Row, Col, Switch, Table, Space, message, Tag, Divider, Typography, Modal, InputNumber, Tooltip, Empty } from 'antd';
import {
  SaveOutlined, ExportOutlined, ArrowLeftOutlined, PlusOutlined, DeleteOutlined,
  UpOutlined, DownOutlined, FileTextOutlined, EyeOutlined, EditOutlined, PictureOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/theme';
import { useSolutionStore } from '@/store/solution';
import { exportMarkdown, exportHtml, printSolution } from '@/utils/export';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

interface Chapter {
  id: string;
  title: string;
  enabled: boolean;
  content: string;
  order: number;
}

interface ProductItem {
  id: string;
  category: string;
  brand: string;
  model: string;
  quantity: number;
  unit: string;
  location: string;
  remark: string;
}

const defaultChapters: Chapter[] = [
  { id: '1', title: '项目概述', enabled: true, content: '', order: 1 },
  { id: '2', title: '需求分析', enabled: true, content: '', order: 2 },
  { id: '3', title: '现状分析', enabled: true, content: '', order: 3 },
  { id: '4', title: '方案设计', enabled: true, content: '', order: 4 },
  { id: '5', title: '产品配置', enabled: true, content: '', order: 5 },
  { id: '6', title: '实施计划', enabled: true, content: '', order: 6 },
  { id: '7', title: '项目管理', enabled: true, content: '', order: 7 },
  { id: '8', title: '售后服务', enabled: true, content: '', order: 8 },
  { id: '9', title: '投资概算', enabled: true, content: '', order: 9 },
  { id: '10', title: '典型案例', enabled: false, content: '', order: 10 },
];

const networkTemplates: Record<string, string> = {
  '项目概述': `一、项目背景
【客户名称】是一家从事【行业领域】的企业/机构，随着业务的快速发展，现有网络基础设施已无法满足当前及未来的业务需求。为提升网络承载能力、保障业务连续性，特制定本网络建设方案。

二、项目目标
1. 建设高可用、高性能的企业网络基础设施
2. 实现网络架构的合理化、标准化
3. 提升网络带宽和传输效率
4. 保障关键业务系统的网络可用性
5. 满足未来3-5年的业务扩展需求

三、项目范围
本项目涵盖【客户名称】总部及各分支机构的网络建设，包括但不限于：
- 核心网络设备部署
- 网络链路建设
- 无线网络覆盖
- 网络安全防护
- 网络运维管理`,

  '需求分析': `一、业务需求
1. 支撑【具体业务系统】的网络传输需求
2. 满足【用户数量】并发访问需求
3. 保障【关键应用】的网络服务质量（QoS）
4. 支持【移动办公/远程接入】等场景

二、技术需求
1. 网络带宽：核心层≥【10】Gbps，汇聚层≥【1】Gbps
2. 网络延迟：核心业务延迟≤【5】ms
3. 网络可用性：≥99.99%
4. 安全要求：满足等保【二级/三级】要求

三、合规需求
1. 符合【GB/T 22239-2019】等保要求
2. 满足【行业监管】合规要求
3. 符合【客户内部】安全策略`,

  '现状分析': `一、网络架构现状
当前网络采用【传统三层架构/扁平化架构】，存在以下问题：
1. 核心设备性能瓶颈，带宽利用率超过【80%】
2. 网络层级过多，转发效率低下
3. 缺乏冗余设计，存在单点故障风险

二、设备现状
1. 核心交换机：【品牌型号】，已使用【X】年
2. 汇聚交换机：【品牌型号】，性能不足
3. 接入交换机：部分端口故障率较高

三、链路现状
1. 互联网出口：【X】条专线，总带宽【X】Mbps
2. 分支互联：采用【MPLS/VPN】方式，带宽不足
3. 数据中心互联：【X】Gbps专线

四、问题总结
1. 网络性能不足，影响业务效率
2. 可靠性差，故障恢复时间长
3. 扩展性差，无法满足业务增长`,

  '方案设计': `一、总体架构设计
采用【核心层-汇聚层-接入层】三层架构（或Spine-Leaf架构），实现网络的高可用、高性能、易扩展。

二、核心层设计
1. 部署【2】台核心交换机，采用【VSS/IRF】虚拟化技术
2. 核心互联带宽：【40/100】Gbps
3. 支持【IPv4/IPv6】双栈

三、汇聚层设计
1. 各楼层/区域部署汇聚交换机
2. 上联核心带宽：【10/40】Gbps
3. 实现策略控制和安全隔离

四、接入层设计
1. 部署【品牌型号】接入交换机
2. 支持【POE+】供电
3. 端口密度：【48】口

五、无线网络设计
1. 部署【WiFi6】无线AP
2. 无线控制器集中管理
3. 支持【漫游/负载均衡】`,

  '产品配置': `一、核心网络设备
| 设备类型 | 品牌 | 型号 | 数量 | 说明 |
|---------|------|------|------|------|
| 核心交换机 | 【品牌】 | 【型号】 | 2台 | 核心虚拟化 |
| 汇聚交换机 | 【品牌】 | 【型号】 | X台 | 楼层汇聚 |
| 接入交换机 | 【品牌】 | 【型号】 | X台 | 终端接入 |

二、无线网络设备
| 设备类型 | 品牌 | 型号 | 数量 | 说明 |
|---------|------|------|------|------|
| 无线AP | 【品牌】 | 【型号】 | X个 | WiFi6 |
| 无线控制器 | 【品牌】 | 【型号】 | X台 | 集中管理 |

三、网络安全设备
| 设备类型 | 品牌 | 型号 | 数量 | 说明 |
|---------|------|------|------|------|
| 防火墙 | 【品牌】 | 【型号】 | X台 | 边界防护 |

四、配套设备
| 设备类型 | 品牌 | 型号 | 数量 | 说明 |
|---------|------|------|------|------|
| 机柜 | - | - | X个 | 设备安装 |
| 配线架 | - | - | X个 | 布线管理 |`,

  '实施计划': `一、项目组织
1. 项目经理：【姓名】，负责项目整体协调
2. 技术负责人：【姓名】，负责技术方案实施
3. 实施工程师：【姓名】，负责设备安装调试

二、实施阶段
| 阶段 | 时间 | 工作内容 | 负责人 |
|------|------|----------|--------|
| 准备阶段 | 第1周 | 设备到货、环境准备 | 【姓名】 |
| 安装阶段 | 第2-3周 | 设备上架、线缆连接 | 【姓名】 |
| 调试阶段 | 第4周 | 设备配置、功能测试 | 【姓名】 |
| 验收阶段 | 第5周 | 性能测试、项目验收 | 【姓名】 |

三、里程碑节点
1. 设备到货：【日期】
2. 安装完成：【日期】
3. 调试完成：【日期】
4. 项目验收：【日期】`,

  '项目管理': `一、项目管理方法
采用【敏捷/瀑布】项目管理方法，确保项目按时、按质、按预算完成。

二、沟通机制
1. 周例会：每周【X】召开项目进度会议
2. 日报：实施团队每日提交工作日报
3. 问题升级：重大问题【2】小时内升级处理

三、风险管理
1. 风险识别：定期识别项目风险
2. 风险评估：评估风险影响和发生概率
3. 风险应对：制定风险应对措施

四、质量管理
1. 设备到货检验
2. 安装工艺检查
3. 功能测试验证
4. 性能测试验收`,

  '售后服务': `一、质保服务
1. 设备质保期：【3】年
2. 质保范围：设备硬件故障免费更换
3. 响应时间：【4】小时响应，【24】小时到场

二、技术支持
1. 7×24小时技术支持热线
2. 远程技术支持
3. 现场技术支持

三、增值服务
1. 定期巡检服务（每季度1次）
2. 网络健康度评估
3. 优化建议报告

四、培训服务
1. 设备操作培训
2. 日常维护培训
3. 应急处理培训`,

  '投资概算': `一、设备投资
| 序号 | 设备类型 | 数量 | 单价（万元） | 小计（万元） |
|------|----------|------|-------------|-------------|
| 1 | 核心交换机 | 2 | 【X】 | 【X】 |
| 2 | 汇聚交换机 | X | 【X】 | 【X】 |
| 3 | 接入交换机 | X | 【X】 | 【X】 |
| 4 | 无线AP | X | 【X】 | 【X】 |
| 5 | 防火墙 | X | 【X】 | 【X】 |
| | 设备小计 | | | 【X】 |

二、服务投资
| 序号 | 服务内容 | 费用（万元） |
|------|----------|-------------|
| 1 | 实施服务 | 【X】 |
| 2 | 培训服务 | 【X】 |
| | 服务小计 | 【X】 |

三、总投资
设备投资 + 服务投资 = 【X】万元`,

  '典型案例': `一、案例名称：【客户名称】网络建设项目

二、项目背景
【客户名称】面临网络性能不足、可靠性差等问题，需要进行全面的网络升级改造。

三、解决方案
采用本方案设计的网络架构，部署相关设备，实现网络的高可用、高性能。

四、项目成果
1. 网络带宽提升【X】倍
2. 网络可用性达到99.99%
3. 故障恢复时间缩短至【X】分钟
4. 满足未来【X】年业务发展需求

五、客户评价
"【客户评价内容】"`,
};

const securityTemplates: Record<string, string> = {
  '项目概述': `一、项目背景
【客户名称】作为【行业领域】的重要企业/机构，承载着大量敏感数据和关键业务系统。随着网络安全威胁日益严峻，为满足等保合规要求，提升整体安全防护能力，特制定本网络安全建设方案。

二、项目目标
1. 满足网络安全等级保护【二级/三级】要求
2. 建立纵深防御的安全防护体系
3. 提升安全威胁检测和响应能力
4. 保障关键信息基础设施安全
5. 满足行业监管合规要求

三、项目范围
本项目涵盖【客户名称】整体网络安全建设，包括但不限于：
- 安全边界防护
- 安全监测预警
- 安全运营管理
- 数据安全保护
- 应急响应处置`,

  '需求分析': `一、合规需求
1. 满足《网络安全法》要求
2. 符合等保2.0【二级/三级】标准
3. 满足【行业】监管要求
4. 符合【GB/T 22239-2019】等标准

二、安全需求
1. 边界防护：防火墙、入侵防御、Web应用防火墙
2. 终端防护：防病毒、终端检测响应（EDR）
3. 网络安全：网络准入、流量审计
4. 数据安全：数据加密、数据脱敏、DLP
5. 安全运营：SIEM、SOC、威胁情报

三、业务需求
1. 保障业务系统连续性
2. 防止数据泄露事件
3. 快速响应安全事件
4. 满足审计和合规检查`,

  '现状分析': `一、安全组织现状
1. 缺乏专业的安全管理团队
2. 安全职责划分不清晰
3. 安全培训和意识不足

二、安全技术现状
1. 边界防护：仅有基础防火墙，缺乏入侵防御
2. 终端防护：防病毒软件版本老旧
3. 网络安全：缺乏网络准入控制
4. 数据安全：无数据加密和脱敏措施
5. 安全运营：无统一安全监控平台

三、安全管理制度现状
1. 安全管理制度不完善
2. 安全操作规程缺失
3. 安全审计机制不健全

四、问题总结
1. 安全防护能力不足，存在重大风险
2. 无法满足等保合规要求
3. 安全运营能力薄弱`,

  '方案设计': `一、总体安全架构
采用"纵深防御、主动防护"的安全架构，构建覆盖物理层、网络层、应用层、数据层的全方位安全防护体系。

二、安全边界防护
1. 部署下一代防火墙（NGFW），实现应用级防护
2. 部署入侵防御系统（IPS），检测和阻断攻击
3. 部署Web应用防火墙（WAF），防护Web攻击

三、终端安全防护
1. 部署终端检测响应（EDR），实现终端威胁检测
2. 部署网络准入控制（NAC），确保终端合规
3. 统一终端安全管理

四、数据安全保护
1. 敏感数据识别和分类分级
2. 数据加密传输和存储
3. 数据防泄漏（DLP）策略

五、安全运营中心
1. 部署SIEM系统，实现日志集中分析
2. 建设SOC安全运营中心
3. 建立威胁情报接入机制`,

  '产品配置': `一、边界安全设备
| 设备类型 | 品牌 | 型号 | 数量 | 说明 |
|---------|------|------|------|------|
| 下一代防火墙 | 【品牌】 | 【型号】 | X台 | 边界防护 |
| 入侵防御系统 | 【品牌】 | 【型号】 | X台 | 攻击检测 |
| Web应用防火墙 | 【品牌】 | 【型号】 | X台 | Web防护 |

二、终端安全设备
| 设备类型 | 品牌 | 型号 | 数量 | 说明 |
|---------|------|------|------|------|
| EDR终端防护 | 【品牌】 | 【型号】 | X套 | 终端安全 |
| 网络准入控制 | 【品牌】 | 【型号】 | X套 | 准入管理 |

三、数据安全设备
| 设备类型 | 品牌 | 型号 | 数量 | 说明 |
|---------|------|------|------|------|
| 数据库审计 | 【品牌】 | 【型号】 | X台 | 数据审计 |
| 数据脱敏 | 【品牌】 | 【型号】 | X套 | 数据保护 |

四、安全运营设备
| 设备类型 | 品牌 | 型号 | 数量 | 说明 |
|---------|------|------|------|------|
| SIEM系统 | 【品牌】 | 【型号】 | X套 | 安全分析 |
| 堡垒机 | 【品牌】 | 【型号】 | X台 | 运维审计 |`,

  '实施计划': `一、项目组织
1. 项目经理：【姓名】，负责项目整体协调
2. 安全顾问：【姓名】，负责安全方案设计
3. 实施工程师：【姓名】，负责设备部署调试

二、实施阶段
| 阶段 | 时间 | 工作内容 | 负责人 |
|------|------|----------|--------|
| 准备阶段 | 第1周 | 设备到货、环境准备 | 【姓名】 |
| 部署阶段 | 第2-3周 | 安全设备部署 | 【姓名】 |
| 配置阶段 | 第4-5周 | 策略配置、规则调优 | 【姓名】 |
| 测试阶段 | 第6周 | 安全测试、漏洞扫描 | 【姓名】 |
| 验收阶段 | 第7周 | 等保测评、项目验收 | 【姓名】 |

三、里程碑节点
1. 设备到货：【日期】
2. 部署完成：【日期】
3. 配置完成：【日期】
4. 等保测评：【日期】
5. 项目验收：【日期】`,

  '项目管理': `一、项目管理方法
采用【敏捷/瀑布】项目管理方法，结合网络安全项目特点，确保项目按时、按质完成。

二、沟通机制
1. 周例会：每周【X】召开项目进度会议
2. 日报：实施团队每日提交工作日报
3. 问题升级：安全事件【1】小时内升级处理

三、风险管理
1. 风险识别：定期识别项目风险
2. 风险评估：评估风险影响和发生概率
3. 风险应对：制定风险应对措施

四、质量管理
1. 设备到货检验
2. 安全配置审查
3. 漏洞扫描验证
4. 等保测评通过`,

  '售后服务': `一、质保服务
1. 设备质保期：【3】年
2. 质保范围：设备硬件故障免费更换
3. 响应时间：【4】小时响应，【24】小时到场

二、安全服务
1. 安全设备策略优化
2. 威胁情报更新
3. 安全事件应急响应

三、增值服务
1. 定期安全巡检（每月1次）
2. 安全健康度评估
3. 优化建议报告

四、培训服务
1. 安全设备操作培训
2. 安全意识培训
3. 应急响应培训`,

  '投资概算': `一、设备投资
| 序号 | 设备类型 | 数量 | 单价（万元） | 小计（万元） |
|------|----------|------|-------------|-------------|
| 1 | 下一代防火墙 | X | 【X】 | 【X】 |
| 2 | 入侵防御系统 | X | 【X】 | 【X】 |
| 3 | Web应用防火墙 | X | 【X】 | 【X】 |
| 4 | EDR终端防护 | X | 【X】 | 【X】 |
| 5 | SIEM系统 | X | 【X】 | 【X】 |
| | 设备小计 | | | 【X】 |

二、服务投资
| 序号 | 服务内容 | 费用（万元） |
|------|----------|-------------|
| 1 | 实施服务 | 【X】 |
| 2 | 等保测评 | 【X】 |
| 3 | 培训服务 | 【X】 |
| | 服务小计 | 【X】 |

三、总投资
设备投资 + 服务投资 = 【X】万元`,

  '典型案例': `一、案例名称：【客户名称】网络安全建设项目

二、项目背景
【客户名称】面临等保合规压力，需要进行全面的网络安全建设，满足等保三级要求。

三、解决方案
采用本方案设计的安全架构，部署相关安全设备，建立安全运营中心。

四、项目成果
1. 顺利通过等保三级测评
2. 安全事件响应时间缩短【X】%
3. 年度安全事件减少【X】%
4. 安全运维效率提升【X】%

五、客户评价
"【客户评价内容】"`,
};

const SolutionCreate: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const { addSolution } = useSolutionStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  const [solutionData, setSolutionData] = useState({
    type: '' as 'network' | 'security' | '',
    subType: '',
    customSubType: '',
    name: '',
    customerName: '',
    industry: '',
    customIndustry: '',
    scale: '',
    protectionLevel: '',
    standards: [] as string[],
    budget: 0,
    background: '',
    goals: '',
    chapters: [...defaultChapters],
    products: [] as ProductItem[],
    status: 'draft' as 'draft' | 'completed',
  });

  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [chapterModalOpen, setChapterModalOpen] = useState(false);
  const [chapterContent, setChapterContent] = useState('');
  const [isCustomSubType, setIsCustomSubType] = useState(false);
  const [isCustomIndustry, setIsCustomIndustry] = useState(false);
  const textareaRef = useRef<any>(null);

  const networkTypes = [
    { value: 'campus', label: '园区网络', desc: '企业园区网络建设', icon: '🏢' },
    { value: 'datacenter', label: '数据中心', desc: '数据中心网络架构', icon: '🖥️' },
    { value: 'wan', label: '广域网', desc: '广域网互联方案', icon: '🌐' },
    { value: 'wireless', label: '无线网络', desc: '无线覆盖方案', icon: '📡' },
    { value: 'cloud', label: '云网络', desc: '混合云/多云网络架构', icon: '☁️' },
    { value: 'iot', label: '物联网', desc: 'IoT网络接入与安全', icon: '🔗' },
  ];

  const securityTypes = [
    { value: 'compliance', label: '等保合规', desc: '等保2.0合规建设', icon: '🛡️' },
    { value: 'security-arch', label: '安全架构', desc: '整体安全架构设计', icon: '🏰' },
    { value: 'soc', label: '安全运营', desc: 'SOC安全运营中心', icon: '📊' },
    { value: 'incident', label: '应急响应', desc: '安全事件应急处置', icon: '🚨' },
    { value: 'data-security', label: '数据安全', desc: '数据安全治理', icon: '🔐' },
    { value: 'cloud-security', label: '云安全', desc: '云环境安全防护', icon: '☁️' },
  ];

  const industries = [
    { value: 'finance', label: '金融', desc: '银行/证券/保险' },
    { value: 'government', label: '政务', desc: '政府/事业单位' },
    { value: 'healthcare', label: '医疗', desc: '医院/卫生机构' },
    { value: 'education', label: '教育', desc: '高校/中小学' },
    { value: 'energy', label: '能源', desc: '电力/石油/煤炭' },
    { value: 'transport', label: '交通', desc: '航空/铁路/公路' },
    { value: 'telecom', label: '电信', desc: '运营商/通信' },
    { value: 'manufacturing', label: '制造业', desc: '工厂/制造企业' },
    { value: 'internet', label: '互联网', desc: '互联网/科技公司' },
    { value: 'retail', label: '零售', desc: '零售/电商' },
  ];

  const scales = [
    { value: 'small', label: '小型', desc: '<100人' },
    { value: 'medium', label: '中型', desc: '100-500人' },
    { value: 'large', label: '大型', desc: '500-2000人' },
    { value: 'xlarge', label: '超大型', desc: '>2000人' },
  ];

  const protectionLevels = [
    { value: 'level2', label: '二级' },
    { value: 'level3', label: '三级' },
    { value: 'level4', label: '四级' },
  ];

  const standardOptions = [
    { value: 'GB/T 22239-2019', label: 'GB/T 22239-2019 等保基本要求' },
    { value: 'GB/T 25070-2019', label: 'GB/T 25070-2019 等保设计要求' },
    { value: 'GB/T 28448-2019', label: 'GB/T 28448-2019 等保测评要求' },
    { value: 'GB/T 20271-2006', label: 'GB/T 20271-2006 通用安全技术要求' },
    { value: 'GB/T 35273-2020', label: 'GB/T 35273-2020 个人信息安全规范' },
    { value: 'GB/T 39786-2021', label: 'GB/T 39786-2021 密码应用要求' },
  ];

  const productCategories = ['防火墙', '交换机', '路由器', 'WAF', 'IDS/IPS', 'VPN', '服务器', '存储', '无线AP', 'AC控制器', '堡垒机', '日志审计'];

  const handleNext = () => {
    if (currentStep === 0 && !solutionData.type) {
      message.warning('请选择方案类型');
      return;
    }
    if (currentStep === 1) {
      if (!solutionData.name) {
        message.warning('请输入方案名称');
        return;
      }
      if (!solutionData.customerName) {
        message.warning('请输入客户名称');
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSave = () => {
    if (!solutionData.name) {
      message.warning('请填写方案名称');
      return;
    }
    const newSolution = {
      ...solutionData,
      id: Date.now().toString(),
      type: solutionData.type as 'network' | 'security',
      subType: isCustomSubType ? solutionData.customSubType : solutionData.subType,
      industry: isCustomIndustry ? solutionData.customIndustry : solutionData.industry,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addSolution(newSolution as any);
    message.success('方案已保存');
    navigate('/solution');
  };

  const handleExport = (format: string) => {
    const solution = {
      ...solutionData,
      id: Date.now().toString(),
      type: solutionData.type as 'network' | 'security',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    switch (format) {
      case 'Markdown':
        exportMarkdown(solution as any);
        message.success('已导出Markdown文件');
        break;
      case 'HTML':
        exportHtml(solution as any);
        message.success('已导出HTML文件');
        break;
      case '打印':
        printSolution(solution as any);
        break;
    }
  };

  const handleMoveChapter = (index: number, direction: 'up' | 'down') => {
    const newChapters = [...solutionData.chapters];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newChapters.length) return;
    [newChapters[index], newChapters[targetIndex]] = [newChapters[targetIndex], newChapters[index]];
    newChapters.forEach((c, i) => c.order = i + 1);
    setSolutionData({ ...solutionData, chapters: newChapters });
  };

  const handleEditChapterContent = (chapter: Chapter) => {
    setEditingChapter(chapter);
    if (chapter.content) {
      setChapterContent(chapter.content);
    } else {
      const templates = solutionData.type === 'network' ? networkTemplates : securityTemplates;
      setChapterContent(templates[chapter.title] || '');
    }
    setChapterModalOpen(true);
  };

  const handleSaveChapterContent = () => {
    if (editingChapter) {
      const newChapters = solutionData.chapters.map((c) =>
        c.id === editingChapter.id ? { ...c, content: chapterContent } : c
      );
      setSolutionData({ ...solutionData, chapters: newChapters });
      setChapterModalOpen(false);
      message.success('章节内容已保存');
    }
  };

  const handleInsertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/gif,image/webp,image/bmp,image/svg+xml';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          const markdownImg = `\n![${file.name}](${url})\n`;
          const textarea = textareaRef.current?.resizableTextArea?.textArea;
          if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newText = chapterContent.substring(0, start) + markdownImg + chapterContent.substring(end);
            const cursorPos = start + markdownImg.length;
            setChapterContent(newText);
            requestAnimationFrame(() => {
              textarea.focus();
              textarea.setSelectionRange(cursorPos, cursorPos);
            });
          } else {
            setChapterContent(chapterContent + markdownImg);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleAddProduct = () => {
    const newProduct: ProductItem = {
      id: Date.now().toString(),
      category: '',
      brand: '',
      model: '',
      quantity: 1,
      unit: '台',
      location: '',
      remark: '',
    };
    setSolutionData({ ...solutionData, products: [...solutionData.products, newProduct] });
  };

  const handleDeleteProduct = (id: string) => {
    setSolutionData({ ...solutionData, products: solutionData.products.filter((p) => p.id !== id) });
  };

  const handleUpdateProduct = (id: string, field: keyof ProductItem, value: any) => {
    const newProducts = solutionData.products.map((p) =>
      p.id === id ? { ...p, [field]: value } : p
    );
    setSolutionData({ ...solutionData, products: newProducts });
  };

  const getSubTypeLabel = (value: string) => {
    const types = solutionData.type === 'network' ? networkTypes : securityTypes;
    return types.find(t => t.value === value)?.label || value;
  };

  const getIndustryLabel = (value: string) => {
    return industries.find(i => i.value === value)?.label || value;
  };

  const step1Content = (
    <div>
      <Title level={4} style={{ marginBottom: 8 }}>选择方案类型</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>请选择方案的主类型</Text>

      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card
            hoverable
            onClick={() => setSolutionData({ ...solutionData, type: 'network', subType: '', customSubType: '' })}
            style={{
              borderColor: solutionData.type === 'network' ? theme.colors.primary : theme.colors.border,
              borderWidth: solutionData.type === 'network' ? 2 : 1,
              background: solutionData.type === 'network' ? theme.colors.primary + '08' : theme.colors.bgContainer,
            }}
          >
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🌐</div>
              <Title level={3} style={{ marginBottom: 8 }}>网络建设</Title>
              <Paragraph type="secondary">网络基础设施建设方案</Paragraph>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            hoverable
            onClick={() => setSolutionData({ ...solutionData, type: 'security', subType: '', customSubType: '' })}
            style={{
              borderColor: solutionData.type === 'security' ? theme.colors.primary : theme.colors.border,
              borderWidth: solutionData.type === 'security' ? 2 : 1,
              background: solutionData.type === 'security' ? theme.colors.primary + '08' : theme.colors.bgContainer,
            }}
          >
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🛡️</div>
              <Title level={3} style={{ marginBottom: 8 }}>网络安全</Title>
              <Paragraph type="secondary">网络安全防护建设方案</Paragraph>
            </div>
          </Card>
        </Col>
      </Row>

      {solutionData.type && (
        <div style={{ marginTop: 32 }}>
          <Title level={4} style={{ marginBottom: 8 }}>选择子类型</Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>请选择具体的方案子类型</Text>
          <Row gutter={[16, 16]}>
            {(solutionData.type === 'network' ? networkTypes : securityTypes).map((item) => (
              <Col span={8} key={item.value}>
                <Card
                  hoverable
                  size="small"
                  onClick={() => {
                    setSolutionData({ ...solutionData, subType: item.value });
                    setIsCustomSubType(false);
                  }}
                  style={{
                    borderColor: !isCustomSubType && solutionData.subType === item.value ? theme.colors.primary : theme.colors.border,
                    borderWidth: !isCustomSubType && solutionData.subType === item.value ? 2 : 1,
                    background: !isCustomSubType && solutionData.subType === item.value ? theme.colors.primary + '08' : theme.colors.bgContainer,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 28 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{item.label}</div>
                      <Text type="secondary" style={{ fontSize: 12 }}>{item.desc}</Text>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
            <Col span={8}>
              <Card
                hoverable
                size="small"
                onClick={() => setIsCustomSubType(true)}
                style={{
                  borderColor: isCustomSubType ? theme.colors.primary : theme.colors.border,
                  borderWidth: isCustomSubType ? 2 : 1,
                  background: isCustomSubType ? theme.colors.primary + '08' : theme.colors.bgContainer,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 28 }}>➕</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>自定义</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>输入自定义子类型</Text>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {isCustomSubType && (
            <div style={{ marginTop: 16 }}>
              <Input
                placeholder="请输入自定义子类型名称"
                value={solutionData.customSubType}
                onChange={(e) => setSolutionData({ ...solutionData, customSubType: e.target.value })}
                style={{ maxWidth: 400 }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );

  const step2Content = (
    <div>
      <Title level={4} style={{ marginBottom: 8 }}>基本信息</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>请填写方案的基本信息</Text>

      <Form layout="vertical">
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="方案名称" required>
              <Input
                value={solutionData.name}
                onChange={(e) => setSolutionData({ ...solutionData, name: e.target.value })}
                placeholder="如：XX银行网络安全防护方案"
                maxLength={50}
                showCount
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="客户名称" required>
              <Input
                value={solutionData.customerName}
                onChange={(e) => setSolutionData({ ...solutionData, customerName: e.target.value })}
                placeholder="请输入客户名称"
                maxLength={50}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="所属行业">
              <Select
                value={isCustomIndustry ? 'custom' : (solutionData.industry || undefined)}
                onChange={(v) => {
                  if (v === 'custom') {
                    setIsCustomIndustry(true);
                  } else {
                    setIsCustomIndustry(false);
                    setSolutionData({ ...solutionData, industry: v });
                  }
                }}
                placeholder="请选择行业"
                allowClear
              >
                {industries.map((ind) => (
                  <Option key={ind.value} value={ind.value}>{ind.label}</Option>
                ))}
                <Option value="custom">➕ 自定义</Option>
              </Select>
            </Form.Item>
          </Col>
          {isCustomIndustry && (
            <Col span={8}>
              <Form.Item label="自定义行业">
                <Input
                  value={solutionData.customIndustry}
                  onChange={(e) => setSolutionData({ ...solutionData, customIndustry: e.target.value })}
                  placeholder="请输入行业名称"
                />
              </Form.Item>
            </Col>
          )}
          <Col span={8}>
            <Form.Item label="项目规模">
              <Select
                value={solutionData.scale || undefined}
                onChange={(v) => setSolutionData({ ...solutionData, scale: v })}
                placeholder="请选择规模"
                allowClear
              >
                {scales.map((s) => (
                  <Option key={s.value} value={s.value}>{s.label}（{s.desc}）</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="预算（万元）">
              <InputNumber
                value={solutionData.budget || undefined}
                onChange={(v) => setSolutionData({ ...solutionData, budget: v || 0 })}
                placeholder="请输入预算"
                min={0}
                precision={2}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          {solutionData.type === 'security' && (
            <Col span={8}>
              <Form.Item label="等保级别">
                <Select
                  value={solutionData.protectionLevel || undefined}
                  onChange={(v) => setSolutionData({ ...solutionData, protectionLevel: v })}
                  placeholder="请选择等保级别"
                  allowClear
                >
                  {protectionLevels.map((l) => (
                    <Option key={l.value} value={l.value}>{l.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}
          <Col span={24}>
            <Form.Item label="参考标准">
              <Select
                mode="multiple"
                value={solutionData.standards}
                onChange={(v) => setSolutionData({ ...solutionData, standards: v })}
                placeholder="请选择参考标准，可多选"
                allowClear
                maxTagCount={3}
              >
                {standardOptions.map((s) => (
                  <Option key={s.value} value={s.value}>{s.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="项目背景">
              <TextArea
                rows={4}
                value={solutionData.background}
                onChange={(e) => setSolutionData({ ...solutionData, background: e.target.value })}
                placeholder="请描述项目背景..."
                maxLength={2000}
                showCount
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="项目目标">
              <TextArea
                rows={3}
                value={solutionData.goals}
                onChange={(e) => setSolutionData({ ...solutionData, goals: e.target.value })}
                placeholder="请描述项目目标..."
                maxLength={1000}
                showCount
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );

  const step3Content = (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>章节配置</Title>
          <Text type="secondary">点击编辑按钮查看并编辑章节模板内容</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            const newChapter: Chapter = {
              id: Date.now().toString(),
              title: '新章节',
              enabled: true,
              content: '',
              order: solutionData.chapters.length + 1,
            };
            setSolutionData({ ...solutionData, chapters: [...solutionData.chapters, newChapter] });
          }}
        >
          添加章节
        </Button>
      </div>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        共 {solutionData.chapters.length} 个章节，{solutionData.chapters.filter(c => c.enabled).length} 个启用
        | 当前模板：{solutionData.type === 'network' ? '网络建设' : '网络安全'}
      </Text>

      <div style={{ border: `1px solid ${theme.colors.border}`, borderRadius: 8, overflow: 'hidden' }}>
        {solutionData.chapters.map((chapter, index) => (
          <div
            key={chapter.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              borderBottom: index < solutionData.chapters.length - 1 ? `1px solid ${theme.colors.border}` : 'none',
              background: chapter.enabled ? theme.colors.bgContainer : theme.colors.bgLayout,
              opacity: chapter.enabled ? 1 : 0.6,
            }}
          >
            <div style={{ width: 40, textAlign: 'center', color: theme.colors.textTertiary }}>
              {chapter.order}
            </div>
            <div style={{ flex: 1, marginLeft: 8 }}>
              <Input
                value={chapter.title}
                onChange={(e) => {
                  const newChapters = solutionData.chapters.map((c) =>
                    c.id === chapter.id ? { ...c, title: e.target.value } : c
                  );
                  setSolutionData({ ...solutionData, chapters: newChapters });
                }}
                style={{ border: 'none', boxShadow: 'none', background: 'transparent' }}
              />
            </div>
            <Space>
              <Tooltip title="编辑内容">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => handleEditChapterContent(chapter)}
                  style={{ color: chapter.content ? '#52c41a' : theme.colors.primary }}
                >
                  {chapter.content ? '已编辑' : '编辑'}
                </Button>
              </Tooltip>
              <Tooltip title="上移">
                <Button
                  type="text"
                  icon={<UpOutlined />}
                  disabled={index === 0}
                  onClick={() => handleMoveChapter(index, 'up')}
                />
              </Tooltip>
              <Tooltip title="下移">
                <Button
                  type="text"
                  icon={<DownOutlined />}
                  disabled={index === solutionData.chapters.length - 1}
                  onClick={() => handleMoveChapter(index, 'down')}
                />
              </Tooltip>
              <Switch
                checked={chapter.enabled}
                onChange={(checked) => {
                  const newChapters = solutionData.chapters.map((c) =>
                    c.id === chapter.id ? { ...c, enabled: checked } : c
                  );
                  setSolutionData({ ...solutionData, chapters: newChapters });
                }}
                checkedChildren="启用"
                unCheckedChildren="禁用"
              />
              <Tooltip title="删除">
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    setSolutionData({
                      ...solutionData,
                      chapters: solutionData.chapters.filter((c) => c.id !== chapter.id),
                    });
                  }}
                />
              </Tooltip>
            </Space>
          </div>
        ))}
      </div>

      <Modal
        title={`编辑章节: ${editingChapter?.title}`}
        open={chapterModalOpen}
        onOk={handleSaveChapterContent}
        onCancel={() => setChapterModalOpen(false)}
        width={800}
        okText="保存"
        cancelText="取消"
      >
        <div style={{ marginBottom: 8, padding: '8px 12px', background: '#f0f5ff', borderRadius: 4 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            💡 以下为模板内容，您可以直接修改。修改后仅影响当前方案，不会影响其他方案。
          </Text>
        </div>
        <div style={{ marginBottom: 8 }}>
          <Button size="small" icon={<PictureOutlined />} onClick={handleInsertImage}>
            插入图片
          </Button>
          <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>支持插入本地图片</Text>
        </div>
        <TextArea
          ref={textareaRef}
          value={chapterContent}
          onChange={(e) => setChapterContent(e.target.value)}
          rows={20}
          style={{ fontSize: 14, lineHeight: 1.8 }}
        />
      </Modal>
    </div>
  );

  const step4Content = (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>设备清单</Title>
          <Text type="secondary">添加方案所需的产品设备信息</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProduct}>
          添加设备
        </Button>
      </div>

      <div style={{ border: `1px solid ${theme.colors.border}`, borderRadius: 8, overflow: 'hidden' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '60px 1fr 1fr 1fr 80px 80px 1fr 120px 60px',
          gap: 0,
          padding: '12px 16px',
          background: theme.colors.bgLayout,
          borderBottom: `1px solid ${theme.colors.border}`,
          fontWeight: 600,
          fontSize: 13,
        }}>
          <div>序号</div>
          <div>设备类型</div>
          <div>品牌</div>
          <div>型号</div>
          <div>数量</div>
          <div>单位</div>
          <div>部署位置</div>
          <div>备注</div>
          <div>操作</div>
        </div>

        {solutionData.products.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <Empty description="暂无设备，点击上方按钮添加" />
          </div>
        ) : (
          solutionData.products.map((product, index) => (
            <div
              key={product.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr 1fr 1fr 80px 80px 1fr 120px 60px',
                gap: 0,
                padding: '8px 16px',
                borderBottom: index < solutionData.products.length - 1 ? `1px solid ${theme.colors.border}` : 'none',
                alignItems: 'center',
              }}
            >
              <div style={{ color: theme.colors.textTertiary }}>{index + 1}</div>
              <div>
                <Select value={product.category || undefined} onChange={(v) => handleUpdateProduct(product.id, 'category', v)} placeholder="类型" size="small" style={{ width: '100%' }}>
                  {productCategories.map((cat) => <Option key={cat} value={cat}>{cat}</Option>)}
                </Select>
              </div>
              <div>
                <Input value={product.brand} onChange={(e) => handleUpdateProduct(product.id, 'brand', e.target.value)} placeholder="品牌" size="small" />
              </div>
              <div>
                <Input value={product.model} onChange={(e) => handleUpdateProduct(product.id, 'model', e.target.value)} placeholder="型号" size="small" />
              </div>
              <div>
                <InputNumber value={product.quantity} onChange={(v) => handleUpdateProduct(product.id, 'quantity', v || 1)} min={1} size="small" style={{ width: '100%' }} />
              </div>
              <div>
                <Select value={product.unit} onChange={(v) => handleUpdateProduct(product.id, 'unit', v)} size="small" style={{ width: '100%' }}>
                  <Option value="台">台</Option>
                  <Option value="套">套</Option>
                  <Option value="个">个</Option>
                  <Option value="块">块</Option>
                  <Option value="组">组</Option>
                </Select>
              </div>
              <div>
                <Input value={product.location} onChange={(e) => handleUpdateProduct(product.id, 'location', e.target.value)} placeholder="位置" size="small" />
              </div>
              <div>
                <Input value={product.remark} onChange={(e) => handleUpdateProduct(product.id, 'remark', e.target.value)} placeholder="备注" size="small" />
              </div>
              <div>
                <Button type="text" danger icon={<DeleteOutlined />} size="small" onClick={() => handleDeleteProduct(product.id)} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const step5Content = (
    <div>
      <Title level={4} style={{ marginBottom: 8 }}>预览方案</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>请检查方案信息，确认无误后可导出或保存</Text>

      <Card title="基本信息" style={{ marginBottom: 16 }}>
        <Row gutter={[24, 16]}>
          <Col span={8}>
            <Text type="secondary">方案类型：</Text>
            <Tag color={solutionData.type === 'network' ? 'blue' : 'red'} style={{ marginLeft: 8 }}>
              {solutionData.type === 'network' ? '网络建设' : '网络安全'}
            </Tag>
          </Col>
          <Col span={8}>
            <Text type="secondary">子类型：</Text>
            <Text>{isCustomSubType ? solutionData.customSubType : getSubTypeLabel(solutionData.subType)}</Text>
          </Col>
          <Col span={8}>
            <Text type="secondary">方案名称：</Text>
            <Text strong>{solutionData.name || '-'}</Text>
          </Col>
          <Col span={8}>
            <Text type="secondary">客户名称：</Text>
            <Text>{solutionData.customerName || '-'}</Text>
          </Col>
          <Col span={8}>
            <Text type="secondary">所属行业：</Text>
            <Text>{isCustomIndustry ? solutionData.customIndustry : getIndustryLabel(solutionData.industry)}</Text>
          </Col>
          <Col span={8}>
            <Text type="secondary">项目规模：</Text>
            <Text>{scales.find(s => s.value === solutionData.scale)?.label || '-'}</Text>
          </Col>
          <Col span={8}>
            <Text type="secondary">预算：</Text>
            <Text>{solutionData.budget ? `${solutionData.budget.toLocaleString()}万元` : '-'}</Text>
          </Col>
        </Row>
      </Card>

      {solutionData.standards.length > 0 && (
        <Card title="参考标准" style={{ marginBottom: 16 }}>
          <Space wrap>
            {solutionData.standards.map((s) => <Tag key={s} color="blue">{s}</Tag>)}
          </Space>
        </Card>
      )}

      {solutionData.background && (
        <Card title="项目背景" style={{ marginBottom: 16 }}>
          <Paragraph>{solutionData.background}</Paragraph>
        </Card>
      )}

      {solutionData.goals && (
        <Card title="项目目标" style={{ marginBottom: 16 }}>
          <Paragraph>{solutionData.goals}</Paragraph>
        </Card>
      )}

      <Card title="章节结构" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 8]}>
          {solutionData.chapters.filter(c => c.enabled).map((c, i) => (
            <Col key={c.id} span={8}>
              <Tag style={{ width: '100%', textAlign: 'center', padding: '8px 12px' }}>
                {i + 1}. {c.title} {c.content ? '✓' : ''}
              </Tag>
            </Col>
          ))}
        </Row>
      </Card>

      {solutionData.products.length > 0 && (
        <Card title={`设备清单 (${solutionData.products.length}项)`}>
          <Table
            dataSource={solutionData.products}
            rowKey="id"
            pagination={false}
            size="small"
            columns={[
              { title: '类型', dataIndex: 'category', width: 100 },
              { title: '品牌', dataIndex: 'brand', width: 100 },
              { title: '型号', dataIndex: 'model', width: 120 },
              { title: '数量', dataIndex: 'quantity', width: 60 },
              { title: '单位', dataIndex: 'unit', width: 60 },
              { title: '位置', dataIndex: 'location' },
              { title: '备注', dataIndex: 'remark' },
            ]}
          />
        </Card>
      )}
    </div>
  );

  const steps = [
    { title: '类型选择', content: step1Content },
    { title: '基本信息', content: step2Content },
    { title: '章节配置', content: step3Content },
    { title: '设备清单', content: step4Content },
    { title: '预览导出', content: step5Content },
  ];

  return (
    <div>
      <Card>
        <Steps
          current={currentStep}
          style={{ marginBottom: 32 }}
          items={steps.map((step, index) => ({
            title: step.title,
            status: index === currentStep ? 'process' : index < currentStep ? 'finish' : 'wait',
          }))}
        />

        <div style={{ minHeight: 500, padding: '0 16px' }}>
          {steps[currentStep].content}
        </div>

        <Divider />

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button disabled={currentStep === 0} onClick={handlePrev} size="large">上一步</Button>
          <Space>
            <Button onClick={handleSave} size="large">保存草稿</Button>
            {currentStep < steps.length - 1 ? (
              <Button type="primary" onClick={handleNext} size="large">下一步</Button>
            ) : (
              <Space>
                <Button icon={<ExportOutlined />} onClick={() => handleExport('Markdown')} size="large">导出MD</Button>
                <Button onClick={() => handleExport('HTML')} size="large">导出HTML</Button>
                <Button onClick={() => handleExport('打印')} size="large">打印预览</Button>
                <Button type="primary" onClick={handleSave} size="large">保存方案</Button>
              </Space>
            )}
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default SolutionCreate;
