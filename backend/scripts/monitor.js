const chokidar = require("chokidar");
const path = require("path");
const fs = require("fs");
const notifier = require("node-notifier");
require("dotenv").config();
const { getSettings } = require("../controllers/SettingsController");
const { analyseFile, predictFile, updateVirusFileInDB, quarantineFile, isAllowedVirusFile, createFileMD5 } = require("../utils/detection");
const dayjs = require("dayjs");

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
                readAllFilesAndFolders(fullPath);
            } else {
                callbackFn(fullPath, entry.name);
            }
        });
    });
};

const analyzeFileAndTakeActionIfNeeded = async (filePath, fileName) => {
    const fileInfoRaw = await analyseFile(filePath);
    const fileMD5 = await createFileMD5(filePath);
    const fileInfo = {
        SectionsMeanEntropy: fileInfoRaw.SectionsMeanEntropy,
        SectionsMinEntropy: fileInfoRaw.SectionsMinEntropy,
        SectionsMaxEntropy: fileInfoRaw.SectionsMaxEntropy,
        ResourcesMeanEntropy: fileInfoRaw.ResourcesMeanEntropy,
        ResourcesMinEntropy: fileInfoRaw.ResourcesMinEntropy,
        ResourcesMaxEntropy: fileInfoRaw.ResourcesMaxEntropy,
    };
    if (!isAllowedVirusFile(filePath, fileMD5)) {
        const prediction = await predictFile(fileInfo);
        if (prediction.malicious) {
            console.log("Malicious file detected:", fileName);
            notifier.notify({
                title: process.env.REACT_APP_PROJECT_NAME ?? "RDPS",
                message: `Ransomware detected! (${fileName})`,
                sound: true,
                timeout: 60,
                wait: true,
                open: process.env.REACT_APP_FE_URL,
            });
            const newFileName = `${dayjs().format("YYYYMMDDHHmmss")}---${fileName}`;
            quarantineFile(filePath, newFileName);
            updateVirusFileInDB(filePath, fileInfo, newFileName, fileMD5);
        }
    }
};

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
        setInterval(() => {
            initializeFirstScan(dirPath);
        }, 1000 * 60 * 60);
        initializeWatcher(dirPath);
    } catch (error) {
        console.error("Error initializing watcher:", error);
    }
})();
