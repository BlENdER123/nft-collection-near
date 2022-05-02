import getFormattedDate from "./getFormattedDate";

test("returns at least a string", () => {
	expect(typeof getFormattedDate(Date.now())).toBe("string");
});
