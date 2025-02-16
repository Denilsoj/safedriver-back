export const isAdult = (date: string) => {
	const birth_date = new Date(date);
	const today = new Date();

	const age = today.getFullYear() - birth_date.getFullYear();

	return age > 18;
};

export const generateUniqueFilename = (
	fieldname: string,
	filename: string,
	driverName: string | unknown,
): string => {
	const uniqueSufix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
	const extension = filename.split(".").pop();
	const driveNameTratament =
		typeof driverName === "string"
			? driverName.replaceAll(" ", "_")
			: driverName;
	return `${fieldname}-${driveNameTratament}-${uniqueSufix}.${extension}`;
};
