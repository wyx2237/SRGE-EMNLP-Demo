window.__currentCalculatorConfig = {
    resultLabel: '🔄 血脂单位换算结果',
    resultUnit: '',
    defaultWarning: 'ⓘ TC/HDL-C/LDL-C换算系数38.67(或0.02586)，TG换算系数88.57(或0.01129)。',
    footnote: '📖 TC/HDL-C/LDL-C: mmol/L×38.67=mg/dL, mg/dL×0.02586=mmol/L &nbsp; TG: mmol/L×88.57=mg/dL, mg/dL×0.01129=mmol/L',
    batchWarning: '⚠️ 注意区分胆固醇与甘油三酯的换算系数。',
    resultColumnTitle: '换算结果',

    fields: [
        { name: 'lipid_type', label: '血脂指标', type: 'radio', options: [
            { value: 'tc', label: 'TC(总胆固醇)', checked: true },
            { value: 'tg', label: 'TG(甘油三酯)', checked: false },
            { value: 'hdl', label: 'HDL-C(高密度脂蛋白)', checked: false },
            { value: 'ldl', label: 'LDL-C(低密度脂蛋白)', checked: false }
        ] },
        { name: 'value', label: '数值', type: 'number', default: 5.0, step: 0.01, placeholder: '输入数值' },
        { name: 'source_unit', label: '原始单位', type: 'radio', options: [
            { value: 'mmolL', label: 'mmol/L', checked: true },
            { value: 'mgdL', label: 'mg/dL', checked: false }
        ] }
    ],

    calculateFn: (params) => {
        const { lipid_type, value, source_unit } = params;
        if (value <= 0) return null;
        if (lipid_type === 'tg') {
            if (source_unit === 'mmolL') return value * 88.57;
            else return value * 0.01129;
        } else {
            if (source_unit === 'mmolL') return value * 38.67;
            else return value * 0.02586;
        }
    },

    customWarning: (params) => {
        return 'ⓘ 注意区分胆固醇(TC/HDL-C/LDL-C)与甘油三酯(TG)的换算系数差异。';
    },

    batchColumns: [
        { title: '指标', field: 'lipid_type', type: 'select', options: [
            { value: 'tc', label: 'TC' },
            { value: 'tg', label: 'TG' },
            { value: 'hdl', label: 'HDL-C' },
            { value: 'ldl', label: 'LDL-C' }
        ], default: 'tc' },
        { title: '数值', field: 'value', type: 'number', default: 5.0, step: 0.01 },
        { title: '原始单位', field: 'source_unit', type: 'select', options: [
            { value: 'mmolL', label: 'mmol/L' },
            { value: 'mgdL', label: 'mg/dL' }
        ], default: 'mmolL' }
    ],

    batchCalculateFn: (row) => {
        const { lipid_type, value, source_unit } = row;
        if (value <= 0) return null;
        if (lipid_type === 'tg') {
            if (source_unit === 'mmolL') return value * 88.57;
            else return value * 0.01129;
        } else {
            if (source_unit === 'mmolL') return value * 38.67;
            else return value * 0.02586;
        }
    }
};
