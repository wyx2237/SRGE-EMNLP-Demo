window.__currentCalculatorConfig = {
    resultLabel: '🧪 所需10%氯化钾溶液（理论值）',
    resultUnit: 'mL',
    defaultWarning: 'ⓘ 首次补充计算量的1/2。需见尿补钾，浓度≤0.3%，速度≤20 mmol/h。',
    footnote: '📖 补钾量(mL) = (期望K - 实测K) × 体重 × 0.3 ÷ 1.34 &nbsp; 首次补充1/2',
    batchWarning: '⚠️ 理论补钾量，临床需根据血钾监测动态调整。',
    resultColumnTitle: '10%KCl(mL)',

    fields: [
        { name: 'target_k', label: '期望血钾值 (mmol/L)', type: 'number', default: 4.0, step: 0.1, placeholder: '通常设为4.0' },
        { name: 'current_k', label: '实测血钾值 (mmol/L)', type: 'number', default: 3.0, step: 0.1, placeholder: 'mmol/L' },
        { name: 'weight', label: '体重 (kg)', type: 'number', default: 60, step: 0.5, placeholder: 'kg' }
    ],

    calculateFn: (params) => {
        const { target_k, current_k, weight } = params;
        if (target_k <= 0 || current_k <= 0 || weight <= 0) return null;
        if (target_k <= current_k) return 0;
        return (target_k - current_k) * weight * 0.3 / 1.34;
    },

    customWarning: (params) => {
        return 'ⓘ 适用于成人低钾血症，不适用于儿童、肾功能不全或少尿期患者。';
    },

    batchColumns: [
        { title: '期望K(mmol/L)', field: 'target_k', type: 'number', default: 4.0, step: 0.1 },
        { title: '实测K(mmol/L)', field: 'current_k', type: 'number', default: 3.0, step: 0.1 },
        { title: '体重(kg)', field: 'weight', type: 'number', default: 60, step: 0.5 }
    ],

    batchCalculateFn: (row) => {
        const { target_k, current_k, weight } = row;
        if (target_k <= 0 || current_k <= 0 || weight <= 0) return null;
        if (target_k <= current_k) return 0;
        return (target_k - current_k) * weight * 0.3 / 1.34;
    }
};
