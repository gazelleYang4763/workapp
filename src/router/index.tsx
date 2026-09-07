import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import Home from '@/pages/Home';
import Search from '@/pages/Search';
import SolutionList from '@/pages/Solution/List';
import SolutionDetail from '@/pages/Solution/Detail';
import KnowledgeHome from '@/pages/Knowledge';

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
          { path: 'create', element: <SolutionDetail /> },
          { path: 'edit/:id', element: <SolutionDetail /> },
          { path: ':id', element: <SolutionDetail /> },
        ],
      },
      {
        path: 'knowledge',
        children: [
          { index: true, element: <KnowledgeHome /> },
          { path: ':type', element: <KnowledgeHome /> },
          { path: ':type/:id', element: <KnowledgeHome /> },
        ],
      },
      {
        path: 'security-sites',
        element: <KnowledgeHome />,
      },
    ],
  },
]);

export default router;
