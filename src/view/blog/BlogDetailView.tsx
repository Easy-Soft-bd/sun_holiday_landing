
import BlogDetailHero from "./components/details/BlogDetailHero";
import BlogContent from "./components/details/BlogContent";
import { BlogPost } from "./data/blogData";

export default function BlogDetailView({ post }: { post: BlogPost }) {
    return (
        <main className="min-h-screen bg-base-200/40">
            <BlogDetailHero post={post} />
            <BlogContent post={post} />
        </main>
    );
}
