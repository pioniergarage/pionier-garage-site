import type { ReactNode } from "react";

export interface Props<T> {
  items: T[];
  keyExtractor: (item: T) => string | number;
  card: (item: T) => ReactNode;
}

export default function Grid<T>({ items, keyExtractor, card }: Props<T>) {
  const itemList = Array.isArray(items) ? items : [];

  return (
    <div 
      className="grid grid-cols-1 px-5 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start *:min-w-0"
    >
      {itemList.map((item) => (
        <div key={keyExtractor(item)}>
          {card(item)}
        </div>
      ))}
    </div>
  );
}