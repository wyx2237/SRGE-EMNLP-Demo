# 从数据集中正确加载数据
import os
import sys
sys.path.append("/root/local/BIYELUNWEN/KAITI/SRGE/datasets/medcalc-bench")

DATASET_PATH = "/root/local/BIYELUNWEN/KAITI/SRGE/datasets/medcalc-bench/MedCalc-Bench-v1.2-dataset"


def load_test_data(split_name="test", dataset_path=DATASET_PATH):
    """
    加载测试数据集
    
    Args:
        split_name (str, optional): 指定要加载的数据分割名称，如 'train', 'validation', 'test'等。
                                    如果为None，则返回整个数据集字典
        dataset_path (str): 数据集路径
    
    Returns:
        如果指定split_name: 返回对应的Dataset对象
        如果split_name为None: 返回包含所有分割的DatasetDict对象
    """
    from datasets import load_dataset, load_from_disk

    try:
        # 加载数据集
        local_ds = load_from_disk(dataset_path)
        
        # 1. 查看数据集基本信息
        print("=== 数据集基本信息 ===")
        print(f"数据集类型: {type(local_ds)}")
        
        if split_name is None:
            # 返回整个数据集字典
            print(f"数据集分割: {list(local_ds.keys())}")
            
            # 查看每个分割的详细信息
            for split, split_data in local_ds.items():
                print(f"\n=== {split.upper()} 分割 ===")
                print(f"样本数量: {len(split_data)}")
                print(f"特征结构: {split_data.features}")
                print(f"列名: {split_data.column_names}")
            
            # 查看前几个样本的详细内容
            for split, split_data in local_ds.items():
                print(f"\n=== {split.upper()} 分割的前3个样本 ===")
                
                for i in range(min(3, len(split_data))):
                    sample = split_data[i]
                    print(f"\n样本 {i}:")
                    for key, value in sample.items():
                        # 如果值太长，只显示前200个字符
                        value_str = str(value)
                        if len(value_str) > 200:
                            value_str = value_str[:200] + "..."
                        print(f"  {key}: {value_str}")
            
            return local_ds
            
        else:
            # 检查指定的split_name是否存在
            if split_name not in local_ds:
                available_splits = list(local_ds.keys())
                raise ValueError(f"分割 '{split_name}' 不存在。可用的分割有: {available_splits}")
            
            # 返回指定的分割数据
            split_data = local_ds[split_name]
            print(f"\n=== 加载的分割: {split_name.upper()} ===")
            print(f"样本数量: {len(split_data)}")
            print(f"特征结构: {split_data.features}")
            print(f"列名: {split_data.column_names}")
            
            # 查看前几个样本的详细内容
            print(f"\n=== {split_name.upper()} 分割的前3个样本 ===")
            for i in range(min(3, len(split_data))):
                sample = split_data[i]
                print(f"\n样本 {i}:")
                for key, value in sample.items():
                    # 如果值太长，只显示前200个字符
                    value_str = str(value)
                    if len(value_str) > 200:
                        value_str = value_str[:200] + "..."
                    print(f"  {key}: {value_str}")
            
            return split_data
            
    except Exception as e:
        print(f"加载数据集时出错: {e}")
        return None
    
if __name__ == "__main__":
    # 加载测试数据集
    test_data = load_test_data(split_name="test")
    if test_data is not None:
        print("测试数据加载成功")
    else:
        print("测试数据加载失败")