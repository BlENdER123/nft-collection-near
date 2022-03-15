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
			<div class="footer">
				<div class="container-header">
					<div class="footer-1">
						<div class="name">RADIANCETEAM</div>
						<div class="copyright">
							© 2022, radianceteam.com
							<br />
							Terms of Service
							<br />
							Privacy Policy
						</div>
					</div>
					<div class="footer-2">
						<div class="pages">
							{/* <a href="https://t.me/DefiSpacecom">
								<div class="page-element">Telegram</div>
							</a> */}
						</div>
						<div class="email">
							<span>For corporation</span>
							<div class="text">info@radianceteam.com</div>
						</div>
					</div>
				</div>
			</div>
		</Router>
	);
}

export default Footer;
