import getTruncatedNum from "./getTruncatedNum";

test("fn(0) should return 0", () => {
	expect(getTruncatedNum(0)).toBe(0);
});

test("fn(23) should return 23", () => {
	expect(getTruncatedNum(23)).toBe(23);
});

test("fn(29.2332838) should return 29.2332", () => {
	expect(getTruncatedNum(29.2332838)).toBe(29.2332);
});

test("fn(0.000007) should return 0.000007", () => {
	expect(getTruncatedNum(0.000007)).toBe(0.000007);
});

test("fn(1.000007) should return 1.000007", () => {
	expect(getTruncatedNum(1.000007)).toBe(1.000007);
});

test("fn(0.00000732) should return 0.000007", () => {
	expect(getTruncatedNum(0.00000732)).toBe(0.000007);
});

test("fn(1.00000189) should return 1.000001", () => {
	expect(getTruncatedNum(1.00000189)).toBe(1.000001);
});
