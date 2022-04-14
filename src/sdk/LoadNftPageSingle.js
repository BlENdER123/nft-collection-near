import React, {useContext, useState, useEffect} from "react";
import {HashRouter as Router, Redirect, useHistory} from "react-router-dom";
import Context from "./Context";
//import 'idempotent-babel-polyfill';

import Header from "./Header";
import Footer from "./Footer";

import {useDispatch, useSelector} from "react-redux";

const axios = require("axios");
//const fs = require('fs');
const FormData = require("form-data");

const pinataKey = "0a2ed9f679a6c395f311";
const pinataSecretKey =
	"7b53c4d13eeaf7063ac5513d4c97c4f530ce7e660f0c147ab5d6aee6da9a08b9";

// const testAuthentication = () => {
//     const url = `https://api.pinata.cloud/data/testAuthentication`;
//     return axios
//         .get(url, {
//             headers: {
//                 pinata_api_key: '0a2ed9f679a6c395f311',
//                 pinata_secret_api_key: '7b53c4d13eeaf7063ac5513d4c97c4f530ce7e660f0c147ab5d6aee6da9a08b9'
//             }
//         })
//         .then(function (response) {
//             //handle your response here
// 			console.log(response);
//         })
//         .catch(function (error) {
//             //handle error here
// 			console.error(error);
//         });
// };

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

