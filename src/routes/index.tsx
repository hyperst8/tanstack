import { createFileRoute, Link } from "@tanstack/react-router";
import { homepageLinks } from "../data/menuLinks";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-incl-header flex flex-col items-center justify-center">
      <h1 className="text-2xl">Welcome!</h1>
      <div className="flex flex-col gap-2 my-4 p-4 border rounded-md shadow-md bg-transparent">
        {homepageLinks.map((link, index) => (
          <Link
            key={index}
            to={link.url}
            className="home-links text-white bg-green-500"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
