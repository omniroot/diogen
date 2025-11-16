export const upperFirstLetter = (text: any) => {
	const typedText = text as string;
	const result = `${typedText.at(0)?.toUpperCase()}${typedText.slice(1, Infinity)}`;
	return result;
};
