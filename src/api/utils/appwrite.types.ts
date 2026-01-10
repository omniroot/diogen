export interface AppwriteConfig {
	projectId: string;
	endpoint: string;
	projectName: string;
	settings: ProjectSettings;
	tablesDB: DatabaseInfo[];
	tables: CollectionConfig[];
	functions: FunctionConfig[];
	buckets: BucketConfig[];
}

export interface ProjectSettings {
	services: Record<string, boolean>;
	auth: {
		methods: Record<string, boolean>;
		security: Record<string, any>; // Упростил, чтобы избежать конфликтов в security
	};
}

export interface DatabaseInfo {
	$id: string;
	name: string;
	enabled: boolean;
}

export interface CollectionConfig {
	$id: string;
	$permissions: string[];
	databaseId: string;
	name: string;
	enabled: boolean;
	rowSecurity: boolean;
	columns: ColumnDefinition[];
	indexes: IndexDefinition[];
}

export interface ColumnDefinition {
	key: string;
	// Изменено: добавлен string, чтобы TS не ругался на строковые литералы из JSON
	type:
		| "string"
		| "integer"
		| "boolean"
		| "datetime"
		| "double"
		| "relationship"
		| string;
	required: boolean;
	array: boolean;
	size?: number | null;
	default?: any;
	encrypt?: boolean;
	format?: string;
	elements?: string[];
	min?: number;
	max?: number;
}

export interface IndexDefinition {
	key: string;
	type: string; // Упростил с Union до string
	status: string;
	columns: string[];
	orders: string[];
}

// ... интерфейсы для functions и buckets можно оставить прежними

/**
 * Конфигурация Cloud Functions
 */
export interface FunctionConfig {
	$id: string;
	execute: string[];
	name: string;
	enabled: boolean;
	logging: boolean;
	runtime: string;
	scopes: string[];
	events: string[];
	schedule: string;
	timeout: number;
	entrypoint: string;
	commands: string;
	specification: string;
	path: string;
}

/**
 * Конфигурация Storage Buckets
 */
export interface BucketConfig {
	$id: string;
	$permissions: string[];
	fileSecurity: boolean;
	name: string;
	enabled: boolean;
	maximumFileSize: number;
	allowedFileExtensions: string[];
	// compression: "none" | "gzip" | "zstd";
	compression: string;
	encryption: boolean;
	antivirus: boolean;
}
