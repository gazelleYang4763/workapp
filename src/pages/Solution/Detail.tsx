import { Card, Empty } from 'antd';
import { useThemeStore } from '@/store/theme';

const SolutionDetail: React.FC = () => {
  const { theme } = useThemeStore();

  return (
    <Card style={{ borderRadius: 8 }}>
      <Empty description="方案详情页面开发中..." />
    </Card>
  );
};

export default SolutionDetail;
