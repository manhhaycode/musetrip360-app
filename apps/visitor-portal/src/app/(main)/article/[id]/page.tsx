'use client';

import { ArticleDetailPage } from '@/components/article/ArticleDetailPage';

interface ArticlePageProps {
  params: {
    id: string;
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  return <ArticleDetailPage articleId={params.id} />;
}
