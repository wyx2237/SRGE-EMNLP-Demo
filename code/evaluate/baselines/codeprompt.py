# Code Prompt
"""
生成代码并执行
"""
import re
import sys
sys.path.append('/root/local/BIYELUNWEN/KAITI/SRGE')

from method.core.models import chat_method_qwen3_8b
from method.tools.regex_tools import regex_python, regex_json
# Code Prompt （医学计算问题不包含完整定义）
Code_Prompt = """
### 任务说明
你是一位临床医学指标计算专家，请你根据我提供的【病人信息】和【医学指标计算问题】，从病人信息中采集相关参数并完成计算
- 你需要根据【医学指标计算问题】的定义，生成完整的 可执行的 Python 代码进行计算。

### 【代码生成要求】
1. 生成的代码中，需要包含所有计算变量，并已经根据病人信息进行了赋值
2. 将最终计算结果赋值给result变量

### 输出格式
<python></python> 标签对封装的Python代码(禁止使用```python ```标记)

示例：
<python>
weight_kg = 70
height_cm = 170
bmi = weight_kg / (height_cm / 100) ** 2
result = bmi
</python>


### 输入内容
#【病人信息】
{patient_note}

#【医学指标计算问题】
{question}
"""

EXTRACT_PROMPT = """
### 任务说明
你是一个参数抽取工具，请你根据我提供的【病人信息】和【计算参数定义】，从病人信息中采集所有必要参数，并按指定格式返回

### 输入内容
#【病人信息】
{patient_note}

#【计算参数定义】
{params}

### 输出格式
输出以 <json></json> 标签对封装的json对象(禁止使用```json ```标记)
{{
    "参数名1":"参数值1"
    "参数名2":"参数值2"
    ...
}}

示例：
<json>
{{
    "height_cm":"170",
    "weight_kg":"70",
}}
</json>

### 注意事项
1. 参数名与提供的【计算参数定义】保持一致，大小写敏感
2. 参数值不带任何单位，参数值类型严格参照【计算参数定义】中的要求
"""
async def run(patient_note, question, calculator):
    prompt = Code_Prompt.format(patient_note=patient_note, question=question)
    code_answer = await chat_method_qwen3_8b(prompt)
    code_str = regex_python(code_answer)
    print(f"【code_answer】:\n{code_answer}")
    print(f"【code_str】:\n{code_str}")
    result = code_exec(code_str)
    print(f"【code prompt result】:\n{result}")
    return result

async def extract(patient, params:dict):
    """
    根据计算参数定义params，从病例原文中提取信息
    """
    pass

def code_exec(code_str):
    """
    执行 Python 代码字符串，返回代码中 result 变量的值。

    Args:
        code_str (str): 要执行的 Python 代码字符串。

    Returns:
        Any: 代码执行后 result 变量的值，若不存在则返回 None。
    """
    namespace = {}
    exec(code_str, namespace)
    result = namespace.get('result') if 'result' in namespace else None
    if result:
        result = str(result)  # 将结果转换为字符串
    return result



