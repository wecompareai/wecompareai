interface CommentItemProps {
  comment: {
    id: string;
    content: string;
    createdAt: Date | string;
    author: {
      id: string;
      name: string;
      avatar: string | null;
    };
  };
  canDelete: boolean;
  onDelete: () => void;
}

export default function CommentItem({
  comment,
  canDelete,
  onDelete,
}: CommentItemProps) {
  const date = new Date(comment.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="p-4 rounded-xl border border-border bg-background">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-medium text-xs">
              {comment.author.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-medium text-foreground">
            {comment.author.name}
          </span>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
        {canDelete && (
          <button
            onClick={onDelete}
            className="text-xs text-muted-foreground hover:text-red-500 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
      <p className="text-sm text-foreground leading-relaxed">
        {comment.content}
      </p>
    </div>
  );
}
