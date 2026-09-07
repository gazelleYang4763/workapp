import { useState, useRef } from 'react';
import { Button, Space, Divider, Tooltip, Input } from 'antd';
import {
  BoldOutlined, ItalicOutlined, UnderlineOutlined, StrikethroughOutlined,
  OrderedListOutlined, UnorderedListOutlined, LinkOutlined, PictureOutlined,
  CodeOutlined, FileTextOutlined, EyeOutlined, EditOutlined,
} from '@ant-design/icons';
import { useThemeStore } from '@/store/theme';

const { TextArea } = Input;

export interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: number;
  readOnly?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = '请输入内容...',
  height = 400,
  readOnly = false,
}) => {
  const { theme } = useThemeStore();
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<any>(null);

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current?.resizableTextArea?.textArea;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end);
    onChange?.(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const handleInsertLink = () => {
    const url = prompt('请输入链接URL:', 'https://');
    if (url) {
      const text = prompt('请输入链接文本:', url);
      insertMarkdown(`[${text || url}](`, `${url})`);
    }
  };

  const handleInsertImage = () => {
    const url = prompt('请输入图片URL:', 'https://');
    if (url) {
      const alt = prompt('请输入图片描述:', '图片');
      insertMarkdown(`![${alt || 'image}](`, `${url})`);
    }
  };

  const renderPreview = (text: string) => {
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/__(.*?)__/g, '<u>$1</u>')
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width:100%"/>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
      .replace(/\n/g, '<br/>');

    return html;
  };

  return (
    <div style={{ border: `1px solid ${theme.colors.border}`, borderRadius: 8, overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 12px',
          background: theme.colors.bgLayout,
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <Space>
          <Tooltip title="加粗"><Button size="small" icon={<BoldOutlined />} onClick={() => insertMarkdown('**', '**')} disabled={readOnly} /></Tooltip>
          <Tooltip title="斜体"><Button size="small" icon={<ItalicOutlined />} onClick={() => insertMarkdown('*', '*')} disabled={readOnly} /></Tooltip>
          <Tooltip title="下划线"><Button size="small" icon={<UnderlineOutlined />} onClick={() => insertMarkdown('__', '__')} disabled={readOnly} /></Tooltip>
          <Tooltip title="删除线"><Button size="small" icon={<StrikethroughOutlined />} onClick={() => insertMarkdown('~~', '~~')} disabled={readOnly} /></Tooltip>
          <Divider type="vertical" />
          <Tooltip title="有序列表"><Button size="small" icon={<OrderedListOutlined />} onClick={() => insertMarkdown('1. ')} disabled={readOnly} /></Tooltip>
          <Tooltip title="无序列表"><Button size="small" icon={<UnorderedListOutlined />} onClick={() => insertMarkdown('- ')} disabled={readOnly} /></Tooltip>
          <Divider type="vertical" />
          <Tooltip title="插入链接"><Button size="small" icon={<LinkOutlined />} onClick={handleInsertLink} disabled={readOnly} /></Tooltip>
          <Tooltip title="插入图片"><Button size="small" icon={<PictureOutlined />} onClick={handleInsertImage} disabled={readOnly} /></Tooltip>
          <Tooltip title="代码"><Button size="small" icon={<CodeOutlined />} onClick={() => insertMarkdown('`', '`')} disabled={readOnly} /></Tooltip>
        </Space>
        <Space>
          <Button
            size="small"
            type={mode === 'edit' ? 'primary' : 'default'}
            icon={<EditOutlined />}
            onClick={() => setMode('edit')}
          >
            编辑
          </Button>
          <Button
            size="small"
            type={mode === 'preview' ? 'primary' : 'default'}
            icon={<EyeOutlined />}
            onClick={() => setMode('preview')}
          >
            预览
          </Button>
        </Space>
      </div>

      <div style={{ minHeight: height }}>
        {mode === 'edit' ? (
          <TextArea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            style={{
              border: 'none',
              borderRadius: 0,
              resize: 'none',
              height,
              fontSize: 14,
              lineHeight: 1.8,
            }}
            readOnly={readOnly}
          />
        ) : (
          <div
            style={{
              padding: '12px 16px',
              height,
              overflow: 'auto',
              lineHeight: 1.8,
              fontSize: 14,
            }}
            dangerouslySetInnerHTML={{ __html: renderPreview(value) || '<span style="color:#999">暂无内容</span>' }}
          />
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;
