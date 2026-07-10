# Zero-Shot方法
"""
直接回答
"""

import sys
sys.path.append('/root/local/BIYELUNWEN/KAITI/SRGE')

from method.core.models import chat_method_qwen3_8b

Zero_Shot_Prompt = """
### 任务说明
你是一位临床医学指标计算专家，请你根据我提供的【病人信息】和【医学指标计算问题】，从病人信息中采集相关参数并完成计算

### 输出格式
- 只输出最终结果，不带中间过程
- 只输出最后的计算结果数值，不带单位
- 对于浮点数类型的结果，保留到小数点后4位
- 例如：计算BMI，可输出输出 "24.1000" "18.6975" 等数值；计算评分，可输出 "0" "12" "3.5" 等数值

### 输出示例
18.6975
24.1000
0
3.5

### 输入内容
#【病人信息】
{patient_note}

#【医学指标计算问题】
{question}
"""

async def run(patient_note, question, calculator):
    prompt = Zero_Shot_Prompt.format(patient_note=patient_note, question=question)
    print("="*100)
    print(f"【zero-shot prompt】: \n{prompt}")
    result = await chat_method_qwen3_8b(prompt)
    print(f"【zero-shot result】: \n{result}")
    return result
