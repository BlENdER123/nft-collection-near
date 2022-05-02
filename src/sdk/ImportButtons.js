import React, {useState, useEffect} from "react";
import {HashRouter as Router, Redirect, useHistory} from "react-router-dom";
import {Button, Box} from "@mui/material";

Object.defineProperty(window, "indexedDB", {
	value:
		window.indexedDB ||
		window.mozIndexedDB ||
		window.webkitIndexedDB ||
		window.msIndexedDB,
});

function ImportButtons() {

    let history = useHistory();

    function newProject() {
        // localStorage.clear();
        // sessionStorage.clear();
        // TODO Delete all DB data
        history.push("/load-nft")
    }

    function openProject() {

    }

    function handleFile(e) {
		const fileReader = new FileReader();
		fileReader.readAsText(e.target.files[0], "UTF-8");
		fileReader.onload = (e) => {
			const data = JSON.parse(e.target.result);
            console.log(data);
			// setProjectName(data.projectName || "");
			// setCollectionName(data.collectionName || "");
			// setProjectDescription(data.projectDescription || "");
			// setWidth(data.width);
			// setHeight(data.height);
			// setClassArr1(data.classArr);

			//setFiles(e.target.result);
		};
	}


    return (
        <div class="import-buttons">
            <div class="new" onClick={newProject}></div>
            {/* <div class="import"></div> */}
            <Box className="import" type="button" component="label">
                <input
                    type="file"
                    accept=".json"
                    hidden
                    onChange={handleFile}
                />
            </Box>
            <div class="save"></div>
            
        </div>
    )


}

export default ImportButtons;