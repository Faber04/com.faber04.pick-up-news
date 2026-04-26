/**
 * Breadcrumb trail navigation system — scalable for nested pages/subpages
 */

export type BreadcrumbNode = {
  id: string;                    // unique page id: 'home', 'settings', 'feeds', etc.
  label: string;                 // display label for breadcrumb
  params?: Record<string, unknown>;  // dynamic data if needed (e.g. feedId, userId)
};

export type NavigationState = {
  trail: BreadcrumbNode[];       // breadcrumb path: [home, settings, feeds, ...]
};

export type NavigationActions = {
  push: (node: BreadcrumbNode) => void;        // navigate deeper (add to trail)
  pop: () => void;                             // go back (remove last)
  goToIndex: (index: number) => void;          // jump to a specific level
  reset: () => void;                           // return to home
};
