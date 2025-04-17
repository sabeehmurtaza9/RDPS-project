const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const PeParser = require('pe-parser');  // Ensure this library is installed

// Example helper functions (you might need to adjust based on the library's output)
function calculateMeanEntropy(sections) {
  return sections.reduce((sum, sec) => sum + sec.entropy, 0) / sections.length;
}
function calculateMinEntropy(sections) {
  return Math.min(...sections.map(sec => sec.entropy));
}
function calculateMaxEntropy(sections) {
  return Math.max(...sections.map(sec => sec.entropy));
}
function calculateMeanRawSize(sections) {
  return sections.reduce((sum, sec) => sum + sec.SizeOfRawData, 0) / sections.length;
}
function calculateMinRawSize(sections) {
  return Math.min(...sections.map(sec => sec.SizeOfRawData));
}
function calculateMaxRawSize(sections) {
  return Math.max(...sections.map(sec => sec.SizeOfRawData));
}
function calculateMeanVirtualSize(sections) {
  return sections.reduce((sum, sec) => sum + sec.VirtualSize, 0) / sections.length;
}
function calculateMinVirtualSize(sections) {
  return Math.min(...sections.map(sec => sec.VirtualSize));
}
function calculateMaxVirtualSize(sections) {
  return Math.max(...sections.map(sec => sec.VirtualSize));
}
function calculateTotalImports(imports) {
  return imports.reduce((total, imp) => total + (imp.entries ? imp.entries.length : 0), 0);
}
function calculateOrdinalImports(imports) {
  return imports.reduce((total, imp) =>
    total + (imp.entries ? imp.entries.filter(e => e.ordinal).length : 0), 0);
}
function calculateResourcesMeanEntropy(resources) {
  if (!resources || resources.length === 0) return 0;
  return resources.reduce((sum, res) => sum + res.entropy, 0) / resources.length;
}
function calculateResourcesMinEntropy(resources) {
  if (!resources || resources.length === 0) return 0;
  return Math.min(...resources.map(res => res.entropy));
}
function calculateResourcesMaxEntropy(resources) {
  if (!resources || resources.length === 0) return 0;
  return Math.max(...resources.map(res => res.entropy));
}
function calculateResourcesMeanSize(resources) {
  if (!resources || resources.length === 0) return 0;
  return resources.reduce((sum, res) => sum + res.size, 0) / resources.length;
}
function calculateResourcesMinSize(resources) {
  if (!resources || resources.length === 0) return 0;
  return Math.min(...resources.map(res => res.size));
}
function calculateResourcesMaxSize(resources) {
  if (!resources || resources.length === 0) return 0;
  return Math.max(...resources.map(res => res.size));
}

