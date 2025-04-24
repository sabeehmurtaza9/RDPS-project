import pefile
import hashlib
import os
import math
import json

def calculate_entropy(data):
    # Calculate entropy for the given data
    byte_count = [0] * 256
    for byte in data:
        byte_count[byte] += 1
    entropy = 0
    for count in byte_count:
        if count > 0:
            p = count / len(data)
            entropy -= p * math.log2(p)
    return entropy

def calculate_checksum(pe_file):
    """Calculate the checksum of a PE file excluding the PE header."""
    # Read the file content
    with open(pe_file, 'rb') as f:
        data = f.read()

    # Skip the first 0x3C bytes (DOS header and PE header offset) 
    # to begin from the actual PE header
    header = data[:0x3C]
    pe_offset = int.from_bytes(data[0x3C:0x40], byteorder='little')  # PE header offset
    pe_data = data[pe_offset:]

    # Calculate checksum (simple sum of bytes)
    checksum = sum(pe_data) % 2**32  # Ensure it's a 32-bit value

    return checksum

def analyze_pe(file_path):
    # Check if file exists
    if not os.path.isfile(file_path):
        raise ValueError(f"File {file_path} does not exist.")
    
    # Open the PE file
    pe = pefile.PE(file_path)

    # Calculate MD5 hash of the file
    with open(file_path, 'rb') as f:
        md5_hash = hashlib.md5(f.read()).hexdigest()

    # Extract required fields from PE headers
    file_header = pe.FILE_HEADER
    optional_header = pe.OPTIONAL_HEADER

    # Initialize data dictionary
    data = {
        'Name': os.path.basename(file_path),
        'md5': md5_hash,
        'Machine': file_header.Machine,
        'SizeOfOptionalHeader': file_header.SizeOfOptionalHeader,
        'Characteristics': file_header.Characteristics,
        'MajorOperatingSystemVersion': optional_header.MajorOperatingSystemVersion,
        'MinorOperatingSystemVersion': optional_header.MinorOperatingSystemVersion,
        'SizeOfCode': optional_header.SizeOfCode,
        'SizeOfInitializedData': optional_header.SizeOfInitializedData,
        'SizeOfUninitializedData': optional_header.SizeOfUninitializedData,
        'AddressOfEntryPoint': optional_header.AddressOfEntryPoint,
        'BaseOfCode': optional_header.BaseOfCode,
        'BaseOfData': optional_header.BaseOfData,
        'ImageBase': optional_header.ImageBase,
        'SectionAlignment': optional_header.SectionAlignment,
        'FileAlignment': optional_header.FileAlignment,
        'MajorImageVersion': optional_header.MajorImageVersion,
        'MinorImageVersion': optional_header.MinorImageVersion,
        'MajorLinkerVersion': optional_header.MajorLinkerVersion,
        'MinorLinkerVersion': optional_header.MinorLinkerVersion,
        'MajorSubsystemVersion': optional_header.MajorSubsystemVersion,
        'MinorSubsystemVersion': optional_header.MinorSubsystemVersion,
        'SizeOfImage': optional_header.SizeOfImage,
        'SizeOfHeaders': optional_header.SizeOfHeaders,
        'CheckSum': optional_header.CheckSum,
        'CheckSum_real': calculate_checksum(file_path),
        'Subsystem': optional_header.Subsystem,
        'DllCharacteristics': optional_header.DllCharacteristics,
        'SizeOfStackReserve': optional_header.SizeOfStackReserve,
        'SizeOfStackCommit': optional_header.SizeOfStackCommit,
        'SizeOfHeapReserve': optional_header.SizeOfHeapReserve,
        'SizeOfHeapCommit': optional_header.SizeOfHeapCommit,
        'LoaderFlags': optional_header.LoaderFlags,
        'NumberOfRvaAndSizes': optional_header.NumberOfRvaAndSizes,
    }

    # Extract section info for calculating entropy and sizes
    section_data = []
    for section in pe.sections:
        section_data.append({
            'name': section.Name.decode('utf-8').strip(),
            'raw_size': section.SizeOfRawData,
            'virtual_size': section.Misc_VirtualSize,
            'entropy': calculate_entropy(section.get_data())
        })

    # Calculate statistics for sections
    if section_data:
        sections_mean_entropy = sum(s['entropy'] for s in section_data) / len(section_data)
        sections_min_entropy = min(s['entropy'] for s in section_data)
        sections_max_entropy = max(s['entropy'] for s in section_data)
        sections_mean_rawsize = sum(s['raw_size'] for s in section_data) / len(section_data)
        sections_min_rawsize = min(s['raw_size'] for s in section_data)
        sections_max_rawsize = max(s['raw_size'] for s in section_data)
        sections_mean_virtualsize = sum(s['virtual_size'] for s in section_data) / len(section_data)
        sections_min_virtualsize = min(s['virtual_size'] for s in section_data)
        sections_max_virtualsize = max(s['virtual_size'] for s in section_data)

        # Add section statistics to the data dictionary
        data.update({
            'SectionsNb': len(section_data),
            'SectionsMeanEntropy': sections_mean_entropy,
            'SectionsMinEntropy': sections_min_entropy,
            'SectionsMaxEntropy': sections_max_entropy,
            'SectionsMeanRawsize': sections_mean_rawsize,
            'SectionsMinRawsize': sections_min_rawsize,
            'SectionMaxRawsize': sections_max_rawsize,
            'SectionsMeanVirtualsize': sections_mean_virtualsize,
            'SectionsMinVirtualsize': sections_min_virtualsize,
            'SectionMaxVirtualsize': sections_max_virtualsize,
        })

    return data

# Example usage
file_path = os.path.join(os.path.dirname(__file__), "../watched/cerber.exe")  # Replace with your PE file path
pe_info = analyze_pe(file_path)
print(json.dumps(pe_info, indent=4))
# Print the extracted information
for key, value in pe_info.items():
    print(f'{key}: {value}')
