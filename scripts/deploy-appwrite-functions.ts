import { execSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import readline from "node:readline";

// const tar = require("tar") as typeof import("tar");
// const execa = require("execa") as typeof import("execa");

interface FunctionMeta {
	id: string;
	name: string;
	entrypoint: string;
	codePath?: string;
	activate?: boolean;
	_dir?: string;
}

export interface LocalFunction {
	dir: string;
	meta: FunctionMeta;
}
const FUNCTIONS_DIR = path.resolve("appwrite");

const folders = readdirSync(FUNCTIONS_DIR);

const getAppwriteFunctions = () => {
	const result: FunctionMeta[] = [];
	folders.forEach((folder) => {
		const functionMetaPath = path.resolve("appwrite", folder, "function.json");
		if (existsSync(functionMetaPath)) {
			const meta = JSON.parse(
				readFileSync(functionMetaPath, { encoding: "utf-8" }),
			) as FunctionMeta;

			meta._dir = path.resolve("appwrite", folder);
			// console.log({ meta });

			// console.log("@@", `${meta.id}: ${meta.name}`);

			result.push(meta);
		}
	});
	return result;
};

export async function deployFunction(fn: LocalFunction): Promise<void> {
	const deployDir = fn.dir;

	// очистим старую папку
	// rmSync(deployDir, { force: true });

	// скопируем весь код туда
	// cpSync(fn.dir, deployDir, { force: true });

	const activate = fn.meta.activate === false ? "--activate=false" : "--activate=true";

	const cmd = [
		"appwrite functions create-deployment",
		`--function-id=${fn.meta.id}`,
		`--entrypoint=${fn.meta.entrypoint}`,
		`--code=${deployDir}`,
		activate,
	].join(" ");

	console.log("\n▶", cmd, "\n");

	execSync(cmd, { stdio: "inherit" });

	// очистка после деплоя (по желанию)
	// rmSync(deployDir, { force: true });
}

export async function selectFunction(items: string[]) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	items.forEach((item, i) => {
		console.log(`${i + 1}. ${item}`);
	});

	const index = await new Promise<number>((resolve) => {
		rl.question("\nВыбери номер функции: ", (answer) => {
			rl.close();
			resolve(Number(answer) - 1);
		});
	});

	if (Number.isNaN(index) || index < 0 || index >= items.length) {
		throw new Error("Неверный выбор");
	}

	return { selected: items[index], index: index };
}

const main = async () => {
	const appwriteFunctions = getAppwriteFunctions();
	// console.log({ appwriteFunctions });
	const { selected, index } = await selectFunction(
		appwriteFunctions.map((fn) => `${fn.id}`),
	);
	console.log({ selected, index });

	deployFunction({ dir: appwriteFunctions[index]._dir!, meta: appwriteFunctions[index] });

	// const chosen = await inquirer.prompt([
	// 	{
	// 		type: "list",
	// 		name: "chosen",
	// 		message: "Выберите функцию для обновления:",
	// 		choices: appwriteFunctions.map((appwriteFunc, i) => ({
	// 			name: `${appwriteFunc.name}`,
	// 			value: i,
	// 		})),
	// 	},
	// ]);
	// console.log({ chosen });
};

main();
// prompt

// list;
