import React, {useEffect, useState} from "react";

export default function CalculateTimeLeft(props) {
	const calculateTimeLeft = () => {
		let year = new Date().getFullYear();
		const difference = +props.date - +new Date();
		let timeLeft = {};

		if (difference > 0) {
			timeLeft = {
				"y.": Math.floor(difference / (1000 * 60 * 60 * 24 * 365)),
				"mon.": Math.floor((difference / (1000 * 60 * 60 * 24 * 30)) % 12),
				"d.": Math.floor((difference / (1000 * 60 * 60 * 24)) % 30),
				"h.": Math.floor((difference / (1000 * 60 * 60)) % 24),
				"m.": Math.floor((difference / 1000 / 60) % 60),
				"s.": Math.floor((difference / 1000) % 60),
			};
		}

		return timeLeft;
	};

	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
	const [year] = useState(new Date().getFullYear());

	useEffect(() => {
		setTimeout(() => {
			setTimeLeft(calculateTimeLeft());
		}, 1000);
	});

	const timerComponents = [];

	Object.keys(timeLeft).forEach((interval) => {
		if (!timeLeft[interval]) {
			return;
		}

		timerComponents.push(
			<span>
				{timeLeft[interval]} {interval}{" "}
			</span>,
		);
	});
	return (
		<div>
			{timerComponents.length ? timerComponents : <span>Time's up!</span>}
		</div>
	);
}
