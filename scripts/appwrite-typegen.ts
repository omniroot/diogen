import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";
import appwriteConfig from "~/appwrite.config.json";

type Column = {
	key: string;
	type: string;
	required: boolean;
	array: boolean;
	format?: string;
	elements?: string[];
};

type TableSchema = {
	$id: string;
	name: string;
	columns: Column[];
};

function mapColumnType(type: string): string {
	switch (type) {
		case "string":
			return "string";
		case "integer":
		case "float":
			return "number";
		case "boolean":
			return "boolean";
		case "datetime":
			return "string"; // Appwrite возвращает ISO, увы
		default:
			return "any"; // TS уже устал
	}
}

function toPascalCase(value: string): string {
	return value
		.split("_")
		.map((v) => v.charAt(0).toUpperCase() + v.slice(1))
		.join("");
}

// function capitalize(str: string): string {
// 	return str.charAt(0).toUpperCase() + str.slice(1);
// }

function generateTableTypes(table: TableSchema): string {
	const typeName = toPascalCase(table.name);

	const enumTypes = table.columns
		.filter((c) => c.format === "enum" && c.elements?.length)
		.map((col) => {
			const enumName = `${typeName}${toPascalCase(col.key)}`;
			const values = col.elements!.map((v) => `"${v}"`).join(" | ");
			return `export type ${enumName} = ${values};`;
		})
		.join("\n\n");

	const fields =
		table.columns.length === 0
			? ""
			: table.columns
					.map((col) => {
						const optional = col.required ? "" : "?";

						const baseType =
							col.format === "enum"
								? `${typeName}${toPascalCase(col.key)}`
								: mapColumnType(col.type);

						const finalType = col.array ? `${baseType}[]` : baseType;

						return `\t${col.key}${optional}: ${finalType};`;
					})
					.join("\n");

	return `${enumTypes}

export type ${typeName} = Models.Row & {
${fields}
};`;
}

export function generateTypesFromTables(tables: TableSchema[]): string {
	const header = `import type { Models } from "appwrite";\n\n`;

	const body = tables
		.filter((t) => !t.name.endsWith("_old")) // без археологии
		.map(generateTableTypes)
		.join("\n\n");

	return header + body;
}

// appwriteConfig.tables.forEach((table) => {
const code = generateTypesFromTables(appwriteConfig.tables);
// resultTypes += `${code} \n`;
// });

const output_path = path.resolve("src", "api", "types", "appwrite.d.ts");

writeFileSync(output_path, code);
execSync(`bun run biome format ${output_path} --write`);
// "typegen:appwrite": "bun appwrite pull tables && bun run appwrite types -l ts ./src/api/types/",

// console.log({ output_path });
