import type { Models } from "appwrite";

export type Posts = Models.Row & {
	title?: string;
	banner_url?: string;
	author_id?: string;
	content?: string;
};

export type DaysRecordsMood = "happy" | "sad" | "neutral" | "energetic" | "tired";

export type DaysRecords = Models.Row & {
	sleep_start?: string;
	sleep_end?: string;
	notes?: string;
	mood?: DaysRecordsMood;
	sleep_score?: number;
	date: string;
};

export type Users = Models.Row & {
	avatar?: string;
	user_id: string;
	nickname?: string;
	description?: string;
};

export type Goals = Models.Row & {
	title?: string;
	description?: string;
	parent_id?: string;
	completed?: boolean;
};

export type Routines = Models.Row & {};

export type Habits = Models.Row & {
	title?: string;
	icon?: string;
};

export type HabitsRecords = Models.Row & {
	date?: string;
	completed?: boolean;
	habit_id: string;
};

export type ActivitiesType = "task" | "habit";

export type Activities = Models.Row & {
	title?: string;
	description?: string;
	type: ActivitiesType;
	icon?: string;
	user_id: string;
};

export type ActivityEntries = Models.Row & {
	date: string;
	activity_id: string;
	completed?: boolean;
	user_id?: string;
};
