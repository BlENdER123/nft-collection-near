import React, {useState, useEffect} from "react";
import {HashRouter as Router, Redirect, useHistory} from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";

import {useDispatch, useSelector} from "react-redux";

import {scaleWidth, scaleHeight} from "./scaleConfig.json";

function NftCustomization() {
	let history = useHistory();

	const dispatch = useDispatch();
	const connectWallet = useSelector((state) => state.connectWallet);

	let arr = JSON.parse(localStorage.getItem("class"));
	console.log(arr);

	const [accordionHidden, setAccordioHidden] = useState([
		false,
		false,
		false,
		false,
	]);

	let curImg = [];

	for (let i = 0; i < arr.length; i++) {
		curImg.push(0);
	}

	const [curentImages, setCurentImages] = useState(curImg);

	// console.log(document.documentElement.clientHeight);

	// let nftWidth = localStorage.getItem("width");
	// let nftHeight = localStorage.getItem("height");

	// if(nftWidth > 500 && nftHeight > 500){
	// 	for(let i = 0; i < arr.length; i++) {
	// 		let tempWidth = arr[i].width;
	// 		let tempHeight = arr[i].height;

	// 		console.log(tempWidth, tempHeight);

	// 		let realWidth = (tempWidth/(nftWidth/100))*(scaleWidth/100);
	// 		let realHeight = (tempHeight/(nftHeight/100))*(scaleHeight/100);

	// 		console.log(realHeight, realWidth);

	// 		arr[i].width = realWidth;
	// 		arr[i].height = realHeight;
	// 	}
	// }

	// if(nftWidth < 500 && nftHeight < 500){
	// 	for(let i = 0; i < arr.length; i++) {
	// 		let tempWidth = arr[i].width;
	// 		let tempHeight = arr[i].height;

	// 		let realWidth = (tempWidth/(nftWidth/100))*(localStorage.getItem("width")/100);
	// 		let realHeight = (tempHeight/(nftHeight/100))*(localStorage.getItem("height")/100);

	// 		console.log(realHeight, realWidth);

	// 		arr[i].width = realWidth;
	// 		arr[i].height = realHeight;
	// 	}
	// }

	console.log(arr, 1);

	const [classArr, setClassArr] = useState(arr);

	// let statusSize = "";

	// if (nftWidth < 500 && nftHeight < 500) {
	// 	console.log("small");
	// } else if(nftWidth/nftHeight > 1.2) {
	// 	console.log("4:2");
	// 	statusSize = "horizontal";
	// } else if (nftWidth/nftHeight < 0.8) {
	// 	console.log("2:4");
	// 	statusSize = "vertical";
	// } else {
	// 	console.log("1:1");
	// 	statusSize = "square";
	// }

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
				if (event == "+") {
					let newZ = temp.z_index;
					newZ++;
					temp.z_index = newZ;
					tempArr.push(temp);
				} else if (temp.z_index > 0) {
					let newZ = temp.z_index;
					newZ--;
					temp.z_index = newZ;
					tempArr.push(temp);
				} else {
					tempArr.push(temp);
				}
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

		// if(nftWidth > 500 && nftHeight > 500){
		// 	// for(let i = 0; i < arr.length; i++) {
		// 	// 	let tempWidth = arr[i].width;
		// 	// 	let tempHeight = arr[i].height;

		// 	// 	let realWidth = (tempWidth/(nftWidth/100))*(scaleWidth/100);
		// 	// 	let realHeight = (tempHeight/(nftHeight/100))*(scaleHeight/100);

		// 	// 	console.log(realHeight, realWidth);

		// 	// 	arr[i].width = realWidth;
		// 	// 	arr[i].height = realHeight;
		// 	// }

		// 	for (let i = 0; i < classArr.length; i++) {
		// 		let temp = classArr[i];
		// 		if (i == curentLayer) {
		// 			let tempBg = [];
		// 			for (let j = 0; j < classArr[i].imgs.length; j++) {
		// 				let tempWidth = curentWidth;
		// 				let tempHeight = curentHeight;

		// 				console.log(tempWidth, tempHeight);

		// 				let realWidth = (tempWidth/(nftWidth/100))*(scaleWidth/100);
		// 				let realHeight = (tempHeight/(nftHeight/100))*(scaleHeight/100);

		// 				console.log(realWidth, realHeight);

		// 				temp.width = realWidth;
		// 				temp.height = realHeight;
		// 				const src = await getResize(temp.imgs[j], curentWidth, curentHeight);
		// 				console.log(1111111111, src);
		// 				tempBg.push(src);

		// 			}
		// 			temp.src = tempBg;
		// 			tempArr.push(temp);
		// 		} else {
		// 			tempArr.push(temp);
		// 		}
		// 	}

		// 	console.log(tempArr);
		// 	setClassArr(tempArr);
		// 	return;
		// }

		for (let i = 0; i < classArr.length; i++) {
			let temp = classArr[i];
			if (i == curentLayer) {
				let tempBg = [];
				for (let j = 0; j < classArr[i].imgs.length; j++) {
					temp.width = curentWidth;
					temp.height = curentHeight;
					const src = await getResize(temp.imgs[j], curentWidth, curentHeight);
					console.log(1111111111, src);
					tempBg.push(src);
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
		history.push("/nft-generate");
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
				console.log(classArr[i].imgs[j]);
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

	function accordionChange(index) {
		let tempValue = [];
		for (let i = 0; i < accordionHidden.length; i++) {
			if (i == index) {
				tempValue.push(!accordionHidden[i]);
			} else {
				tempValue.push(accordionHidden[i]);
			}
			console.log(accordionHidden[i]);
		}
		setAccordioHidden(tempValue);
	}

	function setImgActive(index) {
		let curImg = [];

		for (let i = 0; i < curentImages.length; i++) {
			let temp = curentImages[i];
			if (i == curentLayer) {
				temp = index;
				curImg.push(index);
			} else {
				curImg.push(temp);
			}
		}

		//curImg[curentLayer] = index;
		setCurentImages(curImg);
		console.log(curentImages);
	}

	function changeRarity(rarity) {
		let tempArr = [];

		for (let i = 0; i < classArr.length; i++) {
			let temp = classArr[i];
			if (curentLayer == i) {
				for (let j = 0; j < classArr[i].rarity.length; j++) {
					if (curentImages[curentLayer] == j) {
						temp.rarity[j] = rarity;
					}
				}
			}
			tempArr.push(temp);
		}

		setClassArr(tempArr);
		console.log(classArr);
	}

	function changeRarityL(rarity) {
		let tempArr = [];

		for (let i = 0; i < classArr.length; i++) {
			let temp = classArr[i];
			if (curentLayer == i) {
				temp.rarityLayer = rarity;
			}
			tempArr.push(temp);
		}

		setClassArr(tempArr);
		console.log(classArr);
	}

	function setNewLayerName(event) {
		let tempVal = event.target.value;

		let tempArr = [];
		for (let i = 0; i < classArr.length; i++) {
			let temp = classArr[i];
			if (curentLayer == i) {
				temp.name = tempVal;
			}
			tempArr.push(temp);
		}
		setClassArr(tempArr);
	}

	return (
		<Router>
			<div
				className={
					errorModal.hidden === true || connectWallet ? "error-bg" : "hide"
				}
			>
				<span className={connectWallet ? "" : "hide"} onClick={close}></span>
			</div>
			<div
				className={
					errorModal.hidden === true || connectWallet ? "App-error" : "App App2"
				}
			>
				<Header activeCat={1}></Header>

				<div className="constructors">
					<div className="container-header">
						<div
							className={errorModal.hidden === true ? "error-modal" : "hide"}
						>
							<button className="close" onClick={closeError}>
								<span></span>
								<span></span>
							</button>
							<div className="message">{errorModal.message}</div>
						</div>

						<div className="modal-constructor modal-constructor-layers ">
							<div className="title-1">NFT Editor</div>
							<div class="steps mobile-steps">
								<div class="step step1">
									<div class="img"></div>
									<div class="text">
										<div class="name">Step 1</div>
										<div class="desc">Upload images</div>
									</div>
								</div>
								<div class="line"></div>
								<div
									class="step step2  active"
									onClick={() => {
										let res = logData();
										if (res) {
											history.push("/nft-customization");
										}
									}}
								>
									<div class="img"></div>
									<div class="text">
										<div class="name">Step 2</div>
										<div class="desc">Customize layers</div>
									</div>
								</div>
								<div class="line"></div>
								<div
									class="step step3"
									onClick={() => {
										let res = logData();
										if (res) {
											history.push("/nft-generate");
										}
									}}
								>
									<div class="img"></div>
									<div class="text">
										<div class="name">Step 3</div>
										<div class="desc">Create Collection</div>
									</div>
								</div>
							</div>
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

							<div style={{margin: "40px 0px 0px 0px"}} className="title">
								Layer Settings
							</div>
							<div className="text">Change your layers settings</div>
							<div className="setting">
								<div className="title-settings">Layer Name</div>
								<input
									type="text"
									className="input-settings"
									placeholder={classArr[curentLayer].name}
									onChange={setNewLayerName}
								/>
							</div>

							<div className="setting">
								<div className="title-settings">
									Rarity{" "}
									<span aria-label="hint" className="info hint--top"></span>
								</div>
								{classArr[curentLayer].imgs.map((item, index) => {
									return (
										<input
											key={"uniqueId" + index}
											className={
												curentImages[curentLayer] == index ? "rarity" : "hide"
											}
											type="range"
											min="0"
											max="4"
											step="1"
											value={classArr[curentLayer].rarityLayer}
											onChange={() => changeRarityL(event.target.value)}
										/>
									);
								})}

								<div className="grades">
									<span className="legendary">Legendary</span>
									<span className="epic">Epic</span>
									<span className="rare">Rare</span>
									<span className="uncommon">Unusual</span>
									<span className="common">Usual</span>
								</div>
							</div>

							{/* <div className="title">How to use?</div>
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
							</div> */}
						</div>

						<div className="modal-constructor modal-constructor-position">
							<div class="steps steps-desk">
								<div
									class="step step1"
									onClick={() => {
										history.push("/load-nft");
									}}
								>
									<div class="img"></div>
									<div class="text">
										<div class="name">Step 1</div>
										<div class="desc">Upload images</div>
									</div>
								</div>
								<div class="line"></div>
								<div class="step step2 active">
									<div class="img"></div>
									<div class="text">
										<div class="name">Step 2</div>
										<div class="desc">Customize layers</div>
									</div>
								</div>
								<div class="line"></div>
								<div
									class="step step3"
									onClick={() => {
										history.push("/nft-generate");
									}}
								>
									<div class="img"></div>
									<div class="text">
										<div class="name">Step 3</div>
										<div class="desc">Create Collection</div>
									</div>
								</div>
							</div>

							<div class="video-start">
								<span className="info"></span>Move layers to appropriate
								position
							</div>

							<div className="nft-img">
								<div
									// className={statusSize == "horizontal" ? "horizontal img" : statusSize == "vertical" ? "vertical img" : statusSize == "square" ? "square img" : "img"}
									// style={statusSize == ""?{
									// 	width: localStorage.getItem("width") + "px",
									// 	height: localStorage.getItem("height") + "px",
									// }:null}

									className={"img"}
									style={{
										width: localStorage.getItem("width") + "px",
										height: localStorage.getItem("height") + "px",
									}}
								>
									{/* classArr[0].src?.length > 0 */}
									{classArr[0].src?.length > 0
										? classArr.map((item, index) => {
												return (
													<img
														key={"uniqueId" + index}
														src={item.src[curentImages[index]]}
														style={{
															// width: item.width +"px",
															// height: item.height +"px",
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
										<div></div>
										<div></div>
										<div></div>
									</div>
								</div>
								<div className="break"></div>
								<div
									className="button-1-square"
									style={{width: localStorage.getItem("width") + "px"}}
									onClick={logData}
								>
									Next
								</div>
							</div>
						</div>

						<div className="modal-constructor modal-constructor-settings">
							<div className="import opacity">Import Project</div>
							{classArr.map((item, index) => {
								return (
									<div
										key={"uniqueId" + index}
										className={item.active ? "project-settings" : "hide"}
									>
										<div className="title">
											Layer Properties{" "}
											<span
												className={accordionHidden[0] ? "hidden" : ""}
												onClick={() => {
													accordionChange(0);
												}}
											></span>
										</div>
										<div className="text">Edit element position</div>
										<div className={accordionHidden[0] ? "hidden" : "setting"}>
											<div className="inputs">
												<div className="title-settings">Left Position</div>
												<div className="title-settings">Right Position</div>
											</div>
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
											<div className="inputs">
												<div
													className="zIndex"
													onClick={() => {
														setZ(item, "+");
													}}
												>
													Layer Up
												</div>
												<div
													className="zIndex"
													onClick={() => {
														setZ(item, "-");
													}}
												>
													Layer Down
												</div>
											</div>
											{/* <div className="setting">
											<div className="title-settings">Z-Index</div>

											<input
												type="text"
												placeholder="1"
												onChange={(event) => setZ(item, event)}
											/>
											</div> */}
										</div>

										<div className="title">
											Size{" "}
											<span
												className={accordionHidden[1] ? "hidden" : ""}
												onClick={() => {
													accordionChange(1);
												}}
											></span>
										</div>
										<div className="text">Edit element size</div>
										<div className={accordionHidden[1] ? "hidden" : "setting"}>
											<div className="inputs">
												<div className="title-settings">Width (px)</div>
												<div className="title-settings">Height (px)</div>
											</div>
											<div className="inputs">
												<input
													type="text"
													placeholder="150"
													onChange={(event) =>
														setCurentWidth(event.target.value)
													}
												/>
												<input
													type="text"
													placeholder="125"
													onChange={(event) => {
														setCurentHeight(event.target.value);
													}}
												/>
											</div>
										</div>

										<div
											className={
												accordionHidden[1] ? "hidden" : "button-1-square"
											}
											onClick={saveSize}
										>
											Save size
										</div>

										<div className="title">
											Elements{" "}
											<div aria-label="hint" className="hint hint--top"></div>{" "}
											<span
												className={accordionHidden[2] ? "hidden" : ""}
												onClick={() => {
													accordionChange(2);
												}}
											></span>
										</div>
										<div className="text">Uploaded elements</div>
										<div className={accordionHidden[2] ? "hidden" : "setting"}>
											<div className="inputs">
												{classArr[curentLayer].imgs.map((item, index) => {
													return (
														<div
															key={"uniqueId" + index}
															// className={"elem"}
															className={
																curentImages[curentLayer] == index
																	? "elem img-element img-element-active"
																	: "elem img-element"
															}
															onClick={() => setImgActive(index)}
														>
															<img src={getSrc(item)}></img>
														</div>
													);
												})}
											</div>
										</div>

										<div className="title">
											Element Settings{" "}
											<span
												className={accordionHidden[3] ? "hidden" : ""}
												onClick={() => {
													accordionChange(3);
												}}
											></span>
										</div>
										<div className="text"></div>
										<div className={accordionHidden[3] ? "hidden" : "setting"}>
											<div className="title-settings">
												Rarity{" "}
												<span
													aria-label="hint"
													className="info hint--top"
												></span>
											</div>
											{classArr[curentLayer].imgs.map((item, index) => {
												return (
													<input
														key={"uniqueId" + index}
														className={
															curentImages[curentLayer] == index
																? "rarity"
																: "hide"
														}
														type="range"
														min="0"
														max="4"
														step="1"
														value={classArr[curentLayer].rarity[index]}
														onChange={() => changeRarity(event.target.value)}
													/>
												);
											})}

											<div className="grades">
												<span className="legendary">Legendary</span>
												<span className="epic">Epic</span>
												<span className="rare">Rare</span>
												<span className="uncommon">Unusual</span>
												<span className="common">Usual</span>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
					{redirect ? <Redirect to="/nft-generate" /> : ""}
				</div>

				<Footer></Footer>
			</div>
		</Router>
	);
}

export default NftCustomization;
