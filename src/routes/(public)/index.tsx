import { createFileRoute } from '@tanstack/react-router';
import { ExamStartForm } from '@/components/ExamStartForm';
import { seo } from '@/lib/seo';

export const Route = createFileRoute('/(public)/')({
  component: Home,
  head: () => {
    const seoData = seo({
      title: 'Luyện Tập Làm Đề',
      description: 'Nhập thông tin của bạn để bắt đầu làm bài',
    });

    return {
      meta: seoData.meta,
      links: seoData.links,
    };
  },
});

function Home() {
  return (
    <div className="flex min-h-screen justify-center">
      <div className="w-full max-w-2xl px-4">
        <div className="mb-8 text-center">
          <h1 className="font-bold text-4xl tracking-tight">
            Luyện Tập Làm Đề
          </h1>
          <p className="mt-2 text-muted-foreground">
            Nhập thông tin của bạn để bắt đầu làm bài.
          </p>
        </div>
        <ExamStartForm />
      </div>
    </div>
  );
}
