window.__currentCalculatorConfig = {
    resultLabel: '🩸 WHO糖尿病诊断 (2024)',
    resultUnit: '(1=有糖尿病, 0=无)',
    defaultWarning: 'ⓘ 适用于非妊娠成人。无典型症状时需同一样本两个指标或不同日两次检测确认。',
    footnote: '📖 诊断标准：症状+随机血糖≥11.1，或空腹血糖≥7.0，或OGTT 2h≥11.1，或HbA1c≥6.5%',
    batchWarning: '⚠️ 诊断结果(1/0)仅供参考，不能替代临床综合判断。',
    resultColumnTitle: '诊断(1/0)',

    fields: [
        { name: 'symptoms', label: '典型糖尿病症状（三多一少）', type: 'radio', options: [
            { value: 'no', label: '无', checked: true },
            { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'random_glucose', label: '任意时间血浆葡萄糖 (mmol/L)', type: 'number', default: 6.0, step: 0.1, placeholder: 'mmol/L' },
        { name: 'fasting_glucose', label: '空腹血浆葡萄糖 (mmol/L)', type: 'number', default: 5.5, step: 0.1, placeholder: '需空腹≥8h' },
        { name: 'ogtt_2h', label: 'OGTT 2h血浆葡萄糖 (mmol/L)', type: 'number', default: 7.0, step: 0.1, placeholder: 'mmol/L' },
        { name: 'hba1c', label: '糖化血红蛋白 HbA1c (%)', type: 'number', default: 5.5, step: 0.1, placeholder: '%' }
    ],

    calculateFn: (params) => {
        const { symptoms, random_glucose, fasting_glucose, ogtt_2h, hba1c } = params;
        if (symptoms === 'yes' && random_glucose >= 11.1) return 1;
        if (fasting_glucose >= 7.0) return 1;
        if (ogtt_2h >= 11.1) return 1;
        if (hba1c >= 6.5) return 1;
        return 0;
    },

    customWarning: (params) => {
        return 'ⓘ 适用于非妊娠成人。无典型症状时需复查确认，避免基于单次检测诊断。';
    },

    batchColumns: [
        { title: '症状', field: 'symptoms', type: 'select', options: [
            { value: 'no', label: '无' }, { value: 'yes', label: '有' }
        ], default: 'no' },
        { title: '随机血糖(mmol/L)', field: 'random_glucose', type: 'number', default: 6.0, step: 0.1 },
        { title: '空腹血糖(mmol/L)', field: 'fasting_glucose', type: 'number', default: 5.5, step: 0.1 },
        { title: 'OGTT 2h(mmol/L)', field: 'ogtt_2h', type: 'number', default: 7.0, step: 0.1 },
        { title: 'HbA1c(%)', field: 'hba1c', type: 'number', default: 5.5, step: 0.1 }
    ],

    batchCalculateFn: (row) => {
        const { symptoms, random_glucose, fasting_glucose, ogtt_2h, hba1c } = row;
        if (symptoms === 'yes' && random_glucose >= 11.1) return 1;
        if (fasting_glucose >= 7.0) return 1;
        if (ogtt_2h >= 11.1) return 1;
        if (hba1c >= 6.5) return 1;
        return 0;
    }
};
