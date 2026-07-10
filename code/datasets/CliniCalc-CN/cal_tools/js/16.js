window.__currentCalculatorConfig = {
    resultLabel: '💧 每日维持液体需求量',
    resultUnit: 'mL/天',
    defaultWarning: 'ⓘ 适用于3.5kg以上、肾功能正常的儿童。上限通常不超过2400 mL。',
    footnote: '📖 ≤10kg: 体重×100 &nbsp; 11-20kg: 1000+(体重-10)×50 &nbsp; >20kg: 1500+(体重-20)×20（上限2400）',
    batchWarning: '⚠️ 计算结果为理论需求量，需根据临床状态动态调整。',
    resultColumnTitle: '液体量(mL/天)',

    fields: [
        { name: 'weight', label: '体重 (kg)', type: 'number', default: 15, step: 0.1, placeholder: 'kg' }
    ],

    calculateFn: (params) => {
        const { weight } = params;
        if (weight <= 0) return null;
        let result;
        if (weight <= 10) result = weight * 100;
        else if (weight <= 20) result = 1000 + (weight - 10) * 50;
        else result = 1500 + (weight - 20) * 20;
        return Math.min(result, 2400);
    },

    customWarning: (params) => {
        const { weight } = params;
        if (weight < 3.5) return '⚠️ 体重<3.5kg，该公式可能不适用于新生儿。';
        return 'ⓘ 适用于3.5kg以上、肾功能正常的儿童。';
    },

    batchColumns: [
        { title: '体重(kg)', field: 'weight', type: 'number', default: 15, step: 0.1 }
    ],

    batchCalculateFn: (row) => {
        const { weight } = row;
        if (weight <= 0) return null;
        let result;
        if (weight <= 10) result = weight * 100;
        else if (weight <= 20) result = 1000 + (weight - 10) * 50;
        else result = 1500 + (weight - 20) * 20;
        return Math.min(result, 2400);
    }
};
