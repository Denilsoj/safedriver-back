export const isAdult = (date: string) => {
	const birth_date = new Date(date);
	const today = new Date();

	const age = today.getFullYear() - birth_date.getFullYear();

	return age > 18;
};
