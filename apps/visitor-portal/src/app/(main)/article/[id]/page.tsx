'use client';

import { ArticleDetailPage } from '@/components/article/ArticleDetailPage';
import { use } from 'react';

interface ArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const { id } = use(params);
  return <ArticleDetailPage articleId={id} />;
}
