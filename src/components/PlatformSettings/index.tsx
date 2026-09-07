import { useState } from 'react';
import { Card, Input, Button, Upload, Space, Typography, message, Divider } from 'antd';
import { UploadOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { usePlatformStore } from '@/store/platform';
import { useThemeStore } from '@/store/theme';

const { Title, Text } = Typography;

const PlatformSettings: React.FC = () => {
  const { theme } = useThemeStore();
  const { platformName, logoUrl, setPlatformName, setLogoUrl } = usePlatformStore();
  const [name, setName] = useState(platformName);
  const [logo, setLogo] = useState(logoUrl);

  const handleSave = () => {
    setPlatformName(name);
    setLogoUrl(logo);
    message.success('设置已保存');
  };

  const handleReset = () => {
    setName('工作台');
    setLogo('');
  };

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogo(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    return false;
  };

  return (
    <Card title="平台设置" style={{ maxWidth: 600 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={5}>平台名称</Title>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="请输入平台名称"
          maxLength={20}
        />
        <Text type="secondary" style={{ fontSize: 12 }}>显示在首页和侧边栏顶部</Text>
      </div>

      <div style={{ marginBottom: 24 }}>
        <Title level={5}>平台Logo</Title>
        <Space>
          {logo && (
            <div style={{
              width: 64,
              height: 64,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <img src={logo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            </div>
          )}
          <Upload
            beforeUpload={handleLogoUpload}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>上传Logo</Button>
          </Upload>
          {logo && (
            <Button onClick={() => setLogo('')}>移除</Button>
          )}
        </Space>
        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
          建议尺寸：64x64px 或 128x128px，支持 PNG/JPG/SVG
        </Text>
      </div>

      <Divider />

      <div style={{ marginBottom: 16 }}>
        <Title level={5}>预览</Title>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: 16,
          background: theme.colors.bgLayout,
          borderRadius: 8,
        }}>
          {logo ? (
            <img src={logo} alt="Logo" style={{ width: 32, height: 32 }} />
          ) : (
            <div style={{
              width: 32,
              height: 32,
              background: theme.colors.primary,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 18,
            }}>
              📋
            </div>
          )}
          <Text strong style={{ fontSize: 16 }}>{name}</Text>
        </div>
      </div>

      <Space>
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>保存</Button>
        <Button icon={<UndoOutlined />} onClick={handleReset}>重置默认</Button>
      </Space>
    </Card>
  );
};

export default PlatformSettings;
