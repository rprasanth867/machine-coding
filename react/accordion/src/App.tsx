import { useId, useRef, useState } from "react";
import type { ElementType, KeyboardEvent, ReactNode } from "react";

const items = [
  {
    id: "kb-1",
    headingLevel: 3,
    title: "ArrowUp and ArrowDown navigation",
    content:
      "Pressing Down Arrow moves focus to the next header button; Up Arrow moves to the previous header button.",
  },
  {
    id: "kb-2",
    headingLevel: 3,
    title: "Home and End shortcuts",
    content:
      "Pressing Home jumps focus directly to the first accordion header, and End jumps to the last header.",
  },
  {
    id: "kb-3",
    headingLevel: 3,
    title: "Enter and Space toggling",
    content:
      "Standard button keys toggle expansion without breaking native keyboard or screen-reader expectations.",
  },
] as const;

type HeadingProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
};

function Heading({ level = 3, children }: HeadingProps) {
  const Tag = `h${level}` as ElementType;
  return (
    <Tag style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>
      {children}
    </Tag>
  );
}

export default function App() {
  const baseId = useId();
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(["kb-1"]));

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const focusIndex = (index: number) => {
    const count = items.length;
    if (!count) return;
    const wrappedIndex = ((index % count) + count) % count;
    buttonRefs.current[wrappedIndex]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusIndex(index + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusIndex(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusIndex(0);
        break;
      case "End":
        event.preventDefault();
        focusIndex(items.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", fontFamily: "sans-serif" }}>
      {items.map((item, index) => {
        const isOpen = openIds.has(item.id);
        const buttonId = `${baseId}-${item.id}-btn`;
        const panelId = `${baseId}-${item.id}-panel`;

        return (
          <div
            key={item.id}
            style={{
              borderBottom: "1px solid #333",
              padding: "12px 0",
            }}
          >
            <Heading level={item.headingLevel}>
              <button
                ref={(el) => {
                  buttonRefs.current[index] = el;
                }}
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "transparent",
                  color: "inherit",
                  border: "none",
                  padding: "6px 0",
                  fontSize: "inherit",
                  fontWeight: "inherit",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span>{item.title}</span>
                <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
              </button>
            </Heading>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              style={{ paddingTop: 8, lineHeight: 1.5, opacity: 0.9 }}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
