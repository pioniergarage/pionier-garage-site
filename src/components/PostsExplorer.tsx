
import Grid from "./ui/Grid";
import PostCard from "./PostCard";
import type { PostData } from "./posts/types";

interface Props {
    posts: PostData[]
}

export default function PostExplorer({ posts }: Props) {
    return (
        <Grid
            items={posts}
            keyExtractor={(post) => post.id}
            card={(post) => <PostCard data={post} />}
        />
    );
}