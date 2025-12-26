// scripts/check-bundle.js

import stats from "../dist/stats.json";

// const stats = JSON.parse(fs.readFileSync("dist/stats.json", "utf8"));

// Находим самые большие чанки
const largeChunks = stats
	.filter((chunk) => chunk.gzipSize > 10_00) // > 100KB
	.sort((a, b) => b.size - a.size);

console.log("🚨 Крупнейшие чанки:");
largeChunks.forEach((chunk) => {
	console.log(`  ${chunk.name || chunk.id}: ${(chunk.size / 1024).toFixed(1)}KB`);

	// Анализируем содержимое
	chunk.modules?.forEach((mod) => {
		if (mod.size > 10_000) {
			// Модули > 10KB
			console.log(`    📦 ${mod.name}: ${(mod.size / 1024).toFixed(1)}KB`);
		}
	});
});

// Проверяем лимиты
const MAX_TOTAL_SIZE = 500 * 1024; // 500KB
const totalSize = stats.reduce((sum, asset) => sum + asset.gzipSize, 0);

if (totalSize > MAX_TOTAL_SIZE) {
	console.error(
		`❌ Превышен лимит размера бандла: ${(totalSize / 1024).toFixed(1)}KB > 500KB`,
	);
	process.exit(1); // Фатальная ошибка в CI
}
