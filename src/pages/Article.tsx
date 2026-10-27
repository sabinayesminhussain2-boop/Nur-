import { Link, useParams } from "react-router-dom";
import { ARTICLES, getArticle, type ArticleBlock } from "../data/journal";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import SmartImage from "../components/SmartImage";
import Reveal from "../components/Reveal";
import { Breadcrumbs } from "../components/PageHero";
import NotFound from "./NotFound";

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "heading":
      return <h2>{block.text}</h2>;
    case "list":
      return (
        <ul>
          {block.items?.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "quote":
      return <blockquote>{block.text}</blockquote>;
    default:
      return <p>{block.text}</p>;
  }
}

export default function Article() {
  const { slug } = useParams();
  const article = slug ? getArticle(slug) : undefined;

  useDocumentMeta({
    title: article?.title ?? "Article not found",
    description: article?.intro ?? "UXT design journal article",
    path: article ? `/journal/${article.slug}` : "/journal",
    image: article?.cover,
  });

  if (!article) return <NotFound />;

  const related = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);
  const idx = ARTICLES.findIndex((a) => a.slug === article.slug);

  return (
    <article className="bg-ivory text-ink">
      {/* Hero */}
      <header className="uxt-container pt-32 md:pt-40">
        <Breadcrumbs
          dark
          items={[
            { label: "Journal", to: "/journal" },
            { label: article.title },
          ]}
        />
        <div className="mt-8 max-w-3xl">
          <p className="eyebrow text-taupe">
            {article.category} · {article.readingTime} · {article.date}
          </p>
          <h1 className="display-lg mt-5">{article.title}</h1>
          <p className="lead mt-6 text-ink/65">{article.intro}</p>
        </div>
      </header>

      <div className="uxt-container mt-12">
        <div className="img-frame aspect-[16/8] w-full">
          <SmartImage
            src={article.cover}
            alt={article.title}
            fallbackLabel={article.title}
            loading="eager"
          />
        </div>
      </div>

      {/* Readable content column */}
      <div className="uxt-container py-16 md:py-24">
        <Reveal className="mx-auto max-w-2xl">
          <p className="eyebrow mb-8 text-taupe">
            Article 0{idx + 1} — {article.category}
          </p>
          <div className="prose-uxt">
            {article.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>

          <div className="mt-14 border-t border-ink/10 pt-8">
            <Link to="/journal" className="link-arrow">
              <span className="arrow">←</span> Back to the journal
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Related */}
      <section className="bg-mist/60">
        <div className="uxt-container py-20">
          <h2 className="display-md text-ink">CONTINUE READING.</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
            {related.map((a, i) => (
              <Reveal key={a.slug} delay={i * 100}>
                <Link to={`/journal/${a.slug}`} className="group block">
                  <div className="img-frame aspect-[4/3]">
                    <SmartImage
                      src={a.cover}
                      alt={a.title}
                      fallbackLabel={a.title}
                    />
                  </div>
                  <p className="eyebrow mt-5 text-taupe">
                    {a.category} · {a.readingTime}
                  </p>
                  <h3 className="mt-3 font-serif text-2xl leading-snug transition-opacity group-hover:opacity-75">
                    {a.title}
                  </h3>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
