import ToolCard from "./ToolCard";

export default function ResultsGrid({ results, votes, onVote, onTierClick, canEditTier, compact, onOpen }) {
  const gridCols = compact ? "minmax(260px, 1fr)" : "minmax(312px, 1fr)";
  return (
    <section style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, ${gridCols})`, gap: 16 }} aria-label="Catalogue">
      {results.map((tool, i) => (
        <ToolCard
          key={tool.id}
          tool={tool}
          vote={votes[tool.id]}
          onVote={onVote}
          onTierClick={onTierClick}
          canEditTier={canEditTier}
          index={i}
          onOpen={() => onOpen(tool.id)}
        />
      ))}
    </section>
  );
}
