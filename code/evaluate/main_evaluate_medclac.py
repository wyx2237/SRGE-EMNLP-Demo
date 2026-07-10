# 评估实验代码 (基于qwen3-8b)

# Zero Shot （医学计算问题不包含完整定义）
import asyncio
import json
import os
import sys
sys.path.append('/root/local/BIYELUNWEN/KAITI/SRGE/datasets/CliniCalc-CN/code')
sys.path.append('/root/local/BIYELUNWEN/KAITI/SRGE')
sys.path.append('/root/local/BIYELUNWEN/KAITI/SRGE/evaluate')

from method.core.models import chat_method_qwen3_8b
from evaluate.baselines.zeroshot import run as zeroshot_run
from evaluate.baselines.codeprompt import run as codeprompt_run
from evaluate.baselines.ICLCoT import run as ICLCoT_run
from evaluate.baselines.ICLCoTfewshot import run as ICLCoT_FS_run
from evaluate.baselines.medrac import run as medrac_run
from method.srge import srge_main


# Text2Rule(ours)

async def evaluate_sample(patient_note, question, calculator, baseline):
    """
    测试单条样本
    Params:
        patient_note: str, 病历
        question: str, 问题
        calculator: dict, 计算指标
        baseline: int, 基线选择
    """
    prompt = None
    # baseline1 Zero-Shot
    # baseline2 Code Prompt
    # baseline3 ICL CoT
    # baseline4 ICL CoT Few Shot
    # baseline5 MedRac
    # baseline6 Text2Rule
    input_params = None
    if baseline == 1:
        # prompt = Zero_Shot_Prompt.format(patient_note=patient_note, question=question)
        result = await zeroshot_run(patient_note=patient_note, question=question, calculator=calculator)
        log(content=f"Result: {result}")
    elif baseline == 2:
        result = await codeprompt_run(patient_note=patient_note, question=question, calculator=calculator)
        log(content=f"Result: {result}")
    elif baseline == 3:
        result = await ICLCoT_run(patient_note=patient_note, question=question, calculator=calculator)
    elif baseline == 4:
        result = await ICLCoT_FS_run(patient_note=patient_note, question=question, calculator=calculator)
    elif baseline == 5:
        result = await medrac_run(patient_note=patient_note, question=question, calculator=calculator)
    elif baseline == 6:
        input_params, result = await srge_main(patient_info=patient_note, question=question, calculator=calculator)
    else:
        raise ValueError("Invalid baseline #")

    return {
        "params": input_params,
        "final_value": result
    }
    # print(prompt)
    # log(content="Prompt:\n")
    # log(content=prompt)
    # if prompt:
    #     result = await chat_method_qwen3_8b(prompt)
    #     print(result)
    #     return result
    # else:
    #     return 



async def evaluate_all(dataset:list, result_path:str, method_id:int):
    """
    评估某个方法在ZH-MedCalc上的表现
    """
        
    # log_path = "logs/0521.log"
    calculators_dict = load_calculators()
    print(calculators_dict.keys())
    for i in range(0, 1100): # max=len(dataset)
        sample = dataset[i]
        print("="*100)
        print("="*100)
        # print(sample)
        print(f"Evaluating {sample['Row Number']} {sample['Calculator ID']} {sample['Calculator Name']}")
        log(content=f"Evaluating Sample ID: {sample['Row Number']} Calculator ID: {sample['Calculator ID']} Calculator Name: {sample['Calculator Name']}")
        patient_note = sample['Patient Note']
        question = sample['Question']
        calculator_id = int(sample['Calculator ID'])
        calculator = calculators_dict[calculator_id]
        # print(f"[Calculator Dict]: {json.dumps(calculator, ensure_ascii=False, indent=4)}")          
        # 评估单条样本
        try:
            result = await evaluate_sample(patient_note, question, calculator, baseline=method_id)
            log(content=f"Result: {result}")
            log(content="\n" + "="*150 + "\n")
            result_sample = {
                "Sample ID": sample['Row Number'],
                "Calculator ID": sample['Calculator ID'],
                "Calculator Name": sample['Calculator Name'],
                "Question": sample['Question'],
                "Ground Truth": sample['Ground Truth Answer'],
                "Result": result.get("final_value")
            }
            if method_id == 6:
                result_sample["Extracted Params"] = result.get("params", None)
        except Exception as e:
            log(content=f"Error: {e}")
            result_sample = {
                "Sample ID": sample['Row Number'],
                "Calculator ID": sample['Calculator ID'],
                "Calculator Name": sample['Calculator Name'],
                "Question": sample['Question'],
                "Ground Truth": sample['Ground Truth Answer'],
                "Result": None,
                "Error": str(e)
            }
            # raise e
        with open(result_path, 'a') as f:
            f.write(json.dumps(result_sample, ensure_ascii=False) + "\n")



def log(path="logs/0623.log", content=None):
    # 如果不存在该文件路径则创建
    import logging
    if not os.path.exists(path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
    logging.basicConfig(filename=path, level=logging.INFO, format='%(asctime)s %(message)s')
    logging.info(content)
    # with open(path, 'a') as f:
    #     f.write(content + '\n')

def load_calculators():
    with open('/root/local/BIYELUNWEN/KAITI/SRGE/datasets/medcalc-bench/task_set_with_formula.json') as f:
        calculators = json.load(f)
    
    calculators_dict = {}
    for c in calculators:
        calculators_dict[c['calculator id']] = c
    return calculators_dict

DATASET_PATH = "/root/local/BIYELUNWEN/KAITI/SRGE/datasets/medcalc-bench/MedCalc-Bench-v1.2-dataset"
def load_test_data(split_name:str="test", dataset_path:str=DATASET_PATH):
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
        raise e
    

if __name__ == '__main__':
    
    # 加载数据集
    dataset = load_test_data()
    # 评估某个方法在ZH-MedCalc上的表现
    method_id = 4
    methd_name_dict = {
        1: "Zero-Shot",
        2: "CodePrompt",
        3: "ICLCoT",
        4: "ICLCoT-FewShot",
        5: "MedRac",
        6: "SRGE"
    }
    method_name = methd_name_dict.get(method_id)
    result_path = os.path.join("/root/local/BIYELUNWEN/KAITI/SRGE/evaluate/results/Medcalc", method_name + ".jsonl")
    print(f"Evaluating {method_name}...")
    print(f"dataset size: {len(dataset)}")
    # print(dataset[:3])
    # print(type(dataset))
    asyncio.run(evaluate_all(dataset, result_path, method_id))