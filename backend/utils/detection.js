const fs = require("fs");
const path = require("path");
const PeParser = require("pe-parser");
const { db } = require("../db/init");
require('dotenv').config()

function calculateEntropy(buffer) {
    const frequency = new Array(256).fill(0);
    for (let i = 0; i < buffer.length; i++) {
        frequency[buffer[i]]++;
    }
    let entropy = 0;
    for (let i = 0; i < 256; i++) {
        if (frequency[i] === 0) continue;
        const p = frequency[i] / buffer.length;
        entropy -= p * Math.log2(p);
    }
    return entropy;
}

function analyzeEntropyFromBuffer(peFile, buffer) {
    if (!peFile.sections || peFile.sections.length === 0) {
        throw new Error("No sections found in PE file.");
    }
    const sectionEntropies = [];
    for (const section of peFile.sections) {
        const start = section.PointerToRawData;
        const size = section.SizeOfRawData;
        if (start + size > buffer.length) {
            console.warn(`Skipping section ${section.Name} due to invalid range.`);
            continue;
        }
        const sectionData = buffer.slice(start, start + size);
        const entropy = calculateEntropy(sectionData);
        sectionEntropies.push(entropy);
    }
    if (sectionEntropies.length === 0) {
        throw new Error("No valid section data found for entropy calculation.");
    }
    return {
        MeanEntropy: sectionEntropies.reduce((a, b) => a + b, 0) / sectionEntropies.length,
        MinEntropy: Math.min(...sectionEntropies),
        MaxEntropy: Math.max(...sectionEntropies),
    };
}

async function fetchOtherFileData(filePath) {
    const response = await fetch(`${process.env.REACT_APP_FLASK_URL}/detect`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            file_path: filePath,
        }),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} [a]`);
    }
    const data = await response.json();
    if (data.success) {
        return data.data;
    } else {
        throw new Error(`HTTP error! status: ${response.status} [b]`);
    }
}

module.exports = {
    analyseFile: async (filePath) => {
        try {
            const buffer = fs.readFileSync(filePath);
            const pe = await new PeParser.Parse(buffer);
            const entropyMetrics = analyzeEntropyFromBuffer(pe, buffer);
            const fileOtherData = await fetchOtherFileData(filePath);
            const fileInfo = {
                SectionsMeanEntropy: entropyMetrics.MeanEntropy,
                SectionsMinEntropy: entropyMetrics.MinEntropy,
                SectionsMaxEntropy: entropyMetrics.MaxEntropy,
                ...fileOtherData,
            };
            return fileInfo;
        } catch (error) {
            console.error("Error analyzing file:", error);
            throw new Error("File analysis failed");
        }
    },
    predictFile: async (obj) => {
        const response = await fetch(`${process.env.REACT_APP_FLASK_URL}/predict`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} [a]`);
        }
        const data = await response.json();
        if (data.success) {
            return data.data;
        } else {
            throw new Error(`HTTP error! status: ${response.status} [b]`);
        }
    },
    updateVirusFileInDB: (filePath, fileInfo, newFileName) => {
        try {
            const quarantineAt = new Date().toISOString();
            const quarantinePath = path.resolve(__dirname, `../../quarantine/${newFileName}`);
            const fileInfoString = JSON.stringify(fileInfo);
            const fileName = path.basename(filePath);
            const qry = db.prepare(`
                INSERT INTO viruses (file_name, file_path, file_info, quarantine_at, quarantine_path)
                VALUES (?, ?, ?, ?, ?)
            `);
            const result = qry.run(fileName, filePath, fileInfoString, quarantineAt, quarantinePath);
            return result;
        } catch (error) {
            console.error("Error updating virus file in DB:", error);
            throw new Error("Database update failed");
        }
    },
    quarantineFile: (filePath, newFileName) => {
        try {
            const quarantinePath = path.resolve(__dirname, `../../quarantine/${newFileName}`);
            fs.renameSync(filePath, quarantinePath);
            return true;
        } catch (error) {
            console.error("Error quarantining file:", error);
            throw new Error("File quarantine failed");
        }
    },
};
