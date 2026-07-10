window.__currentCalculatorConfig = {
    resultLabel: '🧪 内生肌酐清除率 (CCr)',
    resultUnit: 'mL/min',
    defaultWarning: 'ⓘ 需准确收集24小时全部尿液，避免剧烈运动，禁食肉类。',
    footnote: '📖 CCr = (尿肌酐 × 24h尿量) / (血肌酐 × 1440) &nbsp; 单位需一致',
    batchWarning: '⚠️ 结果需结合年龄、性别、体重综合分析。',
    resultColumnTitle: 'CCr(mL/min)',

    fields: [
        { name: 'urine_cr', label: '尿肌酐浓度 (μmol/L)', type: 'number', default: 4420, step: 10, placeholder: 'μmol/L' },
        { name: 'serum_cr', label: '血肌酐浓度 (μmol/L)', type: 'number', default: 88.4, step: 0.1, placeholder: 'μmol/L' },
        { name: 'urine_volume', label: '24小时总尿量 (mL)', type: 'number', default: 1800, step: 50, placeholder: 'mL' }
    ],

    calculateFn: (params) => {
        const { urine_cr, serum_cr, urine_volume } = params;
        if (urine_cr <= 0 || serum_cr <= 0 || urine_volume <= 0) return null;
        return (urine_cr * urine_volume) / (serum_cr * 1440);
    },

    customWarning: (params) => {
        return 'ⓘ 肾功能严重受损时肾小管分泌肌酐可致结果假性偏高。药物、剧烈运动可影响结果。';
    },

    batchColumns: [
        { title: '尿肌酐(μmol/L)', field: 'urine_cr', type: 'number', default: 4420, step: 10 },
        { title: '血肌酐(μmol/L)', field: 'serum_cr', type: 'number', default: 88.4, step: 0.1 },
        { title: '24h尿量(mL)', field: 'urine_volume', type: 'number', default: 1800, step: 50 }
    ],

    batchCalculateFn: (row) => {
        const { urine_cr, serum_cr, urine_volume } = row;
        if (urine_cr <= 0 || serum_cr <= 0 || urine_volume <= 0) return null;
        return (urine_cr * urine_volume) / (serum_cr * 1440);
    }
};
