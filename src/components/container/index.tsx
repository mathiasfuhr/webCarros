import { ReactNode } from "react";

export function Container({ children }: { children: ReactNode }) {
  return <div className="w-full max-w-7xl mx-auto px-4">{children}</div>;
}

// Container vai em volta de praticamente todos conteudos, seguir esse padrão
