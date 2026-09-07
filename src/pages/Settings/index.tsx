import { Tabs, Card } from 'antd';
import { UserOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import UserManagement from './UserManagement';
import PlatformSettings from '@/components/PlatformSettings';

const Settings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Tabs
        items={[
          {
            key: 'users',
            label: <span><UserOutlined /> 用户管理</span>,
            children: <UserManagement />,
          },
          {
            key: 'platform',
            label: <span><SettingOutlined /> 平台设置</span>,
            children: <PlatformSettings />,
          },
        ]}
      />
    </div>
  );
};

export default Settings;
