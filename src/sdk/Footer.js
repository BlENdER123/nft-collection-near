import React, {useState} from "react";
//import "../index.scss";
//import './App.css';
//import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap";
import {
	HashRouter as Router,
	Switch,
	Route,
	useHistory,
} from "react-router-dom";

import {useDispatch, useSelector} from "react-redux";

function Footer() {
	return (
		<Router>
			<div className="footer">
				<div className="container-header">
					<div className="footer-1">
						<div className="name">RADIANCETEAM</div>
						<div className="copyright">
							© 2022, radianceteam.com
							<br />
							Terms of Service
							<br />
							Privacy Policy
						</div>
					</div>
					<div className="footer-2">
						<div className="pages">
							{/* <a href="https://t.me/DefiSpacecom">
								<div className="page-element">Telegram</div>
							</a> */}
						</div>
						{/* <div className="email">
							<span>For corporation</span>
							<div className="text">info@radianceteam.com</div>
						</div> */}
					</div>
				</div>
			</div>
		</Router>
	);
}

export default Footer;
