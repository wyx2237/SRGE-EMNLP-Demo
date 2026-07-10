from autogen_agentchat.base import TaskResult
from core.agents import get_QuestionDecomposer, get_CodeGenerator
import asyncio

from core.models import deepseek_v4_pro_client, chat_method

qd = get_QuestionDecomposer()
cg = get_CodeGenerator()

question = r"""
{
  "calculator name": "儿童体表面积 (Haycock公式)",
  "question": "用Haycock公式计算儿童体表面积的结果是多少？",
  "description": "基于三维测量数据推导的幂函数公式，拟合度良好，尤其适用于新生儿和婴儿。多项研究推荐其为儿童（特别是低龄儿童）BSA估算的首选公式。",
  "formula": "BSA (m²) = 0.024265 × 体重(kg)^0.5378 × 身高(cm)^0.3964\n\n计算步骤：\n1. 将体重（公斤）的0.5378次方与身高（厘米）的0.3964次方相乘\n2. 将乘积乘以系数0.024265\n3. 得到体表面积（平方米）",
}
"""
# print(result)

def debug_info_tool(result:TaskResult):
    print(f"content: \n{result.messages[-1].to_model_text()}\n")

    # 时间延迟计算
    print(f"answer created_at: \n{result.messages[-1].created_at}\n")
    print(f"delay: \n{result.messages[-1].created_at - result.messages[0].created_at}\n")
    ## token消耗计算
    print(f"models_usage: \n{result.messages[-1].models_usage}\n")

def get_result_content(result:TaskResult) -> str:
    debug_info_tool(result)
    return result.messages[-1].to_model_text()
# result = asyncio.run(chat_method("BMI是怎么算的？"))
# print(result)

def generate():
    result = asyncio.run(qd.run(task=question))
    result_content = get_result_content(result)

    # 暂时保存结果到文件
    with open("result.txt", "w") as f:
        f.write(result_content)

    print("-"*50)
    code_result = asyncio.run(cg.run(task=f"步骤序列：\n{result_content}"))
    code_content = get_result_content(code_result)
    code = regex_python(code_content)

    # 暂时保存代码到文件
    with open("code.txt", "w") as f:
        f.write(code)

def regex_python(content):
    import re
    pattern = r"<python>(.*?)</python>"
    match = re.search(pattern, content, re.DOTALL)
    if match:
        return match.group(1)
    else:
        return ""



import math

# 创建代码沙盒执行生成的代码
def execute_code(code: str, input_data: dict) -> dict:
    # 编译代码
    print(f"type(code): {type(code)}")
    print(f"code: \n{code}")
    
    # 1. 编译代码（修复：参数正确）
    compiled_code = compile(source=code, filename="", mode="exec")
    
    # 2. 用独立命名空间执行代码，防止污染
    local_namespace = {}
    exec(compiled_code, {"__builtins__": __builtins__, "math": math}, local_namespace)
    
    # 3. 获取代码中的 solve 函数
    solve = local_namespace["solve"]
    
    # 4. 获取函数签名中的参数名称
    import inspect
    # 获取参数名列表
    sig = inspect.signature(solve)
    params = list(sig.parameters.keys())
    print("函数参数列表:", params)
    
    # 5. 执行生成器函数，分步获取结果（适配你的 yield）
    gen = solve(**input_data)
    try:
        while True:
            step_output = next(gen)      # 依次获取每个 yield 的字典
            print(step_output)           # 可处理中间步骤
    except StopIteration as e:
        final_value = e.value            # 获取 return 的值
        print("最终结果:", final_value)
        return final_value


def test1():
    with open("code.txt", "r") as f:
        code = f.read()
    execute_code(code, {"weight": 10, "height": 100})

# generate()
test1()
