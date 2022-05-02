import React from "react";

function Service({title, logo, description}) {
	return (
		<div className="service">
			<div className="title">{title}</div>
			<div className="logo">
				<img src={logo} alt="logo"></img>
			</div>
			<div className="description">{description}</div>
		</div>
	);
}

export default Service;
