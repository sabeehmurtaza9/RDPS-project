const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const PeParser = require("pe-parser");

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

        // Validate range
        if (start + size > buffer.length) {
            console.warn(`Skipping section ${section.Name} due to invalid range.`);
            continue;
        }

        const sectionData = buffer.slice(start, start + size);
        const entropy = calculateEntropy(sectionData);

        // console.log(`Entropy of section ${section.Name.trim()}:`, entropy.toFixed(4));
        sectionEntropies.push(entropy);
    }

    if (sectionEntropies.length === 0) {
        throw new Error("No valid section data found for entropy calculation.");
    }

    const meanEntropy = sectionEntropies.reduce((a, b) => a + b, 0) / sectionEntropies.length;
    const minEntropy = Math.min(...sectionEntropies);
    const maxEntropy = Math.max(...sectionEntropies);

    return {
        MeanEntropy: meanEntropy,
        MinEntropy: minEntropy,
        MaxEntropy: maxEntropy,
    };
}

async function fetchOtherFileData(filePath) {
    const response = await fetch("http://127.0.0.1:6001/detect", {
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
            // console.log("File Path:", filePath);
            // console.log("File Info:", fileInfo);
            return fileInfo;
        } catch (error) {
            console.error("Error analyzing file:", error);
            throw new Error("File analysis failed");
        }
    },
    predictFile: async (obj) => {
        const response = await fetch("http://127.0.0.1:6001/predict", {
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
};
