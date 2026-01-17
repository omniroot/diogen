export function generateUniqueId(): string {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0; // Random integer between 0 and 15
		const v = c === "x" ? r : (r & 0x3) | 0x8; // Set bits for 'y' to 8, 9, A, or B
		return v.toString(16); // Convert to hexadecimal
	});
}
