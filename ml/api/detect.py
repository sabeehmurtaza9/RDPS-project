import pefile
import math

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
                                    continue

        entropies = [r[0] for r in resources]
        resources_mean_entropy = sum(entropies) / len(entropies) if entropies else 0
        resources_min_entropy = min(entropies) if entropies else 0
        resources_max_entropy = max(entropies) if entropies else 0

        res = {
            'success': True,
            'data': {
                'ResourcesMeanEntropy': float(resources_mean_entropy),
                'ResourcesMinEntropy': float(resources_min_entropy),
                'ResourcesMaxEntropy': float(resources_max_entropy)
            }
        }
        pe.close()
    except Exception as e:
        res = {
            'success': False,
            'error': str(e)
        }
    return res