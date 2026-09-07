import type { Solution } from '@/types/solution';

export const exportToMarkdown = (solution: Solution): string => {
  const lines: string[] = [];

  lines.push(`# ${solution.name}`);
  lines.push('');
  lines.push('## 基本信息');
  lines.push('');
  lines.push(`- **客户名称**: ${solution.customerName}`);
  lines.push(`- **方案类型**: ${solution.type === 'network' ? '网络建设' : '网络安全'}`);
  lines.push(`- **所属行业**: ${solution.industry || '-'}`);
  lines.push(`- **项目规模**: ${solution.scale || '-'}`);
  if (solution.protectionLevel) {
    lines.push(`- **等保级别**: ${solution.protectionLevel}`);
  }
  if (solution.budget) {
    lines.push(`- **预算**: ${solution.budget}万元`);
  }
  lines.push('');

  if (solution.standards && solution.standards.length > 0) {
    lines.push('## 参考标准');
    lines.push('');
    solution.standards.forEach((s) => {
      lines.push(`- ${s}`);
    });
    lines.push('');
  }

  if (solution.background) {
    lines.push('## 项目背景');
    lines.push('');
    lines.push(solution.background);
    lines.push('');
  }

  if (solution.goals) {
    lines.push('## 项目目标');
    lines.push('');
    lines.push(solution.goals);
    lines.push('');
  }

  if (solution.chapters && solution.chapters.length > 0) {
    lines.push('## 章节结构');
    lines.push('');
    solution.chapters.filter(c => c.enabled).forEach((chapter, index) => {
      lines.push(`### ${index + 1}. ${chapter.title}`);
      lines.push('');
      lines.push('（待补充内容）');
      lines.push('');
    });
  }

  if (solution.products && solution.products.length > 0) {
    lines.push('## 设备清单');
    lines.push('');
    lines.push('| 类型 | 品牌 | 型号 | 数量 | 部署位置 |');
    lines.push('|------|------|------|------|----------|');
    solution.products.forEach((p) => {
      lines.push(`| ${p.type} | ${p.brand} | ${p.model} | ${p.quantity} | ${p.location || '-'} |`);
    });
    lines.push('');
  }

  lines.push('---');
  lines.push(`*导出时间: ${new Date().toLocaleString()}*`);

  return lines.join('\n');
};

export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportMarkdown = (solution: Solution) => {
  const content = exportToMarkdown(solution);
  downloadFile(content, `${solution.name || '方案'}.md`, 'text/markdown;charset=utf-8');
};

export const exportHtml = (solution: Solution) => {
  const md = exportToMarkdown(solution);
  const html = md
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');

  const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>${solution.name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8; }
    h1 { color: #1890ff; border-bottom: 2px solid #1890ff; padding-bottom: 8px; }
    h2 { color: #333; margin-top: 32px; }
    h3 { color: #666; }
    table { border-collapse: collapse; width: 100%; margin: 16px 0; }
    th, td { border: 1px solid #e6f7ff; padding: 8px 12px; text-align: left; }
    th { background: #f0f5ff; }
  </style>
</head>
<body>
${html}
</body>
</html>`;

  downloadFile(fullHtml, `${solution.name || '方案'}.html`, 'text/html;charset=utf-8');
};

export const printSolution = (solution: Solution) => {
  const md = exportToMarkdown(solution);
  const html = md
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${solution.name}</title>
        <style>
          body { font-family: -apple-system, sans-serif; padding: 40px; line-height: 1.8; }
          h1 { color: #1890ff; }
        </style>
      </head>
      <body>${html}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
};
