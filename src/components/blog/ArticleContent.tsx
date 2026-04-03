export default function ArticleContent({ content }: { content: string }) {
  return (
    <div
      className="article-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
