import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Clock3, Search } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { primaryKnowledge } from "../../data/knowledge";
import type { KnowledgeKind, KnowledgeLevel } from "../../data/knowledge";
import { wordsToKnow } from "../../data/knowledge/plainLanguage";
import { knowledgeService } from "../../services/knowledgeService";
import { PageTitle } from "../ui";
import {
  BookmarkButton,
  CodeExample,
  KnowledgePractice,
  MethodCards,
  ReferenceTable,
} from "./KnowledgeComponents";

const levels: KnowledgeLevel[] = ["Beginner", "Intermediate", "Advanced"];
const kinds: KnowledgeKind[] = [
  "Concept",
  "Syntax",
  "Method",
  "Function",
  "Error",
  "OOP",
  "Data Structure",
  "Cheat Sheet",
];
const shelves = [
  ["Python Fundamentals", ["python-fundamentals", "variables", "operators"]],
  [
    "Data Structures",
    ["built-in-data-type-reference", "lists", "dictionaries"],
  ],
  ["Functions", ["functions", "scope", "recursion"]],
  ["OOP", ["oop", "classes-and-objects", "inheritance"]],
  ["Errors & Debugging", ["error-guide", "indexerror", "debugging"]],
  ["Built-in Functions", ["built-in-functions", "enumerate", "zip"]],
  ["Python Methods", ["list-methods", "string-methods", "dictionary-methods"]],
  [
    "Cheat Sheets",
    ["python-basics-cheat-sheet", "functions-cheat-sheet", "oop-cheat-sheet"],
  ],
] as const;

