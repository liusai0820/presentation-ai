export function PresentationHeader() {
  return (
    <div className="space-y-4 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
        <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="text-sm font-medium text-primary">AI 驱动</span>
      </div>
      <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
        快速创建精美
        <br />
        <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
          演示文稿
        </span>
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        上传文档或描述主题，AI 将其转化为专业的演示幻灯片
      </p>
    </div>
  );
}
