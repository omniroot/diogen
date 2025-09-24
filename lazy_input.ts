// vite.config.ts
import MagicString from "magic-string";
import type { Plugin } from "vite";

export default function lazyImportsPlugin(components: string[]): Plugin {
	return {
		name: "vite-plugin-lazy-imports",
		enforce: "pre",

		transform(code, id) {
			if (!id.endsWith(".tsx") && !id.endsWith(".jsx")) return;

			const importRegex = /import\s+\{\s*([A-Za-z0-9_]+)\s*\}\s+from\s+["'](@\/components\/[^"']+)["']/g;

			let match;
			const s = new MagicString(code);
			let replaced = false;

			while ((match = importRegex.exec(code))) {
				const [full, name, path] = match;

				// проверяем, что компонент есть в списке
				if (!components.includes(name)) continue;

				// удаляем оригинальный import
				s.remove(match.index, match.index + full.length);

				// фикс пути
				const fixedPath = path.endsWith(".tsx") ? path : `${path}.tsx`;

				// делаем ленивый компонент и обёртку в Suspense
				const lazyName = `Lazy${name}`;
				const wrapped = `
const ${lazyName} = React.lazy(() =>
  import("${fixedPath}").then(m => ({ default: m.${name} }))
);
const ${name} = (props) => (
  <React.Suspense fallback={null}>
    <${lazyName} {...props} />
  </React.Suspense>
);
`;
				s.appendLeft(0, wrapped);

				replaced = true;
			}

			if (!replaced) return null;

			// добавляем React, если его нет
			if (!/import\s+React/.test(s.toString())) {
				s.prepend(`import React from "react";\n`);
			}

			return {
				code: s.toString(),
				map: s.generateMap({ hires: true }),
			};
		},
	};
}
