# 正确率计算脚本
# 从结果 JSONL 文件中读取每一行样本，将 Ground Truth 与 Result 对比，
# 根据 Calculator 所属的 Category（如 Risk、Physical、Lab 等）分别统计正确率和整体正确率。

import json
import os

# === 配置 ===
# 结果文件列表（可在此添加或删减）
RESULT_FILE_PATHS = [
    "/root/local/BIYELUNWEN/KAITI/SRGE/evaluate/results/CliniCalc-CN/Zero-Shot.jsonl",
    "/root/local/BIYELUNWEN/KAITI/SRGE/evaluate/results/CliniCalc-CN/CodePrompt.jsonl",
    "/root/local/BIYELUNWEN/KAITI/SRGE/evaluate/results/CliniCalc-CN/ICLCoT.jsonl",
    "/root/local/BIYELUNWEN/KAITI/SRGE/evaluate/results/CliniCalc-CN/ICLCoT-FewShot.jsonl",
    "/root/local/BIYELUNWEN/KAITI/SRGE/evaluate/results/CliniCalc-CN/MedRac.jsonl",
    "/root/local/BIYELUNWEN/KAITI/SRGE/evaluate/results/CliniCalc-CN/SRGE-final.jsonl",
    "/root/local/BIYELUNWEN/KAITI/SRGE/evaluate/results/CliniCalc-CN/wo_atomic_wo-final.jsonl",
    "/root/local/BIYELUNWEN/KAITI/SRGE/evaluate/results/CliniCalc-CN/wo_code_exec_wo.jsonl",
    "/root/local/BIYELUNWEN/KAITI/SRGE/evaluate/results/CliniCalc-CN/wo_rule_generate_wo.jsonl"
]
# Calculator 定义文件路径
CALCULATORS_PATH = "/root/local/BIYELUNWEN/KAITI/SRGE/datasets/wyx-Cmedcalc/datasets/calculators.json"

# 浮点数比较容差（绝对容差，用于非 Equation 类型的指标）
ABSOLUTE_TOLERANCE = 1e-3
# Equation 类型指标的相对容差（上下浮动标答的 5%）
RELATIVE_TOLERANCE = 0.001


def load_calculator_categories(calc_path: str) -> dict[int, tuple[str, str]]:
    """
    加载 calculators.json，返回 {calculator_id: (top_level, subtype)} 映射。
    category 字段格式为 ["Equation", "<SubType>"]，
    如 ["Equation", "Risk"]，则 top_level="Equation", subtype="Risk"。
    """
    with open(calc_path, "r", encoding="utf-8") as f:
        calculators = json.load(f)

    mapping = {}
    for calc in calculators:
        cid = calc["calculator id"]
        category_list = calc.get("category", [])
        top_level = category_list[0] if len(category_list) > 0 else "Unknown"
        subtype = category_list[1] if len(category_list) > 1 else "Unknown"
        mapping[cid] = (top_level, subtype)
    return mapping


def is_correct(ground_truth: float, result, use_relative: bool) -> bool:
    """
    判断预测结果与标准答案是否一致。
    若 result 为 None 或无法转换为 float，视为错误。
    use_relative=True 时采用相对容差（标答的 ±5%），适用于 Equation 类型；
    use_relative=False 时采用绝对容差 1e-6。
    """
    if result is None:
        return False
    try:
        pred = float(result)
    except (ValueError, TypeError):
        return False

    if use_relative:
        # 标答为 0 时无法计算相对误差，退化为绝对容差比较
        if ground_truth == 0:
            return abs(pred) < ABSOLUTE_TOLERANCE
        return abs(pred - ground_truth) / abs(ground_truth) < RELATIVE_TOLERANCE
    else:
        return abs(pred - ground_truth) < ABSOLUTE_TOLERANCE