async function analyzePE(filePath) {
  const buffer = fs.readFileSync(filePath);
  const md5 = crypto.createHash('md5').update(buffer).digest('hex');
  
  // Use PeParser to parse the PE file asynchronously
  try {
    // Correctly instantiate PeParser with the buffer
    const pe = new PeParser.Parse(buffer);
    
    // Debugging: Log the parsed PE object to check its structure
    console.log("Parsed PE object:", pe);

    // Ensure that necessary headers exist
    if (!pe.fileHeader || !pe.optionalHeader) {
      console.error("PE file headers are missing or invalid");
      return;
    }
    // Build an attributes object using both header values and computed metrics
    const attributes = {
      Name: path.basename(filePath),
      md5,
      Machine: pe.fileHeader.Machine,
      SizeOfOptionalHeader: pe.fileHeader.SizeOfOptionalHeader,
      Characteristics: pe.fileHeader.Characteristics,
      MajorLinkerVersion: pe.optionalHeader.MajorLinkerVersion,
      MinorLinkerVersion: pe.optionalHeader.MinorLinkerVersion,
      SizeOfCode: pe.optionalHeader.SizeOfCode,
      SizeOfInitializedData: pe.optionalHeader.SizeOfInitializedData,
      SizeOfUninitializedData: pe.optionalHeader.SizeOfUninitializedData,
      AddressOfEntryPoint: pe.optionalHeader.AddressOfEntryPoint,
      BaseOfCode: pe.optionalHeader.BaseOfCode,
      BaseOfData: pe.optionalHeader.BaseOfData,
      ImageBase: pe.optionalHeader.ImageBase,
      SectionAlignment: pe.optionalHeader.SectionAlignment,
      FileAlignment: pe.optionalHeader.FileAlignment,
      MajorOperatingSystemVersion: pe.optionalHeader.MajorOperatingSystemVersion,
      MinorOperatingSystemVersion: pe.optionalHeader.MinorOperatingSystemVersion,
      MajorImageVersion: pe.optionalHeader.MajorImageVersion,
      MinorImageVersion: pe.optionalHeader.MinorImageVersion,
      MajorSubsystemVersion: pe.optionalHeader.MajorSubsystemVersion,
      MinorSubsystemVersion: pe.optionalHeader.MinorSubsystemVersion,
      SizeOfImage: pe.optionalHeader.SizeOfImage,
      SizeOfHeaders: pe.optionalHeader.SizeOfHeaders,
      CheckSum: pe.optionalHeader.CheckSum,
      Subsystem: pe.optionalHeader.Subsystem,
      DllCharacteristics: pe.optionalHeader.DllCharacteristics,
      SizeOfStackReserve: pe.optionalHeader.SizeOfStackReserve,
      SizeOfStackCommit: pe.optionalHeader.SizeOfStackCommit,
      SizeOfHeapReserve: pe.optionalHeader.SizeOfHeapReserve,
      SizeOfHeapCommit: pe.optionalHeader.SizeOfHeapCommit,
      LoaderFlags: pe.optionalHeader.LoaderFlags,
      NumberOfRvaAndSizes: pe.optionalHeader.NumberOfRvaAndSizes,
      SectionsNb: pe.sections.length,
      SectionsMeanEntropy: calculateMeanEntropy(pe.sections),
      SectionsMinEntropy: calculateMinEntropy(pe.sections),
      SectionsMaxEntropy: calculateMaxEntropy(pe.sections),
      SectionsMeanRawsize: calculateMeanRawSize(pe.sections),
      SectionsMinRawsize: calculateMinRawSize(pe.sections),
      SectionMaxRawsize: calculateMaxRawSize(pe.sections),
      SectionsMeanVirtualsize: calculateMeanVirtualSize(pe.sections),
      SectionsMinVirtualsize: calculateMinVirtualSize(pe.sections),
      SectionMaxVirtualsize: calculateMaxVirtualSize(pe.sections),
      ImportsNbDLL: pe.imports ? pe.imports.length : 0,
      ImportsNb: calculateTotalImports(pe.imports),
      ImportsNbOrdinal: calculateOrdinalImports(pe.imports),
      ExportNb: pe.exports.length,
      ResourcesNb: pe.resources ? pe.resources.length : 0,
      ResourcesMeanEntropy: calculateResourcesMeanEntropy(pe.resources),
      ResourcesMinEntropy: calculateResourcesMinEntropy(pe.resources),
      ResourcesMaxEntropy: calculateResourcesMaxEntropy(pe.resources),
      ResourcesMeanSize: calculateResourcesMeanSize(pe.resources),
      ResourcesMinSize: calculateResourcesMinSize(pe.resources),
      ResourcesMaxSize: calculateResourcesMaxSize(pe.resources),
      LoadConfigurationSize: pe.loadConfiguration ? pe.loadConfiguration.Size : 0,
      VersionInformationSize: pe.versionInformation ? pe.versionInformation.Size : 0
    };

    console.log(attributes);
    return attributes;
  } catch (error) {
    console.error('Error parsing PE file:', error);
  }
}

// Example usage:
analyzePE(path.resolve(__dirname, "../watched/cerber.exe"));
