import React, {useState, useEffect, useRef} from "react";
// import {useNavigate} from "react-router-dom";
// import Header from "../../Pages/Header/Header";
// import Footer from "../../Pages/Footer/Footer";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";

import HeaderEditor from "../HeaderEditor/HeaderEditor";
import ErrorModal from "../ErrorModal/ErrorModal";
import DropDown from "../DropDown/DropDown";
import DoubleField from "../DoubleField/DoubleField";

import {dbDexie} from "../../db";
import {
	createNewLayer,
	updateAllData,
	updateOneLayer,
} from "../../store/actions/editor";
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
		this.rarity = [];
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

	const openRequest = window.indexedDB.open("imgsStore", 10);
	openRequest.onupgradeneeded = (event) => {
		// Save the IDBDatabase interface
		db = event.target.result;
		console.log(db);
		db.createObjectStore("imgs", {keyPath: "id", autoIncrement: true});

		db.onversionchange = function (event) {
			console.log(event);
			event.target.close();
		};
	};

	let nftArea = useRef();
	// setClassArr1([
	// 	new MyClass("background", true, [], [], [], 0, 0, 0, 0, 0),
	// ]);

	//const {status} = useContext(Context);
	let navigate = useNavigate();

	const dispatch = useDispatch();

	const projectEditorState = useSelector(
		(state) => state.editorReducer.projectState,
	);

	const openError = (text) => {
		dispatch({type: "openError", payload: text});
	};

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

	const [limit, setLimit] = useState(1);

	const checkLimit = () => {
		let lim = 1;
		const imgs = classArr1.map((e) => (lim = e.url.length * lim));
		setLimit(lim);
		setTimeout(() => {
			setLimit(1);
		}, 2000);
		console.log("LIMIT", limit);
		return lim != 0 && lim < 30 ? true : false;
	};

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

	function newProject() {
		navigate("/load-nft");
		localStorage.clear();
		let deleteRequest = window.indexedDB.deleteDatabase("imgsStore");
		location.reload();
	}

	async function loadProject(e) {
		const fileReader = new FileReader();
		fileReader.readAsText(e.target.files[0], "UTF-8");
		fileReader.onload = async (e) => {
			localStorage;
			const data = JSON.parse(e.target.result);

			setProjectName(data.projectName || "");
			setCollectionName(data.collectionName || "");
			setProjectDescription(data.projectDescription || "");
			setWidth(data.width);
			setHeight(data.height);
			setClassArr1(data.classArr);
			// localStorage.setItem(
			// 	"project",
			// 	JSON.stringify({
			// 		name: projectName,
			// 		collectionName: collectionName,
			// 		description: projectDescription,
			// 	}),
			// );
			localStorage.setItem("class", JSON.stringify(data.classArr));
			localStorage.setItem("width", data.width);
			localStorage.setItem("height", data.height);

			//setFiles(e.target.result);

			const imgs = Object.values(data.indexedData);
			await imgs.reduce((previousPromise, nextID) => {
				return previousPromise.then(() => {
					return addFileInDB(nextID, 1);
				});
			}, Promise.resolve());

			const openRequest = window.indexedDB.open("imgsStore", 1);
			const localClass = JSON.parse(localStorage.getItem("class"));
			await request(openRequest, localClass).then((result) => {
				localStorage.setItem("class", JSON.stringify(result));
				//setClassArr1(result);
			});
			await history.go("/load-nft");
		};
	}

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

	function saveProject(e) {
		if (projectName === undefined) {
			setErrorModal({
				hidden: true,
				message: "Project name is empty!",
			});
			return;
		} else {
			let idBlobObj = {};

			let tempArr = [];

			const openRequest = window.indexedDB.open("imgsStore", 1);

			openRequest.onsuccess = async (event) => {
				const store = event.target.result
					.transaction("imgs")
					.objectStore("imgs");
				store.getAll().onsuccess = (event) => {
					console.log(event.target.result);
					const store_data = event.target.result;

					for (let i = 0; i < store_data.length; i++) {
						let tempFile = store_data[i];

						console.log(tempFile);
						// tempFile.arrayBuffer().then((data)=>{
						//   console.log(data);
						// })

						tempArr.push(tempFile);

						let reader = new FileReader();
						reader.readAsDataURL(tempFile);
						reader.onload = (e) => {
							console.log(e.currentTarget.result);
							let tempId = tempFile.id;
							idBlobObj[tempId] = e.currentTarget.result;
						};
					}
				};
			};

			setTimeout(() => {
				console.log(idBlobObj);
				const data = {
					projectName: projectName,
					collectionName: collectionName,
					projectDescription: projectDescription,
					width: localStorage.getItem("width"),
					height: localStorage.getItem("height"),
					classArr: classArr1,
					indexedData: idBlobObj,
				};

				e.preventDefault();
				const a = document.createElement("a");
				const file = new Blob([JSON.stringify(data)], {type: "text/json"});
				a.href = URL.createObjectURL(file);
				a.download = projectName + ".json";
				a.click();

				URL.revokeObjectURL(a.href);

				// downloadFile({
				// 	data: JSON.stringify(data),
				// 	fileName: projectName + ".json",
				// 	fileType: "text/json",
				// });
			}, 1000);
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
									console.log(URL.createObjectURL(event.target.result.value));
									localClass[i].url[j] = URL.createObjectURL(
										event.target.result.value,
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

	useEffect(() => {
		if (
			localStorage.getItem("class") !== undefined &&
			localStorage.getItem("class") !== null
		) {
			const openRequest = window.indexedDB.open("imgsStore", 10);
			const localClass = JSON.parse(localStorage.getItem("class"));
			request(openRequest, localClass).then((result) => {
				setClassArr1(result);
				isNextActive(result);
			});

			if (
				localStorage.getItem("details") !== undefined &&
				localStorage.getItem("details") !== null
			) {
				projDet = JSON.parse(localStorage.getItem("details"));
			}

			let tempActiveLayer = 0;

			for (let i = 0; i < localClass.length; i++) {
				if (localClass[i].active) {
					tempActiveLayer = i;
				}
			}
			setCurenLayer(tempActiveLayer);

			localWidth = localStorage.getItem("width");
			localHeight = localStorage.getItem("height");
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
		}
	}, []);

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

			if (
				localStorage.getItem("details") !== undefined &&
				localStorage.getItem("details") !== null
			) {
				changeError(
					"colName",
					JSON.parse(localStorage.getItem("details")).projName,
				);
				changeError(
					"projName",
					JSON.parse(localStorage.getItem("details")).projectName,
				);
				changeError(
					"colDesc",
					JSON.parse(localStorage.getItem("details")).projectDescription,
				);
			}

			setWidth(localStorage.getItem("width"));
			setHeight(localStorage.getItem("height"));
		}
	}, []);

	function isNextActive(arr) {
		// Next button activity
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].imgs[0] == undefined) {
				setActiveNext(false);
				return;
			}
		}
		setActiveNext(true);
	}

	// new layer instance
	function newClass(name, active, imgsL, x, y, z) {
		for (let i = 0; i < classArr1.length; i++) {
			if (classArr1[i].name == name) {
				openError("Give a unique name.");
				return;
			}
		}

		let temp = new MyClass(name, active, imgsL, [], [], x, y, z);

		let tempR = {
			name,
			active,
			imgs: imgsL,
			src: [],
			url: [],
			x: x,
			y: y,
			width: 0,
			height: 0,
			z_index: z,
			names: [],
			rarity: [],
			sizes: {
				width: [],
				height: [],
			},
			rarityLayer: "4",
		};

		let tempArr = Object.values(classArr1);
		tempArr.push(temp);

		setClassArr1(tempArr);

		let curImg = curentImages;
		try {
			curImg.push(0);
		} catch {}
		setCurentImages(curImg);
		dispatch(createNewLayer(tempR));
		isNextActive(tempArr);
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
		console.log(tempArr);
		setClassArr1(tempArr);

		let updatedProjectState = [...projectEditorState];

		for (let i = 0; i < updatedProjectState.length; i++) {
			if (updatedProjectState[i].name == item.name) {
				updatedProjectState[i].active = true;
			} else {
				updatedProjectState[i].active = false;
			}
		}

		// let updatedLayer = {
		// 	...projectEditorState[curentLayer]
		// }

		// updatedLayer.name = tempVal;

		dispatch(updateAllData(updatedProjectState));
	}

	// switching active picture
	function setImgActive(index) {
		setCurentImages({...curentImages, [curentLayer]: index});
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

			const openRequest = window.indexedDB.open("imgsStore", 10);

			console.log(openRequest);

			openRequest.onerror = (event) => {
				console.log(event);
				// return;
			};

			openRequest.onsuccess = async (event) => {
				console.log(event);
				const store = event.target.result
					.transaction("imgs", "readwrite")
					.objectStore("imgs");
				console.log(store);
				// const testres = store.add(file);

				console.log(file);

				const id = await dbDexie.imgs.add({value: file});

				console.log(id);
				// testres.then((data)=>{
				// 	console.log(data);
				// });
				// console.log(testres);

				let lastId;

				let tempBlob;

				const resRequest = await dbDexie.imgs.toArray();

				console.log(resRequest);

				try {
					lastId = id;
				} catch {
					lastId = 0;
				}
				tempBlob = URL.createObjectURL(file);

				var reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = function (e) {
					var image = new Image();

					image.src = e.target.result;
					image.onload = async function () {
						let name = file.name.substring(0, file.name.indexOf("."));

						let newWidth = this.width;
						let newHeight = this.height;

						let tempArr = [];

						let updatedLayer = {
							...projectEditorState[curentLayer],
						};

						updatedLayer.imgs = [
							...projectEditorState[curentLayer].imgs,
							lastId,
						];
						updatedLayer.url = [
							...projectEditorState[curentLayer].url,
							tempBlob,
						];
						updatedLayer.names = [
							...projectEditorState[curentLayer].names,
							name,
						];
						updatedLayer.rarity = [
							...projectEditorState[curentLayer].rarity,
							"4",
						];
						updatedLayer.sizes = {
							width: [...projectEditorState[curentLayer].sizes.width, newWidth],
							height: [
								...projectEditorState[curentLayer].sizes.height,
								newHeight,
							],
						};

						dispatch(
							updateOneLayer({
								index: curentLayer,
								updatedLayer,
							}),
						);

						for (let i = 0; i < classArr1.length; i++) {
							let temp = classArr1[i];

							if (classArr1[curentLayer].name == classArr1[i].name) {
								temp.imgs = [...temp.imgs, lastId];
								temp.names = [...temp.names, name];
								temp.url = [...temp.url, tempBlob];

								temp.width = newWidth;
								temp.height = newHeight;
								temp.rarity = [...temp.rarity, "4"];

								temp.sizes = {
									width: [...temp.sizes.width, newWidth],
									height: [...temp.sizes.height, newHeight],
								};

								// temp.imgs = [...temp.imgs];
								// temp.names = [...temp.names];
								// temp.url = [...temp.url];

								// temp.width = newWidth;
								// temp.height = newHeight;
								// temp.rarity = [...temp.rarity];

								// temp.sizes = {
								// 	width: [...temp.sizes.width],
								// 	height: [...temp.sizes.height],
								// };
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
						localStorage.setItem("class", JSON.stringify(tempArr));
						localStorage.setItem("width", maxW);
						localStorage.setItem("height", maxH);
						setClassArr1(tempArr);
						dispatch(updateAllData(tempArr));
						isNextActive(tempArr);
					};
				};
			};
		}
	}

	// Removing an image from a layer
	function removeImg(index) {
		let tempArr = [];

		const openRequest = window.indexedDB.open("imgsStore", 10);

		let idDel = classArr1[curentLayer].imgs[index];

		openRequest.onsuccess = async (event) => {
			const store = event.target.result
				.transaction("imgs", "readwrite")
				.objectStore("imgs");
			store.delete(idDel);
		};

		// let updatedLayer = {
		// 	...projectEditorState[curentLayer]
		// }

		// updatedLayer.imgs = [
		// 	...projectEditorState[curentLayer].imgs.slice(0, index),
		// 	...projectEditorState[curentLayer].imgs.slice(index+1),
		// 	];
		// updatedLayer.url = [
		// 	...projectEditorState[curentLayer].url.slice(0, index),
		// 	...projectEditorState[curentLayer].url.slice(index+1),
		// 	];
		// updatedLayer.names = [
		// 	...projectEditorState[curentLayer].names.slice(0, index),
		// 	...projectEditorState[curentLayer].names.slice(index+1),
		// 	];
		// updatedLayer.rarity = [
		// 	...projectEditorState[curentLayer].rarity.slice(0, index),
		// 	...projectEditorState[curentLayer].rarity.slice(index+1),
		// 	];
		// updatedLayer.sizes = {
		// 	width: [
		// 		...projectEditorState[curentLayer].sizes.width.slice(0, index),
		// 		...projectEditorState[curentLayer].sizes.width.slice(index+1),
		// 		],
		// 	height: [
		// 		...projectEditorState[curentLayer].sizes.height.slice(0, index),
		// 		...projectEditorState[curentLayer].sizes.height.slice(index+1),
		// 		],
		// };

		// dispatch(updateOneLayer({
		// index: curentLayer,
		// updatedLayer,
		// }));

		for (let i = 0; i < classArr1.length; i++) {
			let temp = classArr1[i];

			let tempArrImg = [];
			let tempArrUrl = [];
			let tempArrNames = [];
			let tempArrRarity = [];
			let tempArrImgSizeW = [];
			let tempArrImgSizeH = [];
			if (classArr1[curentLayer].name == classArr1[i].name) {
				for (let j = 0; j < classArr1[i].imgs.length; j++) {
					if (classArr1[i].imgs[j] != classArr1[i].imgs[index]) {
						tempArrImg.push(classArr1[curentLayer].imgs[j]);
						tempArrUrl.push(classArr1[curentLayer].url[j]);
						tempArrNames.push(classArr1[curentLayer].names[j]);
						tempArrRarity.push(classArr1[curentLayer].rarity[j]);
						tempArrImgSizeW.push(classArr1[curentLayer].sizes.width[j]);
						tempArrImgSizeH.push(classArr1[curentLayer].sizes.height[j]);
					}
				}

				temp.imgs = tempArrImg;
				temp.url = tempArrUrl;
				temp.rarity = tempArrRarity;
				temp.names = tempArrNames;
				temp.sizes = {
					width: tempArrImgSizeW,
					height: tempArrImgSizeH,
				};
			}

			tempArr.push(temp);
		}

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
		setClassArr1(tempArr);
		isNextActive(tempArr);
	}

	// Changing the name of a layer
	function setNewLayerName(event) {
		for (let i = 0; i < classArr1.length; i++) {
			if (classArr1[i].name == event.target.value) {
				openError("Give a unique name");
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
		setClassArr1(tempArr);

		let updatedLayer = {
			...projectEditorState[curentLayer],
		};

		updatedLayer.name = tempVal;
		dispatch(
			updateOneLayer({
				index: curentLayer,
				updatedLayer,
			}),
		);
	}

	// Loading intermediate data
	function logData() {
		for (let i = 0; i < classArr1.length; i++) {
			if (classArr1[i].imgs[0] == undefined) {
				openError("Each layer must contain at least 1 image.");
				return;
			}
		}

		if (width <= 0 || width == undefined || width != parseInt(width, 10)) {
			setErrorInput("width");

			return false;
		}

		if (height <= 0 || height == undefined || height != parseInt(height, 10)) {
			setErrorInput("height");

			return false;
		}

		let tempCollectionName = "";
		let tempProjectName = "";
		let tempProjectDescription = "";

		if (collectionName === "" || collectionName === undefined) {
			setCollectionName("No Name");
			tempCollectionName = "No Name";
		} else {
			tempCollectionName = collectionName;
		}

		if (projectName === "" || projectName === undefined) {
			setProjectName("Project Name");
			tempProjectName = "Project Name";
		} else {
			tempProjectName = projectName;
		}

		if (projectDescription === "" || projectDescription === undefined) {
			setProjectDescription("Project Description");
			tempProjectDescription = "Project Description";
		} else {
			tempProjectDescription = projectDescription;
		}

		localStorage.setItem("class", JSON.stringify(classArr1));
		localStorage.setItem("width", width);
		localStorage.setItem("height", height);
		localStorage.setItem("curentLayer", curentLayer);
		localStorage.setItem(
			"details",
			JSON.stringify({
				projName: tempCollectionName,
				projectName: tempProjectName,
				projectDescription: tempProjectDescription,
			}),
		);

		return true;
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
				// setActiveNext(true);
			} else {
				// setActiveNext(false);
			}
		} else {
			setErrorInput(input);
			// setActiveNext(false);
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

	return (
		<>
			<div className={videoPlay ? "video-player" : "hide"}>
				<button className="close" onClick={() => setVideoPlay(false)}>
					<span />
					<span />
				</button>

				<div className="video">
					<iframe
						src="https://www.youtube.com/embed/YHatcktJM8I"
						title="YouTube video player"
						frameBorder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					/>
				</div>
			</div>
			<div className={"App App2"}>
				<ErrorModal />

				<div className="constructors">
					<div className="container-header">
						<HeaderEditor
							classArr={classArr1}
							projectData={{
								width,
								height,
								curentLayer,
								projectDescription,
								projectName,
								collectionName,
							}}
							activeStep={1}
						/>

						<div className="modal-constructor modal-constructor-layers">
							<div className="title">Layers</div>
							<div className="text">Add/Edit layers</div>
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
							<div className="text">Change layer settings</div>
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
							<div className="video-start">
								Need Help? &nbsp;{" "}
								<span onClick={() => setVideoPlay(true)}>
									{" "}
									Click to watch the Walkthrough Video.
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
														<span />
														<span />
													</div>
													<img src={classArr1[curentLayer].url[index]} />
												</div>
											);
										})}
								</div>

								<input
									type="file"
									id="input_file"
									accept=".png,.jpg,.jpeg"
									onChange={download}
									onClick={(event) => {
										event.target.value = null;
									}}
									multiple
								/>

								<label htmlFor="input_file" className="input__file-button">
									<span className="input__file-icon-wrapper"></span>
									<span className="input__file-text">Browse Images</span>
									<span className="input__file-text2">
										(image/png, image/jpg, image/jpeg) <br />
										You can select multiple images at once
									</span>
								</label>
							</div>

							<div
								className={
									activeNext ? "button-1-square" : "button-1-square unactive"
								}
								onClick={() => {
									let res = logData();
									if (res && checkLimit()) {
										navigate("/nft-customization");
									}
								}}
							>
								{limit > 30 ? (
									<span style={{color: "red"}}>
										{`Combinations - ${limit}, is exceeded. Allowed - 30 .Please
										reduce the number of images`}
									</span>
								) : (
									"Next"
								)}
							</div>
						</div>

						<div className="modal-constructor modal-constructor-settings">
							<div className="project-settings">
								<DropDown
									title={"Project details"}
									subtitle={"Add project name & description."}
								>
									<div className={"setting"}>
										<div className="title-settings">Project Name</div>
										<input
											type="text"
											placeholder="Project Name"
											className="input-settings"
											value={projectName}
											onBlur={() =>
												projectName == "" ? setProjectName("No Name") : null
											}
											onFocus={() =>
												projectName == "No Name" ? setProjectName("") : null
											}
											onChange={(event) => setProjectName(event.target.value)}
										/>
										{/* <span className="errMsg">Set project name</span> */}
									</div>
									<div className={"setting"}>
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
											onBlur={() =>
												collectionName == ""
													? setCollectionName("No Name")
													: null
											}
											onFocus={() =>
												collectionName == "No Name"
													? setCollectionName("")
													: null
											}
											onChange={(event) =>
												changeError("colName", event.target.value)
											}
										/>
										<span
											className={errorInput == "colName" ? "errMsg" : "hide"}
										>
											Set Collection Name
										</span>
									</div>
									<div className={"setting"}>
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
											onBlur={() =>
												projectDescription == ""
													? setProjectDescription("No Description")
													: null
											}
											onFocus={() =>
												projectDescription == "No Description"
													? setProjectDescription("")
													: null
											}
											onChange={(event) =>
												// changeError("colDesc", event.target.value);
												setProjectDescription(event.target.value)
											}
										/>
										<span
											className={errorInput == "colDesc" ? "errMsg" : "hide"}
										>
											Set Collection Description
										</span>
									</div>
								</DropDown>

								<DropDown
									title={"Dimensions"}
									subtitle={"Canvas dimensions"}
									hint={
										"The image resolution are picked from the first image you drag and drop. We expect all images to be the same resolution."
									}
								>
									<DoubleField
										firstField={["Width (px)", width]}
										secondField={["Height (px)", height]}
									/>
								</DropDown>
							</div>
						</div>
						<div className="break" />
					</div>
				</div>
			</div>
		</>
	);
}

export default LoadNftPage;
