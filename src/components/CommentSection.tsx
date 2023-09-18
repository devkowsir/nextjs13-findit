import prisma from "@/lib/prisma";
import CommentsWrapper from "./CommentsWrapper";

interface CommentSectionProps {
  postId: string;
  userId: string | null;
  replyToId?: string;
}

const CommentSection: React.FC<CommentSectionProps> = async ({
  postId,
  userId,
}) => {
  const comments = await prisma.comment.findMany({
    where: { postId, replyToId: null },
    include: {
      author: true,
      votes: true,
      replies: { include: { author: true, votes: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <CommentsWrapper
      initialComments={comments}
      userId={userId}
      postId={postId}
    />
  );
};

export default CommentSection;
