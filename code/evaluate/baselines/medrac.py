# medrac 基于公式检索和代码生成的方法

import re
import sys
sys.path.append('/root/local/BIYELUNWEN/KAITI/SRGE')

from method.core.models import chat_method_qwen3_8b
from method.tools.regex_tools import regex_json, regex_python
COMMON_PACKAGES = [
    'math', 'datetime', 'json', 're', 'os', 'sys',
    'numpy', 'pandas'
]

import json
import datetime
import math
import random
import collections

def formula_retrieve(question, calculator):
    """
    公式检索
    """
    formula = calculator.get('formula', '')
    return formula

CODE_GENERATION_PROMPT = """
### 任务说明
你是一位临床医学指标计算专家，请你根据我提供的【病人信息】和【医学指标计算问题】，从病人信息中采集相关参数并完成计算
- 你需要根据【医学指标计算问题】的定义，生成完整的 可执行的 Python 代码。

### 【代码生成要求】
1. 生成的代码中，需要包含所有计算变量，并已经根据病人信息进行了赋值
2. 按照计算问题的完整定义，编写代码，可分为多个计算步骤，依次计算并得到最终答案
3. 将最终计算结果赋值给result变量
4. 除了注释部分之外，代码中禁止出现任何中文字符

### 输出格式
<python></python> 标签对封装的Python代码(禁止使用```python ```标记)

示例：
<python>
# constants 输入参数常量
age = 65
weight = 70          # kg
gender_coeff = 0.85
Scr = 1.3            # mg/dL

# computation 代入公式进行计算
result = ((140 - age) * weight * gender_coeff) / (72 * Scr)
</python>


### 输入内容
#【输入参数抽取结果】
{params}

#【医学指标计算问题】
{question}

### 注意事项
1. 除了注释部分，代码中禁止出现任何中文字符！！！（尤其是变量名）
"""

async def code_generation(question, calculator, params):
    """
    代码生成
    """
    prompt = CODE_GENERATION_PROMPT.format(question=question, params=params)
    print(f"【code prompt】：\n{prompt}")
    code_answer = await chat_method_qwen3_8b(prompt)
    code_result = regex_python(code_answer)
    print(f"【code result】：\n{code_result}")
    return code_result


def code_run(code: str):
    """
    执行 Python 代码字符串，返回代码中 result 变量的值。

    Args:
        code_str (str): 要执行的 Python 代码字符串。

    Returns:
        Any: 代码执行后 result 变量的值，若不存在则返回 None。
    """
    builtins = {
        're': re,
        'json': json,
        'datetime': datetime,
        'math': math,
        'random': random,
        'collections': collections,
        # 可继续添加其他常用模块，如 itertools, typing 等
    }
    namespace = {}
    local_vars = {}
    exec(code, namespace, local_vars)
    return local_vars.get('result')


EXTRACT_PROMPT = """
### 任务说明
你是一个参数抽取工具，请你根据我提供的【医学计算问题】和【完整公式定义】，从【病人信息中】采集所有必要参数，并按指定格式返回

### 输入内容
#【病人信息】
{patient_note}

#【医学计算问题】
{question}

#【医学计算问题的完整公式定义】
{formula}

### 输出格式
输出以 <json></json> 标签对封装的json对象(禁止使用```json ```标记)
{{
    "参数名1":"参数值1" # 标明该参数的类型、单位（如果有的话）
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
"""
async def params_extract(patient_note, question, formula):
    """
    参数抽取
    基于计算指标的公式规则定义，去病人信息中抽取对应的参数
    """
    prompt = EXTRACT_PROMPT.format(patient_note=patient_note, question=question, formula=formula)
    extract_answer = await chat_method_qwen3_8b(prompt)
    extract_result = regex_json(extract_answer)
    print(f"【extract result】：\n{extract_result}")
    return extract_result

async def main_medrac(question, patient_note, calculator):
    """
    medrac方法主函数
    """
    # 公式检索
    formula = formula_retrieve(question, calculator)
    # question = question + "\n当前医学指标的完整定义如下：\n" + formula

    # 参数抽取
    params = await params_extract(patient_note, question, formula)

    # 代码生成
    # (将抽取到的参数全部放进代码当中去得出结果)
    question = question + "\n当前医学指标的完整定义如下：\n" + formula
    code = await code_generation(question, calculator, params)

    # 代码执行
    result = code_run(code)
    print(f"【result】：\n{result}")
    return result

async def run(question, patient_note, calculator):
    result = await main_medrac(question, patient_note, calculator)
    return result

def regex_python(text: str):
    matches = re.findall(r"<python>(.*?)</python>", text, re.DOTALL)
    if matches:
        match = matches[0].strip()
        return match
    else:
        return ""