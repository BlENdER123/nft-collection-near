/**
 * Returns truncated number
 *
 * @param {number} num
 * @param {number} [digits=4]
 * @returns {number}
 */
export default function getTruncatedNum(num, digits = 4) {
	if (Number.isInteger(num)) return num;

	let truncatedNum = getFixedDown(num, digits);

	while (Number.isInteger(truncatedNum))
		truncatedNum = getFixedDown(num, digits++);

	return truncatedNum;
}

/**
 * Returns truncated number
 * Based on @kirilloid answer from https://stackoverflow.com/questions/4912788/truncate-not-round-off-decimal-numbers-in-javascript
 *
 * @param {number} num
 * @param {number} [digits=4]
 * @returns {number}
 */
function getFixedDown(num, digits) {
	const re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)");
	const m = num.toString().match(re);
	return m ? parseFloat(m[1]) : num.valueOf();
}
