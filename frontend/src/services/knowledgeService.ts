import { knowledge, primaryKnowledge } from "../data/knowledge";
import type {
  KnowledgeArticle,
  KnowledgeKind,
  KnowledgeLevel,
} from "../data/knowledge";

const searchableText = (article: KnowledgeArticle) =>
  [
    article.title,
    article.definition,
    article.category,
    article.overview,
    article.syntax,
    article.interviewNote,
    ...article.tags,
    ...article.keywords,
    ...article.methods.flatMap((method) => [
      method.name,
      method.purpose,
      method.syntax,
    ]),
  ]
    .join(" ")
    .toLowerCase();

export const knowledgeService = {
  all: () => knowledge,
  primary: () => primaryKnowledge,
  get: (id: string) => knowledge.find((article) => article.id === id),
  search(
    query: string,
    level?: KnowledgeLevel | "",
    kind?: KnowledgeKind | "",
  ) {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return knowledge
      .filter((article) => !level || article.level === level)
      .filter((article) => !kind || article.kind === kind)
      .map((article) => {
        const text = searchableText(article);
        const matches = terms.every((term) => text.includes(term));
        const exactTitle = article.title.toLowerCase() === query.toLowerCase();
        const titleStarts = article.title
          .toLowerCase()
          .startsWith(query.toLowerCase());
        return {
          article,
          matches,
          score: exactTitle ? 3 : titleStarts ? 2 : 1,
        };
      })
      .filter((entry) => !terms.length || entry.matches)
      .sort(
        (a, b) =>
          b.score - a.score || a.article.title.localeCompare(b.article.title),
      )
      .map((entry) => entry.article);
  },
  related(article: KnowledgeArticle) {
    return article.related
      .map((id) => knowledge.find((candidate) => candidate.id === id))
      .filter((item): item is KnowledgeArticle => Boolean(item));
  },
  adjacent(article: KnowledgeArticle) {
    const index = primaryKnowledge.findIndex((item) => item.id === article.id);
    if (index < 0) return { previous: undefined, next: undefined };
    return {
      previous: primaryKnowledge[index - 1],
      next: primaryKnowledge[index + 1],
    };
  },
};
