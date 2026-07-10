# 消融代码执行
from method.srge import *
from method.tools.regex_tools import regex_general

PROMPT = """
### 任务说明
你是一位医学计算领域的专家，请你根据【计算问题】和【规则定义】，从【病人信息】中获取参数并完成计算，返回最终结果。
- 你需要根据我提供的对于计算问题的【规则定义】，一步步思考，列出你的思考过程，并最终输出答案

### 输出格式
包含两部分，每一部分必须用对应的 XML 标签对封装
对于最终计算结果需要注意：
- 只输出最后的计算结果数值，不带单位
- 对于浮点数类型的结果，保留到小数点后4位
- 例如：计算BMI，可输出输出 "24.1000" "18.6975" 等数值；计算评分，可输出 "0" "12" "3.5" 等数值
<THINKING>你的思考过程（1.从病人信息中获取到参数... 2.计算**，得到... 3.. 4.最终计算结果为...）</THINKING>
<ANSWER>最终计算结果</ANSWER>

### 输入
- 【计算问题】：
{}

- 【规则定义】：
{}

- 【病人信息】：
{}
"""
async def wo_code_exec(patient_info, question, calculator):
    """
    消融代码执行测试
    """
    workflow = await rule_generate(patient_info, question, calculator)
    prompt = PROMPT.format(question, str(workflow), patient_info)  # 构建prompt
    answer = await chat_method_qwen3_8b(prompt)
    print(f"【计算结果 answer】：\n{answer}")  # 打印结果
    result = regex_general(keyword="ANSWER", text=answer)  # 解析JSON
    print(f"【计算结果 result】：\n{result}")  # 打印结果
    return result