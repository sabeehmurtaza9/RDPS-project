const chokidar = require("chokidar");
const path = require("path");
const fs = require("fs");
const notifier = require('node-notifier');
require('dotenv').config()
const { getSettings } = require("../controllers/SettingsController");
const { analyseFile, predictFile } = require("../utils/detection");
const { time } = require("console");

const getWatchedDirPath = () => {
    const settings = getSettings();
    if (["", null, undefined].includes(settings?.watched_dir_path)) {
        console.log("No watched directory set.");
        return;
    }
    return path.resolve(settings?.watched_dir_path);
};

const isFileAllowedToBeAnalyzed = (filePath) => {
    const allowedExtensions = [
        ".acm",
        ".ax",
        ".cpl",
        ".dll",
        ".drv",
        ".efi",
        ".exe",
        ".mui",
        ".ocx",
        ".scr",
        ".sys",
        ".tsp",
        ".mun",
        ".msstyles",
    ];
    const fileExtension = path.extname(filePath).toLowerCase();
    return allowedExtensions.includes(fileExtension);
};

const readAllFilesAndFolders = (dirPath, callbackFn) => {
    fs.readdir(dirPath, { withFileTypes: true }, (err, entries) => {
        if (err) {
            console.error("Error reading directory:", err);
            return;
        }
        entries.forEach((entry) => {
            const fullPath = path.join(dirPath, entry.name);
            if (entry.isDirectory()) {
                // console.log(`Directory: ${fullPath}`);
                // Recursively read nested directories
                readAllFilesAndFolders(fullPath);
            } else {
                callbackFn(fullPath, entry.name);
                // console.log(`File: ${fullPath}`);
            }
        });
    });
};

const analyzeFileAndTakeActionIfNeeded = async (filePath, fileName) => {
    const fileInfoRaw = await analyseFile(filePath);
    const fileInfo = {
        SectionsMeanEntropy: fileInfoRaw.SectionsMeanEntropy,
        SectionsMinEntropy: fileInfoRaw.SectionsMinEntropy,
        SectionsMaxEntropy: fileInfoRaw.SectionsMaxEntropy,
        ResourcesMeanEntropy: fileInfoRaw.ResourcesMeanEntropy,
        ResourcesMinEntropy: fileInfoRaw.ResourcesMinEntropy,
        ResourcesMaxEntropy: fileInfoRaw.ResourcesMaxEntropy,
    };
    const prediction = await predictFile(fileInfo);
    if (prediction.malicious) {
        notifier.notify({
            title: process.env.REACT_APP_PROJECT_NAME ?? "RDPS",
            message: `Ransomware detected! (${fileName})`,
            sound: true,
            timeout: 60,
            wait: true
        });
    }
}

const initializeWatcher = (dirPath) => {
    if (!dirPath) {
        console.error("No directory path provided.");
        return;
    }
    const watcher = chokidar.watch(dirPath, {
        persistent: true,
        ignoreInitial: true,
    });
    watcher.on("add", (filePath) => {
        // console.log(`File added: ${filePath}`);
        if (isFileAllowedToBeAnalyzed(filePath)) {
            analyzeFileAndTakeActionIfNeeded(filePath, path.basename(filePath));
        }
    });
    watcher.on("change", (filePath) => {
        if (isFileAllowedToBeAnalyzed(filePath)) {
            analyzeFileAndTakeActionIfNeeded(filePath, path.basename(filePath));
        }
    });
};

const initializeFirstScan = (dirPath) => {
    readAllFilesAndFolders(dirPath, async (filePath, fileName) => {
        if (isFileAllowedToBeAnalyzed(filePath)) {
            await analyzeFileAndTakeActionIfNeeded(filePath, fileName);
        }
    });
};

(async () => {
    try {
        const dirPath = getWatchedDirPath();
        initializeFirstScan(dirPath);
        initializeWatcher(dirPath);
    } catch (error) {
        console.error("Error initializing watcher:", error);
    }
})();
