import React, {useContext, useState, useEffect} from "react";
import {HashRouter as Router, Redirect, useHistory} from "react-router-dom";
import Context from "./Context";
import Header from "./Header";
import Footer from "./Footer";

import {useDispatch, useSelector} from "react-redux";
//import 'idempotent-babel-polyfill';

const axios = require("axios");
//const fs = require('fs');
const FormData = require("form-data");

const pinataKey = "0a2ed9f679a6c395f311";
const pinataSecretKey =
	"7b53c4d13eeaf7063ac5513d4c97c4f530ce7e660f0c147ab5d6aee6da9a08b9";

class MyClass {
	constructor(
		name,
		active,
		imgs,
		names,
		rarity,
		x,
		y,
		z_index,
		width,
		height,
		src = [],
	) {
		this.name = name;
		this.active = active;
		this.imgs = imgs;
		this.src = src;
		this.rarity = rarity;
		this.rarityLayer = ["4"];
		this.names = names;
		this.x = x;
		this.y = y;
		this.z_index = z_index;
		this.width = width;
		this.height = height;
	}

	logName() {
		console.log(this.name);
	}
}

function LoadNftPage() {
	useEffect(() => {
		if (document.location.href.split("?transactionHashes=")[1]) {
			let href = document.location.origin + document.location.hash;
			document.location.href = href;
		}
		if (localStorage.getItem("class") !== undefined) {
			let result = confirm("Continue with the current project?");

			if (result) {
				setClassArr1(JSON.parse(localStorage.getItem("class")));
			} else {
				setClassArr1([
					new MyClass("background", true, [], [], [], 0, 0, 0, 0, 0),
				]);
			}
		}
	}, []);

	//const {status} = useContext(Context);
	let history = useHistory();

	const dispatch = useDispatch();
	const connectWallet = useSelector((state) => state.connectWallet);

	const [classArr1, setClassArr1] = useState([
		new MyClass("background", true, [], [], [], 0, 0, 0, 0, 0),
	]);

	const [newLayer, setNewLayer] = useState();

	const [curentLayer, setCurenLayer] = useState(0);

	const [width, setWidth] = useState();
	const [height, setHeight] = useState();

	const [projectName, setProjectName] = useState("Project Name");
	const [collectionName, setCollectionName] = useState("No Name");
	const [projectDescription, setProjectDescription] = useState(
		"Project Description",
	);

	const [curentImages, setCurentImages] = useState([0]);

	const [connect, setConnect] = useState(false);

	const [urlImg, setUrlImg] = useState("");

	const [videoPlay, setVideoPlay] = useState(false);

	const [accordionHidden, setAccordioHidden] = useState([false, false]);

	const [errorInput, setErrorInput] = useState();

	// const [sizeImgs, setSizeImgs] = useState([0]);

	const [errorModal, setErrorModal] = useState({
		hidden: false,
		message: "",
	});

	const [redirect, setRedirect] = useState(false);

	const [activeNext, setActiveNext] = useState(false);

	const [tempBg, setTempBg] = useState([]);

	const pinFileToIPFS = async (
		pinataKey,
		pinataSecretKey,
		src,
		width,
		height,
		name,
	) => {
		const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

		let data = new FormData();

		console.log(src);
		data.append("file", src);

		await axios
			.post(url, data, {
				maxBodyLength: "Infinity", //this is needed to prevent axios from erroring out with large files
				headers: {
					"Content-Type": `multipart/form-data; boundary=${data._boundary}`,
					pinata_api_key: pinataKey,
					pinata_secret_api_key: pinataSecretKey,
				},
			})
			.then(function (response) {
				//handle response here
				console.log(response.data.IpfsHash);

				console.log(src);

				let tempArr = [];
				for (let i = 0; i < classArr1.length; i++) {
					let temp = classArr1[i];
					if (classArr1[curentLayer].name == classArr1[i].name) {
						if (temp.imgs[0] == undefined) {
							console.log("empty");

							setWidth(width);
							setHeight(height);

							temp.imgs = [];
							temp.imgs.push(response.data.IpfsHash);
							temp.width = width;
							temp.height = height;
							temp.names = [];
							temp.rarity = [];
							temp.rarity.push("4");
							temp.names.push(name);
						} else {
							temp.imgs.push(response.data.IpfsHash);
							temp.names.push(name);
							temp.rarity.push("4");
							// if ((temp.height == image.height && temp.width == image.width)) {
							// 	temp.imgs.push(src);
							// } else {
							// 	setErrorModal({
							// 		hidden: true,
							// 		message: "Your images are different sizes",
							// 	});
							// }
						}
					}
					tempArr.push(temp);
				}
				console.log(tempArr);
				setClassArr1(tempArr);
			})
			.catch(function (error) {
				//handle error here
				console.log(classArr1);
				console.error(error);
			});
	};

	function newClass(name, active, imgsL, x, y, z) {
		console.log(classArr1);

		for (let i = 0; i < classArr1.length; i++) {
			if (classArr1[i].name == name) {
				setErrorModal({
					hidden: true,
					message: "Give a unique name",
				});
				return;
			}
		}

		let temp = new MyClass(name, active, imgsL, [], [], x, y, z);

		let tempArr = Object.values(classArr1);
		tempArr.push(temp);

		//console.log(tempArr);

		setClassArr1(tempArr);

		// classArr.push(temp);
		// setClassArr1(classArr);
		console.log(classArr1);

		let curImg = curentImages;
		curImg.push(0);
		setCurentImages(curImg);
		//temp.logName();
	}

	function setActive(item) {
		console.log(classArr1[curentLayer].imgs);

		let tempArr = [];
		for (let i = 0; i < classArr1.length; i++) {
			let temp = classArr1[i];
			if (temp == item) {
				//console.log(1);
				temp.active = true;
				tempArr.push(temp);
				setCurenLayer(i);
			} else {
				temp.active = false;
				tempArr.push(temp);
			}
		}
		// console.log(tempArr);
		// console.log(curentLayer);
		setClassArr1(tempArr);
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

	function deleteLayer(item) {
		let tempArr1 = [];

		for (let i = 0; i < classArr1.length; i++) {
			let temp = classArr1[i];
			if (temp == item) {
			} else {
				tempArr1.push(temp);
			}
		}

		if (item.active == classArr1[curentLayer].active) {
			setCurenLayer(0);
		}

		console.log(tempArr1);

		if (classArr1.length == 1) {
			console.log(111);
			let temp = new MyClass("no name", false, [], [], 0, 0, 0);
			setClassArr1([temp]);
		} else {
			setClassArr1(tempArr1);
		}
	}

	function download(event) {
		for (let i = 0; i < event.target.files.length; i++) {
			let file = event.target.files[i];

			if (event.target.files[0].size / 1024 / 1024 > 5) {
				setErrorModal({
					hidden: true,
					message: "Image is larger than 5MB",
				});
				return;
			}

			var image = new Image();
			image.src = URL.createObjectURL(file);
			image.onload = function () {
				console.log(image.width, image.height);

				let name = file.name.substring(0, file.name.indexOf("."));

				pinFileToIPFS(
					pinataKey,
					pinataSecretKey,
					event.target.files[i],
					image.width,
					image.height,
					name,
				);
			};
		}
	}

	function removeImg(index) {
		let tempArr = [];

		for (let i = 0; i < classArr1.length; i++) {
			let temp = classArr1[i];
			let tempArrImg = [];
			let tempArrNames = [];
			let tempArrImgSize = [];
			if (classArr1[curentLayer].name == classArr1[i].name) {
				for (let j = 0; j < classArr1[i].imgs.length; j++) {
					console.log(classArr1[i].imgs.length);

					if (classArr1[i].imgs[j] != classArr1[i].imgs[index]) {
						//console.log(1);

						tempArrImg.push(classArr1[curentLayer].imgs[j]);
						tempArrNames.push(classArr1[curentLayer].names[j]);
						//tempArrImgSize.push(sizeImgs[j]);
					}
				}

				temp.imgs = tempArrImg;
				temp.names = tempArrNames;
				//setSizeImgs(tempArrImgSize);
			}

			tempArr.push(temp);
		}
		setClassArr1(tempArr);
	}

	function changeRarity(rarity) {
		let tempArr = [];

		for (let i = 0; i < classArr1.length; i++) {
			let temp = classArr1[i];
			if (curentLayer == i) {
				for (let j = 0; j < classArr1[i].rarity.length; j++) {
					if (curentImages[curentLayer] == j) {
						temp.rarity[j] = rarity;
					}
				}
			}
			tempArr.push(temp);
		}

		setClassArr1(tempArr);
		console.log(classArr1);
	}

	function setNewLayerName(event) {
		let tempVal = event.target.value;

		let tempArr = [];
		for (let i = 0; i < classArr1.length; i++) {
			let temp = classArr1[i];
			if (curentLayer == i) {
				temp.name = tempVal;
			}
			tempArr.push(temp);
		}
		setClassArr1(tempArr);
	}

	function getBase64Image(src) {
		var img = new Image();
		img.src = src;
		img.onload = function () {
			var canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;

			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);

			var dataURL = canvas.toDataURL("image/png");

			//console.log(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));

			return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
		};
	}

	function getSrc(src) {
		return "https://cloudflare-ipfs.com/ipfs/" + src;
	}

	function logData() {
		console.log("-----------");

		for (let i = 0; i < classArr1.length; i++) {
			// console.log(classArr1[i].imgs[0]);
			if (classArr1[i].imgs[0] == undefined) {
				setErrorModal({
					hidden: true,
					message: "Each layer must contain at least 1 image.",
				});
			}
		}

		// console.log(width, height);

		// console.log("12ghj3"==parseInt("1ghj23", 10));

		if (width <= 0 || width == undefined || width != parseInt(width, 10)) {
			setErrorInput("width");
			// setErrorModal({
			// 	hidden: true,
			// 	message: "Enter size",
			// });
			return false;
		}

		if (height <= 0 || height == undefined || height != parseInt(height, 10)) {
			setErrorInput("height");
			// setErrorModal({
			// 	hidden: true,
			// 	message: "Enter size",
			// });
			return false;
		}

		if (width > 700 || height > 700) {
			setErrorModal({
				hidden: true,
				message: "The size is too large",
			});
			return false;
		}

		// if (width/height > 2) {
		// 	setErrorModal({
		// 		hidden: true,
		// 		message: "The aspect ratio must be no more than 4:2",
		// 	});
		// 	return;
		// }

		// if (width/height < 0.5) {
		// 	setErrorModal({
		// 		hidden: true,
		// 		message: "The aspect ratio must be no more than 2:4",
		// 	});
		// 	return;
		// }

		if (collectionName === "" || collectionName === undefined) {
			// setErrorModal({
			// 	hidden: true,
			// 	message: "Set collection name",
			// });

			// setErrorInput("colName");

			setCollectionName("No Name");
			// return;
		}

		if (projectName === "" || projectName === undefined) {
			// setErrorModal({
			// 	hidden: true,
			// 	message: "Set project name",
			// });

			// setProjectName("Project Name");

			setProjectName("Project Name");

			// return;
		}

		if (projectDescription === "" || projectDescription === undefined) {
			// setErrorModal({
			// 	hidden: true,
			// 	message: "Set project description",
			// });

			// setErrorInput("colDesc");

			setProjectDescription("Project Description");
			// return;
		}

		console.log(classArr1);

		localStorage.setItem("class", JSON.stringify(classArr1));
		localStorage.setItem("width", width);
		localStorage.setItem("height", height);
		localStorage.setItem("curentLayer", curentLayer);
		sessionStorage.setItem(
			"details",
			JSON.stringify({
				projectName: projectName,
				projectDescription: projectDescription,
			}),
		);

		return true;
		// setRedirect(true);
	}

	async function downloadUrl() {
		const pinataKey = "0a2ed9f679a6c395f311";
		const pinataSecretKey =
			"7b53c4d13eeaf7063ac5513d4c97c4f530ce7e660f0c147ab5d6aee6da9a08b9";
		console.log(urlImg);

		var image = new Image();
		image.src = urlImg;
		console.log(image);
		image.onload = function () {
			console.log(image);
		};

		await fetch(urlImg, {
			mode: "no-cors",
			// headers: {
			// 	"Content-Type": "application/json",

			// },
		})
			.then((res) => res.blob())
			.then((blob) => {
				const file = new File([blob], "File name", {type: "image/png"});

				const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

				let data = new FormData();

				data.append("file", file);

				console.log(file);

				var image = new Image();
				image.src = URL.createObjectURL(file);
				console.log(image);
				image.onload = function () {
					console.log(image);
				};

				return axios
					.post(url, data, {
						maxBodyLength: "Infinity",
						headers: {
							"Content-Type": `multipart/form-data; boundary=${data._boundary}`,
							pinata_api_key: pinataKey,
							pinata_secret_api_key: pinataSecretKey,
						},
					})
					.then(async function (response) {
						console.log(response.data.IpfsHash);

						// let tempArr = [];
						// for (let i = 0; i < classArr1.length; i++) {
						// 	let temp = classArr1[i];
						// 	if (classArr1[curentLayer].name == classArr1[i].name) {
						// 		if (temp.imgs[0] == undefined) {
						// 			console.log("empty");

						// 			setWidth(width);
						// 			setHeight(height);

						// 			temp.imgs = [];
						// 			temp.imgs.push(response.data.IpfsHash);
						// 			temp.width = width;
						// 			temp.height = height;
						// 			temp.names = [];
						// 			temp.rarity = [];
						// 			temp.rarity.push("4");
						// 			temp.names.push("Name");
						// 		} else {
						// 			temp.imgs.push(response.data.IpfsHash);
						// 			temp.names.push("Name");
						// 			temp.rarity.push("4");
						// 			// if ((temp.height == image.height && temp.width == image.width)) {
						// 			// 	temp.imgs.push(src);
						// 			// } else {
						// 			// 	setErrorModal({
						// 			// 		hidden: true,
						// 			// 		message: "Your images are different sizes",
						// 			// 	});
						// 			// }
						// 		}
						// 	}
						// 	tempArr.push(temp);
						// }
						// console.log(tempArr);
						// setClassArr1(tempArr);
					});
			});
	}

	function closeError() {
		setErrorModal({
			hidden: false,
			message: "",
		});
	}

	// function summImgs() {
	// 	let temp = 0;
	// 	for(let i = 0; i < sizeImgs.length; i++) {
	// 		temp += Number(sizeImgs[i]);
	// 		//console.log(sizeImgs);
	// 	}
	// 	return temp;
	// }

	// function pinataFunc() {
	// 	pinata.testAuthentication().then((result) => {
	// 		//handle successful authentication here
	// 		console.log(result);
	// 	}).catch((err) => {
	// 		//handle error here
	// 		console.log(err);
	// 	});
	// }

	function close() {
		dispatch({type: "closeConnect"});
		console.log(connectWallet);
	}

	function changeError(input, value) {
		if (value !== "" && value !== undefined) {
			setErrorInput("");
			if (
				width !== "" &&
				width !== undefined &&
				height !== "" &&
				height !== undefined
			) {
				setActiveNext(true);
			} else {
				setActiveNext(false);
			}
		} else {
			setErrorInput(input);
			setActiveNext(false);
		}

		if (input == "width") {
			setWidth(value);
		}
		if (input == "height") {
			setHeight(value);
		}
		if (input == "colName") {
			setCollectionName(value);
		}
		if (input == "colDesc") {
			setProjectDescription(value);
		}
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

	return (
		<Router>
			<div
				className={
					errorModal.hidden === true || connect === true || connectWallet
						? "error-bg"
						: "hide"
				}
			>
				<span className={connectWallet ? "" : "hide"} onClick={close}></span>
			</div>
			<div className={videoPlay ? "video-player" : "hide"}>
				<button className="close" onClick={() => setVideoPlay(false)}>
					<span></span>
					<span></span>
				</button>

				<div className="video">
					<iframe
						src="https://www.youtube.com/embed/YHatcktJM8I"
						title="YouTube video player"
						frameBorder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					></iframe>
				</div>
			</div>
			<div
				className={
					errorModal.hidden === true || connect === true || connectWallet
						? "App-error"
						: "App App2"
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
							<button className="button-3-square" onClick={closeError}>
								OK
							</button>
						</div>

						<div className="modal-constructor modal-constructor-layers">
							<div className="title-1">NFT Editor</div>

							<div class="steps mobile-steps">
								<div class="step step1 active">
									<div class="img"></div>
									<div class="text">
										<div class="name">Step 1</div>
										<div class="desc">Upload images</div>
									</div>
								</div>
								<div class="line"></div>
								<div
									class="step step2"
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
							<div className="text">Add and edit layers</div>
							{classArr1.map((item, index) => {
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
										<span>{item.name.slice(0, 27)}</span>
									</div>
								);
							})}

							<div className="layers-list_layer-input">
								<div className="title">Add New Layer</div>
								<input
									type="text"
									placeholder="Layer Name"
									onChange={(ev) => {
										setNewLayer(ev.target.value);
									}}
								/>
								<button
									className="button-4-square"
									onClick={() => newClass(newLayer, false, [], 0, 0, 0, 0, 0)}
								>
									+
								</button>
							</div>

							<div className="title">Layer Settings</div>
							<div className="text">Change your layers settings</div>
							<div className="setting">
								<div className="title-settings">Layer Name</div>
								<input
									type="text"
									className="input-settings"
									placeholder={classArr1[curentLayer].name}
									onChange={setNewLayerName}
								/>
							</div>
						</div>
						<div className="modal-constructor modal-constructor-upload">
							<div class="steps">
								<div class="step step1 active">
									<div class="img"></div>
									<div class="text">
										<div class="name">Step 1</div>
										<div class="desc">Upload images</div>
									</div>
								</div>
								<div class="line"></div>
								<div
									class="step step2"
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

							<div class="video-start">
								Not sure where to start? &nbsp;{" "}
								<span onClick={() => setVideoPlay(true)}>
									{" "}
									Check out our intro video here.
								</span>
							</div>

							<div
								className="drop-img"
								onDrop={(e) => {
									let event = e;
									console.log(e);
									event.stopPropagation();
									event.preventDefault();
								}}
								onDragOver={(e) => {
									let event = e;
									console.log(e);
									event.stopPropagation();
									event.preventDefault();
								}}
							>
								<div className="imgs-list">
									{classArr1[curentLayer].imgs.map((item, index) => {
										return (
											<div
												key={"uniqueId" + index}
												className={
													curentImages[curentLayer] == index
														? "img-element img-element-active"
														: "img-element"
												}
												onClick={() => setImgActive(index)}
											>
												<div className="close" onClick={() => removeImg(index)}>
													<span></span>
													<span></span>
												</div>
												<img src={getSrc(item)}></img>
												{/* <div className="name">
													{classArr1[curentLayer].names[index]}
												</div> */}
											</div>
										);
									})}
								</div>

								<input
									type="file"
									id="input_file"
									accept=".png,.jpg,.jpeg"
									onChange={download}
									multiple
								/>

								<label htmlFor="input_file" className="input__file-button">
									<span className="input__file-icon-wrapper"></span>
									<span className="input__file-text">Browse Image</span>
									<span className="input__file-text2">
										(image/png, image/jpg, image/jpeg, Max size: 5MB)
									</span>
								</label>
								{/* <input className="text" type="file" onChange={(ev) => download(ev.target)}/> */}
								{/* Click or drop images here!
								(image/png, image/gif, video/mp4, Max size: 10MB) */}
								{/* </input> */}
								{/* <button type="button" onClick={logImgs}>Log imgs</button> */}
							</div>
							{/* <div>
								<div className="text">Download the image from the link</div>
								<input className="input" onChange={(ev)=>{
									setUrlImg(ev.target.value);
								}}/>
								<button className="button-1-square" onClick={downloadUrl}>Add</button>
							</div> */}
							<div
								className={
									activeNext ? "button-1-square" : "button-1-square unactive"
								}
								onClick={() => {
									let res = logData();
									if (res) {
										history.push("/nft-customization");
									}
								}}
							>
								Next
							</div>
						</div>

						<div className="modal-constructor modal-constructor-settings">
							<div className="import">Import Project</div>
							<div className="project-settings">
								<div className="title">
									Project details{" "}
									<span
										className={accordionHidden[0] ? "hidden" : ""}
										onClick={() => {
											accordionChange(0);
										}}
									></span>
								</div>
								<div className="text">Add project name & description.</div>
								<div className={accordionHidden[0] ? "hidden" : "setting"}>
									<div className="title-settings">Project Name</div>
									<input
										type="text"
										placeholder="Project Name"
										className="input-settings"
										// value={projectName}
										onChange={(event) => setProjectName(event.target.value)}
									/>
									{/* <span className="errMsg">Set project name</span> */}
								</div>
								<div className={accordionHidden[0] ? "hidden" : "setting"}>
									<div className="title-settings">Collection Name</div>
									<input
										type="text"
										placeholder="No Name"
										value={collectionName}
										className={
											errorInput == "colName"
												? "input-settings inputErr"
												: "input-settings"
										}
										onChange={(event) =>
											changeError("colName", event.target.value)
										}
									/>
									<span className={errorInput == "colName" ? "errMsg" : "hide"}>
										Set Collection Name
									</span>
								</div>
								<div className={accordionHidden[0] ? "hidden" : "setting"}>
									<div className="title-settings">Collection Description</div>
									<textarea
										type="text"
										placeholder="Collection Description"
										className={
											errorInput == "colDesc"
												? "input-settings inputErr"
												: "input-settings"
										}
										onChange={(event) =>
											changeError("colDesc", event.target.value)
										}
									/>
									<span className={errorInput == "colDesc" ? "errMsg" : "hide"}>
										Set Collection Description
									</span>
								</div>
								<div className="title">
									Dimensions{" "}
									<div
										aria-label="The image resolution are picked from the first image you drag and drop. We expect all images to be the same resolution."
										className="hint hint--top hint--large"
									></div>{" "}
									<span
										className={accordionHidden[1] ? "hidden" : ""}
										onClick={() => {
											accordionChange(1);
										}}
									></span>
								</div>
								<div className="text">
									Edit canvas dimensions <br /> Max size: 5 MB
								</div>
								<div
									className={
										accordionHidden[1] ? "hidden" : "setting setting-grid"
									}
								>
									{/* <div className="title-settings">Dimension (px)</div> */}

									<div class="dim-title">Width (px)</div>
									<div class="dim-title">Height (px)</div>
									<div className="dimensions">
										<input
											type="text"
											placeholder="700"
											value={width}
											className={
												errorInput == "width"
													? "input-settings inputL inputL1 inputErr"
													: "input-settings inputL inputL1"
											}
											onChange={(event) =>
												changeError("width", event.target.value)
											}
										/>
										<span className={errorInput == "width" ? "errMsg" : "hide"}>
											Set width
										</span>
									</div>

									<div className="dimensions">
										<input
											type="text"
											placeholder="700"
											value={height}
											className={
												errorInput == "height"
													? "input-settings inputL inputErr"
													: "input-settings inputL"
											}
											onChange={(event) =>
												changeError("height", event.target.value)
											}
										/>
										<span
											className={errorInput == "height" ? "errMsg" : "hide"}
										>
											Set height
										</span>
									</div>
								</div>

								{/* <div className="title">Element Settings</div>
								<div className="text">Change your element settings</div>
								<div className="setting">
									<div className="title-settings">Rarity</div>
									{classArr1[curentLayer].imgs.map((item, index) => {
										return (
											<input
												key={"uniqueId"+index}
												className={
													curentImages[curentLayer] == index ? "" : "hide"
												}
												type="range"
												min="0"
												max="4"
												step="1"
												value={classArr1[curentLayer].rarity[index]}
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
								</div> */}
							</div>
						</div>
						<div className="break"></div>
						{/* <a href="#/nft-customization"><div className="next" onClick={logData}>Next</div></a> */}

						{redirect ? <Redirect to="/nft-customization" /> : ""}
					</div>
				</div>

				<Footer></Footer>
			</div>
		</Router>
	);
}

export default LoadNftPage;
