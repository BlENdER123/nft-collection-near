import React from "react";
import {HashRouter as Router} from "react-router-dom";

function AppPageHeader() {
	return (
		<Router>
			<div className="acc">
				<div className="acc-logo"></div>
				<div className="content">
					<div className="acc-status">Connected</div>
					<div className="break"></div>
					<div className="acc-wallet">0:5f48...757f</div>
				</div>
			</div>

			<a href="#/login">
				<button type="button" className="btn-signout">
					Sign out
				</button>
			</a>
		</Router>
	);
}

export default AppPageHeader;
