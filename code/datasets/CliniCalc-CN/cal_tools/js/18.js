window.__currentCalculatorConfig = {
    resultLabel: '🧪 血清渗透压估算 (OSMc)',
    resultUnit: 'mOsm/kg',
    defaultWarning: 'ⓘ 常用于鉴别高渗或低渗状态及计算渗透压间隙筛查毒物。',
    footnote: '📖 OSMc = 2×Na + 血糖/18 + BUN/2.8 &nbsp; 血糖mg/dL, BUN mg/dL',
    batchWarning: '⚠️ 不适用于严重高脂血症或高蛋白血症。估算值仅供参考。',
    resultColumnTitle: 'OSMc(mOsm/kg)',

    fields: [
        { name: 'sodium', label: '血钠 (mmol/L)', type: 'number', default: 140, step: 1, placeholder: 'mmol/L' },
        { name: 'glucose', label: '血糖 (mg/dL)', type: 'number', default: 90, step: 1, placeholder: 'mg/dL' },
        { name: 'bun', label: '血尿素氮 (mg/dL)', type: 'number', default: 14, step: 0.5, placeholder: 'mg/dL' }
    ],

    calculateFn: (params) => {
        const { sodium, glucose, bun } = params;
        if (sodium <= 0 || glucose < 0 || bun < 0) return null;
        if (glucose === 0) glucose = 0;
        if (bun === 0) bun = 0;
        return 2 * sodium + glucose / 18 + bun / 2.8;
    },

    customWarning: (params) => {
        return 'ⓘ 血糖单位若为mmol/L需先乘以18转换为mg/dL。BUN≠尿素。';
    },

    batchColumns: [
        { title: '血钠(mmol/L)', field: 'sodium', type: 'number', default: 140, step: 1 },
        { title: '血糖(mg/dL)', field: 'glucose', type: 'number', default: 90, step: 1 },
        { title: 'BUN(mg/dL)', field: 'bun', type: 'number', default: 14, step: 0.5 }
    ],

    batchCalculateFn: (row) => {
        const { sodium, glucose, bun } = row;
        if (sodium <= 0 || glucose < 0 || bun < 0) return null;
        return 2 * sodium + glucose / 18 + bun / 2.8;
    }
};
