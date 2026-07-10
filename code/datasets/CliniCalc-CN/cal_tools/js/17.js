window.__currentCalculatorConfig = {
    resultLabel: '🔬 ANCA肾脏风险评分 (ARRS)',
    resultUnit: '分（0-11分）',
    defaultWarning: 'ⓘ 直接输入肾活检数值及诊断时eGFR，系统将自动转换为分级评分，预测AAGN患者进展至ESRD的风险。',
    footnote: '📖 ARRS = N(正常肾小球) + T(间质纤维化) + G(eGFR) &nbsp; 0:低危 2-7:中危 8-11:高危',
    batchWarning: '⚠️ 评分基于病理活检结果及eGFR数值，需结合临床综合判断。',

    // 输入项：改为数字输入，具体数值将自动转换为分级评分
    fields: [
        { 
            name: 'n_score', 
            label: '正常肾小球比例 (%)', 
            type: 'number', 
            min: 0, 
            max: 100, 
            step: 1, 
            default: 50,          // 默认 >25% → N0 (0分)
            placeholder: '输入0-100的百分比'
        },
        { 
            name: 't_score', 
            label: '肾小管萎缩及间质纤维化 (%)', 
            type: 'number', 
            min: 0, 
            max: 100, 
            step: 1, 
            default: 10,          // 默认 ≤25% → T0 (0分)
            placeholder: '输入0-100的百分比'
        },
        { 
            name: 'g_score', 
            label: '诊断时eGFR (mL/min/1.73m²)', 
            type: 'number', 
            min: 0, 
            max: 200, 
            step: 0.1, 
            default: 30,          // 默认 >15 → G0 (0分)
            placeholder: '输入eGFR数值'
        }
    ],

    // 计算总分：根据数字输入自动进行分级映射
    calculateFn: (params) => {
        // 获取数值，无效时使用安全默认值（保证评分不会因空值中断）
        let nPercent = parseFloat(params.n_score);
        if (isNaN(nPercent)) nPercent = 50;   // 默认>25%区间

        let tPercent = parseFloat(params.t_score);
        if (isNaN(tPercent)) tPercent = 10;   // 默认≤25%区间

        let egfr = parseFloat(params.g_score);
        if (isNaN(egfr)) egfr = 30;           // 默认>15区间

        // 正常肾小球比例评分 (N)
        let nScore;
        if (nPercent > 25) nScore = 0;
        else if (nPercent >= 10 && nPercent <= 25) nScore = 4;
        else nScore = 6;  // <10%

        // 间质纤维化评分 (T)
        let tScore = tPercent > 25 ? 2 : 0;

        // eGFR评分 (G)
        let gScore = egfr <= 15 ? 3 : 0;

        return nScore + tScore + gScore;
    },

    // 定制提示：基于总分显示风险分层（评分规则不变）
    customWarning: (params) => {
        // 复用计算总分逻辑，确保提示与最终得分同步
        let nPercent = parseFloat(params.n_score);
        if (isNaN(nPercent)) nPercent = 50;
        let tPercent = parseFloat(params.t_score);
        if (isNaN(tPercent)) tPercent = 10;
        let egfr = parseFloat(params.g_score);
        if (isNaN(egfr)) egfr = 30;

        let nScore = nPercent > 25 ? 0 : (nPercent >= 10 && nPercent <= 25 ? 4 : 6);
        let tScore = tPercent > 25 ? 2 : 0;
        let gScore = egfr <= 15 ? 3 : 0;
        let total = nScore + tScore + gScore;

        if (total === 0) return 'ⓘ 0分:低危(3年ESRD~0%)';
        if (total >= 2 && total <= 7) return 'ⓘ 2-7分:中危(~27%)';
        if (total >= 8 && total <= 11) return 'ⓘ 8-11分:高危(~78%)';
        return 'ⓘ 风险分层基于总分';
    },

    // 批量计算表格列配置：改为数字输入，便于批量处理
    batchColumns: [
        { 
            title: '正常肾小球 (%)', 
            field: 'n_score', 
            type: 'number', 
            min: 0, 
            max: 100, 
            step: 1, 
            default: 50,
            placeholder: '百分比'
        },
        { 
            title: '间质纤维化 (%)', 
            field: 't_score', 
            type: 'number', 
            min: 0, 
            max: 100, 
            step: 1, 
            default: 10,
            placeholder: '百分比'
        },
        { 
            title: 'eGFR (mL/min/1.73m²)', 
            field: 'g_score', 
            type: 'number', 
            min: 0, 
            max: 200, 
            step: 0.1, 
            default: 30,
            placeholder: '数值'
        }
    ],

    // 批量计算行总分：根据数字输入映射分级评分后求和
    batchCalculateFn: (row) => {
        let nPercent = parseFloat(row.n_score);
        if (isNaN(nPercent)) nPercent = 50;
        let tPercent = parseFloat(row.t_score);
        if (isNaN(tPercent)) tPercent = 10;
        let egfr = parseFloat(row.g_score);
        if (isNaN(egfr)) egfr = 30;

        let nScore = nPercent > 25 ? 0 : (nPercent >= 10 && nPercent <= 25 ? 4 : 6);
        let tScore = tPercent > 25 ? 2 : 0;
        let gScore = egfr <= 15 ? 3 : 0;

        return nScore + tScore + gScore;
    }
};