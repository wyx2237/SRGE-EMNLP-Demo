# 消融原子工具模板
from method.srge import *

async def wo_atomic(patient_info, question, calculator):
    """
    消融原子工具模板
    """
    workflow = await rule_generate(patient_info, question, calculator, wo=True)
    input_params = await extract_parameters(workflow=workflow, patient_info=patient_info, question=question)  # 提取参数
    cal_result = execute_code(code=workflow.get("code"), input_params=input_params)
    print(f"【计算结果 cal_result】：\n{cal_result}")
    final_value = cal_result.get("final_value")
    return input_params, final_value
