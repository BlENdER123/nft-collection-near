import React, {useState, useEffect, useRef, useMemo} from "react";
import {useNavigate} from "react-router-dom";

// import Header from "../../Pages/Header/Header";
// import Footer from "../../Pages/Footer/Footer";
import HeaderEditor from "../HeaderEditor/HeaderEditor";

import {useDispatch, useSelector, connect} from "react-redux";

//fabric
import {FabricJSCanvas, useFabricJSEditor} from "fabricjs-react";
import {fabric} from "fabric";
import {Navigate} from "react-router";

import ListDraggable from "../ListDraggable/ListDraggable";
//end fabric

Object.defineProperty(window, "indexedDB", {
	value:
		window.indexedDB ||
		window.mozIndexedDB ||
		window.webkitIndexedDB ||
		window.msIndexedDB,
});

import {
	createNewLayer,
	updateAllData,
	updateOneLayer,
} from "../../store/actions/editor";

function NftCustomization(props) {
	let navigate = useNavigate();

	let nftArea = useRef();

	const dispatch = useDispatch();
	const connectWallet = useSelector((state) => state.connectWallet);

	let arr = JSON.parse(localStorage.getItem("class"));
	//console.log(arr);

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

	//fabric
	const {editor, onReady} = useFabricJSEditor();
	const [changeXY, setchangeXY] = React.useState({});

	const [layerPosition, setLayerPosition] = React.useState({
		x: 0,
		y: 0,
	});
	useEffect(() => {
		if (!editor) return;
		else if ((changeXY.x !== 0 || changeXY.y !== 0) && changeXY.y !== "") {
			updateXY(changeXY);
		}
	}, [changeXY, editor]);

	async function updateZ(canv, arr) {
		arr.map((e, i) => {
			const lay = canv.getObjects().filter((o) => o.idLayerName === e.name);
			console.log("control z", e.name, i * 10);
			lay.map((l) => canv.moveTo(l, i * 10));
		});
		canv.renderAll();
		//setClassArr(arr);
		//localStorage.setItem("class", JSON.stringify(arr));
	}

	function updateXY(changeXY) {
		// let clas = classArr;
		// clas.map((e, i) => {
		// 	if (e.name === changeXY.name) {
		// 		clas[i].x = changeXY.x;
		// 		clas[i].y = changeXY.y;
		// 	}
		// });
		// setClassArr(clas);
		// console.log("changeXY!");

		let clas = props.project;
		clas.map((e, i) => {
			if (e.name === changeXY.name) {
				clas[i].x = changeXY.x;
				clas[i].y = changeXY.y;
			}
		});
		// setClassArr(clas);
		props.updateData(clas);
		console.log("changeXY!");
	}

	const _onReady = (canvas) => {
		//canvas.set({preserveObjectStacking: true});
		let index = 0,
			objs = [];
		//changeBackground(canvas, 0);

		// classArr.map((e, i) => {
		// 	classArr[i].url.map((l, j) => {
		// 		fabric.Image.fromURL(classArr[i].url[j], (img) => {
		// 			img.scaleToWidth(img.width / nftSizeIndex);
		// 			img.scaleToHeight(img.height / nftSizeIndex);
		// 			img.set({
		// 				id: index,
		// 				idLayer: i,
		// 				idLayerName: e.name,
		// 				idImg: j,
		// 				top: classArr[i].y / nftSizeIndex,
		// 				left: classArr[i].x / nftSizeIndex,
		// 				lockScalingX: true,
		// 				lockScalingY: true,
		// 				lockRotation: true,
		// 				visible: j === 0,
		// 				selectable: false,
		// 			});
		// 			canvas.add(img);
		// 			console.log("mount Z", classArr[i].name, i * 10);
		// 			canvas.moveTo(img, i * 10);
		// 			index++;
		// 			i === classArr.length - 1 &&
		// 				canvas.setActiveObject(img) &&
		// 				img.set({opacity: 0.6, selectable: true});
		// 		});
		// 	});
		// });

		props.project.map((e, i) => {
			props.project[i].imgs.map((l, j) => {
				fabric.Image.fromURL(props.project[i].imgs[j].url, (img) => {
					img.scaleToWidth(img.width / nftSizeIndex);
					img.scaleToHeight(img.height / nftSizeIndex);
					img.set({
						id: index,
						idLayer: i,
						idLayerName: e.name,
						idImg: j,
						top: props.project[i].y / nftSizeIndex,
						left: props.project[i].x / nftSizeIndex,
						lockScalingX: true,
						lockScalingY: true,
						lockRotation: true,
						visible: j === 0,
						selectable: false,
					});
					canvas.add(img);
					console.log("mount Z", props.project[i].name, i * 10);
					canvas.moveTo(img, i * 10);
					index++;
					i === props.project.length - 1 &&
						canvas.setActiveObject(img) &&
						img.set({opacity: 0.6, selectable: true});
				});
			});
		});

		canvas.setDimensions({
			width: nftAreaSize.width,
			height: nftAreaSize.height,
		});

		canvas.on("object:moving", () => {
			let lay = {x: 0, y: 0, name: ""};
			lay.x = canvas.getActiveObject().left * nftSizeIndex;
			lay.y = canvas.getActiveObject().top * nftSizeIndex;
			lay.name = canvas.getActiveObject().idLayerName;

			const imgsByLayer = canvas
				.getObjects()
				.filter((l) => l.idLayerName === canvas.getActiveObject().idLayerName);
			imgsByLayer.map((m) =>
				m.set({left: lay.x / nftSizeIndex, top: lay.y / nftSizeIndex}),
			);
			setchangeXY(lay);
		});

		canvas.on("selection:created", function () {
			canvas.getActiveObject().set({opacity: 0.6});
			canvas.renderAll();
		});

		canvas.on("selection:cleared", function () {
			canvas
				.getObjects()
				.map((e) => (e.opacity !== 1 ? e.set({opacity: 1}) : null));
			//updateZ(canvas, classArr);
			canvas.renderAll();
		});

		// canvas.on("mouse:up", function () {
		// 	updateZ(canvas, classArr);
		// });

		onReady(canvas);
	};

	// const changeBackground = (canvas, indexImage) => {
	// 	const bakgroundLayer = classArr.filter((e) => e.name == "background");
	// 	fabric.Image.fromURL(bakgroundLayer[0].url[indexImage], (img) => {
	// 		img.set({
	// 			left: 0,
	// 			top: 0,
	// 		});
	// 		img.scaleToHeight(nftAreaSize.height);
	// 		img.scaleToWidth(nftAreaSize.width);
	// 		canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
	// 	});
	// };

	function callbackChangeActive(index) {
		// setActive(classArr[index]);

		setActive(props.project[index]);
	}
	function callbackChangePosition(clas) {
		// setClassArr(clas);
		props.updateData(clas);
		updateZ(editor.canvas, clas);
		console.log("DRAG AND DROP LAYER EVENT");

		// dispatch({type: "updateAllData", payload: clas});
	}
	function callbackRemoveLayer(index) {
		// setActive(classArr[0]);
		setActive(props.project[0]);
		let tempArr = props.project.slice();
		tempArr.splice(index, 1);
		console.log("DELETE LAYER", tempArr);
		localStorage.setItem("class", JSON.stringify(tempArr));
		// setClassArr(tempArr);
		props.updateData(tempArr);

		// dispatch({type: "updateAllData", payload: tempArr});
	}

	//end fabric

	const [curentImages, setCurentImages] = useState(curImg);

	const [nftSizeIndex, setNftSizeIndex] = useState(1);

	const [nftAreaSize, setNftAreaSize] = useState({
		width: 0,
		height: 0,
	});

	const [newSizesArr, setNewSizesArr] = useState();

	async function addFileInDB(dataURL, index) {
		var arr = dataURL.split(",");
		var mime = arr[0].match(/:(.*?);/)[1];
		var type = mime.split("/")[1];

		//console.log("file", arr, mime, type);
		const file = await fetch(dataURL)
			.then((res) => res.blob())
			.then((blob) => {
				return new File([blob], index + "." + type, {type: mime});
			});

		try {
			const openRequest = await window.indexedDB.open("imgsStore", 1);
			openRequest.onsuccess = async (event) => {
				const store = event.target.result
					.transaction("imgs", "readwrite")
					.objectStore("imgs");

				await store.add(file);
			};
		} catch (e) {
			console.error(e);
		}
	}

	function request(openRequest, localClass) {
		return new Promise((resolve, reject) => {
			openRequest.onsuccess = async (event) => {
				const store = event.target.result
					.transaction("imgs")
					.objectStore("imgs");

				const functionsToWait = [];
				for (let i = 0; i < localClass.length; i++) {
					for (let j = 0; j < localClass[i].imgs.length; j++) {
						functionsToWait.push(
							new Promise((resolve, reject) => {
								console.log(i, j);
								store.get(localClass[i].imgs[j]).onsuccess = (event) => {
									localClass[i].url[j] = URL.createObjectURL(
										event.target.result,
									);
									resolve(true);
								};
							}),
						);
					}
				}
				Promise.all(functionsToWait).then((res) => {
					resolve(localClass);
				});
			};
		});
	}

	// const [errorInput, setErrorInput] = useState();

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
						let tempWidth = arr[i].imgs[j].width;
						let tempHeight = arr[i].imgs[j].height;

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
						let tempWidth = arr[i].imgs[j].width;
						let tempHeight = arr[i].imgs[j].height;

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
						let tempWidth = arr[i].imgs[j].width;
						let tempHeight = arr[i].imgs[j].height;

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
					let tempWidth = arr[i].imgs[j].width;
					let tempHeight = arr[i].imgs[j].height;

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

	//console.log(arr);

	const [classArr, setClassArr] = useState(arr);

	let localClass = arr;
	// loading project from localStorage

	var openRequest = window.indexedDB.open("imgsStore", 1);
	localClass = JSON.parse(localStorage.getItem("class"));
	openRequest.onsuccess = async (event) => {
		//console.log(event);

		let db = event.target.result;

		let store = db.transaction("imgs").objectStore("imgs");

		for (let i = 0; i < localClass.length; i++) {
			for (let j = 0; j < localClass[i].imgs.length; j++) {
				store.get(localClass[i].imgs[j]).onsuccess = (event) => {
					//console.log(event.target.result);
					localClass[i].url[j] = URL.createObjectURL(event.target.result);
				};
			}
		}

		//console.log(localClass);

		// setTimeout(()=>{
		// 	setClassArr1(localClass);
		// }, 1000);
	};

	useEffect(() => {
		copySrc();
		setTimeout(() => {
			console.log("useEff 3");
			// setClassArr(localClass);
			props.updateData(localClass);
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

	// function changeError(input, value) {
	// 	if (value == "" || value < 0 || value == undefined || value == null) {
	// 		setErrorInput(input);
	// 		setColPrice(value);
	// 	} else {
	// 		if (input == "salePrice") {
	// 			setErrorInput("");
	// 			setColPrice(value);
	// 		}
	// 	}
	// }

	function copySrc() {
		const asyncFunction = async function () {
			return await getResizeMany();
		};
		asyncFunction().then((res) => {
			let tempArr = [];
			console.log(res);

			// for (let i = 0; i < classArr.length; i++) {
			// 	let temp = classArr[i];
			// 	temp.src = res[i];
			// 	tempArr.push(temp);
			// }
			// console.log(tempArr);
			// setClassArr(tempArr);

			for (let i = 0; i < props.project.length; i++) {
				let temp = props.project[i];
				temp.src = res[i];
				tempArr.push(temp);
			}

			props.updateData(tempArr);
		});
	}

	function setActive(item) {
		let tempArr = [];
		let curLayer = 0; //fabric

		// for (let i = 0; i < classArr.length; i++) {
		// 	let temp = classArr[i];
		// 	if (temp == item) {
		// 		//console.log(1);
		// 		temp.active = true;
		// 		tempArr.push(temp);
		// 		setCurentLayer(i);
		// 		curLayer = i; //fabric
		// 	} else {
		// 		temp.active = false;
		// 		tempArr.push(temp);
		// 	}
		// }

		for (let i = 0; i < props.project.length; i++) {
			let temp = props.project[i];
			if (temp == item) {
				//console.log(1);
				temp.active = true;
				tempArr.push(temp);
				setCurentLayer(i);
				curLayer = i; //fabric
			} else {
				temp.active = false;
				tempArr.push(temp);
			}
		}

		//fabric

		console.log("item", curLayer, curentImages);
		editor.canvas.getObjects().map((e, i) => {
			if (e.idLayerName == item.name) {
				editor.canvas.setActiveObject(e);
				e.set({opacity: 0.6});
				editor.canvas.item(i).set({selectable: true});
			} else {
				editor.canvas.item(i).set({selectable: false});
				e.set({opacity: 1});
			}
		});
		editor.canvas.renderAll();
		//end fabric

		// setClassArr(tempArr);
		props.updateData(tempArr);
		// console.log(curentLayer);
	}

	function setX(item, event) {
		let tempArr = [];
		let position = {x: event.target.value, y: layerPosition.y};
		setLayerPosition(position);

		// for (let i = 0; i < classArr.length; i++) {
		// 	let temp = classArr[i];
		// 	if (temp == item) {
		// 		temp.x = event.target.value;
		// 		tempArr.push(temp);
		// 	} else {
		// 		tempArr.push(temp);
		// 	}
		// }

		for (let i = 0; i < props.project.length; i++) {
			let temp = props.project[i];
			if (temp == item) {
				temp.x = event.target.value;
				tempArr.push(temp);
			} else {
				tempArr.push(temp);
			}
		}
		// setClassArr(tempArr);
		props.updateData(props.project);
		// editor.canvas.getActiveObject().setCoords({left: event.target.value});
		// editor.canvas.calcOffset();
		// editor.canvas.renderAll();
	}

	function setY(item, event) {
		let tempArr = [];
		let position = {x: layerPosition.x, y: event.target.value};
		setLayerPosition(position);
		// for (let i = 0; i < classArr.length; i++) {
		// 	let temp = classArr[i];
		// 	if (temp == item) {
		// 		temp.y = event.target.value;
		// 		tempArr.push(temp);
		// 	} else {
		// 		tempArr.push(temp);
		// 	}
		// }
		for (let i = 0; i < props.project.length; i++) {
			let temp = props.project[i];
			if (temp == item) {
				temp.y = event.target.value;
				tempArr.push(temp);
			} else {
				tempArr.push(temp);
			}
		}

		// setClassArr(tempArr);
		props.updateData(tempArr);
		// editor.canvas.getActiveObject().setCoords({top: event.target.value});
		// editor.canvas.calcOffset();
		// editor.canvas.renderAll();
	}

	function setZ(item, event) {
		let tempArr = [];
		let tempSizeArr = [];
		let tempCurentImages = [];
		let curIndex = curentLayer;

		// if (event === "+" && curentLayer < classArr.length - 1) {
		// 	tempArr = reverseArr(classArr, curIndex, curIndex + 1);
		// 	tempSizeArr = reverseArr(newSizesArr, curIndex, curIndex + 1);
		// 	tempCurentImages = reverseArr(curentImages, curIndex, curIndex + 1);
		// 	setCurentLayer(curIndex + 1);
		// } else if (event === "-" && curentLayer > 0) {
		// 	tempArr = reverseArr(classArr, curIndex, curIndex - 1);
		// 	tempSizeArr = reverseArr(newSizesArr, curIndex, curIndex - 1);
		// 	tempCurentImages = reverseArr(curentImages, curIndex, curIndex - 1);
		// 	setCurentLayer(curIndex - 1);
		// }

		if (event === "+" && curentLayer < props.project.length - 1) {
			tempArr = reverseArr(props.project, curIndex, curIndex + 1);
			tempSizeArr = reverseArr(newSizesArr, curIndex, curIndex + 1);
			tempCurentImages = reverseArr(curentImages, curIndex, curIndex + 1);
			setCurentLayer(curIndex + 1);
		} else if (event === "-" && curentLayer > 0) {
			tempArr = reverseArr(props.project, curIndex, curIndex - 1);
			tempSizeArr = reverseArr(newSizesArr, curIndex, curIndex - 1);
			tempCurentImages = reverseArr(curentImages, curIndex, curIndex - 1);
			setCurentLayer(curIndex - 1);
		}

		function reverseArr(arr, index1, index2) {
			let temp = arr.slice();
			const oldLayer = temp[index2];
			temp[index2] = temp[index1];
			temp[index1] = oldLayer;
			return temp;
		}

		console.log("set Z===", tempArr, tempSizeArr, tempCurentImages, curIndex);

		setCurentImages(tempCurentImages);
		setNewSizesArr(tempSizeArr);
		// setClassArr(tempArr);
		props.updateData(props.project);
		//localStorage.setItem("class", JSON.stringify(classArr));
		updateZ(editor.canvas, tempArr);
	}

	function getSrc(src) {
		return "https://cloudflare-ipfs.com/ipfs/" + src;
	}

	function logData() {
		console.log("-----------");

		// let tempArr = [];
		// for (let i = 0; i < classArr.length; i++) {
		// 	let temp = classArr[i];
		// 	temp.src = [];
		// 	tempArr.push(temp);
		// }

		// setClassArr(tempArr);

		// console.log(classArr);
		localStorage.setItem("class", JSON.stringify(props.project));
		console.log(newSizesArr);
		localStorage.setItem("realSizes", JSON.stringify(newSizesArr));
		localStorage.setItem("nftAreaSize", JSON.stringify(nftAreaSize));
		localStorage.setItem("sizeIndex", nftSizeIndex);
		localStorage.setItem("curentLayer", curentLayer);

		// setRedirect(true);
		navigate("/nft-generate");
	}

	function closeError() {
		setErrorModal({
			hidden: false,
			message: "",
		});
	}

	async function getResizeMany() {
		let tempArr = [];

		// for (let i = 0; i < classArr.length; i++) {
		// 	let tempArrImg = [];
		// 	for (let j = 0; j < classArr[i].imgs.length; j++) {
		// 		console.log(classArr[i].imgs[j]);
		// 		let res = await getResize(
		// 			classArr[i].imgs[j],
		// 			classArr[i].width,
		// 			classArr[i].height,
		// 		);
		// 		tempArrImg.push(res);
		// 	}
		// 	tempArr.push(tempArrImg);
		// }

		for (let i = 0; i < props.project.length; i++) {
			let tempArrImg = [];
			for (let j = 0; j < props.project[i].imgs.length; j++) {
				console.log(props.project[i].imgs[j]);
				let res = await getResize(
					props.project[i].imgs[j].url,
					props.projectr[i].width,
					props.project[i].height,
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

		//fabric

		// const ob = editor.canvas
		// 	.getObjects()
		// 	.filter((e) => e.idLayerName == classArr[curentLayer].name);
		// ob.map((e) => {
		// 	if (e.idImg == index) {
		// 		editor.canvas.setActiveObject(e);
		// 		e.set({
		// 			visible: true,
		// 			left: classArr[curentLayer].x / nftSizeIndex,
		// 			top: classArr[curentLayer].y / nftSizeIndex,
		// 		});
		// 		editor.canvas.moveTo(e, classArr[curentLayer].z_index);
		// 	} else e.set({visible: false});
		// });

		// updateZ(editor.canvas, classArr);

		const ob = editor.canvas
			.getObjects()
			.filter((e) => e.idLayerName == props.project[curentLayer].name);
		ob.map((e) => {
			if (e.idImg == index) {
				editor.canvas.setActiveObject(e);
				e.set({
					visible: true,
					left: props.project[curentLayer].x / nftSizeIndex,
					top: props.project[curentLayer].y / nftSizeIndex,
				});
				editor.canvas.moveTo(e, props.project[curentLayer].z_index);
			} else e.set({visible: false});
		});

		updateZ(editor.canvas, props.project);

		editor.canvas.renderAll();

		//end fabric

		//curImg[curentLayer] = index;
		setCurentImages(curImg);
		console.log(curImg);
	}

	function changeRarity(rarity) {
		let tempArr = [];

		// for (let i = 0; i < classArr.length; i++) {
		// 	let temp = classArr[i];
		// 	if (curentLayer == i) {
		// 		for (let j = 0; j < classArr[i].rarity.length; j++) {
		// 			if (curentImages[curentLayer] == j) {
		// 				temp.rarity[j] = rarity;
		// 			}
		// 		}
		// 	}
		// 	tempArr.push(temp);
		// }

		for (let i = 0; i < props.project.length; i++) {
			let temp = props.project[i];
			if (curentLayer == i) {
				for (let j = 0; j < props.project[i].imgs.length; j++) {
					if (curentImages[curentLayer] == j) {
						temp.imgs[j].rarity = rarity;
					}
				}
			}
			tempArr.push(temp);
		}

		// setClassArr(tempArr);
		props.updateData(tempArr);
		console.log(classArr);
	}

	function changeRarityL(rarity) {
		let tempArr = [];

		// for (let i = 0; i < classArr.length; i++) {
		// 	let temp = classArr[i];
		// 	if (curentLayer == i) {
		// 		temp.rarityLayer = rarity;
		// 	}
		// 	tempArr.push(temp);
		// }

		for (let i = 0; i < props.project.length; i++) {
			let temp = props.project[i];
			if (curentLayer == i) {
				temp.rarityLayer = rarity;
			}
			tempArr.push(temp);
		}

		// setClassArr(tempArr);
		props.updateData(tempArr);
	}

	function setNewLayerName(event) {
		let tempVal = event.target.value;

		let tempArr = [];
		// for (let i = 0; i < classArr.length; i++) {
		// 	let temp = classArr[i];
		// 	if (curentLayer == i) {
		// 		temp.name = tempVal;
		// 	}
		// 	tempArr.push(temp);
		// }
		for (let i = 0; i < props.project.length; i++) {
			let temp = props.project[i];
			if (curentLayer == i) {
				temp.name = tempVal;
			}
			tempArr.push(temp);
		}
		// setClassArr(tempArr);
		props.updateData(tempArr);
	}

	return (
		<>
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
				{/*<Header activeCat={1}></Header>*/}

				<div className="constructors">
					<div className="container-header">
						<HeaderEditor
							// classArr={classArr}
							classArr={props.project}
							projectDataStep2={{
								newSizesArr,
								nftAreaSize,
								nftSizeIndex,
								curentLayer,
							}}
							activeStep={2}
						/>

						<div className="modal-constructor modal-constructor-layers ">
							<div className="title">Layers</div>
							<div className="text">Select a layer to Edit</div>
							{/* {classArr.map((item, index) => {
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
							})} */}

							<ListDraggable
								// list={classArr}
								list={props.project}
								callbackChangeActive={callbackChangeActive}
								callbackChangePosition={callbackChangePosition}
								callbackRemoveLayer={callbackRemoveLayer}
							/>

							<div style={{margin: "40px 0px 0px 0px"}} className="title">
								Layer Settings
							</div>
							<div className="text">Change your layers settings</div>
							<div className="setting">
								<div className="title-settings">Layer Name</div>
								<input
									type="text"
									className="input-settings"
									placeholder={props.project[curentLayer].name}
									onChange={setNewLayerName}
								/>
							</div>

							<div className="setting">
								<div className="title-settings">
									Rarity{" "}
									<span aria-label="hint" className="info hint--top"></span>
								</div>
								{/* {classArr[curentLayer].imgs.map((item, index) => {
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
								})} */}

								{props.project[curentLayer].imgs.map((item, index) => {
									return (
										<input
											key={"uniqueId" + index}
											className={
												curentImages[curentLayer] == index ? "rarity" : "hide"
											}
											style={{
												background:
													"linear-gradient(to right, #6333FF 0%, #6333FF " +
													props.project[curentLayer].rarityLayer * 25 +
													"%, #444444 " +
													props.project[curentLayer].rarityLayer * 25 +
													"%, #444444 100%)",
											}}
											type="range"
											min="0"
											max="4"
											step="1"
											value={props.project[curentLayer].rarityLayer}
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
							<div class="video-start">
								<span className="info"></span>Move layers to appropriate
								position
							</div>

							<div className="nft-img" ref={nftArea}>
								<div
									className={"img"}
									style={{
										width: nftAreaSize.width + "px",
										height: nftAreaSize.height + "px",
									}}
								>
									{nftAreaSize.width && <FabricJSCanvas onReady={_onReady} />}
									<div
										className={
											props.project[0].imgs?.length > 0 ? "hide" : "loader"
										}
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
							{props.project.map((item, index) => {
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
													value={
														changeXY.x > 0 || changeXY.x < 0
															? changeXY.x.toFixed()
															: 0
													}
													onChange={(event) => setX(item, event)}
													disabled
												/>

												<input
													type="text"
													placeholder="Y:50"
													value={
														changeXY.y > 0 || changeXY.y < 0
															? changeXY.y.toFixed()
															: 0
													}
													onChange={(event) => setY(item, event)}
													disabled
												/>
											</div>
											<div className="inputs">
												<div
													className={
														curentLayer == props.project.length - 1
															? "zIndex zIndex-dis"
															: "zIndex"
													}
													onClick={() => {
														curentLayer == props.project.length - 1
															? null
															: setZ(item, "+");
													}}
												>
													Move to Front
												</div>
												<div
													className={
														curentLayer == 0 ? "zIndex zIndex-dis" : "zIndex"
													}
													onClick={() => {
														curentLayer == 0 ? null : setZ(item, "-");
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
														props.project[curentLayer].imgs[
															curentImages[curentLayer]
														].width
													}
												</div>
												<div className="info">
													{
														props.project[curentLayer].imgs[
															curentImages[curentLayer]
														].height
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
												{props.project[curentLayer].imgs.map((item, index) => {
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
															<img
																src={props.project[curentLayer].imgs[index].url}
															></img>
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
											{props.project[curentLayer].imgs.map((item, index) => {
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
																props.project[curentLayer].imgs[index].rarity *
																	25 +
																"%, #444444 " +
																props.project[curentLayer].imgs[index].rarity *
																	25 +
																"%, #444444 100%)",
														}}
														type="range"
														min="0"
														max="4"
														step="1"
														value={
															props.project[curentLayer].imgs[index].rarity
														}
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
					{redirect ? <Navigate to="/nft-generate" /> : ""}
				</div>

				{/*<Footer></Footer>*/}
			</div>
		</>
	);
}

// export default NftCustomization;
function mapStateToProps(state) {
	console.log("mapStateToProps", state.editorReducer);
	return {
		//walletAddress: state.reducerWallet.address,
		project: state.editorReducer.projectState,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		updateLayer: (e) => dispatch(updateOneLayer(e)),
		updateData: (e) => dispatch(updateAllData(e)),
		createLayer: (e) => dispatch(createNewLayer(e)),
		//asyncConnectWallet: () => dispatch(asyncConnectWallet()),
		//asynDisconnectWallet: () => dispatch(asynDisconnectWallet()),
		//asyncGetAddressWallet: () => dispatch(asyncGetAddressWallet()),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(NftCustomization);
