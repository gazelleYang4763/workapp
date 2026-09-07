import { useEffect, useState } from 'react';
import { Card, Descriptions, Tag, Typography, Button, Space, Row, Col, Table, Empty, Divider, Spin } from 'antd';
import { ArrowLeftOutlined, EditOutlined, ExportOutlined, PrinterOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useThemeStore } from '@/store/theme';
import { useSolutionStore } from '@/store/solution';
import { exportMarkdown, exportHtml, printSolution } from '@/utils/export';

const { Title, Text, Paragraph } = Typography;

const SolutionDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useThemeStore();
  const { solutions } = useSolutionStore();
  const [solution, setSolution] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const found = solutions.find((s) => s.id === id);
    if (found) {
      setSolution(found);
    }
    setLoading(false);
  }, [id, solutions]);

  if (loading) {
    return <Card><Spin size="large" style={{ display: 'block', margin: '100px auto' }} /></Card>;
  }

  if (!solution) {
    return (
      <Card>
        <Empty description="方案不存在">
          <Button type="primary" onClick={() => navigate('/solution')}>返回列表</Button>
        </Empty>
      </Card>
    );
  }

  const handleExport = (format: string) => {
    switch (format) {
      case 'Markdown':
        exportMarkdown(solution);
        break;
      case 'HTML':
        exportHtml(solution);
        break;
      case '打印':
        printSolution(solution);
        break;
    }
  };

  const industries: Record<string, string> = {
    finance: '金融', government: '政务', healthcare: '医疗', education: '教育',
    energy: '能源', transport: '交通', telecom: '电信', manufacturing: '制造业',
    internet: '互联网', retail: '零售',
  };

  const scales: Record<string, string> = {
    small: '小型', medium: '中型', large: '大型', xlarge: '超大型',
  };

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/solution')}>返回</Button>
          <Title level={4} style={{ margin: 0 }}>{solution.name}</Title>
        </Space>
        <Space>
          <Button icon={<EditOutlined />} onClick={() => navigate(`/solution/edit/${solution.id}`)}>编辑</Button>
          <Button icon={<ExportOutlined />} onClick={() => handleExport('Markdown')}>导出MD</Button>
          <Button onClick={() => handleExport('HTML')}>导出HTML</Button>
          <Button icon={<PrinterOutlined />} onClick={() => handleExport('打印')}>打印</Button>
        </Space>
      </div>

      <Card title="基本信息" style={{ marginBottom: 16 }}>
        <Descriptions column={3} bordered>
          <Descriptions.Item label="方案类型">
            <Tag color={solution.type === 'network' ? 'blue' : 'red'}>
              {solution.type === 'network' ? '网络建设' : '网络安全'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="方案名称">{solution.name}</Descriptions.Item>
          <Descriptions.Item label="客户名称">{solution.customerName}</Descriptions.Item>
          <Descriptions.Item label="所属行业">{industries[solution.industry] || '-'}</Descriptions.Item>
          <Descriptions.Item label="项目规模">{scales[solution.scale] || '-'}</Descriptions.Item>
          <Descriptions.Item label="预算">{solution.budget ? `${solution.budget.toLocaleString()}万元` : '-'}</Descriptions.Item>
          {solution.protectionLevel && (
            <Descriptions.Item label="等保级别">{solution.protectionLevel}</Descriptions.Item>
          )}
          <Descriptions.Item label="状态">
            <Tag color={solution.status === 'completed' ? 'green' : 'orange'}>
              {solution.status === 'completed' ? '已完成' : '草稿'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">{new Date(solution.updatedAt).toLocaleString()}</Descriptions.Item>
        </Descriptions>
      </Card>

      {solution.standards && solution.standards.length > 0 && (
        <Card title="参考标准" style={{ marginBottom: 16 }}>
          <Space wrap>
            {solution.standards.map((s: string) => <Tag key={s} color="blue">{s}</Tag>)}
          </Space>
        </Card>
      )}

      {solution.background && (
        <Card title="项目背景" style={{ marginBottom: 16 }}>
          <Paragraph>{solution.background}</Paragraph>
        </Card>
      )}

      {solution.goals && (
        <Card title="项目目标" style={{ marginBottom: 16 }}>
          <Paragraph>{solution.goals}</Paragraph>
        </Card>
      )}

      {solution.chapters && solution.chapters.filter((c: any) => c.enabled).length > 0 && (
        <Card title="章节结构" style={{ marginBottom: 16 }}>
          <Row gutter={[16, 8]}>
            {solution.chapters.filter((c: any) => c.enabled).map((c: any, i: number) => (
              <Col key={c.id} span={8}>
                <Card size="small" title={`${i + 1}. ${c.title}`} extra={c.content && <Tag color="green">已填写</Tag>}>
                  {c.content ? (
                    <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 0 }}>{c.content}</Paragraph>
                  ) : (
                    <Text type="secondary">暂无内容</Text>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {solution.products && solution.products.length > 0 && (
        <Card title={`设备清单 (${solution.products.length}项)`}>
          <Table
            dataSource={solution.products}
            rowKey="id"
            pagination={false}
            columns={[
              { title: '类型', dataIndex: 'category', width: 100 },
              { title: '品牌', dataIndex: 'brand', width: 100 },
              { title: '型号', dataIndex: 'model', width: 120 },
              { title: '数量', dataIndex: 'quantity', width: 60 },
              { title: '单位', dataIndex: 'unit', width: 60 },
              { title: '部署位置', dataIndex: 'location' },
              { title: '备注', dataIndex: 'remark' },
            ]}
          />
        </Card>
      )}
    </div>
  );
};

export default SolutionDetail;
