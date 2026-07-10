window.__currentCalculatorConfig = {
    resultLabel: '🥩 每日蛋白质摄入估算 (Maroni公式)',
    resultUnit: 'g/24h',
    defaultWarning: 'ⓘ 适用于接受稳定治疗的CKD成年患者，评估饮食蛋白质依从性。',
    footnote: '📖 DPI = 6.25 × (UUN + 0.031 × 体重) &nbsp; UUN为24小时尿尿素氮(g/24h)',
    batchWarning: '⚠️ 不适用于AKI、高分解代谢状态或重症患者。',
    resultColumnTitle: 'DPI(g/24h)',

    fields: [
        { name: 'uun', label: '24小时尿尿素氮 (g/24h)', type: 'number', default: 10, step: 0.5, placeholder: 'g/24h' },
        { name: 'weight', label: '体重 (kg)', type: 'number', default: 60, step: 0.5, placeholder: 'kg' }
    ],

    calculateFn: (params) => {
        const { uun, weight } = params;
        if (uun < 0 || weight <= 0) return null;
        return 6.25 * (uun + 0.031 * weight);
    },

    customWarning: (params) => {
        return 'ⓘ 适用于稳定CKD成人。高分解代谢状态（感染、创伤等）结果不准确。';
    },

    batchColumns: [
        { title: 'UUN(g/24h)', field: 'uun', type: 'number', default: 10, step: 0.5 },
        { title: '体重(kg)', field: 'weight', type: 'number', default: 60, step: 0.5 }
    ],

    batchCalculateFn: (row) => {
        const { uun, weight } = row;
        if (uun < 0 || weight <= 0) return null;
        return 6.25 * (uun + 0.031 * weight);
    }
};