def evaluate_file(file_path: str, cat_mapping: dict):
    """处理单个结果文件，打印统计结果并保存为 Markdown。"""
    # 从文件名提取方法名称（如 "Zero-Shot"）
    method_name = os.path.splitext(os.path.basename(file_path))[0]

    # 读取结果 JSONL 文件并逐行统计
    category_stats = {}
    top_level_stats = {}
    total = 0
    correct = 0

    if not os.path.exists(file_path):
        print(f"错误：结果文件不存在 -> {file_path}")
        return

    with open(file_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue

            sample = json.loads(line)
            calc_id = sample.get("Calculator ID")
            ground_truth = sample.get("Ground Truth")
            result = sample.get("Result")

            # 获取该 Calculator 的顶层类型和子类
            top_level, subtype = cat_mapping.get(calc_id, ("Unknown", "Unknown"))

            # Equation 类型采用相对容差（标答的 ±5%），其他采用绝对容差
            use_relative = (top_level == "Equation")

            # 初始化该子类的统计
            if subtype not in category_stats:
                category_stats[subtype] = {"total": 0, "correct": 0}

            # 初始化该顶层类型的统计
            if top_level not in top_level_stats:
                top_level_stats[top_level] = {"total": 0, "correct": 0}

            # 判断是否正确
            ok = is_correct(ground_truth, result, use_relative)
            # 更新子类统计
            category_stats[subtype]["total"] += 1
            if ok:
                category_stats[subtype]["correct"] += 1
            # 更新顶层类型统计
            top_level_stats[top_level]["total"] += 1
            if ok:
                top_level_stats[top_level]["correct"] += 1
            total += 1
            if ok:
                correct += 1

    # 构建统计结果文本（同时用于终端输出和保存到文件）
    overall_acc = correct / total * 100 if total > 0 else 0.0
    lines = []

    title = f"# 方法：{method_name}"
    lines.append(title)
    lines.append("")
    lines.append(f"> Equation 类型（Physical / Lab / Diagnosis / Dosage / Model）采用 **±0.1% 相对容差**；Logic 类型（Risk / Severity）采用 **绝对容差 {ABSOLUTE_TOLERANCE}**。")
    lines.append("")

    # 按子类统计
    lines.append("## 按子类统计")
    lines.append("")
    lines.append(f"| {'子类':<12} | {'总数':>6} | {'正确':>6} | {'正确率':>8} |")
    lines.append(f"|{'-'*14}|{'-'*8}|{'-'*8}|{'-'*10}|")
    for cat in sorted(category_stats.keys()):
        stats = category_stats[cat]
        acc = stats["correct"] / stats["total"] * 100 if stats["total"] > 0 else 0.0
        lines.append(f"| {cat:<12} | {stats['total']:>6} | {stats['correct']:>6} | {acc:>7.2f}% |")
    lines.append("")

    # 按顶层类型聚合
    lines.append("## 按类型聚合")
    lines.append("")
    lines.append(f"| {'类型':<12} | {'总数':>6} | {'正确':>6} | {'正确率':>8} |")
    lines.append(f"|{'-'*14}|{'-'*8}|{'-'*8}|{'-'*10}|")
    for tl in sorted(top_level_stats.keys()):
        stats = top_level_stats[tl]
        acc = stats["correct"] / stats["total"] * 100 if stats["total"] > 0 else 0.0
        lines.append(f"| {tl:<12} | {stats['total']:>6} | {stats['correct']:>6} | {acc:>7.2f}% |")

    # 总体
    lines.append(f"| {'**总体**':<12} | {total:>6} | {correct:>6} | {overall_acc:>7.2f}% |")

    # 输出到终端
    output = "\n".join(lines)
    print(output)

    # 保存到 Markdown 文件
    result_dir = os.path.dirname(file_path)
    md_path = os.path.join(result_dir, f"{method_name}.md")
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(output + "\n")
    print(f"统计结果已保存至：{md_path}")


def main():
    # 加载 calculator -> (top_level, subtype) 映射（只需加载一次）
    cat_mapping = load_calculator_categories(CALCULATORS_PATH)
    print(f"已加载 {len(cat_mapping)} 个 Calculator 的 Category 映射\n")

    # 遍历所有结果文件
    for file_path in RESULT_FILE_PATHS:
        evaluate_file(file_path, cat_mapping)
        print("\n" + "=" * 60 + "\n")


if __name__ == "__main__":
    main()