export function KnowledgeHubPage() {
  const { state } = useApp(),
    [query, setQuery] = useState(""),
    [level, setLevel] = useState<KnowledgeLevel | "">(""),
    [kind, setKind] = useState<KnowledgeKind | "">(""),
    results = useMemo(
      () => knowledgeService.search(query, level, kind),
      [query, level, kind],
    ),
    history = (state.knowledgeHistory || [])
      .map(knowledgeService.get)
      .filter(Boolean),
    bookmarked = state.bookmarks
      .map((item) => knowledgeService.get(item.id))
      .filter(Boolean),
    recommendedIds = state.selectedPath.includes("Interview")
      ? ["python-interview-concepts", "time-complexity", "oop"]
      : state.selectedPath.includes("Web")
        ? ["packages", "json", "exception-handling"]
        : ["python-fundamentals", "lists", "functions"],
    recommended = recommendedIds.map(knowledgeService.get).filter(Boolean),
    filtering = Boolean(query || level || kind);
  return (
    <div className="page">
      <PageTitle
        title="Knowledge Hub"
        subtitle={`${knowledgeService.all().length} detailed Python references, method guides, errors, and revision sheets.`}
      />
      <section className="card sticky top-16 z-10 grid gap-3 bg-white/95 backdrop-blur dark:bg-slate-900/95 lg:grid-cols-[1fr_180px_210px]">
        <label className="field flex items-center gap-2">
          <Search size={18} />
          <input
            className="w-full bg-transparent outline-none"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Python, append, IndexError, inheritance…"
            aria-label="Search Python references"
          />
        </label>
        <select
          className="field"
          value={level}
          onChange={(event) =>
            setLevel(event.target.value as KnowledgeLevel | "")
          }
          aria-label="Filter by difficulty"
        >
          <option value="">All levels</option>
          {levels.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select
          className="field"
          value={kind}
          onChange={(event) =>
            setKind(event.target.value as KnowledgeKind | "")
          }
          aria-label="Filter by reference type"
        >
          <option value="">All reference types</option>
          {kinds.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </section>

      {!filtering && (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            <Shelf
              title="Continue Reading"
              icon={<BookOpen size={18} />}
              items={history.slice(0, 3)}
              empty="Open an article and it will appear here."
            />
            <Shelf
              title="Recently Viewed"
              icon={<Clock3 size={18} />}
              items={history.slice(0, 3)}
              empty="Your reading history is empty."
            />
            <Shelf
              title="Bookmarked"
              items={bookmarked.slice(0, 3)}
              empty="Bookmark an article, method, error, or cheat sheet."
            />
          </div>
          <section>
            <h2 className="text-xl font-black">Popular Topics</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {shelves.map(([title, ids]) => (
                <div className="card" key={title}>
                  <h3 className="font-bold">{title}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {ids.map((id) => {
                      const item = knowledgeService.get(id);
                      return item ? (
                        <Link
                          className="badge hover:border-indigo-400"
                          to={`/knowledge/${item.id}`}
                          key={id}
                        >
                          {item.title}
                        </Link>
                      ) : null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <Shelf
            title="Recommended for You"
            items={recommended}
            empty="Complete onboarding to personalize references."
            horizontal
          />
        </>
      )}

      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-black">
              {filtering ? "Search results" : "Complete reference library"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {results.length} matching articles
            </p>
          </div>
          {filtering && (
            <button
              className="btn-secondary"
              onClick={() => {
                setQuery("");
                setLevel("");
                setKind("");
              }}
            >
              Clear filters
            </button>
          )}
        </div>
        {results.length ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {results.map((item) => (
              <ArticleCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="card mt-4">
            <h3 className="font-bold">No references matched</h3>
            <p className="mt-2 text-slate-500">
              Try a method name, exception, concept, or remove one filter.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export function KnowledgeArticlePage() {
  const { topic = "" } = useParams(),
    { state, update, bookmark } = useApp(),
    item = knowledgeService.get(topic);
  useEffect(() => {
    if (!item) return;
    update((current) => ({
      ...current,
      knowledgeHistory: [
        item.id,
        ...(current.knowledgeHistory || []).filter((id) => id !== item.id),
      ].slice(0, 12),
    }));
  }, [item?.id]);
  if (!item)
    return (
      <div className="page">
        <PageTitle
          title="Reference not found"
          subtitle="This Knowledge Hub article does not exist."
        />
        <Link className="btn-primary" to="/knowledge">
          Return to Knowledge Hub
        </Link>
      </div>
    );
  const related = knowledgeService.related(item),
    { previous, next } = knowledgeService.adjacent(item),
    simpleWords = wordsToKnow(item),
    active = state.bookmarks.some(
      (entry) => entry.id === item.id && entry.kind.startsWith("Knowledge"),
    );
  const toc = [
    "overview",
    "why-used",
    "syntax",
    "example",
    "rules",
    "operations",
    ...(item.methods.length ? ["methods"] : []),
    "mistakes",
    "best-practices",
    "real-world",
    "quick-reference",
    "interview-note",
    "practice",
  ];
  return (
    <article className="page max-w-7xl">
      <Link
        className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600"
        to="/knowledge"
      >
        <ArrowLeft size={16} />
        Knowledge Hub
      </Link>
      <PageTitle title={item.title} subtitle={item.definition} />
      <div className="flex flex-wrap gap-2">
        <span className="badge">{item.level}</span>
        <span className="badge">{item.kind}</span>
        <span className="badge">{item.category}</span>
        <BookmarkButton
          article={item}
          active={active}
          onToggle={() =>
            bookmark({
              kind: `Knowledge ${item.kind}`,
              id: item.id,
              title: item.title,
              path: `/knowledge/${item.id}`,
            })
          }
        />
      </div>
      <div className="grid gap-5 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="card h-fit lg:sticky lg:top-24">
          <h2 className="font-bold">On this page</h2>
          <nav className="mt-3 grid gap-1 text-sm">
            {toc.map((anchor) => (
              <a
                className="rounded-lg px-2 py-1.5 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-indigo-950"
                href={`#${anchor}`}
                key={anchor}
              >
                {label(anchor)}
              </a>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 space-y-5">
          <Section id="overview" title="Overview">
            <p>{item.overview}</p>
            {simpleWords.length > 0 && (
              <div className="mt-5 rounded-xl bg-indigo-50 p-4 dark:bg-indigo-950/40">
                <h3 className="font-bold text-indigo-900 dark:text-indigo-100">
                  Words to know
                </h3>
                <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                  {simpleWords.map(({ word, meaning }) => (
                    <div key={word}>
                      <dt className="font-mono text-sm font-bold text-indigo-700 dark:text-indigo-300">
                        {word}
                      </dt>
                      <dd className="text-sm">{meaning}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              {item.howItWorks.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </Section>
          <Section id="why-used" title="Why it is used">
            <p>{item.whyUsed}</p>
          </Section>
          <Section id="syntax" title="Syntax">
            <CodeExample code={item.syntax} title="Syntax" />
          </Section>
          <Section id="example" title="Basic example">
            <CodeExample code={item.example} title={`${item.title} example`} />
            <h3 className="mt-5 font-bold">Expected output</h3>
            <pre className="mt-2">
              <code>{item.output}</code>
            </pre>
            <h3 className="mt-5 font-bold">How it works</h3>
            <ol className="mt-2 list-decimal space-y-2 pl-5">
              {item.howItWorks.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </Section>
          <Section id="rules" title="Important rules">
            <BulletList items={item.rules} />
          </Section>
          <Section id="operations" title="Common operations">
            <ReferenceTable rows={item.operations} />
            {!item.operations.length && <BulletList items={item.howItWorks} />}
          </Section>
          {item.methods.length > 0 && (
            <Section id="methods" title="Methods / functions">
              <MethodCards methods={item.methods} />
            </Section>
          )}
          <div className="grid gap-5 md:grid-cols-2">
            <Section id="mistakes" title="Common mistakes" tone="amber">
              <BulletList items={item.mistakes} />
            </Section>
            <Section id="best-practices" title="Best practices" tone="emerald">
              <BulletList items={item.bestPractices} />
            </Section>
          </div>
          <Section id="real-world" title="Real-world use">
            <p>{item.realWorld}</p>
          </Section>
          <Section id="quick-reference" title="Quick reference">
            <ReferenceTable rows={item.quickReference} />
          </Section>
          <Section
            id="interview-note"
            title="Interview / exam note"
            tone="indigo"
          >
            <p>{item.interviewNote}</p>
          </Section>
          <KnowledgePractice article={item} />
          {related.length > 0 && (
            <section className="card">
              <h2 className="font-bold">Related topics</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {related.map((relatedItem) => (
                  <Link
                    className="btn-secondary"
                    to={`/knowledge/${relatedItem.id}`}
                    key={relatedItem.id}
                  >
                    {relatedItem.title}
                  </Link>
                ))}
              </div>
            </section>
          )}
          <nav className="grid gap-3 sm:grid-cols-2">
            {previous ? (
              <Link
                className="card flex items-center gap-3 hover:border-indigo-400"
                to={`/knowledge/${previous.id}`}
              >
                <ArrowLeft />
                <span>
                  <small className="text-slate-500">Previous topic</small>
                  <b className="block">{previous.title}</b>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                className="card flex items-center justify-end gap-3 text-right hover:border-indigo-400"
                to={`/knowledge/${next.id}`}
              >
                <span>
                  <small className="text-slate-500">Next topic</small>
                  <b className="block">{next.title}</b>
                </span>
                <ArrowRight />
              </Link>
            )}
          </nav>
          <div className="flex flex-wrap gap-2">
            <Link
              className="btn-primary"
              to={`/practice/${encodeURIComponent(item.title)}`}
            >
              Practice this topic
            </Link>
            <Link
              className="btn-secondary"
              to={`/playground?code=${encodeURIComponent(item.example)}`}
            >
              Open in Playground
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function ArticleCard({
  item,
}: {
  item: ReturnType<typeof knowledgeService.all>[number];
}) {
  return (
    <Link
      className="card group hover:border-indigo-400"
      to={`/knowledge/${item.id}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="badge">{item.kind}</span>
        <span className="text-xs text-slate-500">{item.level}</span>
      </div>
      <h3 className="mt-3 font-bold group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
        {item.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{item.definition}</p>
      <p className="mt-3 text-xs font-semibold text-indigo-600">
        {item.category}
      </p>
    </Link>
  );
}
function Shelf({
  title,
  items,
  empty,
  icon,
  horizontal = false,
}: {
  title: string;
  items: any[];
  empty: string;
  icon?: React.ReactNode;
  horizontal?: boolean;
}) {
  return (
    <section className={horizontal ? "" : "card"}>
      <h2 className="flex items-center gap-2 font-black">
        {icon}
        {title}
      </h2>
      {items.length ? (
        <div
          className={`mt-3 grid gap-2 ${horizontal ? "sm:grid-cols-3" : ""}`}
        >
          {items.map((item) => (
            <ArticleCard item={item} key={item.id} />
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-500">{empty}</p>
      )}
    </section>
  );
}
function Section({
  id,
  title,
  children,
  tone,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  tone?: "amber" | "emerald" | "indigo";
}) {
  const color =
    tone === "amber"
      ? "border-amber-200 dark:border-amber-900"
      : tone === "emerald"
        ? "border-emerald-200 dark:border-emerald-900"
        : tone === "indigo"
          ? "border-indigo-200 dark:border-indigo-900"
          : "";
  return (
    <section id={id} className={`card scroll-mt-24 ${color}`}>
      <h2 className="mb-4 text-xl font-black">{title}</h2>
      <div className="leading-7 text-slate-700 dark:text-slate-200">
        {children}
      </div>
    </section>
  );
}
function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
const label = (value: string) =>
  value
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
