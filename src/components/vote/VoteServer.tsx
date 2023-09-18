import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import VoteClient from "./VoteClient";

interface VoteServerProps {
  postId: string;
}

const VoteServer: React.FC<VoteServerProps> = async ({ postId }) => {
  const session = await getAuthSession();
  const votes = await prisma.vote.findMany({ where: { postId } });

  const userVote =
    votes.find(({ userId }) => userId === session?.user.id)?.type || null;
  const votesAmount = votes.reduce(
    (acc, { type }) => (type === "UP" ? acc + 1 : acc - 1),
    0,
  );

  return (
    <VoteClient
      id={postId}
      initialUserVote={userVote}
      initialVoteAmount={votesAmount}
      mutationUrl="/api/post-vote"
      className="flex-col"
    />
  );
};

export default VoteServer;
