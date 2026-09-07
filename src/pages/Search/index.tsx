import { useState, useEffect } from 'react';
import { Input, Tabs, Card, Row, Col, Tag, Empty, Spin } from 'antd';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSolutionStore } from '@/store/solution';
import { useKnowledgeStore } from '@/store/knowledge';
import { useThemeStore } from '@/store/theme';

const { Search: SearchInput } = Input;

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const query = searchParams.get('q') || '';
  const [searchValue, setSearchValue] = useState(query);
  const { solutions } = useSolutionStore();
  const { products, competitors, cases, standards, knowledgeBases } = useKnowledgeStore();

  const [results, setResults] = useState({
    solutions: [] as any[],
    products: [] as any[],
    competitors: [] as any[],
    cases: [] as any[],
    standards: [] as any[],
    knowledgeBases: [] as any[],
  });

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      setResults({
        solutions: solutions.filter(s => s.name.toLowerCase().includes(lowerQuery) || s.customerName.toLowerCase().includes(lowerQuery)),
        products: products.filter(p => p.name.toLowerCase().includes(lowerQuery) || p.brand.toLowerCase().includes(lowerQuery)),
        competitors: competitors.filter(c => c.name.toLowerCase().includes(lowerQuery)),
        cases: cases.filter(c => c.name.toLowerCase().includes(lowerQuery)),
        standards: standards.filter(s => s.code.toLowerCase().includes(lowerQuery) || s.name.toLowerCase().includes(lowerQuery)),
        knowledgeBases: knowledgeBases.filter(kb => kb.name.toLowerCase().includes(lowerQuery)),
      });
      setLoading(false);
    }, 300);
  }, [query, solutions, products, competitors, cases, standards, knowledgeBases]);

  const handleSearch = (value: string) => {
    if (value.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(value)}`;
    }
  };

  const totalResults = Object.values(results).reduce((acc, arr) => acc + arr.length, 0);

  const renderResultCard = (type: string, item: any) => {
    const typeColors: Record<string, string> = {
      solution: '#1890ff', product: '#52c41a', competitor: '#faad14',
      case: '#722ed1', standard: '#eb2f96', knowledgeBase: '#13c2c2',
    };
    const typeLabels: Record<string, string> = {
      solution: '方案', product: '产品', competitor: '竞品',
      case: '案例', standard: '标准', knowledgeBase: '知识库',
    };

    return (
      <Card key={item.id} hoverable onClick={() => {
        if (type === 'solution') navigate(`/solution/${item.id}`);
        else navigate(`/knowledge/${type}s/${item.id}`);
      }} style={{ marginBottom: 16, borderRadius: 8 }}>
        <Tag color={typeColors[type]}>{typeLabels[type]}</Tag>
        <div style={{ fontSize: 16, fontWeight: 500, color: theme.colors.textPrimary, margin: '8px 0 4px' }}>
          {item.name || item.code}
        </div>
        <div style={{ fontSize: 14, color: theme.colors.textSecondary }}>
          {item.industry || item.brand || item.description || '-'}
        </div>
      </Card>
    );
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <div style={{ marginBottom: 32 }}>
        <SearchInput
          placeholder="搜索方案、知识库、产品、标准..."
          size="large"
          enterButton="搜索"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={handleSearch}
        />
      </div>

      <Spin spinning={loading}>
        {!query ? (
          <Empty description="请输入搜索关键词" />
        ) : totalResults === 0 ? (
          <Empty description={`未找到与"${query}"相关的结果`} />
        ) : (
          <>
            <div style={{ color: theme.colors.textSecondary, marginBottom: 16 }}>
              找到 {totalResults} 个结果
            </div>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <Tabs.TabPane tab={`全部 (${totalResults})`} key="all">
                <Row gutter={[16, 16]}>
                  {Object.entries(results).map(([type, items]) =>
                    items.map((item) => renderResultCard(type, item))
                  )}
                </Row>
              </Tabs.TabPane>
            </Tabs>
          </>
        )}
      </Spin>
    </div>
  );
};

export default Search;
