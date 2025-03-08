import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center space-y-6">
        <div className="relative h-64 w-full">
          <img
            src="/not-found.png?height=250&width=400"
            alt="Sad pet"
            className="object-contain"
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">
            Oops! Looks like this page has run away like a dog without a leash.
          </p>
        </div>

        <Button asChild size="lg" className="mt-6">
          <Link to={{ pathname: "/feed" }}>Return to Feed</Link>
        </Button>
      </div>
    </div>
  );
}
