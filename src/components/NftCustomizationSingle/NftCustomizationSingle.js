import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

import Header from "../../Pages/Header/Header";
import Footer from "../../Pages/Footer/Footer";

import {useDispatch, useSelector} from "react-redux";
import {Navigate} from "react-router";

function NftCustomizationSingle() {
	let navigate = useNavigate();

	const dispatch = useDispatch();
	const connectWallet = useSelector((state) => state.connectWallet);

	let arr = JSON.parse(localStorage.getItem("class"));
	console.log(arr);

	const [classArr, setClassArr] = useState(arr);

	const [contrBg, setContrBg] = useState(false);

	let cur = localStorage.getItem("curentLayer");
	const [curentLayer, setCurentLayer] = useState(cur);

	const [curentWidth, setCurentWidth] = useState();
	const [curentHeight, setCurentHeight] = useState();

	const [curentSrc, setCurentSrc] = useState();

	const [redirect, setRedirect] = useState(false);

	const [errorModal, setErrorModal] = useState({
		hidden: false,
		message: "",
	});

	function copySrc() {
		const asyncFunction = async function () {
			return await getResizeMany();
		};
		asyncFunction().then((res) => {
			let tempArr = [];
			console.log(res);
			for (let i = 0; i < classArr.length; i++) {
				let temp = classArr[i];
				temp.src = res[i];
				tempArr.push(temp);
			}
			console.log(tempArr);
			setClassArr(tempArr);
		});
	}

	console.log(arr);

	function test() {
		//let array = JSON.parse(localStorage.getItem("class"));
		//console.log(array);
		console.log(classArr);
	}

	function setActive(item) {
		let tempArr = [];
		for (let i = 0; i < classArr.length; i++) {
			let temp = classArr[i];
			if (temp == item) {
				//console.log(1);
				temp.active = true;
				tempArr.push(temp);
				setCurentLayer(i);
			} else {
				temp.active = false;
				tempArr.push(temp);
			}
		}
		setClassArr(tempArr);
	}

	function contrastBg() {
		if (contrBg) {
			setContrBg(false);
		} else {
			setContrBg(true);
		}
	}

	function setX(item, event) {
		let tempArr = [];

		for (let i = 0; i < classArr.length; i++) {
			let temp = classArr[i];
			if (temp == item) {
				temp.x = event.target.value;
				tempArr.push(temp);
			} else {
				tempArr.push(temp);
			}
		}
		setClassArr(tempArr);
	}

	function setY(item, event) {
		let tempArr = [];

		for (let i = 0; i < classArr.length; i++) {
			let temp = classArr[i];
			if (temp == item) {
				temp.y = event.target.value;
				tempArr.push(temp);
			} else {
				tempArr.push(temp);
			}
		}
		setClassArr(tempArr);
	}

	function setZ(item, event) {
		let tempArr = [];

		for (let i = 0; i < classArr.length; i++) {
			let temp = classArr[i];
			if (temp == item) {
				temp.z_index = event.target.value;
				tempArr.push(temp);
			} else {
				tempArr.push(temp);
			}
		}
		setClassArr(tempArr);
	}

	function setWidth(item, event) {}

	async function saveSize() {
		let tempArr = [];

		if (curentWidth <= 1 || curentHeight <= 1) {
			setErrorModal({
				hidden: true,
				message: "Image size is too small",
			});
			return;
		}

		for (let i = 0; i < classArr.length; i++) {
			let temp = classArr[i];
			if (i == curentLayer) {
				let tempBg = [];
				for (let j = 0; j < classArr[i].imgs.length; j++) {
					//let src;

					// var image = new Image();
					// image.src = getSrc(temp.imgs[j]);

					// // console.log(temp.imgs[j]);
					// // console.log(getSrc(temp.imgs[j]));
					// //console.log(image);
					// var canvas = document.createElement("canvas");
					// canvas.width = curentWidth;
					// canvas.height = curentHeight;
					temp.width = curentWidth;
					temp.height = curentHeight;
					const src = await getResize(temp.imgs[j], curentWidth, curentHeight);
					console.log(1111111111, src);
					tempBg.push(src);
					// var ctx = canvas.getContext("2d");
					// ctx.drawImage(image, 0, 0, curentWidth, curentHeight);

					// var dataURL = canvas.toDataURL("image/png");

					// //console.log(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));

					// let src = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
					// //resolve(src);
					// tempBg.push(src);
					// console.log(tempBg);
					//console.log(src);
					// let tempbb = tempBg;
					// tempbb.push(src);
					// setTempBg(tempbb);
					//setSrc(URL.createObjectURL(file));
				}
				temp.src = tempBg;
				//console.log(tempBg);
				//temp.imgs = tempBg;
				tempArr.push(temp);
			} else {
				tempArr.push(temp);
			}
		}
		console.log(tempArr);
		setClassArr(tempArr);
	}

	function getSrc(src) {
		return "https://cloudflare-ipfs.com/ipfs/" + src;
	}

	function logData() {
		console.log("-----------");

		let tempArr = [];
		for (let i = 0; i < classArr.length; i++) {
			let temp = classArr[i];
			temp.src = [];
			tempArr.push(temp);
		}

		setClassArr(tempArr);

		console.log(classArr);
		localStorage.setItem("class", JSON.stringify(classArr));
		localStorage.setItem("curentLayer", curentLayer);

		// setRedirect(true);
		navigate("/nft-generate-single");
	}

	function closeError() {
		setErrorModal({
			hidden: false,
			message: "",
		});
	}

	function testL() {
		for (let j = 0; j < classArr[0].imgs.length; j++) {
			let src = classArr[0].imgs[j];
			console.log(src);
			let src2 = getSrc(src);
			console.log(src2);
		}
	}

	async function getResizeMany() {
		let tempArr = [];
		for (let i = 0; i < classArr.length; i++) {
			let tempArrImg = [];
			for (let j = 0; j < classArr[i].imgs.length; j++) {
				let res = await getResize(
					classArr[i].imgs[j],
					classArr[i].width,
					classArr[i].height,
				);
				tempArrImg.push(res);
			}
			tempArr.push(tempArrImg);
		}

		console.log(tempArr);
		return tempArr;
	}

	function getResize(img, width, height) {
		return new Promise((resolve, reject) => {
			var image = new Image();
			image.src = getSrc(img);
			console.log(getSrc(img));

			var canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;

			var ctx = canvas.getContext("2d");
			// ctx.drawImage(image, 0, 0, width, height);

			// console.log(canvas);

			image.setAttribute("crossorigin", "anonymous");

			image.onload = function () {
				ctx.drawImage(image, 0, 0, width, height);
				resolve(canvas.toDataURL("image/png"));
			};

			//console.log(canvas.toDataURL("image/png"));

			// var dataURL = canvas.toDataURL("image/png");
			// console.log(dataURL);
			// return dataURL;
		});
	}

	function close() {
		dispatch({type: "closeConnect"});
		console.log(connectWallet);
	}

	return (
		<>
			<div
				className={
					errorModal.hidden === true || connectWallet ? "error-bg" : "hide"
				}
			>
				<span onClick={close}/>
			</div>
			<div
				className={
					errorModal.hidden === true || connectWallet ? "App-error" : "App App2"
				}
			>

				<div className="constructors">
					<div className="container-header">
						<div
							className={errorModal.hidden === true ? "error-modal" : "hide"}
						>
							<button className="close" onClick={closeError}>
								<span/>
								<span/>
							</button>
							<div className="message">{errorModal.message}</div>
						</div>

						<div className="modal-constructor modal-constructor-layers ">
							<div className="title">Layers</div>
							<div className="text">Select and edit the layer</div>
							{classArr.map((item, index) => {
								return (
									<div
										key={"uniqueId" + index}
										className={
											item.active
												? "layers-list_layer layers-list_layer-active"
												: "layers-list_layer"
										}
										onClick={() => setActive(item)}
									>
										<div className="index">{index + 1}. </div>
										<span>{item.name}</span>
									</div>
								);
							})}

							<div className="title">How to use?</div>
							<div className="text text-nonline">
								Phasellus condimentum suscipit metus vel mattis. Ut vulputate
								tincidunt odio. Nam odio augue, molestie id rutrum et, cursus id
								libero. Quisque nulla dolor, condimentum quis posuere et, mattis
								quis sapien. Donec mollis.
								<br />
								<br />
								Fusce venenatis odio id pharetra vulputate. Phasellus dolor
								lacus, condimentum at bibendum vel, laoreet id arcu. Phasellus
								lobortis luctus semper. Fusce faucibus dolor eget nulla
								venenatis, eget porttitor nibh finibus. Praesent rhoncus erat et
								aliquet suscipit. Nam sed bibendum arcu, quis tristique tellus.
							</div>
						</div>

						<div className="modal-constructor modal-constructor-position">
							<div className="nft-img">
								<div
									className={contrBg ? "img img-contrast" : "img"}
									style={{
										width: localStorage.getItem("width") + "px",
										height: localStorage.getItem("height") + "px",
									}}
								>
									{classArr[0].src?.length > 0
										? classArr.map((item, index) => {
												return (
													<img
														key={"uniqueId" + index}
														src={item.src[0]}
														style={{
															left: item.x + "px",
															top: item.y + "px",
															zIndex: item.z_index,
														}}
													/>
												);
										  })
										: copySrc()}
									<div
										className={classArr[0].src?.length > 0 ? "hide" : "loader"}
									>
										<div/>
										<div/>
										<div/>
									</div>
								</div>
								<div className="break"/>
								<div
									className="button-1-square"
									style={{width: localStorage.getItem("width") + "px"}}
									onClick={logData}
								>
									Create NFT
								</div>
							</div>
						</div>

						<div className="modal-constructor modal-constructor-settings">
							{classArr.map((item, index) => {
								return (
									<div
										key={"uniqueId" + index}
										className={item.active ? "project-settings" : "hide"}
									>
										<div className="title">Settings</div>
										<div className="text">
											Edit element position & properties
										</div>
										<div className="setting">
											<div className="title-settings">Position</div>
											<div className="inputs">
												<input
													type="text"
													placeholder="X:50"
													onChange={(event) => setX(item, event)}
												/>

												<input
													type="text"
													placeholder="Y:50"
													onChange={(event) => setY(item, event)}
												/>
											</div>
										</div>
										<div className="setting">
											<div className="title-settings">Size</div>
											<div className="inputs">
												<input
													type="text"
													placeholder="150"
													onChange={(event) =>
														setCurentWidth(event.target.value)
													}
												/>
												<br />
												<input
													type="text"
													placeholder="125"
													onChange={(event) =>
														setCurentHeight(event.target.value)
													}
												/>
											</div>
										</div>
										<div className="setting">
											<div className="title-settings">Z-Index</div>

											<input
												type="text"
												placeholder="1"
												onChange={(event) => setZ(item, event)}
											/>
										</div>
										<div className="button-1-square" onClick={saveSize}>
											Save size
										</div>
									</div>
								);
							})}
						</div>
					</div>
					{redirect ? <Navigate to="/nft-generate-single" /> : ""}
				</div>


			</div>
		</>
	);
}

export default NftCustomizationSingle;
