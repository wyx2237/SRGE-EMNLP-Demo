window.__currentCalculatorConfig = {
    resultLabel: '🌡️ Burch-Wartofsky 甲状腺危象评分 (BWPS)',
    resultUnit: '分',
    defaultWarning: 'ⓘ 基于甲状腺毒症患者五大系统评估，≥45分高度提示甲状腺危象。',
    footnote: '📖 BWPS = 体温+心率+房颤+心衰+CNS+胃肠肝+诱因 &nbsp; <25低 25-44前期 ≥45危象 ≥95预后不良',
    batchWarning: '⚠️ 评分敏感度高，不应仅依赖评分而延误治疗。高度怀疑时立即干预。',
    resultColumnTitle: 'BWPS(分)',

    fields: [
        { name: 'temperature', label: '最高体温 (℃)', type: 'number', default: 37.0, step: 0.1, placeholder: '℃' },
        { name: 'heart_rate', label: '心动过速（次/分）', type: 'number', default: 80, step: 1, placeholder: '次/分' },
        { name: 'afib', label: '心房颤动', type: 'radio', options: [
            { value: '0', label: '无 (0分)', checked: true },
            { value: '10', label: '有 (10分)', checked: false }
        ] },
        { name: 'chf', label: '充血性心力衰竭', type: 'radio', options: [
            { value: '0', label: '无 (0分)', checked: true },
            { value: '5', label: '轻度（足部水肿）(5分)', checked: false },
            { value: '10', label: '中度（双肺底啰音）(10分)', checked: false },
            { value: '15', label: '重度（肺水肿）(15分)', checked: false }
        ] },
        { name: 'cns', label: '中枢神经系统影响', type: 'radio', options: [
            { value: '0', label: '无 (0分)', checked: true },
            { value: '10', label: '轻度（焦虑不安）(10分)', checked: false },
            { value: '20', label: '中度（谵妄/精神错乱）(20分)', checked: false },
            { value: '30', label: '重度（癫痫/昏迷）(30分)', checked: false }
        ] },
        { name: 'gi', label: '胃肠道-肝脏功能障碍', type: 'radio', options: [
            { value: '0', label: '无 (0分)', checked: true },
            { value: '10', label: '中度（腹泻/呕吐/腹痛）(10分)', checked: false },
            { value: '20', label: '重度（不明原因黄疸）(20分)', checked: false }
        ] },
        { name: 'precipitant', label: '诱因状态', type: 'radio', options: [
            { value: '0', label: '无明确诱因 (0分)', checked: true },
            { value: '10', label: '有明确诱因 (10分)', checked: false }
        ] }
    ],

    calculateFn: (params) => {
        const { temperature, heart_rate, afib, chf, cns, gi, precipitant } = params;
        const temp = parseFloat(temperature);
        const hr = parseFloat(heart_rate);

        const tempScore = temp <= 37.1 ? 0 : temp <= 37.7 ? 5 : temp <= 38.2 ? 10
                       : temp <= 38.8 ? 15 : temp <= 39.4 ? 20 : temp <= 39.9 ? 25 : 30;
        const hrScore = hr < 90 ? 0 : hr <= 109 ? 5 : hr <= 119 ? 10
                      : hr <= 129 ? 15 : hr <= 139 ? 20 : 25;

        return tempScore + hrScore + parseInt(afib) + parseInt(chf) + parseInt(cns) + parseInt(gi) + parseInt(precipitant);
    },

    customWarning: (params) => {
        const { temperature, heart_rate } = params;
        const temp = parseFloat(temperature);
        const hr = parseFloat(heart_rate);
        let warnings = [];
        if (temp > 40) warnings.push('体温≥40.0℃');
        if (hr >= 140) warnings.push('心率≥140次/分');
        if (warnings.length > 0) {
            return '⚠️ ' + warnings.join('，') + '，提示病情危重，请立即评估并启动综合治疗。';
        }
        return 'ⓘ ≥45分:高度提示甲状腺危象，立即启动积极综合治疗。≥95分:预后不良风险关键阈值。';
    },

    batchColumns: [
        { title: '体温(℃)', field: 'temperature', type: 'number', default: 37.0, step: 0.1 },
        { title: '心率(次/分)', field: 'heart_rate', type: 'number', default: 80, step: 1 },
        { title: '房颤', field: 'afib', type: 'select', options: [{value:'0',label:'无'},{value:'10',label:'有'}], default: '0' },
        { title: '心衰', field: 'chf', type: 'select', options: [
            { value: '0', label: '无' }, { value: '5', label: '轻度' },
            { value: '10', label: '中度' }, { value: '15', label: '重度' }
        ], default: '0' },
        { title: 'CNS', field: 'cns', type: 'select', options: [
            { value: '0', label: '无' }, { value: '10', label: '轻度' },
            { value: '20', label: '中度' }, { value: '30', label: '重度' }
        ], default: '0' },
        { title: '胃肠肝', field: 'gi', type: 'select', options: [
            { value: '0', label: '无' }, { value: '10', label: '中度' }, { value: '20', label: '重度' }
        ], default: '0' },
        { title: '诱因', field: 'precipitant', type: 'select', options: [
            { value: '0', label: '无' }, { value: '10', label: '有' }
        ], default: '0' }
    ],

    batchCalculateFn: (row) => {
        const { temperature, heart_rate, afib, chf, cns, gi, precipitant } = row;
        const temp = parseFloat(temperature);
        const hr = parseFloat(heart_rate);

        const tempScore = temp <= 37.1 ? 0 : temp <= 37.7 ? 5 : temp <= 38.2 ? 10
                       : temp <= 38.8 ? 15 : temp <= 39.4 ? 20 : temp <= 39.9 ? 25 : 30;
        const hrScore = hr < 90 ? 0 : hr <= 109 ? 5 : hr <= 119 ? 10
                      : hr <= 129 ? 15 : hr <= 139 ? 20 : 25;

        return tempScore + hrScore + parseInt(afib) + parseInt(chf) + parseInt(cns) + parseInt(gi) + parseInt(precipitant);
    }
};
