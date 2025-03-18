import { PostsList } from "../components/postsList";

export default function MyPosts() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-md mx-auto">
        <PostsList getOnlyPostsOfUser={true} />
      </div>
    </main>
  );
}
