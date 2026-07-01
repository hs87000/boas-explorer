import ToolCard from "./ToolCard";

export default function ResultsGrid({ results, ranks, compact, onOpen, onRankClick }) {
  const gridCols = compact ? "minmax(260px, 1fr)" : "minmax(312px, 1fr)";
  return (
    <section style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, ${gridCols})`, gap: 16 }} aria-label="Catalogue">
      {results.map((tool, i) => (
        <ToolCard
          key={tool.id}
          tool={tool}
          rank={ranks[tool.id]}
          index={i}
          onOpen={() => onOpen(tool.id)}
          onRankClick={(e) => onRankClick(tool.id, e)}
        />
      ))}
    </section>
  );
}
