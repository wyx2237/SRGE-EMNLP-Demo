# 正确率计算脚本
# 从结果 JSONL 文件中读取每一行样本，将 Ground Truth 与 Result 对比，
# 根据 Calculator 的 Category 和 Output Type 分别统计正确率和整体正确率。
# 适配结果文件中 Ground Truth 为字符串、Result 为多种类型（float/int/str/list/None）的特点。

import json
import os
import ast

# === 配置 ===
# 结果文件列表（可在此添加或删减）
RESULT_FILE_PATHS = [
    "/root/local/BIYELUNWEN/KAITI/SRGE/evaluate/results/Medcalc/CodePrompt.jsonl",
    "/root/local/BIYELUNWEN/KAITI/SRGE/evaluate/results/Medcalc/Zero-Shot.jsonl",
    "/root/local/BIYELUNWEN/KAITI/SRGE/evaluate/results/Medcalc/ICLCoT.jsonl",
    "/root/local/BIYELUNWEN/KAITI/SRGE/evaluate/results/Medcalc/ICLCoT-FewShot.jsonl",
    "/root/local/BIYELUNWEN/KAITI/SRGE/evaluate/results/Medcalc/MedRac.jsonl",
    "/root/local/BIYELUNWEN/KAITI/SRGE/evaluate/results/Medcalc/SRGE-final.jsonl",
]
# Calculator 元数据文件路径（英文版，包含全部 55 个 Calculator 的 category 和 output type）
CALCULATORS_META_PATH = "/root/local/BIYELUNWEN/KAITI/SRGE/datasets/medcalc-bench/task_set_with_formula.json"

# 浮点数比较容差
ABSOLUTE_TOLERANCE = 1e-3
# decimal 类型指标的相对容差（上下浮动标答的 0.1%）
RELATIVE_TOLERANCE = 0.001


EQUATION_BASED_CATEGORIES = {"lab", "physical", "dosage", "date"}


def map_to_group(category: str) -> str:
    """将原始 category 映射为 Equation-based 或 Rule-based。"""
    return "Equation-based" if category in EQUATION_BASED_CATEGORIES else "Rule-based"


def load_calculator_metadata(meta_path: str) -> dict[int, tuple[str, str]]:
    """
    加载 Calculator 元数据，返回 {calculator_id: (category, output_type)} 映射。
    category: lab / risk / physical / severity / diagnosis / date / dosage
    output_type: decimal / integer / date
    """
    with open(meta_path, "r", encoding="utf-8") as f:
        calculators = json.load(f)

    mapping = {}
    for calc in calculators:
        cid = calc["calculator id"]
        category = calc.get("category", "unknown")
        output_type = calc.get("output type", "decimal")
        mapping[cid] = (category, output_type)
    return mapping


def is_correct(ground_truth, result, output_type: str) -> bool:
    """
    判断预测结果与标准答案是否一致，处理多种数据类型。

    - date output_type：精确字符串匹配
    - Result 为 list（孕周计算）：将 GT 的字符串元组解析后逐元素比对
    - integer output_type：整数结果，采用绝对容差
    - decimal output_type：浮点结果，采用相对容差（标答的 ±0.1%）
    - None / 无法转换：视为错误
    """
    if result is None:
        return False

    # date 类型：精确字符串匹配
    if output_type == "date":
        return isinstance(result, str) and isinstance(ground_truth, str) and ground_truth == result

    # list 类型结果（如孕周 ["0 weeks", "6 days"]）
    if isinstance(result, list):
        if isinstance(ground_truth, str):
            # GT 是字符串形式的元组 "('0 weeks', '6 days')"
            try:
                parsed_gt = list(ast.literal_eval(ground_truth))
                return parsed_gt == result
            except (ValueError, SyntaxError, MemoryError):
                return False
        return str(result) == str(ground_truth)

    # 数值型比较
    try:
        gt_val = float(ground_truth)
        pred_val = float(result)
    except (ValueError, TypeError):
        return False

    if output_type == "integer":
        return abs(pred_val - gt_val) < ABSOLUTE_TOLERANCE
    else:
        # decimal 类型采用相对容差
        if gt_val == 0:
            return abs(pred_val) < ABSOLUTE_TOLERANCE
        return abs(pred_val - gt_val) / abs(gt_val) < RELATIVE_TOLERANCE


