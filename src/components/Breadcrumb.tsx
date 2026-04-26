import type { BreadcrumbNode, NavigationActions } from '../types/navigation';

interface BreadcrumbProps {
  trail: BreadcrumbNode[];
  onNavigate: NavigationActions;
}

export const Breadcrumb = ({ trail, onNavigate }: BreadcrumbProps) => {
  if (trail.length <= 1) {
    return null; // no breadcrumb at root level
  }

  return (
    <div className="sticky top-16 z-40 border-b border-[color:var(--border)] bg-[color:var(--surface)]/95 backdrop-blur">
      <div className="app-container h-auto flex items-center gap-1 px-4 py-2 overflow-x-auto">
        {trail.map((node, index) => (
          <div key={node.id} className="flex items-center gap-1 min-w-fit">
            <button
              onClick={() => onNavigate.goToIndex(index)}
              className={`text-sm font-medium px-2 py-1 rounded transition-colors ${
                index === trail.length - 1
                  ? 'text-primary cursor-default'
                  : 'text-secondary hover:text-primary hover:bg-[color:var(--surface-muted)]'
              }`}
            >
              {node.label}
            </button>

            {index < trail.length - 1 && (
              <span className="text-muted text-xs">/</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
