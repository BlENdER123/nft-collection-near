import React, {useContext, useState, useEffect, useRef} from "react";
import {HashRouter as Router, Redirect, useHistory} from "react-router-dom";
import Context from "./Context";
import Header from "./Header";
import Footer from "./Footer";

import {Button, Box} from "@mui/material";

import {useDispatch, useSelector} from "react-redux";

import ImportButtons from "./ImportButtons";

const axios = require("axios");
const FormData = require("form-data");

const pinataKey = "0a2ed9f679a6c395f311";
const pinataSecretKey =
	"7b53c4d13eeaf7063ac5513d4c97c4f530ce7e660f0c147ab5d6aee6da9a08b9";

// layer instance
class MyClass {
	constructor(
		name,
		active,
		imgs,
		url,
		names,
		rarity,
		x,
		y,
		z_index,
		sizes,
		width,
		height,
		src = [],
	) {
		this.name = name;
		this.active = active;
		this.imgs = imgs;
		this.src = src;
		this.url = url;
		this.rarity = rarity;
		this.rarityLayer = ["4"];
		this.names = names;
		this.sizes = {
			width: [],
			height: [],
		};
		this.x = x;
		this.y = y;
		this.z_index = z_index;
		this.width = width;
		this.height = height;
	}

	logName() {
		// console.log(this.name);
	}
}

Object.defineProperty(window, "indexedDB", {
	value:
		window.indexedDB ||
		window.mozIndexedDB ||
		window.webkitIndexedDB ||
		window.msIndexedDB,
});

// In the following line, you should include the prefixes of implementations you want to test.
// window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// DON'T use "var indexedDB = ..." if you're not in a function.
// Moreover, you may need references to some window.IDB* objects:
window.IDBTransaction = window.IDBTransaction ||
	window.webkitIDBTransaction ||
	window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
window.IDBKeyRange =
	window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
// (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)

// Let us open our database
// var openRequest = window.indexedDB.open("imgsStore", 1);

// openRequest.onerror = event => {
// 	console.log(event);
// };
// openRequest.onsuccess = event => {
// 	console.log(event);
// 	db = event.target.result;

// };
// This event is only implemented in recent browsers
// openRequest.onupgradeneeded = event => {
// 	// Save the IDBDatabase interface
// 	db = event.target.result;
// 	console.log(db);
// 	db.createObjectStore("imgs", { keyPath: "id" , autoIncrement: true});

// 	// Create an objectStore for this database
// 	// var objectStore = db.createObjectStore("name", { keyPath: "myKey" });
// };

function addData() {
	let transaction = db.transaction("myObjStore", "readwrite");
	let tempObjs = transaction.objectStore("myObjStore");

	let tempObj = {
		ket23: "val32",
	};

	let request = tempObjs.add(tempObj);
}

function deleteData() {
	let request = db
		.transaction("myObjStore", "readwrite")
		.objectStore("myObjStore")
		.delete(1);
}

function getData() {
	let store = db.transaction("myObjStore").objectStore("myObjStore");
}

