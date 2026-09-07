import { useEffect, useState, useRef } from 'react';
import { Card, Descriptions, Tag, Typography, Button, Space, Row, Col, Table, Empty, Spin, Modal, Input, Select, InputNumber, Switch, message } from 'antd';
import { ArrowLeftOutlined, EditOutlined, ExportOutlined, SaveOutlined, DeleteOutlined, PlusOutlined, UpOutlined, DownOutlined, PictureOutlined, TableOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useThemeStore } from '@/store/theme';
import { useSolutionStore } from '@/store/solution';
import { exportMarkdown, exportHtml, exportWord } from '@/utils/export';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const SolutionDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useThemeStore();
  const { solutions, updateSolution } = useSolutionStore();
  const [solution, setSolution] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [chapterModalOpen, setChapterModalOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [chapterContent, setChapterContent] = useState('');
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [tableHeaders, setTableHeaders] = useState<string[]>([]);
  const [tableHeadersInput, setTableHeadersInput] = useState('');
  const textareaRef = useRef<any>(null);

  useEffect(() => {
    setLoading(true);
    const found = solutions.find((s) => s.id === id);
    if (found) {
      setSolution(found);
      setEditData({ ...found });
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

  const industries: Record<string, string> = {
    finance: '金融', government: '政务', healthcare: '医疗', education: '教育',
    energy: '能源', transport: '交通', telecom: '电信', manufacturing: '制造业',
    internet: '互联网', retail: '零售',
  };

  const scales: Record<string, string> = {
    small: '小型', medium: '中型', large: '大型', xlarge: '超大型',
  };

  const protectionLevels: Record<string, string> = {
    level2: '二级', level3: '三级', level4: '四级',
  };

  const handleExport = (format: string) => {
    switch (format) {
      case 'Markdown': exportMarkdown(solution); break;
      case 'HTML': exportHtml(solution); break;
      case 'Word': exportWord(solution); break;
    }
  };

  const handleViewChapter = (chapter: any) => {
    setSelectedChapter(chapter);
    setChapterContent(chapter.content || '');
    setChapterModalOpen(true);
  };

  const handleEditChapterContent = () => {
    if (selectedChapter) {
      const newChapters = editData.chapters.map((c: any) =>
        c.id === selectedChapter.id ? { ...c, content: chapterContent } : c
      );
      setEditData({ ...editData, chapters: newChapters });
      setChapterModalOpen(false);
      message.success('章节内容已更新');
    }
  };

  const handleSaveSolution = () => {
    if (editData.name && editData.customerName) {
      updateSolution(solution.id, { ...editData, updatedAt: new Date().toISOString() });
      setSolution({ ...editData, updatedAt: new Date().toISOString() });
      setEditMode(false);
      message.success('方案已保存');
    } else {
      message.warning('请填写方案名称和客户名称');
    }
  };

  const handleMoveChapter = (index: number, direction: 'up' | 'down') => {
    const newChapters = [...editData.chapters];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newChapters.length) return;
    [newChapters[index], newChapters[targetIndex]] = [newChapters[targetIndex], newChapters[index]];
    newChapters.forEach((c: any, i: number) => c.order = i + 1);
    setEditData({ ...editData, chapters: newChapters });
  };

  const handleDeleteChapter = (chapterId: string) => {
    setEditData({ ...editData, chapters: editData.chapters.filter((c: any) => c.id !== chapterId) });
  };

  const handleAddChapter = () => {
    const newChapter = {
      id: Date.now().toString(),
      title: '新章节',
      enabled: true,
      content: '',
      order: editData.chapters.length + 1,
    };
    setEditData({ ...editData, chapters: [...editData.chapters, newChapter] });
  };

  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now().toString(),
      category: '',
      brand: '',
      model: '',
      quantity: 1,
      unit: '台',
      location: '',
      remark: '',
    };
    setEditData({ ...editData, products: [...(editData.products || []), newProduct] });
  };

  const handleDeleteProduct = (productId: string) => {
    setEditData({ ...editData, products: editData.products.filter((p: any) => p.id !== productId) });
  };

  const handleUpdateProduct = (productId: string, field: string, value: any) => {
    const newProducts = editData.products.map((p: any) =>
      p.id === productId ? { ...p, [field]: value } : p
    );
    setEditData({ ...editData, products: newProducts });
  };

  const handleInsertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/gif,image/webp,image/bmp,image/svg+xml';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
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
      }
    };
    input.click();
  };

  const handleInsertTable = () => {
    setTableRows(3);
    setTableCols(3);
    setTableHeaders([]);
    setTableHeadersInput('');
    setTableModalOpen(true);
  };

  const handleConfirmInsertTable = () => {
    const headers = tableHeadersInput.split(/[,，、\s]+/).filter(Boolean);
    if (headers.length === 0) {
      message.warning('请填写表头');
      return;
    }
    const colCount = headers.length;
    let markdown = '\n| ' + headers.join(' | ') + ' |\n';
    markdown += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
    for (let i = 0; i < tableRows; i++) {
      markdown += '| ' + headers.map(() => '').join(' | ') + ' |\n';
    }
    markdown += '\n';
    const textarea = textareaRef.current?.resizableTextArea?.textArea;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = chapterContent.substring(0, start) + markdown + chapterContent.substring(end);
      const cursorPos = start + markdown.length;
      setChapterContent(newText);
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(cursorPos, cursorPos);
      });
    } else {
      setChapterContent(chapterContent + markdown);
    }
    setTableModalOpen(false);
    message.success('表格已插入');
  };

  const productCategories = ['防火墙', '交换机', '路由器', 'WAF', 'IDS/IPS', 'VPN', '服务器', '存储', '无线AP', 'AC控制器', '堡垒机', '日志审计'];

  const renderPreview = (text: string) => {
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/__(.*?)__/g, '<u>$1</u>')
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:4px;margin:8px 0"/>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li>$1</li>');

    // Render markdown tables
    html = html.replace(/((?:^\|.+\|$\n?)+)/gm, (match) => {
      const rows = match.trim().split('\n').filter(r => r.trim());
      if (rows.length < 2) return match;
      const headerCells = rows[0].split('|').filter(c => c.trim() !== '');
      const isSeparator = (row: string) => row.split('|').filter(c => c.trim() !== '').every(c => /^[\s\-:]+$/.test(c));
      if (rows.length >= 2 && isSeparator(rows[1])) {
        const bodyRows = rows.slice(2);
        let table = '<table style="border-collapse:collapse;width:100%;margin:12px 0"><thead><tr>';
        headerCells.forEach(cell => {
          table += `<th style="border:1px solid #d9d9d9;padding:8px 12px;background:#f0f5ff;font-weight:600;text-align:left">${cell.trim()}</th>`;
        });
        table += '</tr></thead><tbody>';
        bodyRows.forEach(row => {
          const cells = row.split('|').filter(c => c.trim() !== '');
          table += '<tr>';
          cells.forEach(cell => {
            table += `<td style="border:1px solid #d9d9d9;padding:8px 12px">${cell.trim()}</td>`;
          });
          table += '</tr>';
        });
        table += '</tbody></table>';
        return table;
      }
      return match;
    });

    html = html.replace(/\n/g, '<br/>');
    return html;
  };

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/solution')}>返回</Button>
          <Title level={4} style={{ margin: 0 }}>{editMode ? '编辑方案' : solution.name}</Title>
        </Space>
        <Space>
          {editMode ? (
            <>
              <Button onClick={() => { setEditMode(false); setEditData({ ...solution }); }}>取消</Button>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveSolution}>保存</Button>
            </>
          ) : (
            <>
              <Button icon={<EditOutlined />} onClick={() => { setEditMode(true); setEditData({ ...solution }); }}>编辑</Button>
              <Button icon={<ExportOutlined />} onClick={() => handleExport('HTML')}>导出HTML</Button>
              <Button icon={<ExportOutlined />} onClick={() => handleExport('Word')}>导出Word</Button>
              <Button onClick={() => handleExport('Markdown')}>导出MD</Button>
            </>
          )}
        </Space>
      </div>

      {editMode ? (
        <>
          <Card title="基本信息" style={{ marginBottom: 16 }}>
            <Row gutter={24}>
              <Col span={8}>
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary">方案类型</Text>
                  <Tag color={editData.type === 'network' ? 'blue' : 'red'} style={{ marginLeft: 8 }}>
                    {editData.type === 'network' ? '网络建设' : '网络安全'}
                  </Tag>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary">方案名称 *</Text>
                  <Input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} style={{ marginTop: 4 }} />
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary">客户名称 *</Text>
                  <Input value={editData.customerName} onChange={(e) => setEditData({ ...editData, customerName: e.target.value })} style={{ marginTop: 4 }} />
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary">所属行业</Text>
                  <Select value={editData.industry || undefined} onChange={(v) => setEditData({ ...editData, industry: v })} style={{ width: '100%', marginTop: 4 }} allowClear>
                    {Object.entries(industries).map(([value, label]) => <Option key={value} value={value}>{label}</Option>)}
                  </Select>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary">项目规模</Text>
                  <Select value={editData.scale || undefined} onChange={(v) => setEditData({ ...editData, scale: v })} style={{ width: '100%', marginTop: 4 }} allowClear>
                    {Object.entries(scales).map(([value, label]) => <Option key={value} value={value}>{label}</Option>)}
                  </Select>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary">预算（万元）</Text>
                  <InputNumber value={editData.budget || undefined} onChange={(v) => setEditData({ ...editData, budget: v || 0 })} style={{ width: '100%', marginTop: 4 }} min={0} />
                </div>
              </Col>
            </Row>
          </Card>

          {editData.background !== undefined && (
            <Card title="项目背景" style={{ marginBottom: 16 }}>
              <TextArea value={editData.background} onChange={(e) => setEditData({ ...editData, background: e.target.value })} rows={4} />
            </Card>
          )}

          {editData.goals !== undefined && (
            <Card title="项目目标" style={{ marginBottom: 16 }}>
              <TextArea value={editData.goals} onChange={(e) => setEditData({ ...editData, goals: e.target.value })} rows={3} />
            </Card>
          )}

          <Card title="章节结构" style={{ marginBottom: 16 }} extra={<Button icon={<PlusOutlined />} onClick={handleAddChapter}>添加章节</Button>}>
            {editData.chapters && editData.chapters.map((chapter: any, index: number) => (
              <div key={chapter.id} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: `1px solid ${theme.colors.border}`, background: chapter.enabled ? theme.colors.bgContainer : theme.colors.bgLayout }}>
                <div style={{ width: 40, color: theme.colors.textTertiary }}>{chapter.order}</div>
                <div style={{ flex: 1 }}>
                  <Input value={chapter.title} onChange={(e) => { const newChapters = editData.chapters.map((c: any) => c.id === chapter.id ? { ...c, title: e.target.value } : c); setEditData({ ...editData, chapters: newChapters }); }} style={{ border: 'none', boxShadow: 'none', background: 'transparent' }} />
                </div>
                <Space>
                  <Button type="text" icon={<EditOutlined />} onClick={() => handleViewChapter(chapter)} style={{ color: theme.colors.primary }}>编辑</Button>
                  <Button type="text" icon={<UpOutlined />} disabled={index === 0} onClick={() => handleMoveChapter(index, 'up')} />
                  <Button type="text" icon={<DownOutlined />} disabled={index === editData.chapters.length - 1} onClick={() => handleMoveChapter(index, 'down')} />
                  <Switch checked={chapter.enabled} onChange={(checked) => { const newChapters = editData.chapters.map((c: any) => c.id === chapter.id ? { ...c, enabled: checked } : c); setEditData({ ...editData, chapters: newChapters }); }} size="small" />
                  <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteChapter(chapter.id)} />
                </Space>
              </div>
            ))}
          </Card>

          <Card title={`设备清单 (${editData.products?.length || 0}项)`} style={{ marginBottom: 16 }} extra={<Button icon={<PlusOutlined />} onClick={handleAddProduct}>添加设备</Button>}>
            <Table
              dataSource={editData.products || []}
              rowKey="id"
              pagination={false}
              columns={[
                { title: '类型', dataIndex: 'category', width: 120, render: (text: string, record: any) => (<Select value={text || undefined} onChange={(v) => handleUpdateProduct(record.id, 'category', v)} size="small" style={{ width: '100%' }}>{productCategories.map((cat) => <Option key={cat} value={cat}>{cat}</Option>)}</Select>) },
                { title: '品牌', dataIndex: 'brand', width: 100, render: (text: string, record: any) => (<Input value={text} onChange={(e) => handleUpdateProduct(record.id, 'brand', e.target.value)} size="small" />) },
                { title: '型号', dataIndex: 'model', width: 120, render: (text: string, record: any) => (<Input value={text} onChange={(e) => handleUpdateProduct(record.id, 'model', e.target.value)} size="small" />) },
                { title: '数量', dataIndex: 'quantity', width: 80, render: (text: number, record: any) => (<InputNumber value={text} onChange={(v) => handleUpdateProduct(record.id, 'quantity', v || 1)} min={1} size="small" style={{ width: '100%' }} />) },
                { title: '位置', dataIndex: 'location', render: (text: string, record: any) => (<Input value={text} onChange={(e) => handleUpdateProduct(record.id, 'location', e.target.value)} size="small" />) },
                { title: '备注', dataIndex: 'remark', render: (text: string, record: any) => (<Input value={text} onChange={(e) => handleUpdateProduct(record.id, 'remark', e.target.value)} size="small" />) },
                { title: '操作', width: 60, render: (_: any, record: any) => (<Button type="text" danger icon={<DeleteOutlined />} size="small" onClick={() => handleDeleteProduct(record.id)} />) },
              ]}
            />
          </Card>
        </>
      ) : (
        <>
          <Card title="基本信息" style={{ marginBottom: 16 }}>
            <Descriptions column={3} bordered>
              <Descriptions.Item label="方案类型"><Tag color={solution.type === 'network' ? 'blue' : 'red'}>{solution.type === 'network' ? '网络建设' : '网络安全'}</Tag></Descriptions.Item>
              <Descriptions.Item label="方案名称">{solution.name}</Descriptions.Item>
              <Descriptions.Item label="客户名称">{solution.customerName}</Descriptions.Item>
              <Descriptions.Item label="所属行业">{industries[solution.industry] || solution.industry || '-'}</Descriptions.Item>
              <Descriptions.Item label="项目规模">{scales[solution.scale] || solution.scale || '-'}</Descriptions.Item>
              <Descriptions.Item label="预算">{solution.budget ? `${solution.budget.toLocaleString()}万元` : '-'}</Descriptions.Item>
              {solution.protectionLevel && <Descriptions.Item label="等保级别">{protectionLevels[solution.protectionLevel] || solution.protectionLevel}</Descriptions.Item>}
              <Descriptions.Item label="状态"><Tag color={solution.status === 'completed' ? 'green' : 'orange'}>{solution.status === 'completed' ? '已完成' : '草稿'}</Tag></Descriptions.Item>
              <Descriptions.Item label="更新时间">{new Date(solution.updatedAt).toLocaleString()}</Descriptions.Item>
            </Descriptions>
          </Card>

          {solution.standards && solution.standards.length > 0 && (
            <Card title="参考标准" style={{ marginBottom: 16 }}>
              <Space wrap>{solution.standards.map((s: string) => <Tag key={s} color="blue">{s}</Tag>)}</Space>
            </Card>
          )}

          {solution.background && (
            <Card title="项目背景" style={{ marginBottom: 16 }}>
              <Paragraph style={{ whiteSpace: 'pre-wrap' }}>{solution.background}</Paragraph>
            </Card>
          )}

          {solution.goals && (
            <Card title="项目目标" style={{ marginBottom: 16 }}>
              <Paragraph style={{ whiteSpace: 'pre-wrap' }}>{solution.goals}</Paragraph>
            </Card>
          )}

          {solution.chapters && solution.chapters.filter((c: any) => c.enabled).length > 0 && (
            <Card title="章节结构" style={{ marginBottom: 16 }}>
              <Row gutter={[16, 8]}>
                {solution.chapters.filter((c: any) => c.enabled).map((c: any, i: number) => (
                  <Col key={c.id} span={8}>
                    <Card
                      size="small"
                      hoverable
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleViewChapter(c)}
                      title={<span style={{ color: theme.colors.primary }}>{i + 1}. {c.title}</span>}
                      extra={c.content ? <Tag color="green">已填写</Tag> : <Tag>未填写</Tag>}
                    >
                      {c.content ? (
                        <div
                          style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                          dangerouslySetInnerHTML={{ __html: renderPreview(c.content) }}
                        />
                      ) : (
                        <Text type="secondary" style={{ fontSize: 12 }}>点击查看详情</Text>
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
                  { title: '位置', dataIndex: 'location' },
                  { title: '备注', dataIndex: 'remark' },
                ]}
              />
            </Card>
          )}
        </>
      )}

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{selectedChapter?.title}</span>
            {editMode && <Tag color="orange">可编辑</Tag>}
          </div>
        }
        open={chapterModalOpen}
        onOk={editMode ? handleEditChapterContent : () => setChapterModalOpen(false)}
        onCancel={() => setChapterModalOpen(false)}
        width={800}
        okText={editMode ? '保存' : '关闭'}
        cancelText="取消"
      >
        {editMode && (
          <div style={{ marginBottom: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
            <Button size="small" icon={<PictureOutlined />} onClick={handleInsertImage}>插入图片</Button>
            <Button size="small" icon={<TableOutlined />} onClick={handleInsertTable}>插入表格</Button>
            <Text type="secondary" style={{ fontSize: 12 }}>支持插入本地图片和表格</Text>
          </div>
        )}
        {editMode ? (
          <TextArea
            ref={textareaRef}
            value={chapterContent}
            onChange={(e) => setChapterContent(e.target.value)}
            rows={20}
            style={{ fontSize: 14, lineHeight: 1.8 }}
          />
        ) : (
          <div
            style={{ lineHeight: 1.8, maxHeight: 500, overflow: 'auto', fontSize: 14, padding: '12px 16px' }}
            dangerouslySetInnerHTML={{
              __html: selectedChapter?.content
                ? renderPreview(selectedChapter.content)
                : '<span style="color:#999">暂无内容</span>'
            }}
          />
        )}
      </Modal>

      <Modal
        title="插入表格"
        open={tableModalOpen}
        onOk={handleConfirmInsertTable}
        onCancel={() => setTableModalOpen(false)}
        width={500}
        okText="插入"
        cancelText="取消"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <Text>表头（用逗号或空格分隔）:</Text>
            <Input
              value={tableHeadersInput}
              onChange={(e) => setTableHeadersInput(e.target.value)}
              placeholder="例如: 序号, 名称, 类型, 数量, 备注"
              style={{ marginTop: 4 }}
            />
          </div>
          <div>
            <Text>数据行数:</Text>
            <InputNumber
              value={tableRows}
              onChange={(v) => setTableRows(v || 3)}
              min={1}
              max={50}
              style={{ width: '100%', marginTop: 4 }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SolutionDetail;
