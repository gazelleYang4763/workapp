import type { Solution } from '@/types/solution';

const renderMarkdownToHtml = (text: string): string => {
  if (!text) return '';
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
    const rows = match.trim().split('\n').filter((r: string) => r.trim());
    if (rows.length < 2) return match;
    const headerCells = rows[0].split('|').filter((c: string) => c.trim() !== '');
    const isSeparator = (row: string) => row.split('|').filter((c: string) => c.trim() !== '').every((c: string) => /^[\s\-:]+$/.test(c));
    if (rows.length >= 2 && isSeparator(rows[1])) {
      const bodyRows = rows.slice(2);
      let table = '<table style="border-collapse:collapse;width:100%;margin:12px 0"><thead><tr>';
      headerCells.forEach((cell: string) => {
        table += `<th style="border:1px solid #d9d9d9;padding:8px 12px;background:#f0f5ff;font-weight:600;text-align:left">${cell.trim()}</th>`;
      });
      table += '</tr></thead><tbody>';
      bodyRows.forEach((row: string) => {
        const cells = row.split('|').filter((c: string) => c.trim() !== '');
        table += '<tr>';
        cells.forEach((cell: string) => {
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
    solution.chapters.filter(c => c.enabled).forEach((chapter, index) => {
      lines.push(`## ${index + 1}. ${chapter.title}`);
      lines.push('');
      if (chapter.content) {
        lines.push(chapter.content);
      } else {
        lines.push('（待补充内容）');
      }
      lines.push('');
    });
  }

  if (solution.products && solution.products.length > 0) {
    lines.push('## 设备清单');
    lines.push('');
    lines.push('| 类型 | 品牌 | 型号 | 数量 | 部署位置 |');
    lines.push('|------|------|------|------|----------|');
    solution.products.forEach((p: any) => {
      lines.push(`| ${p.category || p.type || '-'} | ${p.brand || '-'} | ${p.model || '-'} | ${p.quantity || 1} | ${p.location || '-'} |`);
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

const getFullHtml = (solution: Solution, bodyContent: string): string => {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${solution.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
      max-width: 900px;
      margin: 0 auto;
      padding: 40px;
      line-height: 1.8;
      color: #333;
      background: #fff;
    }
    h1 { color: #1890ff; border-bottom: 3px solid #1890ff; padding-bottom: 12px; margin-bottom: 24px; font-size: 28px; }
    h2 { color: #1890ff; margin-top: 32px; margin-bottom: 16px; font-size: 20px; border-left: 4px solid #1890ff; padding-left: 12px; }
    h3 { color: #333; margin-top: 24px; margin-bottom: 12px; font-size: 16px; }
    p { margin-bottom: 12px; }
    table { border-collapse: collapse; width: 100%; margin: 16px 0; }
    th, td { border: 1px solid #d9d9d9; padding: 10px 14px; text-align: left; }
    th { background: #f0f5ff; font-weight: 600; color: #1890ff; }
    tr:nth-child(even) { background: #fafafa; }
    img { max-width: 100%; border-radius: 6px; margin: 8px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    blockquote { border-left: 4px solid #1890ff; padding-left: 16px; color: #666; margin: 12px 0; background: #f0f5ff; padding: 12px 16px; border-radius: 0 4px 4px 0; }
    code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; }
    ul, ol { padding-left: 24px; margin: 8px 0; }
    li { margin-bottom: 4px; }
    .meta-info { background: #f0f5ff; padding: 20px; border-radius: 8px; margin-bottom: 24px; }
    .meta-info p { margin-bottom: 4px; }
    .meta-info strong { color: #1890ff; }
    hr { border: none; border-top: 1px solid #e6f7ff; margin: 24px 0; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e6f7ff; }
    @media print {
      body { padding: 20px; }
      h1 { page-break-after: avoid; }
      h2 { page-break-after: avoid; }
      table { page-break-inside: avoid; }
      img { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
${bodyContent}
</body>
</html>`;
};

const buildBodyContent = (solution: Solution): string => {
  let body = '';

  body += `<h1>${solution.name}</h1>`;

  body += '<div class="meta-info">';
  body += `<p><strong>客户名称：</strong>${solution.customerName}</p>`;
  body += `<p><strong>方案类型：</strong>${solution.type === 'network' ? '网络建设' : '网络安全'}</p>`;
  if (solution.industry) body += `<p><strong>所属行业：</strong>${solution.industry}</p>`;
  if (solution.scale) body += `<p><strong>项目规模：</strong>${solution.scale}</p>`;
  if (solution.protectionLevel) body += `<p><strong>等保级别：</strong>${solution.protectionLevel}</p>`;
  if (solution.budget) body += `<p><strong>预算：</strong>${solution.budget}万元</p>`;
  body += '</div>';

  if (solution.standards && solution.standards.length > 0) {
    body += '<h2>参考标准</h2><ul>';
    solution.standards.forEach(s => { body += `<li>${s}</li>`; });
    body += '</ul>';
  }

  if (solution.background) {
    body += '<h2>项目背景</h2>';
    body += `<p>${solution.background.replace(/\n/g, '</p><p>')}</p>`;
  }

  if (solution.goals) {
    body += '<h2>项目目标</h2>';
    body += `<p>${solution.goals.replace(/\n/g, '</p><p>')}</p>`;
  }

  if (solution.chapters && solution.chapters.length > 0) {
    solution.chapters.filter(c => c.enabled).forEach((chapter, index) => {
      body += `<h2>${index + 1}. ${chapter.title}</h2>`;
      if (chapter.content) {
        body += renderMarkdownToHtml(chapter.content);
      } else {
        body += '<p style="color:#999">（待补充内容）</p>';
      }
    });
  }

  if (solution.products && solution.products.length > 0) {
    body += '<h2>设备清单</h2>';
    body += '<table><thead><tr><th>类型</th><th>品牌</th><th>型号</th><th>数量</th><th>部署位置</th></tr></thead><tbody>';
    solution.products.forEach((p: any) => {
      body += `<tr><td>${p.category || p.type || '-'}</td><td>${p.brand || '-'}</td><td>${p.model || '-'}</td><td>${p.quantity || 1}</td><td>${p.location || '-'}</td></tr>`;
    });
    body += '</tbody></table>';
  }

  body += `<div class="footer">导出时间: ${new Date().toLocaleString()}</div>`;

  return body;
};

export const exportHtml = (solution: Solution) => {
  const bodyContent = buildBodyContent(solution);
  const fullHtml = getFullHtml(solution, bodyContent);
  downloadFile(fullHtml, `${solution.name || '方案'}.html`, 'text/html;charset=utf-8');
};

export const exportWord = (solution: Solution) => {
  const bodyContent = buildBodyContent(solution);
  const html = getFullHtml(solution, bodyContent);

  const wordContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office'
      xmlns:w='urn:schemas-microsoft-com:office:word'
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${solution.name}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    body { font-family: 'Microsoft YaHei', sans-serif; line-height: 1.8; color: #333; }
    h1 { color: #1890ff; border-bottom: 3px solid #1890ff; padding-bottom: 12px; margin-bottom: 24px; font-size: 28px; }
    h2 { color: #1890ff; margin-top: 32px; margin-bottom: 16px; font-size: 20px; border-left: 4px solid #1890ff; padding-left: 12px; }
    h3 { color: #333; margin-top: 24px; margin-bottom: 12px; font-size: 16px; }
    table { border-collapse: collapse; width: 100%; margin: 16px 0; }
    th, td { border: 1px solid #d9d9d9; padding: 8px 12px; text-align: left; }
    th { background: #f0f5ff; font-weight: bold; }
    img { max-width: 100%; }
    blockquote { border-left: 4px solid #1890ff; padding-left: 16px; color: #666; margin: 12px 0; }
    .meta-info { background: #f0f5ff; padding: 16px; margin-bottom: 20px; }
    .meta-info p { margin-bottom: 4px; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #e6f7ff; padding-top: 16px; }
  </style>
</head>
<body>
${bodyContent}
</body>
</html>`;

  downloadFile(wordContent, `${solution.name || '方案'}.doc`, 'application/msword');
};