function LoadNftPage() {
	var db;

	if (!window.indexedDB) {
		console.log(
			"Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.",
		);
	}

	const openRequest = window.indexedDB.open("imgsStore", 1);
	openRequest.onupgradeneeded = (event) => {
		// Save the IDBDatabase interface
		db = event.target.result;
		console.log(db);
		db.createObjectStore("imgs", {keyPath: "id", autoIncrement: true});

		// Create an objectStore for this database
		// var objectStore = db.createObjectStore("name", { keyPath: "myKey" });
	};

	let nftArea = useRef();
	// setClassArr1([
	// 	new MyClass("background", true, [], [], [], 0, 0, 0, 0, 0),
	// ]);

	//const {status} = useContext(Context);
	let history = useHistory();

	const dispatch = useDispatch();
	const connectWallet = useSelector((state) => state.connectWallet);

	const [newLayer, setNewLayer] = useState();

	const [curentLayer, setCurenLayer] = useState(0);

	const [curentImages, setCurentImages] = useState([0]);

	const [connect, setConnect] = useState(false);

	const [urlImg, setUrlImg] = useState("");

	const [videoPlay, setVideoPlay] = useState(false);

	const [accordionHidden, setAccordioHidden] = useState([false, false]);

	// const [sizeImgs, setSizeImgs] = useState([0]);

	const [errorModal, setErrorModal] = useState({
		hidden: false,
		message: "",
	});

	const [redirect, setRedirect] = useState(false);

	const [activeNext, setActiveNext] = useState(false);

	const [tempBg, setTempBg] = useState([]);

	const [layerErr, setLayerErr] = useState(false);

	const [maxSize, setMaxSize] = useState(0);

	const [errorInput, setErrorInput] = useState();

	let projDet;
	let localClass;
	let localWidth;
	let localHeight;
	// loading project from localStorage

	const [width, setWidth] = useState(localWidth);
	const [height, setHeight] = useState(localHeight);

	const [projectName, setProjectName] = useState();
	const [collectionName, setCollectionName] = useState();
	const [projectDescription, setProjectDescription] = useState();

	const [classArr1, setClassArr1] = useState([]);

	useEffect(() => {
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
										console.log(event.target.result);
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

		if (
			localStorage.getItem("class") !== undefined &&
			localStorage.getItem("class") !== null
		) {
			const openRequest = window.indexedDB.open("imgsStore", 1);
			const localClass = JSON.parse(localStorage.getItem("class"));
			request(openRequest, localClass).then((result) => {
				setClassArr1(result);
			});

			// console.log(URL.createObjectURL(file));

			if (
				localStorage.getItem("details") !== undefined &&
				localStorage.getItem("details") !== null
			) {
				// changeError("projName",JSON.parse(localStorage.getItem("details")).projName);
				// changeError("colName",JSON.parse(localStorage.getItem("details")).projectName);
				// changeError("colDesc",JSON.parse(localStorage.getItem("details")).projectDescription);
				projDet = JSON.parse(localStorage.getItem("details"));
			}

			// setWidth(localStorage.getItem("width"));
			// setHeight(localStorage.getItem("height"));

			let tempActiveLayer = 0;

			for (let i = 0; i < localClass.length; i++) {
				if (localClass[i].active) {
					tempActiveLayer = i;
				}
			}
			setCurenLayer(tempActiveLayer);

			localWidth = localStorage.getItem("width");
			localHeight = localStorage.getItem("height");

			// console.log(localClass);
			// setClassArr1(localClass);

			// console.log(JSON.parse(localStorage.getItem("details")).projName);
		} else {
			setClassArr1([
				new MyClass("background", true, [], [], [], 0, 0, 0, 0, 0),
			]);
			localWidth = 0;
			localHeight = 0;
			projDet = {
				projName: "No Name",
				projectName: "No Name",
				projectDescription: "No Description",
			};

			setWidth(0);
			setHeight(0);
			setCollectionName("No Name");
			setProjectName("No Name");
			setProjectDescription("No Description");

			// setClassArr1([
			// 	new MyClass("background", true, [], [], [], 0, 0, 0, 0, 0),
			// ]);
		}
	}, []);

	// const [width, setWidth] = useState(0);
	// const [height, setHeight] = useState(0);

	// const [projectName, setProjectName] = useState("No Name");
	// const [collectionName, setCollectionName] = useState("No Name");
	// const [projectDescription, setProjectDescription] = useState("No Description");

	// const [classArr1, setClassArr1] = useState([new MyClass("background", true, [], [], [], 0, 0, 0, 0, 0)]);

	// useEffect(()=>{
	// 	console.log("effect");
	// })

	useEffect(async () => {
		//deleting previous transactions
		if (document.location.href.split("transactionHashes=")[1]) {
			let href = document.location.origin + document.location.hash;
			document.location.href = href;
		}

		// loading project from localStorage
		if (
			localStorage.getItem("class") !== undefined &&
			localStorage.getItem("class") !== null
		) {
			let localClass = JSON.parse(localStorage.getItem("class"));

			// openRequest.onerror = event => {
			// 	console.log(event);
			// };
			// openRequest.onsuccess = async (event) => {
			// 	console.log(event);
			// 	db = event.target.result;

			// 	let store = db.transaction("imgs").objectStore("imgs");

			// 	for(let i = 0; i < localClass.length; i++) {
			// 		for(let j = 0; j < localClass[i].imgs.length; j++) {
			// 			store.get(localClass[i].imgs[j]).onsuccess = (event) => {
			// 				console.log(event.target.result);
			// 				localClass[i].url[j] = URL.createObjectURL(event.target.result);
			// 			}

			// 		}
			// 	}

			// 	console.log(localClass);

			// 	setTimeout(()=>{
			// 		setClassArr1(localClass);
			// 	}, 1000);

			// };
			// This event is only implemented in recent browsers

			// console.log(URL.createObjectURL(file));

			if (
				localStorage.getItem("details") !== undefined &&
				localStorage.getItem("details") !== null
			) {
				changeError(
					"projName",
					JSON.parse(localStorage.getItem("details")).projName,
				);
				changeError(
					"colName",
					JSON.parse(localStorage.getItem("details")).projectName,
				);
				changeError(
					"colDesc",
					JSON.parse(localStorage.getItem("details")).projectDescription,
				);
			}

			setWidth(localStorage.getItem("width"));
			setHeight(localStorage.getItem("height"));

			// console.log(localClass);
			// setClassArr1(localClass);

			// console.log(JSON.parse(localStorage.getItem("details")).projName);
		} else {
			// setClassArr1([
			// 	new MyClass("background", true, [], [], [], 0, 0, 0, 0, 0),
			// ]);
		}
		setMaxSize(nftArea.current.offsetWidth);
	}, []);

	// useEffect(()=>{

	// 	if (
	// 		// localStorage.getItem("class") !== undefined &&
	// 		// localStorage.getItem("class") !== null
	// 		false
	// 	) {
	// 		let localClass = JSON.parse(localStorage.getItem("class"));

	// 		// var openRequest = window.indexedDB.open("imgsStore", 1);

	// 		openRequest.onerror = () => {
	// 			console.error("Request DB error");
	// 		}

	// 		openRequest.onsuccess = async (event) => {
	// 			db = event.target.result;

	// 			let store = db.transaction("imgs").objectStore("imgs");

	// 			for(let i = 0; i < localClass.length; i++) {
	// 				for(let j = 0; j < localClass[i].imgs.length; j++) {
	// 					store.get(localClass[i].imgs[j]).onsuccess = (event) => {
	// 						console.log(event.target.result);
	// 						localClass[i].url[j] = URL.createObjectURL(event.target.result);
	// 					}

	// 				}
	// 			}

	// 			console.log(localClass);

	// 			setTimeout(()=>{
	// 				setClassArr1(localClass);
	// 			}, 1000);

	// 		};

	// 		openRequest.onupgradeneeded = event => {
	// 			// Save the IDBDatabase interface
	// 			db = event.target.result;
	// 			console.log(db);
	// 			db.createObjectStore("imgs", { keyPath: "id" , autoIncrement: true});

	// 			// Create an objectStore for this database
	// 			// var objectStore = db.createObjectStore("name", { keyPath: "myKey" });
	// 		};

	// 		// console.log(URL.createObjectURL(file));

	// 		if(
	// 			localStorage.getItem("details") !== undefined &&
	// 			localStorage.getItem("details") !== null
	// 		) {
	// 			changeError("projName",JSON.parse(localStorage.getItem("details")).projName);
	// 			changeError("colName",JSON.parse(localStorage.getItem("details")).projectName);
	// 			changeError("colDesc",JSON.parse(localStorage.getItem("details")).projectDescription);
	// 		}

	// 		setWidth(localStorage.getItem("width"));
	// 		setHeight(localStorage.getItem("height"));

	// 		// console.log(localClass);
	// 		// setClassArr1(localClass);

	// 		// console.log(JSON.parse(localStorage.getItem("details")).projName);
	// 	} else {

	// 		// setClassArr1([
	// 		// 	new MyClass("background", true, [], [], [], 0, 0, 0, 0, 0),
	// 		// ]);
	// 	}

	// 	console.log(classArr1, "12333");
	// 	console.log("UseEffect2");

	// }, [classArr1]);

	//uploading files to ipfs
	const pinFileToIPFS = async (
		pinataKey,
		pinataSecretKey,
		src,
		newWidth,
		newHeight,
		name,
	) => {
		const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

		let data = new FormData();

		// console.log(src);
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

				let tempArr = [];
				for (let i = 0; i < classArr1.length; i++) {
					let temp = classArr1[i];
					if (classArr1[curentLayer].name == classArr1[i].name) {
						if (temp.imgs[0] == undefined) {
							// setWidth(newWidth);
							// // changeError("width", width);
							// setHeight(newHeight);
							// changeError("height", height);

							temp.imgs = [];
							temp.imgs.push(response.data.IpfsHash);
							temp.width = newWidth;
							temp.height = newHeight;
							temp.sizes = {
								width: [newWidth],
								height: [newHeight],
							};
							temp.names = [];
							temp.rarity = [];
							temp.rarity.push("4");
							temp.names.push(name);
						} else {
							temp.imgs.push(response.data.IpfsHash);
							temp.names.push(name);
							temp.width = newWidth;

							temp.height = newHeight;
							temp.rarity.push("4");

							let tempSizesWidth = temp.sizes.width;
							tempSizesWidth.push(newWidth);

							let tempSizesHeight = temp.sizes.height;
							tempSizesHeight.push(newHeight);

							temp.sizes = {
								width: tempSizesWidth,
								height: tempSizesHeight,
							};

							// if(width < newWidth ) {
							// 	setWidth(newWidth);
							// 	console.log(width);
							// }
							// if(height < newHeight ) {
							// 	setHeight(newHeight);
							// }
							// setWidth(width);
							// changeError("width", width);
							// setHeight(height);
							// changeError("height", height);
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

				let maxW = Math.max.apply(null, tempArr[curentLayer].sizes.width);
				let maxH = Math.max.apply(null, tempArr[curentLayer].sizes.height);

				if (width < maxW) {
					setWidth(maxW);
				}
				if (height < maxH) {
					setHeight(maxH);
				}
				// setHeight(Math.max.apply(null, tempArr[curentLayer].sizes.height));
				// TODO : 123
				//setClassArr1(tempArr);
			})
			.catch(function (error) {
				//handle error here
				console.error(error);
			});
	};

	function handleFile(e) {
		const fileReader = new FileReader();
		fileReader.readAsText(e.target.files[0], "UTF-8");
		fileReader.onload = (e) => {
			const data = JSON.parse(e.target.result);
			setProjectName(data.projectName || "");
			setCollectionName(data.collectionName || "");
			setProjectDescription(data.projectDescription || "");
			setWidth(data.width);
			setHeight(data.height);
			setClassArr1(data.classArr);

			//setFiles(e.target.result);
		};
	}

	// new layer instance
	function newClass(name, active, imgsL, x, y, z) {
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

		// TODO : 123
		setClassArr1(tempArr);

		// classArr.push(temp);
		// setClassArr1(classArr);

		let curImg = curentImages;
		curImg.push(0);
		setCurentImages(curImg);
		//temp.logName();
	}

	// switching active layer
	function setActive(item) {
		let tempArr = [];
		for (let i = 0; i < classArr1.length; i++) {
			let temp = classArr1[i];
			if (temp == item) {
				temp.active = true;
				tempArr.push(temp);
				setCurenLayer(i);
			} else {
				temp.active = false;
				tempArr.push(temp);
			}
		}
		// TODO : 123
		setClassArr1(tempArr);
	}

	// switching active picture
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

		if (classArr1.length == 1) {
			let temp = new MyClass("no name", false, [], [], 0, 0, 0);
			// TODO: 123
			// setClassArr1([temp]);
		} else {
			// setClassArr1(tempArr1);
		}
	}

	// Download image from input
	async function download(event) {
		for (let i = 0; i < event.target.files.length; i++) {
			let file = event.target.files[i];

			// if (event.target.files[0].size / 1024 / 1024 > 5) {
			// 	setErrorModal({
			// 		hidden: true,
			// 		message: "Image is larger than 5MB",
			// 	});
			// 	return;
			// }

			// let requestDB = db.transaction("imgs", "readwrite").objectStore("imgs");

			const openRequest = window.indexedDB.open("imgsStore", 1);

			openRequest.onsuccess = async (event) => {
				const store = event.target.result
					.transaction("imgs", "readwrite")
					.objectStore("imgs");

				store.add(file);

				let lastId;

				let tempBlob;

				store.getAll().onsuccess = (event) => {
					lastId = event.target.result[event.target.result.length - 1].id;
					tempBlob = URL.createObjectURL(file);

					var reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = function (e) {
						var image = new Image();

						image.src = e.target.result;
						image.onload = async function () {
							let name = file.name.substring(0, file.name.indexOf("."));
							// await pinFileToIPFS(
							// 	pinataKey,
							// 	pinataSecretKey,
							// 	event.target.files[i],
							// 	this.width,
							// 	this.height,
							// 	name,
							// );

							let newWidth = this.width;
							let newHeight = this.height;

							let tempArr = [];
							for (let i = 0; i < classArr1.length; i++) {
								let temp = classArr1[i];
								if (classArr1[curentLayer].name == classArr1[i].name) {
									if (temp.imgs[0] == undefined) {
										// setWidth(newWidth);
										// // changeError("width", width);
										// setHeight(newHeight);
										// changeError("height", height);

										temp.imgs = [];
										temp.imgs.push(lastId);
										temp.url = [tempBlob];
										temp.width = newWidth;
										temp.height = newHeight;
										temp.sizes = {
											width: [newWidth],
											height: [newHeight],
										};
										temp.names = [];
										temp.rarity = [];
										temp.rarity.push("4");
										temp.names.push(name);
									} else {
										temp.imgs.push(lastId);
										temp.names.push(name);
										temp.url.push(tempBlob);
										temp.width = newWidth;

										temp.height = newHeight;
										temp.rarity.push("4");

										let tempSizesWidth = temp.sizes.width;
										tempSizesWidth.push(newWidth);

										let tempSizesHeight = temp.sizes.height;
										tempSizesHeight.push(newHeight);

										temp.sizes = {
											width: tempSizesWidth,
											height: tempSizesHeight,
										};

										// if(width < newWidth ) {
										// 	setWidth(newWidth);
										// 	console.log(width);
										// }
										// if(height < newHeight ) {
										// 	setHeight(newHeight);
										// }
										// setWidth(width);
										// changeError("width", width);
										// setHeight(height);
										// changeError("height", height);
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

							let maxW = Math.max.apply(null, tempArr[curentLayer].sizes.width);
							let maxH = Math.max.apply(
								null,
								tempArr[curentLayer].sizes.height,
							);

							if (width < maxW) {
								setWidth(maxW);
							}
							if (height < maxH) {
								setHeight(maxH);
							}
							// setHeight(Math.max.apply(null, tempArr[curentLayer].sizes.height));
							localStorage.setItem("class", JSON.stringify(tempArr));
							localStorage.setItem("width", maxW);
							localStorage.setItem("height", maxH);
							// TODO : 123
							setClassArr1(tempArr);
						};
					};
				};
			};

			// requestDB.add(file);

			// var image = new Image();
			// image.src = URL.createObjectURL(file);
			// console.log(file, image.width, image.height);
			// image.onload = async function () {
			// 	// console.log(file, image.width, image.height);

			// 	let name = file.name.substring(0, file.name.indexOf("."));

			// 	await pinFileToIPFS(
			// 		pinataKey,
			// 		pinataSecretKey,
			// 		event.target.files[i],
			// 		image.width,
			// 		image.height,
			// 		name,
			// 	);
			// };

			// var reader = new FileReader();
			// reader.readAsDataURL(file);
			// reader.onload = function (e) {
			// 	var image = new Image();

			// 	// console.log(e.target.result);

			// 	image.src = e.target.result;
			// 	image.onload = async function () {
			// 		var height = this.height;
			// 		var width = this.width;

			// 		let name = file.name.substring(0, file.name.indexOf("."));
			// 		await pinFileToIPFS(
			// 			pinataKey,
			// 			pinataSecretKey,
			// 			event.target.files[i],
			// 			this.width,
			// 			this.height,
			// 			name,
			// 		);
			// 		// console.log(this);
			// 		// if ((height >= 1024 || height <= 1100) && (width >= 750 || width <= 800)) {
			// 		// 	alert("Height and Width must not exceed 1100*800.");
			// 		// 	return false;
			// 		// }
			// 		// alert("Uploaded image has valid Height and Width.");
			// 		// return true;
			// 		// return;
			// 	};
			// };
		}
	}

	// Removing an image from a layer
	function removeImg(index) {
		let tempArr = [];

		const openRequest = window.indexedDB.open("imgsStore", 1);

		let idDel = classArr1[curentLayer].imgs[index];

		openRequest.onsuccess = async (event) => {
			const store = event.target.result
				.transaction("imgs", "readwrite")
				.objectStore("imgs");
			store.delete(idDel);
		};

		// let request = db.transaction("imgs", "readwrite").objectStore("imgs").delete(classArr1[curentLayer].imgs[index]);

		for (let i = 0; i < classArr1.length; i++) {
			let temp = classArr1[i];

			let tempArrImg = [];
			let tempArrUrl = [];
			let tempArrNames = [];
			let tempArrImgSizeW = [];
			let tempArrImgSizeH = [];
			if (classArr1[curentLayer].name == classArr1[i].name) {
				for (let j = 0; j < classArr1[i].imgs.length; j++) {
					// if(maxWidth < classArr1[i].width) {
					// 	maxWidth = classArr1[i].width;
					// }
					// if(maxHeight < classArr1[i].height) {
					// 	maxHeight = classArr1[i].height;
					// }

					if (classArr1[i].imgs[j] != classArr1[i].imgs[index]) {
						//console.log(1);

						tempArrImg.push(classArr1[curentLayer].imgs[j]);
						tempArrUrl.push(classArr1[curentLayer].url[j]);
						tempArrNames.push(classArr1[curentLayer].names[j]);
						tempArrImgSizeW.push(classArr1[curentLayer].sizes.width[j]);
						tempArrImgSizeH.push(classArr1[curentLayer].sizes.height[j]);
					}
				}

				temp.imgs = tempArrImg;
				temp.url = tempArrUrl;
				temp.names = tempArrNames;
				temp.sizes = {
					width: tempArrImgSizeW,
					height: tempArrImgSizeH,
				};
				//setSizeImgs(tempArrImgSize);
			}

			tempArr.push(temp);
		}
		// for(let i)
		// setWidth(maxWidth);
		// setHeight(maxHeight);

		let maxWidth = 0;
		let maxHeight = 0;

		for (let i = 0; i < tempArr.length; i++) {
			let newMaxW = Math.max.apply(null, tempArr[i].sizes.width);
			let newMaxH = Math.max.apply(null, tempArr[i].sizes.height);

			if (maxWidth < newMaxW) {
				maxWidth = newMaxW;
			}
			if (maxHeight < newMaxH) {
				maxHeight = newMaxH;
			}
		}

		setWidth(maxWidth);
		setHeight(maxHeight);

		localStorage.setItem("class", JSON.stringify(tempArr));
		// TODO :123
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
		// TODO :123
		//setClassArr1(tempArr);
	}

	// Changing the name of a layer
	function setNewLayerName(event) {
		for (let i = 0; i < classArr1.length; i++) {
			if (classArr1[i].name == event.target.value) {
				setErrorModal({
					hidden: true,
					message: "Give a unique name",
				});
				return;
			}
		}

		let tempVal = event.target.value;

		let tempArr = [];
		for (let i = 0; i < classArr1.length; i++) {
			let temp = classArr1[i];
			if (curentLayer == i) {
				temp.name = tempVal;
			}
			tempArr.push(temp);
		}
		// TODO :123
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

			return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
		};
	}

	async function getSrc(src) {
		let store = db.transaction("imgs").objectStore("imgs");

		store.get(src).onsuccess = async (event) => {
			let res = await URL.createObjectURL(event.target.result);
			return res;
		};
		// return "https://cloudflare-ipfs.com/ipfs/" + src;
	}

	// Loading intermediate data
	function logData() {
		for (let i = 0; i < classArr1.length; i++) {
			if (classArr1[i].imgs[0] == undefined) {
				setErrorModal({
					hidden: true,
					message: "Each layer must contain at least 1 image.",
				});
				return;
			}
		}

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

		// if (width > maxSize || height > maxSize) {
		// 	setErrorModal({
		// 		hidden: true,
		// 		message:
		// 			"The size is too large. The maximum size of the nft must not exceed " +
		// 			maxSize +
		// 			"px by " +
		// 			maxSize +
		// 			"px",
		// 	});
		// 	return false;
		// }

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

		localStorage.setItem("class", JSON.stringify(classArr1));
		localStorage.setItem("width", width);
		localStorage.setItem("height", height);
		localStorage.setItem("curentLayer", curentLayer);
		localStorage.setItem(
			"details",
			JSON.stringify({
				projName: projectName,
				projectName: collectionName,
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
		var image = new Image();
		image.src = urlImg;

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
				var image = new Image();
				image.src = URL.createObjectURL(file);

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
	}

	// Tracking blank fields (outdated)
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
		if (input == "projName") {
			setProjectName(value);
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
										if (
											res &&
											localStorage.getItem("nftAreaSize") !== undefined &&
											localStorage.getItem("nftAreaSize") !== null
										) {
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
							{classArr1.length > 0 &&
								classArr1.map((item, index) => {
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
									className={layerErr ? "inputErr" : ""}
									value={newLayer}
									onChange={(ev) => {
										setNewLayer(ev.target.value);
									}}
								/>
								<span className={layerErr ? "errMsg" : "hide"}>
									Enter new layer name
								</span>
								<button
									className="button-4-square"
									onClick={() => {
										if (newLayer == "" || newLayer == undefined) {
											setLayerErr(true);
											return;
										} else {
											setNewLayer("");
											setLayerErr(false);
											newClass(newLayer, false, [], 0, 0, 0, 0, 0);
										}
									}}
								>
									+
								</button>
							</div>

							<div className="title">Layer Settings</div>
							<div className="text">Change your layers settings</div>
							<div className="setting">
								<div className="title-settings">Layer Name</div>
								{classArr1.length > 0 && (
									<input
										type="text"
										className="input-settings"
										value={classArr1[curentLayer].name}
										placeholder={classArr1[curentLayer].name}
										onChange={setNewLayerName}
									/>
								)}
							</div>
						</div>
						<div className="modal-constructor modal-constructor-upload">
							<div class="steps steps-desk">
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
										if (
											res &&
											localStorage.getItem("nftAreaSize") !== undefined &&
											localStorage.getItem("nftAreaSize") !== null
										) {
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
								ref={nftArea}
								className="drop-img"
								onDrop={(e) => {
									let event = e;
									event.stopPropagation();
									event.preventDefault();
								}}
								onDragOver={(e) => {
									let event = e;
									event.stopPropagation();
									event.preventDefault();
								}}
							>
								<div className="imgs-list">
									{classArr1.length > 0 &&
										classArr1[curentLayer].imgs.map((item, index) => {
											console.log(classArr1, curentLayer);
											// console.log("WTFF", JSON.parse(JSON.stringify(classArr1)))
											// console.log("WTF1",classArr1)
											// console.log("WTF2",classArr1[curentLayer].url[index])
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
													<div
														className="close"
														onClick={() => removeImg(index)}
													>
														<span></span>
														<span></span>
													</div>
													<img src={classArr1[curentLayer].url[index]}></img>
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
										(image/png, image/jpg, image/jpeg) <br />
										You can select multiple images at once
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
							{/* <div className="import">Import Project</div> */}

							{/* <div class="import-buttons">
								<div class="new"></div>
								<div class="import"></div>
								<div class="save"></div>
							</div> */}

							<ImportButtons/>

							{/* <Box className="import" type="button" component="label">
								Import Project
								<input
									type="file"
									accept=".json"
									hidden
									onChange={handleFile}
								/>
							</Box>  */}
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
										value={projectName}
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
										value={projectDescription}
										className={
											errorInput == "colDesc"
												? "input-settings inputErr"
												: "input-settings"
										}
										onChange={(event) =>
											// changeError("colDesc", event.target.value);
											setProjectDescription(event.target.value)
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
								<div className="text">Canvas dimensions</div>
								<div
									className={
										accordionHidden[1] ? "hidden" : "setting setting-grid"
									}
								>
									{/* <div className="title-settings">Dimension (px)</div> */}

									<div class="dim-title">Width (px)</div>
									<div class="dim-title">Height (px)</div>
									<div className="dimensions">
										<div>{width}</div>
										{/* <input
											type="text"
											placeholder={maxSize}
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
										</span> */}
									</div>

									<div className="dimensions">
										<div>{height}</div>
										{/* <input
											type="text"
											placeholder={maxSize}
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
										</span> */}
									</div>
									{/* <button onClick={()=>setWidth(width+1)}>test1</button>
									<button onClick={()=>console.log(width)}>test2</button> */}
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
