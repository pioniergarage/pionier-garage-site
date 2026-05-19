
import Grid from "./ui/Grid";
import type { PostData } from "./startups/types";
import PostCard from "./PostCard";

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