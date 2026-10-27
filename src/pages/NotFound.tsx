import { Link } from "react-router-dom";
import SmartImage from "../components/SmartImage";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

export default function NotFound() {
  useDocumentMeta({
    title: "Page not found",
    description: "The page you are looking for does not exist on UXT.com.",
    path: "/404",
  });

  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-ink text-ivory">
      <div className="absolute inset-0 opacity-30">
        <SmartImage
          src="/images/editorial-3.webp"
          alt=""
          fallbackLabel="404"
        />
        <div className="absolute inset-0 bg-ink/60" />
      </div>
      <div className="uxt-container relative z-10 py-32">
        <p className="eyebrow text-accent">Error 404</p>
        <h1 className="display-lg mt-5 max-w-xl">THIS ROOM IS EMPTY.</h1>
        <p className="lead mt-6 max-w-md">
          The page you are looking for has moved, been renamed, or never
          existed. Let us guide you back to the collection.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link to="/" className="btn btn-solid">
            Return home
          </Link>
          <Link to="/shop" className="btn btn-outline-light">
            Browse the shop
          </Link>
        </div>
      </div>
    </section>
  );
}
