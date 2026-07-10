# ICL CoT Few Shot
"""
提供一个解答的完整示例 （每一个问题给的是不一样的
"""
import sys
import re
sys.path.append('/root/local/BIYELUNWEN/KAITI/SRGE')

from method.core.models import chat_method_qwen3_8b

ICL_CoT_FS_Prompt = """
### 任务说明
你是一位临床医学指标计算专家，请你根据我提供的【病人信息】和【医学指标计算问题】，从病人信息中采集相关参数并完成计算
- 你需要根据我提供的计算问题中的完整定义 formula，一步步思考，列出你的思考过程，并最终输出答案
- 我将提供一个当前【医学指标计算问题】的完整推理和计算的【计算示例】，请你参考该示例进行思考和推理

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

#【计算示例】
{example}
"""

async def run(patient_note, question, calculator:dict):
    formula = calculator.get("formula", "")
    example = calculator.get("example", "")
    print("="*100)

    question = question + "\n当前医学指标的完整定义如下：\n" + formula
    # print(f"【question】: \n{question}")

    prompt = ICL_CoT_FS_Prompt.format(patient_note=patient_note, question=question, example=example)
    print(f"【ICL CoT few shot prompt】: \n{prompt}")

    answer = await chat_method_qwen3_8b(prompt)
    print(f"【ICL CoT few shot answer】: \n{answer}")

    # 后处理
    result = regex_answer(answer)
    print(f"【ICL CoT few shot result】: \n{result}")

    return result

def regex_answer(text: str):
    matches = re.findall(r"<ANSWER>(.*?)</ANSWER>", text, re.DOTALL)
    if matches:
        match = matches[0].strip()
        return match
    else:
        return ""
    
