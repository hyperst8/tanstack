import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="p-8">
      <h1 className="text-2xl text-center">About this app</h1>
      <p className="text-center mt-4">
        This is a simple app that demonstrates the use of TanStack Router with
        React.
      </p>
      <p className="text-center mt-4">
        This app uses TanStack Query to fetch data from an API and display it
        using Chart.js.
      </p>
    </div>
  );
}
