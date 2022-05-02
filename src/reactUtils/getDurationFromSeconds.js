import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

/**
 * Return duration from seconds in days, weeks, months, ...
 *
 * @param {number} seconds
 * @param {('seconds'|'minutes'|'hours'|'days'|'weeks'|'months'|'years')} convertUnit
 * @returns {number}
 */
export function getDurationFromSeconds(seconds, convertUnit) {
	console.log(
		"dayjs.duration({ seconds }).asSeconds()",
		dayjs.duration({seconds}).asSeconds(),
	);
	switch (convertUnit) {
		case "seconds":
			return dayjs.duration({seconds}).asSeconds();
		case "minutes":
			return dayjs.duration({seconds}).asMinutes();
		case "hours":
			return dayjs.duration({seconds}).asHours();
		case "days":
			return dayjs.duration({seconds}).asDays();
		case "weeks":
			return dayjs.duration({seconds}).asWeeks();
		case "months":
			return dayjs.duration({seconds}).asMonths();
		case "years":
			return dayjs.duration({seconds}).asYears();
		default:
			throw new Error("Unknown convert unit");
	}
}

/**
 * Return date in form of "15 September 2021 17:09"
 *
 * @param {number} timestamp
 * @returns {string}
 */
export function getFormattedDate(timestamp) {
	return dayjs(Number(timestamp) * 1000).format("DD.MM.YYYY HH:MM");
}
