window.__currentCalculatorConfig = {
    resultLabel: '🫀 心瓣膜面积 (Gorlin公式)',
    resultUnit: 'cm²',
    defaultWarning: 'ⓘ 适用于心导管术中获取的血液动力学数据。',
    footnote: '📖 VA = CO ÷ (K×HR×FT×√ΔP) &nbsp; 二尖瓣K=37.7，其他瓣膜K=44.3',
    batchWarning: '⚠️ 极低心输出量或压差时可能低估瓣膜面积。',
    resultColumnTitle: '瓣膜面积(cm²)',

    fields: [
        { name: 'co', label: '心输出量 (mL/min)', type: 'number', default: 4500, step: 100, placeholder: 'mL/min' },
        { name: 'valve', label: '瓣膜类型', type: 'radio', options: [
            { value: 'mitral', label: '二尖瓣 (K=37.7)', checked: true },
            { value: 'aortic', label: '主动脉瓣 (K=44.3)', checked: false },
            { value: 'tricuspid', label: '三尖瓣 (K=44.3)', checked: false },
            { value: 'pulmonary', label: '肺动脉瓣 (K=44.3)', checked: false }
        ] },
        { name: 'hr', label: '心率 (次/分)', type: 'number', default: 75, step: 1, placeholder: 'bpm' },
        { name: 'ft', label: '瓣膜开放时间 (秒)', type: 'number', default: 0.4, step: 0.01, placeholder: 'SEP或DFP' },
        { name: 'dp', label: '跨瓣平均压差 (mmHg)', type: 'number', default: 10, step: 0.5, placeholder: 'mmHg' }
    ],

    calculateFn: (params) => {
        const { co, valve, hr, ft, dp } = params;
        if (co <= 0 || hr <= 0 || ft <= 0 || dp <= 0) return null;
        const k = valve === 'mitral' ? 37.7 : 44.3;
        return co / (k * hr * ft * Math.sqrt(dp));
    },

    customWarning: (params) => {
        const { valve } = params;
        if (valve === 'mitral') return 'ⓘ 二尖瓣狭窄参考：<1.0cm²重度，1.0-1.5cm²中度，>1.5cm²轻度。';
        return 'ⓘ 主动脉瓣狭窄参考：<1.0cm²重度，1.0-1.5cm²中度，>1.5cm²轻度。';
    },

    batchColumns: [
        { title: 'CO(mL/min)', field: 'co', type: 'number', default: 4500, step: 100 },
        { title: '瓣膜类型', field: 'valve', type: 'select', options: [
            { value: 'mitral', label: '二尖瓣' }, { value: 'aortic', label: '主动脉瓣' },
            { value: 'tricuspid', label: '三尖瓣' }, { value: 'pulmonary', label: '肺动脉瓣' }
        ], default: 'mitral' },
        { title: 'HR(bpm)', field: 'hr', type: 'number', default: 75, step: 1 },
        { title: 'FT(秒)', field: 'ft', type: 'number', default: 0.4, step: 0.01 },
        { title: 'ΔP(mmHg)', field: 'dp', type: 'number', default: 10, step: 0.5 }
    ],

    batchCalculateFn: (row) => {
        const { co, valve, hr, ft, dp } = row;
        if (co <= 0 || hr <= 0 || ft <= 0 || dp <= 0) return null;
        const k = valve === 'mitral' ? 37.7 : 44.3;
        return co / (k * hr * ft * Math.sqrt(dp));
    }
};