def evaluate_file(file_path: str, meta_mapping: dict):
    """处理单个结果文件，打印统计结果并保存为 Markdown。"""
    method_name = os.path.splitext(os.path.basename(file_path))[0]

    # 统计结构
    category_details = {}  # 原始 category 明细
    group_stats = {}       # Equation-based / Rule-based 聚合
    # 按 output_type 聚合
    output_type_stats = {}
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
            calc_id = int(sample.get("Calculator ID"))
            ground_truth = sample.get("Ground Truth")
            result = sample.get("Result")

            # 获取 Calculator 的 Category 和 Output Type
            category, output_type = meta_mapping.get(calc_id, ("unknown", "decimal"))
            group = map_to_group(category)

            category_details.setdefault(category, {"total": 0, "correct": 0})
            group_stats.setdefault(group, {"total": 0, "correct": 0})
            output_type_stats.setdefault(output_type, {"total": 0, "correct": 0})

            ok = is_correct(ground_truth, result, output_type)

            category_details[category]["total"] += 1
            if ok:
                category_details[category]["correct"] += 1

            group_stats[group]["total"] += 1
            if ok:
                group_stats[group]["correct"] += 1

            output_type_stats[output_type]["total"] += 1
            if ok:
                output_type_stats[output_type]["correct"] += 1

            total += 1
            if ok:
                correct += 1

    overall_acc = correct / total * 100 if total > 0 else 0.0

    lines = []
    title = f"# 方法：{method_name}"
    lines.append(title)
    lines.append("")
    lines.append(
        f"> decimal 类型（lab / physical / dosage）采用 **±{RELATIVE_TOLERANCE*100:.1f}% 相对容差**；"
        f"integer 类型（risk / severity / diagnosis）采用 **绝对容差 {ABSOLUTE_TOLERANCE}**；"
        f"date 类型采用 **精确字符串匹配**。"
    )
    lines.append("")

    # 按原始 Category 明细统计
    lines.append("## 按 Category 明细")
    lines.append("")
    lines.append(f"| {'Category':<15} | {'总数':>6} | {'正确':>6} | {'正确率':>8} |")
    lines.append(f"|{'-'*17}|{'-'*8}|{'-'*8}|{'-'*10}|")
    for cat in sorted(category_details.keys()):
        stats = category_details[cat]
        acc = stats["correct"] / stats["total"] * 100 if stats["total"] > 0 else 0.0
        lines.append(f"| {cat:<15} | {stats['total']:>6} | {stats['correct']:>6} | {acc:>7.2f}% |")
    lines.append("")

    # 按 Equation-based / Rule-based 聚合统计
    lines.append("## 聚合统计（Equation-based / Rule-based）")
    lines.append("")
    lines.append(f"| {'类型':<18} | {'总数':>6} | {'正确':>6} | {'正确率':>8} |")
    lines.append(f"|{'-'*20}|{'-'*8}|{'-'*8}|{'-'*10}|")
    for cat in sorted(group_stats.keys()):
        stats = group_stats[cat]
        acc = stats["correct"] / stats["total"] * 100 if stats["total"] > 0 else 0.0
        lines.append(f"| {cat:<18} | {stats['total']:>6} | {stats['correct']:>6} | {acc:>7.2f}% |")
    lines.append("")

    # 按 Output Type 聚合
    lines.append("## 按输出类型聚合")
    lines.append("")
    lines.append(f"| {'输出类型':<12} | {'总数':>6} | {'正确':>6} | {'正确率':>8} |")
    lines.append(f"|{'-'*14}|{'-'*8}|{'-'*8}|{'-'*10}|")
    for ot in sorted(output_type_stats.keys()):
        stats = output_type_stats[ot]
        acc = stats["correct"] / stats["total"] * 100 if stats["total"] > 0 else 0.0
        lines.append(f"| {ot:<12} | {stats['total']:>6} | {stats['correct']:>6} | {acc:>7.2f}% |")

    # 总体
    lines.append("")
    lines.append(f"| {'**总体**':<12} | {total:>6} | {correct:>6} | {overall_acc:>7.2f}% |")

    output = "\n".join(lines)
    print(output)

    result_dir = os.path.dirname(file_path)
    md_path = os.path.join(result_dir, f"{method_name}.md")
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(output + "\n")
    print(f"统计结果已保存至：{md_path}")


def main():
    meta_mapping = load_calculator_metadata(CALCULATORS_META_PATH)
    print(f"已加载 {len(meta_mapping)} 个 Calculator 的元数据（category + output type）\n")

    for file_path in RESULT_FILE_PATHS:
        evaluate_file(file_path, meta_mapping)
        print("\n" + "=" * 60 + "\n")


if __name__ == "__main__":
    main()
