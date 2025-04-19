const axios = require('axios');

const sampleData = {
  "Machine": 34404,
  "SizeOfOptionalHeader": 224,
  "Characteristics": 271,
  "MajorLinkerVersion": 9,
  "MinorLinkerVersion": 0,
  "SizeOfCode": 16384,
  "SizeOfInitializedData": 8192,
  "SizeOfUninitializedData": 0,
  "AddressOfEntryPoint": 4096,
  "BaseOfCode": 4096,
  "BaseOfData": 8192,
  "ImageBase": 4194304,
  "SectionAlignment": 4096,
  "FileAlignment": 512,
  "MajorOperatingSystemVersion": 4,
  "MinorOperatingSystemVersion": 0,
  "MajorImageVersion": 0,
  "MinorImageVersion": 0,
  "MajorSubsystemVersion": 4,
  "MinorSubsystemVersion": 0,
  "SizeOfImage": 73728,
  "SizeOfHeaders": 1024,
  "CheckSum": 0,
  "Subsystem": 2,
  "DllCharacteristics": 0,
  "SizeOfStackReserve": 1048576,
  "SizeOfStackCommit": 4096,
  "SizeOfHeapReserve": 1048576,
  "SizeOfHeapCommit": 4096,
  "LoaderFlags": 0,
  "NumberOfRvaAndSizes": 16,
  // Below are additional features expected by the model.
  "SectionsNb": 5,
  "SectionsMeanEntropy": 6.5,
  "SectionsMinEntropy": 5.1,
  "SectionsMaxEntropy": 7.9,
  "SectionsMeanRawsize": 2048,
  "SectionsMinRawsize": 512,
  "SectionMaxRawsize": 4096,
  "SectionsMeanVirtualsize": 3072,
  "SectionsMinVirtualsize": 1024,
  "SectionMaxVirtualsize": 6144,
  "ImportsNbDLL": 3,
  "ImportsNb": 10,
  "ImportsNbOrdinal": 2,
  "ExportNb": 0,
  "ResourcesNb": 4,
  "ResourcesMeanEntropy": 6.0,
  "ResourcesMinEntropy": 5.0,
  "ResourcesMaxEntropy": 7.0,
  "ResourcesMeanSize": 256,
  "ResourcesMinSize": 128,
  "ResourcesMaxSize": 512,
  "LoadConfigurationSize": 1024,
  "VersionInformationSize": 128
};

async function predictRansomware() {
  try {
    const response = await fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sampleData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Prediction:', data.prediction);
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

predictRansomware();
