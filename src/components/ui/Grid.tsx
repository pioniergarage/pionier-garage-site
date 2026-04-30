import type { ReactNode } from "react";

export interface Props<T> {
  items: T[];
  keyExtractor: (item: T) => string | number;
  card: (item: T) => ReactNode;
}

export default function Grid<T>({ items, keyExtractor, card }: Props<T>) {
  const itemList = Array.isArray(items) ? items : [];

  return (
    <>
      <div className="grid">
        {itemList.map((item) => (
          <div key={keyExtractor(item)}>
            {card(item)}
          </div>
        ))}
      </div>
    </>
  );
}