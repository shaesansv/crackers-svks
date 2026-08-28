/**
 * Category sorting rules for display:
 * 1. Sound Crackers & Bombs
 * 2. Flower Pot / Flower Pots
 * 3. Ground Chakkar / Ground Chakkars
 * ... (any other categories)
 * Last: Sparklers
 */

export const getCategoryPriority = (name: string): number => {
  const n = (name || '').toLowerCase().trim();

  // 1. Sound Crackers and Bombs
  if (n.includes('sound') || (n.includes('bomb') && !n.includes('rocket') && !n.includes('aerial'))) {
    return 1;
  }

  // 2. Flower Pot / Flower Pots
  if (n.includes('flower') || n.includes('pot')) {
    return 2;
  }

  // 3. Ground Chakkar / Ground Chakkars
  if (n.includes('ground') || n.includes('chakkar')) {
    return 3;
  }

  // Last: Sparklers
  if (n.includes('sparkler')) {
    return 1000;
  }

  // Intermediate categories
  return 500;
};

export const sortCategories = <T extends { name: string }>(categories: T[]): T[] => {
  return [...categories].sort((a, b) => {
    const prioA = getCategoryPriority(a.name);
    const prioB = getCategoryPriority(b.name);
    if (prioA !== prioB) {
      return prioA - prioB;
    }
    return 0;
  });
};
