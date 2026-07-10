# 评估实验代码 (基于qwen3-8b)

# Zero Shot （医学计算问题不包含完整定义）
import asyncio
import json
import os
import sys
sys.path.append('/root/local/BIYELUNWEN/KAITI/SRGE/datasets/wyx-Cmedcalc/code')
sys.path.append('/root/local/BIYELUNWEN/KAITI/SRGE')
sys.path.append('/root/local/BIYELUNWEN/KAITI/SRGE/evaluate')

from method.core.models import chat_method_qwen3_8b
from evaluate.baselines.zeroshot import run as zeroshot_run
from evaluate.baselines.codeprompt import run as codeprompt_run
from evaluate.baselines.ICLCoT import run as ICLCoT_run
from evaluate.baselines.ICLCoTfewshot import run as ICLCoT_FS_run
from evaluate.baselines.medrac import run as medrac_run
from method.srge import srge_main

from evaluate.ablations.wo_atomic import wo_atomic
from evaluate.ablations.wo_code_exec import wo_code_exec
from evaluate.ablations.wo_rule_generate import wo_rule_generate

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

async def evaluate_sample_wo(patient_note, question, calculator, wo=1):
    """
    消融测试
    """
    input_params = None
    if wo == 1:
        # wo atomic
        input_params, result = await wo_atomic(patient_info=patient_note, question=question, calculator=calculator)
        log(content=f"Result: {result}")
    elif wo == 2:
        # wo code exec
        result = await wo_code_exec(patient_info=patient_note, question=question, calculator=calculator)
        log(content=f"Result: {result}")
    elif wo == 3:
        # wo rule generate
        result = await wo_rule_generate(patient_info=patient_note, question=question, calculator=calculator)
        log(content=f"Result: {result}")
    else:
        raise ValueError("Invalid wo #")
    return {
        "final_value": result,
        "params": input_params
    }

async def evaluate_all(dataset:list, result_path:str, method_id:int, wo=0):
    """
    评估某个方法在ZH-MedCalc上的表现
    """
        
    # log_path = "logs/0521.log"
    calculators_dict = load_calculators()
    for sample in dataset[100:101]:
        print("="*100)
        print("="*100)
        print(f"Evaluating {sample['Sample ID']} {sample['Calculator ID']} {sample['Calculator Name']}")
        log(content=f"Evaluating Sample ID: {sample['Sample ID']} Calculator ID: {sample['Calculator ID']} Calculator Name: {sample['Calculator Name']}")
        patient_note = sample['Patient Note']
        question = sample['Question']
        calculator_id = sample['Calculator ID']
        calculator = calculators_dict[calculator_id]            
        # 评估单条样本
        try:
            if wo == 0:
                result = await evaluate_sample(patient_note, question, calculator, baseline=method_id)
            else:
                print("WO == {wo}")
                result = await evaluate_sample_wo(patient_note, question, calculator, wo=wo)
            log(content=f"Result: {result}")
            log(content="\n" + "="*150 + "\n")
            result_sample = {
                "Sample ID": sample['Sample ID'],
                "Calculator ID": sample['Calculator ID'],
                "Calculator Name": sample['Calculator Name'],
                "Question": sample['Question'],
                "Ground Truth": sample['Ground Truth'],
                "Result": result.get("final_value")
            }
            if method_id == 6:
                result_sample["Extracted Params"] = result.get("params", None)
        except Exception as e:
            log(content=f"Error: {e}")
            result_sample = {
                "Sample ID": sample['Sample ID'],
                "Calculator ID": sample['Calculator ID'],
                "Calculator Name": sample['Calculator Name'],
                "Question": sample['Question'],
                "Ground Truth": sample['Ground Truth'],
                "Result": None,
                "Error": str(e)
            }
            # raise e
        with open(result_path, 'a') as f:
            f.write(json.dumps(result_sample, ensure_ascii=False) + "\n")



def log(path="logs/0608.log", content=None):
    # 如果不存在该文件路径则创建
    import logging
    if not os.path.exists(path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
    logging.basicConfig(filename=path, level=logging.INFO, format='%(asctime)s %(message)s')
    logging.info(content)
    # with open(path, 'a') as f:
    #     f.write(content + '\n')

def load_calculators():
    with open('/root/local/BIYELUNWEN/KAITI/SRGE/datasets/wyx-Cmedcalc/datasets/calculators.json') as f:
        calculators = json.load(f)
    
    calculators_dict = {}
    for c in calculators:
        calculators_dict[c['calculator id']] = c
    return calculators_dict

if __name__ == '__main__':
    dataset_path = "/root/local/BIYELUNWEN/KAITI/SRGE/datasets/wyx-Cmedcalc/datasets/final/500sample.jsonl"
    # 加载数据集
    with open(dataset_path, 'r') as f:
        dataset = [json.loads(line) for line in f]
    
    def main_run():
        # 评估某个方法在ZH-MedCalc上的表现
        method_id = 6
        methd_name_dict = {
            1: "Zero-Shot",
            2: "CodePrompt",
            3: "ICLCoT",
            4: "ICLCoT-FewShot",
            5: "MedRac",
            6: "SRGE"
        }
        method_name = methd_name_dict.get(method_id)
        result_path = os.path.join("/root/local/BIYELUNWEN/KAITI/SRGE/evaluate/results/CH-Medcalc", method_name + ".jsonl")
        print(f"Evaluating {method_name}...")
        print(f"dataset size: {len(dataset)}")
        
        # 对比测试
        asyncio.run(evaluate_all(dataset, result_path, method_id))

    def wo_run():
    # 消融测试
        wo_name_dict = {
            1: "wo_atomic",
            2: "wo_code_exec",
            3: "wo_rule_generate"
        }
        wo_id = 1
        wo_name = wo_name_dict.get(wo_id)
        print(f"Evaluating {wo_name}...")
        result_path_wo = os.path.join("/root/local/BIYELUNWEN/KAITI/SRGE/evaluate/results/CH-Medcalc", wo_name + "_wo.jsonl")
        asyncio.run(evaluate_all(dataset, result_path_wo, method_id=6, wo=wo_id))
    
    main_run()