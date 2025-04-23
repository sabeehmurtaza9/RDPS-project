const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const PeParser = require("pe-parser"); // Ensure this library is installed

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
function calculateMeanRawSize(sections) {
    return sections.reduce((sum, sec) => sum + sec.SizeOfRawData, 0) / sections.length;
}
function calculateMinRawSize(sections) {
    return Math.min(...sections.map((sec) => sec.SizeOfRawData));
}
function calculateMaxRawSize(sections) {
    return Math.max(...sections.map((sec) => sec.SizeOfRawData));
}
function calculateMeanVirtualSize(sections) {
    return sections.reduce((sum, sec) => sum + sec.VirtualSize, 0) / sections.length;
}
function calculateMinVirtualSize(sections) {
    return Math.min(...sections.map((sec) => sec.VirtualSize));
}
function calculateMaxVirtualSize(sections) {
    return Math.max(...sections.map((sec) => sec.VirtualSize));
}

async function analyzePE(filePath) {
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
    if (!allowedExtensions.includes(fileExtension)) {
        console.error(`File extension ${fileExtension} is not allowed.`);
        return;
    }
    const buffer = fs.readFileSync(filePath);
    const md5 = crypto.createHash("md5").update(buffer).digest("hex");

    // Use PeParser to parse the PE file asynchronously
    try {
        // Correctly instantiate PeParser with the buffer
        const pe = await new PeParser.Parse(buffer);

        // Debugging: Log the parsed PE object to check its structure
        // console.log("Parsed PE object:", pe);

        // Ensure that necessary headers exist
        if (!pe.nt_headers.FileHeader || !pe.nt_headers.OptionalHeader) {
            console.error("PE file headers are missing or invalid");
            return;
        }
        // Build an attributes object using both header values and computed metrics
        const entropyMetrics = analyzeEntropyFromBuffer(pe, buffer);
        const attributes = {
            Name: path.basename(filePath),
            md5,
            Machine: pe.nt_headers.FileHeader.Machine,
            SizeOfOptionalHeader: pe.nt_headers.FileHeader.SizeOfOptionalHeader,
            Characteristics: pe.nt_headers.FileHeader.Characteristics,
            MajorOperatingSystemVersion: pe.nt_headers.OptionalHeader.MajorOperatingSystemVersion,
            MinorOperatingSystemVersion: pe.nt_headers.OptionalHeader.MinorOperatingSystemVersion,
            SizeOfCode: pe.nt_headers.OptionalHeader.SizeOfCode,
            SizeOfInitializedData: pe.nt_headers.OptionalHeader.SizeOfInitializedData,
            SizeOfUninitializedData: pe.nt_headers.OptionalHeader.SizeOfUninitializedData,
            AddressOfEntryPoint: pe.nt_headers.OptionalHeader.AddressOfEntryPoint,
            BaseOfCode: pe.nt_headers.OptionalHeader.BaseOfCode,
            BaseOfData: pe.nt_headers.OptionalHeader.BaseOfData,
            ImageBase: pe.nt_headers.OptionalHeader.ImageBase,
            SectionAlignment: pe.nt_headers.OptionalHeader.SectionAlignment,
            FileAlignment: pe.nt_headers.OptionalHeader.FileAlignment,
            MajorImageVersion: pe.nt_headers.OptionalHeader.MajorImageVersion,
            MinorImageVersion: pe.nt_headers.OptionalHeader.MinorImageVersion,
            MajorLinkerVersion: pe.nt_headers.OptionalHeader.MajorLinkerVersion,
            MinorLinkerVersion: pe.nt_headers.OptionalHeader.MinorLinkerVersion,
            MajorSubsystemVersion: pe.nt_headers.OptionalHeader.MajorSubsystemVersion,
            MinorSubsystemVersion: pe.nt_headers.OptionalHeader.MinorSubsystemVersion,
            SizeOfImage: pe.nt_headers.OptionalHeader.SizeOfImage,
            SizeOfHeaders: pe.nt_headers.OptionalHeader.SizeOfHeaders,
            CheckSum: pe.nt_headers.OptionalHeader.CheckSum,
            Subsystem: pe.nt_headers.OptionalHeader.Subsystem,
            DllCharacteristics: pe.nt_headers.OptionalHeader.DllCharacteristics,
            SizeOfStackReserve: pe.nt_headers.OptionalHeader.SizeOfStackReserve,
            SizeOfStackCommit: pe.nt_headers.OptionalHeader.SizeOfStackCommit,
            SizeOfHeapReserve: pe.nt_headers.OptionalHeader.SizeOfHeapReserve,
            SizeOfHeapCommit: pe.nt_headers.OptionalHeader.SizeOfHeapCommit,
            LoaderFlags: pe.nt_headers.OptionalHeader.LoaderFlags,
            NumberOfRvaAndSizes: pe.nt_headers.OptionalHeader.NumberOfRvaAndSizes,
            SectionsNb: pe.sections.length,
            SectionsMeanEntropy: entropyMetrics.MeanEntropy,
            SectionsMinEntropy: entropyMetrics.MinEntropy,
            SectionsMaxEntropy: entropyMetrics.MaxEntropy,
            SectionsMeanRawsize: calculateMeanRawSize(pe.sections),
            SectionsMinRawsize: calculateMinRawSize(pe.sections),
            SectionMaxRawsize: calculateMaxRawSize(pe.sections),
            SectionsMeanVirtualsize: calculateMeanVirtualSize(pe.sections),
            SectionsMinVirtualsize: calculateMinVirtualSize(pe.sections),
            SectionMaxVirtualsize: calculateMaxVirtualSize(pe.sections),
        };

        console.log(attributes);
        return attributes;
    } catch (error) {
        console.error("Error parsing PE file:", error);
    }
}

// Example usage:
// analyzePE(path.resolve(__dirname, "../watched/cerber.exe"));
analyzePE(path.resolve(__dirname, "../watched/Locky.exe"));
