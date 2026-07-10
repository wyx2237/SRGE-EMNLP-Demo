# ICL CoT
"""
提供指标计算问题的完整的定义并计算
"""
import sys
import re
sys.path.append('/root/local/BIYELUNWEN/KAITI/SRGE')

from method.core.models import chat_method_qwen3_8b

# ICL CoT （完整定义 + 思维链）
ICL_CoT_Prompt = """ 
### 任务说明
你是一位临床医学指标计算专家，请你根据我提供的【病人信息】和【医学指标计算问题】，从病人信息中采集相关参数并完成计算
- 你需要根据我提供的计算问题中的完整定义 formula，一步步思考，列出你的思考过程，并最终输出答案

### 输出格式
包含两部分，每一部分必须用对应的 XML 标签对封装
对于最终计算结果需要注意：
- 只输出最后的计算结果数值，不带单位
- 对于浮点数类型的结果，保留到小数点后4位
- 例如：计算BMI，可输出输出 "24.1000" "18.6975" 等数值；计算评分，可输出 "0" "12" "3.5" 等数值
<THINKING>你的思考过程（1.从病人信息中获取到参数... 2.计算**，得到... 3.. 4.最终计算结果为...）</THINKING>
<ANSWER>最终计算结果</ANSWER>

### 输入内容
#【病人信息】
{patient_note}

#【医学指标计算问题】
{question}
"""

async def run(patient_note, question, calculator:dict):
    formula = calculator.get("formula", "")
    question = question + "\n当前医学指标的完整定义如下：\n" + formula
    print("="*100)
    # print(f"【question】: \n{question}")
    prompt = ICL_CoT_Prompt.format(patient_note=patient_note, question=question)
    print(f"【ICL CoT prompt】: \n{prompt}")
    answer = await chat_method_qwen3_8b(prompt)
    print(f"【ICL CoT answer】: \n{answer}")
    # 后处理
    result = regex_answer(answer)
    print(f"【ICL CoT result】: \n{result}")
    return result

def regex_answer(text: str):
    matches = re.findall(r"<ANSWER>(.*?)</ANSWER>", text, re.DOTALL)
    if matches:
        match = matches[0].strip()
        return match
    else:
        return ""