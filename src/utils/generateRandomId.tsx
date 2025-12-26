export function generateUniqueId(): string {
	return `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}
