
import BlogDetailHero from "./components/details/BlogDetailHero";
import BlogContent from "./components/details/BlogContent";
import { BlogPost } from "./data/blogData";

export default function BlogDetailView({ post }: { post: BlogPost }) {
    return (
        <main className="bg-base-100 min-h-screen">
            <BlogDetailHero post={post} />
            <BlogContent post={post} />
        </main>
    );
}
