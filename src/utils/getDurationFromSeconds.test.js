import getDurationFromSeconds from "./getDurationFromSeconds";

test("at least returns a number", () => {
	const variants = [
		"seconds",
		"minutes",
		"hours",
		"days",
		"weeks",
		"months",
		"years",
	];

	expect(
		typeof getDurationFromSeconds(
			genRandomInt(0, 1e9),
			variants[genRandomInt(0, 6)],
		),
	).toBe("number");
});

function genRandomInt(min = 0, max = 1) {
	if (max - min < 0 || !Number.isInteger(min) || !Number.isInteger(max))
		throw new Error("Invalid max or min value.");

	const range = max - min + 1;

	return min + Math.floor(Math.random() * range);
}
