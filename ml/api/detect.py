import pefile
import math
import os

def calculate_entropy(data):
    if not data:
        return 0.0
    entropy = 0
    for x in range(256):
        p_x = data.count(bytes([x])) / len(data)
        if p_x > 0:
            entropy -= p_x * math.log2(p_x)
    return entropy

def extract_pe_metadata(filepath):
    res = { "success": False }
    try:
        pe = pefile.PE(filepath)

        # Imports
        imports = []
        imports_nb_dll = 0
        imports_nb_ordinal = 0
        if hasattr(pe, 'DIRECTORY_ENTRY_IMPORT'):
            imports_nb_dll = len(pe.DIRECTORY_ENTRY_IMPORT)
            for entry in pe.DIRECTORY_ENTRY_IMPORT:
                for imp in entry.imports:
                    imports.append(imp)
                    if imp.name is None:  # Imported by ordinal
                        imports_nb_ordinal += 1
        imports_nb = len(imports)

        # Exports
        export_nb = 0
        if hasattr(pe, 'DIRECTORY_ENTRY_EXPORT'):
            export_nb = len(pe.DIRECTORY_ENTRY_EXPORT.symbols)

        # Resources
        resources = []
        if hasattr(pe, 'DIRECTORY_ENTRY_RESOURCE'):
            for resource_type in pe.DIRECTORY_ENTRY_RESOURCE.entries:
                if hasattr(resource_type, 'directory'):
                    for entry in resource_type.directory.entries:
                        if hasattr(entry, 'directory'):
                            for res_entry in entry.directory.entries:
                                try:
                                    data_rva = res_entry.data.struct.OffsetToData
                                    size = res_entry.data.struct.Size
                                    data = pe.get_memory_mapped_image()[data_rva:data_rva+size]
                                    entropy = calculate_entropy(data)
                                    resources.append((entropy, size))
                                except Exception:
                                    continue  # Skip unreadable resources

        resources_nb = len(resources)
        entropies = [r[0] for r in resources]
        sizes = [r[1] for r in resources]
        resources_mean_entropy = sum(entropies) / len(entropies) if entropies else 0
        resources_min_entropy = min(entropies) if entropies else 0
        resources_max_entropy = max(entropies) if entropies else 0
        resources_mean_size = sum(sizes) / len(sizes) if sizes else 0
        resources_min_size = min(sizes) if sizes else 0
        resources_max_size = max(sizes) if sizes else 0

        # Load Configuration Size
        load_config_size = pe.OPTIONAL_HEADER.DATA_DIRECTORY[pefile.DIRECTORY_ENTRY['IMAGE_DIRECTORY_ENTRY_LOAD_CONFIG']].Size

        # Version Info Size
        version_info_size = 0
        if hasattr(pe, 'FileInfo'):
            for fileinfo in pe.FileInfo:
                if hasattr(fileinfo, 'Key') and fileinfo.Key == b'StringFileInfo':
                    for st in fileinfo.StringTable:
                        for k, v in st.entries.items():
                            version_info_size += len(k) + len(v)

        res = {
            'success': True,
            'data': {
                # 'ImportsNbDLL': int(imports_nb_dll),
                # 'ImportsNb': int(imports_nb),
                # 'ImportsNbOrdinal': int(imports_nb_ordinal),
                # 'ExportNb': int(export_nb),
                # 'ResourcesNb': int(resources_nb),
                'ResourcesMeanEntropy': float(resources_mean_entropy),
                'ResourcesMinEntropy': float(resources_min_entropy),
                'ResourcesMaxEntropy': float(resources_max_entropy),
                # 'ResourcesMeanSize': float(resources_mean_size),
                # 'ResourcesMinSize': int(resources_min_size),
                # 'ResourcesMaxSize': int(resources_max_size),
                # 'LoadConfigurationSize': int(load_config_size),
                # 'VersionInformationSize': int(version_info_size)
            }
        }

        pe.close()

    except Exception as e:
        res = {
            'success': False,
            'error': str(e)
        }

    return res