import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import Home from '@/pages/Home';
import Search from '@/pages/Search';
import SolutionList from '@/pages/Solution/List';
import SolutionCreate from '@/pages/Solution/Create';
import SolutionDetail from '@/pages/Solution/Detail';
import KnowledgeHome from '@/pages/Knowledge';
import KnowledgeCommon from '@/pages/Knowledge/Common';
import KnowledgeProducts from '@/pages/Knowledge/Products';
import KnowledgeCompetitors from '@/pages/Knowledge/Competitors';
import KnowledgeCases from '@/pages/Knowledge/Cases';
import KnowledgeStandards from '@/pages/Knowledge/Standards';
import KnowledgeCustom from '@/pages/Knowledge/Custom';
import SecuritySites from '@/pages/SecuritySites';
import Settings from '@/pages/Settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'search', element: <Search /> },
      {
        path: 'solution',
        children: [
          { index: true, element: <SolutionList /> },
          { path: 'create', element: <SolutionCreate /> },
          { path: 'edit/:id', element: <SolutionCreate /> },
          { path: ':id', element: <SolutionDetail /> },
        ],
      },
      {
        path: 'knowledge',
        children: [
          { index: true, element: <KnowledgeHome /> },
          { path: 'common', element: <KnowledgeCommon /> },
          { path: 'common/:type', element: <KnowledgeCommon /> },
          { path: 'products', element: <KnowledgeProducts /> },
          { path: 'competitors', element: <KnowledgeCompetitors /> },
          { path: 'cases', element: <KnowledgeCases /> },
          { path: 'standards', element: <KnowledgeStandards /> },
          { path: 'custom', element: <KnowledgeCustom /> },
        ],
      },
      {
        path: 'security-sites',
        element: <SecuritySites />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]);

export default router;
