import React, {useState, useEffect, useRef} from "react";
import {HashRouter as Router, Redirect, useHistory} from "react-router-dom";
import {Rnd} from "react-rnd";

import Header from "./Header";
import Footer from "./Footer";

import {useDispatch, useSelector} from "react-redux";

Object.defineProperty(window, "indexedDB", {
	value:
		window.indexedDB ||
		window.mozIndexedDB ||
		window.webkitIndexedDB ||
		window.msIndexedDB,
});

function NftCustomization() {
	let history = useHistory();

	let nftArea = useRef();

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

	const [nftSizeIndex, setNftSizeIndex] = useState(1);

	const [nftAreaSize, setNftAreaSize] = useState({
		width: 0,
		height: 0,
	});

	const [newSizesArr, setNewSizesArr] = useState();

	useEffect(() => {
		// image scaling and area
		console.log(nftArea.current.offsetWidth);

		let areaWidth = nftArea.current.offsetWidth;

		let nftWidth = localStorage.getItem("width");
		let nftHeight = localStorage.getItem("height");

		console.log(nftWidth, areaWidth, nftHeight);

		let realSizes = [];
		console.log("useEff");
		if (nftWidth > areaWidth || nftHeight > areaWidth) {
			console.log("if1");
			if (parseInt(nftWidth, 10) > parseInt(nftHeight, 10)) {
				let index = nftWidth / areaWidth;
				let newHeight = nftHeight / index;

				setNftAreaSize({
					width: areaWidth,
					height: newHeight,
				});

				setNftSizeIndex(index);

				console.log(index, newHeight);
				for (let i = 0; i < arr.length; i++) {
					realSizes.push({
						width: [],
						height: [],
					});
					for (let j = 0; j < arr[i].imgs.length; j++) {
						let tempWidth = arr[i].sizes.width[j];
						let tempHeight = arr[i].sizes.height[j];

						let realWidth = tempWidth / index;
						let realHeight = tempHeight / index;

						console.log(realHeight, realWidth);

						realSizes[i].width[j] = realWidth;
						realSizes[i].height[j] = realHeight;
					}

					// console.log(tempWidth, tempHeight);

					// arr[i].width = realWidth;
					// arr[i].height = realHeight;
				}
			} else if (parseInt(nftWidth, 10) < parseInt(nftHeight, 10)) {
				let index = nftHeight / areaWidth;
				let newWidth = nftWidth / index;

				setNftAreaSize({
					width: newWidth,
					height: areaWidth,
				});

				setNftSizeIndex(index);

				console.log(index, newWidth);
				for (let i = 0; i < arr.length; i++) {
					realSizes.push({
						width: [],
						height: [],
					});
					for (let j = 0; j < arr[i].imgs.length; j++) {
						let tempWidth = arr[i].sizes.width[j];
						let tempHeight = arr[i].sizes.height[j];

						// console.log(tempWidth, tempHeight);

						let realWidth = tempWidth / index;
						let realHeight = tempHeight / index;

						console.log(realHeight, realWidth);

						realSizes[i].width[j] = realWidth;
						realSizes[i].height[j] = realHeight;
					}
				}
			} else if (parseInt(nftWidth, 10) == parseInt(nftHeight, 10)) {
				let index = nftHeight / areaWidth;

				setNftAreaSize({
					width: areaWidth,
					height: areaWidth,
				});

				setNftSizeIndex(index);

				console.log(index);
				for (let i = 0; i < arr.length; i++) {
					realSizes.push({
						width: [],
						height: [],
					});
					for (let j = 0; j < arr[i].imgs.length; j++) {
						let tempWidth = arr[i].sizes.width[j];
						let tempHeight = arr[i].sizes.height[j];

						// console.log(tempWidth, tempHeight);

						let realWidth = tempWidth / index;
						let realHeight = tempHeight / index;

						console.log(realHeight, realWidth);

						realSizes[i].width[j] = realWidth;
						realSizes[i].height[j] = realHeight;
					}
				}
			}
		} else {
			console.log("if2");
			setNftAreaSize({
				width: nftWidth,
				height: nftHeight,
			});

			setNftSizeIndex(1);

			for (let i = 0; i < arr.length; i++) {
				realSizes.push({
					width: [],
					height: [],
				});
				for (let j = 0; j < arr[i].imgs.length; j++) {
					let tempWidth = arr[i].sizes.width[j];
					let tempHeight = arr[i].sizes.height[j];

					// console.log(tempWidth, tempHeight);

					let realWidth = tempWidth;
					let realHeight = tempHeight;

					console.log(realHeight, realWidth);

					realSizes[i].width[j] = realWidth;
					realSizes[i].height[j] = realHeight;
				}
			}
			// for(let i = 0; i < arr.length; i++) {
			// 	let tempWidth = arr[i].width;
			// 	let tempHeight = arr[i].height;

			// 	let realWidth = (tempWidth/(nftWidth/100))*(localStorage.getItem("width")/100);
			// 	let realHeight = (tempHeight/(nftHeight/100))*(localStorage.getItem("height")/100);

			// 	console.log(realHeight, realWidth);

			// 	arr[i].width = realWidth;
			// 	arr[i].height = realHeight;
			// }
		}

		console.log(realSizes);
		setNewSizesArr(realSizes);
	}, []);

	console.log(nftAreaSize, nftSizeIndex);

	// console.log(document.documentElement.clientHeight);

	console.log(arr);

	const [classArr, setClassArr] = useState(arr);

	let localClass = arr;
	// loading project from localStorage

	var openRequest = window.indexedDB.open("imgsStore", 1);
	localClass = JSON.parse(localStorage.getItem("class"));
	openRequest.onsuccess = async (event) => {
		console.log(event);

		let db = event.target.result;

		let store = db.transaction("imgs").objectStore("imgs");

		for (let i = 0; i < localClass.length; i++) {
			for (let j = 0; j < localClass[i].imgs.length; j++) {
				store.get(localClass[i].imgs[j]).onsuccess = (event) => {
					console.log(event.target.result);
					localClass[i].url[j] = URL.createObjectURL(event.target.result);
				};
			}
		}

		console.log(localClass);

		// setTimeout(()=>{
		// 	setClassArr1(localClass);
		// }, 1000);
	};

	useEffect(() => {
		copySrc();
		setTimeout(() => {
			console.log("useEff 3");
			setClassArr(localClass);
			console.log(localClass);
		}, 1000);
	}, []);

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

	const [activePosition, setActivePosition] = useState({x: 0, y: 0});

	const [errorModal, setErrorModal] = useState({
		hidden: false,
		message: "",
	});

	const dragStart = (e) => {
		console.log("START", e.clientX, e.clientY);
		if (e.clientX === 0 && e.clientY === 0) return;
		setActivePosition({x: e.clientX, y: e.clientY});
	};

	const dragEnd = (e) => {
		console.log("END", e.clientX, e.clientY);
		setActivePosition({x: 0, y: 0});
	};

	const Drag = (x, y, index) => {
		let tempArr = [];
		for (let i = 0; i < classArr.length; i++) {
			let temp = classArr[i];
			if (i == index) {
				temp.x = x;
				temp.y = y;
				tempArr.push(temp);
			} else {
				tempArr.push(temp);
			}
		}
		setClassArr(tempArr);
	};

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
		// console.log(curentLayer);
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

		console.log(classArr);
		console.log(item, event);

		let curentIndex;
		let changeIndex;

		for (let i = 0; i < classArr.length; i++) {
			let temp = classArr[i];
			if (temp == item && event == "+") {
				curentIndex = i;
				changeIndex = i - 1;
				console.log(i, i - 1);
			}
			if (temp == item && event == "-") {
				curentIndex = i;
				changeIndex = i + 1;
				console.log(i, i + 1);
			}
			tempArr.push(temp);
		}
		[tempArr[curentIndex], tempArr[changeIndex]] = [
			tempArr[changeIndex],
			tempArr[curentIndex],
		];

		let tempSizeArr = newSizesArr;
		[tempSizeArr[curentIndex], tempSizeArr[changeIndex]] = [
			tempSizeArr[changeIndex],
			tempSizeArr[curentIndex],
		];

		let tempCurentImages = curentImages;
		[tempCurentImages[curentIndex], tempCurentImages[changeIndex]] = [
			tempCurentImages[changeIndex],
			tempCurentImages[curentIndex],
		];

		console.log(tempArr);
		setCurentImages(tempCurentImages);
		setNewSizesArr(tempSizeArr);
		setCurentLayer(changeIndex);
		setClassArr(tempArr);

		// for (let i = 0; i < classArr.length; i++) {
		// 	let temp = classArr[i];
		// 	if (temp == item) {
		// 		if (event == "+") {
		// 			let newZ = temp.z_index;
		// 			newZ++;
		// 			temp.z_index = newZ;
		// 			tempArr.push(temp);
		// 		} else if (temp.z_index > 0) {
		// 			let newZ = temp.z_index;
		// 			newZ--;
		// 			temp.z_index = newZ;
		// 			tempArr.push(temp);
		// 		} else {
		// 			tempArr.push(temp);
		// 		}
		// 	} else {
		// 		tempArr.push(temp);
		// 	}
		// }
		// setClassArr(tempArr);
	}

	function setWidth(item, event) {}

	async function saveSize(curentWidth, curentHeight) {
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
		console.log(newSizesArr);
		localStorage.setItem("realSizes", JSON.stringify(newSizesArr));
		localStorage.setItem("nftAreaSize", JSON.stringify(nftAreaSize));
		localStorage.setItem("sizeIndex", nftSizeIndex);
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

	async function getResize(img, width, height) {
		return new Promise((resolve, reject) => {
			var image = new Image();
			image.crossOrigin = "Anonymous";
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
				// console.log(resolve);
				// console.log(canvas.toDataURL());
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
		console.log(curImg);
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
										// let res = logData();
										// if (res) {
										// 	history.push("/nft-generate");
										// }
										logData();
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
											style={{
												background:
													"linear-gradient(to right, #6333FF 0%, #6333FF " +
													classArr[curentLayer].rarityLayer * 25 +
													"%, #444444 " +
													classArr[curentLayer].rarityLayer * 25 +
													"%, #444444 100%)",
											}}
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

							<div className="nft-img" ref={nftArea}>
								<div
									// className={statusSize == "horizontal" ? "horizontal img" : statusSize == "vertical" ? "vertical img" : statusSize == "square" ? "square img" : "img"}
									// style={statusSize == ""?{
									// 	width: localStorage.getItem("width") + "px",
									// 	height: localStorage.getItem("height") + "px",
									// }:null}

									className={"img"}
									style={{
										width: nftAreaSize.width + "px",
										height: nftAreaSize.height + "px",
									}}
									// style={{
									// 	width: localStorage.getItem("width") + "px",
									// 	height: localStorage.getItem("height") + "px",
									// }}
								>
									{/* classArr[0].src?.length > 0 */}
									{classArr[0].url?.length > 0
										? classArr.map((item, index) => {
												return (
													<Rnd
														style={{
															// ...style,
															zIndex: index,
															// background: "#ccc",
															opacity: item.active ? "1" : "0.8",
														}}
														key={`rnd${index}`}
														scale={0.5}
														onDrag={(e, data) =>
															Drag(data.x.toFixed(), data.y.toFixed(), index)
														}
													>
														<img
															onClick={() => setActive(item)}
															onDragStart={(e) => setActive(item)}
															onDrag={(e) => Drag(e, index)}
															key={"uniqueId" + index}
															src={classArr[index].url[curentImages[index]]}
															style={{
																width: newSizesArr
																	? newSizesArr[index].width[
																			curentImages[index]
																	  ] + "px"
																	: "0px",
																height: newSizesArr
																	? newSizesArr[index].height[
																			curentImages[index]
																	  ] + "px"
																	: "0px",
																left: item.x / nftSizeIndex + "px",
																top: item.y / nftSizeIndex + "px",
																zIndex: item.z_index,
															}}
														/>
													</Rnd>
												);
										  })
										: copySrc()}
									<div
										className={classArr[0].url?.length > 0 ? "hide" : "loader"}
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
													value={item.x}
													onChange={(event) => setX(item, event)}
												/>

												<input
													type="text"
													placeholder="Y:50"
													value={item.y}
													onChange={(event) => setY(item, event)}
												/>
											</div>
											<div className="inputs">
												<div
													className={
														curentLayer == classArr.length - 1
															? "zIndex zIndex-dis"
															: "zIndex"
													}
													onClick={() => {
														curentLayer == classArr.length - 1
															? null
															: setZ(item, "-");
													}}
												>
													Move to Front
												</div>
												<div
													className={
														curentLayer == 0 ? "zIndex zIndex-dis" : "zIndex"
													}
													onClick={() => {
														curentLayer == 0 ? null : setZ(item, "+");
													}}
												>
													Move to Back
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
										<div className="text">Element size</div>
										<div className={accordionHidden[1] ? "hidden" : "setting"}>
											<div className="inputs">
												<div className="title-settings">Width (px)</div>
												<div className="title-settings">Height (px)</div>
											</div>
											<div className="inputs">
												<div className="info">
													{
														classArr[curentLayer].sizes.width[
															curentImages[curentLayer]
														]
													}
												</div>
												<div className="info">
													{
														classArr[curentLayer].sizes.height[
															curentImages[curentLayer]
														]
													}
												</div>
												{/* <input
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
												/> */}
											</div>
										</div>

										{/* <div
											className={
												accordionHidden[1] ? "hidden" : "button-1-square"
											}
											onClick={() => {
												saveSize(curentWidth, curentHeight);
											}}
										>
											Save size
										</div>

										<div
											className={
												accordionHidden[1] ? "hidden" : "button-1-square"
											}
											onClick={() => {
												saveSize(
													localStorage.getItem("width"),
													localStorage.getItem("height"),
												);
											}}
										>
											Fit into the frame
										</div> */}

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
															<img src={classArr[curentLayer].url[index]}></img>
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
														style={{
															background:
																"linear-gradient(to right, #6333FF 0%, #6333FF " +
																classArr[curentLayer].rarity[index] * 25 +
																"%, #444444 " +
																classArr[curentLayer].rarity[index] * 25 +
																"%, #444444 100%)",
														}}
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