function LoadNftPageSingle() {
	useEffect(() => {
		if (document.location.href.split("?transactionHashes=")[1]) {
			let href = document.location.origin + document.location.hash;
			document.location.href = href;
		}
	}, []);

	let history = useHistory();
	//const {status} = useContext(Context);
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
	const [projectDescription, setProjectDescription] = useState(
		"Project Description",
	);

	const [curentImages, setCurentImages] = useState([0]);

	const [connect, setConnect] = useState(false);

	// const [sizeImgs, setSizeImgs] = useState([0]);

	const [errorModal, setErrorModal] = useState({
		hidden: false,
		message: "",
	});

	const [redirect, setRedirect] = useState(false);

	const [tempBg, setTempBg] = useState([]);

	const pinFileToIPFS = (
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

		return axios
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

				let tempArr = [];
				for (let i = 0; i < classArr1.length; i++) {
					let temp = classArr1[i];
					if (classArr1[curentLayer].name == classArr1[i].name) {
						if (temp.imgs[0] == undefined) {
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
		let file = event.target.files[0];

		// console.log(sizeImgs);
		// let summ = summImgs();
		// console.log(summ);
		// if(summ < 4.5 && (event.target.files[0].size/1024/1024) < 4.5 && (event.target.files[0].size/1024/1024+summ)<4.5) {
		// 	let size = event.target.files[0].size/1024/1024;
		// 	let temp = sizeImgs;
		// 	temp.push(size);
		// 	setSizeImgs(temp);
		// } else {
		// 	setErrorModal({
		// 		hidden: true,
		// 		message: "Images are larger than 5 MB",
		// 	});
		// 	return;
		// }
		// console.log(sizeImgs);

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
			//console.log(image.width);

			// var canvas = document.createElement("canvas");
			// canvas.width = image.width;
			// canvas.height = image.height;

			// var ctx = canvas.getContext("2d");
			// ctx.drawImage(image, 0, 0);

			// var dataURL = canvas.toDataURL("image/png");

			// //console.log(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));

			// let src = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
			let name = file.name.substring(0, file.name.indexOf("."));

			pinFileToIPFS(
				pinataKey,
				pinataSecretKey,
				event.target.files[0],
				image.width,
				image.height,
				name,
			);

			//setSrc(URL.createObjectURL(file));

			// let tempArr = [];
			// for (let i = 0; i < classArr1.length; i++) {
			// 	let temp = classArr1[i];
			// 	if (classArr1[curentLayer].name == classArr1[i].name) {
			// 		if (temp.imgs[0] == undefined) {
			// 			temp.imgs = [];
			// 			temp.imgs.push(src);
			// 			temp.width = image.width;
			// 			temp.height = image.height;
			// 		} else {
			// 			temp.imgs.push(src);
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
		};
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
			if (classArr1[curentLayer].name == classArr1[i].name) {
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
		if (
			width <= 0 ||
			height <= 0 ||
			width == undefined ||
			height == undefined
		) {
			setErrorModal({
				hidden: true,
				message: "Enter size",
			});
			return;
		}

		if (width > 700 || height > 800) {
			setErrorModal({
				hidden: true,
				message: "The size is too large",
			});
			return;
		}

		if (projectName === "" || projectName === undefined) {
			// setErrorModal({
			// 	hidden: true,
			// 	message: "Set project name",
			// });
			// return;
			setProjectName("Project Name");
		}

		if (projectDescription === "" || projectDescription === undefined) {
			// setErrorModal({
			// 	hidden: true,
			// 	message: "Set project description",
			// });
			// return;
			setProjectDescription("Project Description");
		}

		// for (let i = 0; i < classArr1.length; i++) {
		// 	if(i!==0) {
		// 		if (classArr1[i].height > height || classArr1[i].width > width) {
		// 			setErrorModal({
		// 				hidden: true,
		// 				message: "The selected size are smaller than your images",
		// 			});
		// 			return;
		// 		}
		// 	}
		// }

		// let tempArr = [];
		// for (let i = 0; i < classArr1.length; i++) {
		// 	let temp = classArr1[i];
		// 	if (i == 0) {
		// 		if (temp.imgs[0] == undefined) {
		// 			console.log("Background is empty");
		// 		} else {

		// 			for(let j = 0; j < classArr1[0].imgs.length; j++) {
		// 				var image = new Image();
		// 				image.src = getSrc(classArr1[0].imgs[j]);
		// 				image.onload = function () {
		// 					//console.log(image.width);

		// 					var canvas = document.createElement("canvas");
		// 					canvas.width = width;
		// 					canvas.height = height;

		// 					var ctx = canvas.getContext("2d");
		// 					ctx.drawImage(image, 0, 0, width, height);

		// 					var dataURL = canvas.toDataURL("image/png");

		// 					//console.log(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));

		// 					let src = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
		// 					tempBg.push(src);
		// 					//console.log(src);
		// 					let tempbb = tempBg;
		// 					tempbb.push(src);
		// 					setTempBg(tempbb);
		// 					//setSrc(URL.createObjectURL(file));
		// 				};
		// 			}

		// 			// for(let i = 0; i < temp.imgs.length; i++) {
		// 			// 	temp.imgs[i] = tempBg[i];
		// 			// }
		// 			// console.log(temp.imgs);
		// 			console.log(tempBg);
		// 			temp.imgs = tempBg;
		// 		}
		// 	}
		// 	tempArr.push(temp);
		// }
		// console.log(tempArr);
		// setClassArr1(tempArr);

		// console.log(tempBg);

		console.log(classArr1);

		// window.nfts = classArr1;
		// console.log(window.nfts);

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

		// setRedirect(true);
		history.push("/nft-customization-single");
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
										<span>{item.name}</span>
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
									className="button-1-square"
									onClick={() => newClass(newLayer, false, [], 0, 0, 0, 0, 0)}
								>
									Add Layer
								</button>
							</div>
						</div>
						<div className="modal-constructor modal-constructor-upload">
							<a href="https://www.youtube.com/watch?v=YHatcktJM8I">
								<button className="button-3-square">
									Not sure where to start? Check out our intro video here.
								</button>
							</a>

							<div className="drop-img">
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
												<div className="name">
													{classArr1[curentLayer].names[index].substring(0, 7)}
												</div>
											</div>
										);
									})}
								</div>

								<input
									type="file"
									id="input_file"
									accept=".png,.jpg,.jpeg"
									onChange={download}
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
							<div className="button-1-square" onClick={logData}>
								Upload & Next
							</div>
						</div>

						<div className="modal-constructor modal-constructor-settings">
							<div className="project-settings">
								<div className="title">Project details</div>
								<div className="text">Add project name & description.</div>
								<div className="setting">
									<div className="title-settings">Project Name</div>
									<input
										type="text"
										placeholder="No Name"
										className="input-settings"
										onChange={(event) => setProjectName(event.target.value)}
									/>
								</div>
								<div className="setting">
									<div className="title-settings">Project Description</div>
									<textarea
										type="text"
										placeholder="Project Description"
										className="input-settings"
										onChange={(event) =>
											setProjectDescription(event.target.value)
										}
									/>
								</div>
								<div className="setting">
									<div className="title-settings">Dimension (px)</div>

									<input
										type="text"
										placeholder="700"
										className="input-settings inputL inputL1"
										onChange={(event) => setWidth(event.target.value)}
									/>

									<input
										type="text"
										placeholder="800"
										className="input-settings inputL"
										onChange={(event) => setHeight(event.target.value)}
									/>
									<span>Max size: 5MB</span>
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

								<div className="title">Element Settings</div>
								<div className="text">Change your element settings</div>
								<div className="setting">
									<div className="title-settings">Rarity</div>
									{classArr1[curentLayer].imgs.map((item, index) => {
										return (
											<input
												key={"uniqueId" + index}
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
								</div>
							</div>
						</div>
						<div className="break"></div>
						{/* <a href="#/nft-customization"><div className="next" onClick={logData}>Next</div></a> */}

						{redirect ? <Redirect to="/nft-customization-single" /> : ""}
					</div>
				</div>

				<Footer></Footer>
			</div>
		</Router>
	);
}

export default LoadNftPageSingle;
