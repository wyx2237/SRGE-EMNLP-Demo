window.__currentCalculatorConfig = {
    resultLabel: '❤️ OPT-CAD 评分',
    resultUnit: '分（0-257分）',
    defaultWarning: 'ⓘ 适用于中国冠心病患者，预测1年缺血事件风险。',
    footnote: '📖 OPT-CAD = 年龄+心率+高血压+既往MI+卒中+肾功+贫血+LVEF+cTn+ST段 &nbsp; 0-90低 91-150中 ≥151高',
    batchWarning: '⚠️ 评分结果仅为风险评估，抗血小板策略调整需结合临床判断。',
    resultColumnTitle: 'OPT-CAD(分)',

    fields: [
        { name: 'age', label: '年龄 (岁)', type: 'number', default: 60, step: 1, placeholder: '岁' },
        { name: 'heart_rate', label: '心率 (次/分)', type: 'number', default: 75, step: 1, placeholder: 'bpm' },
        { name: 'hypertension', label: '高血压病史', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'prior_mi', label: '既往心肌梗死史', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'prior_stroke', label: '既往卒中史', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'renal', label: '肾功能不全(eGFR<60)', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'anemia', label: '贫血(男Hb<13,女<12 g/dL)', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'lvef_low', label: 'LVEF < 50%', type: 'radio', options: [
            { value: 'no', label: '否', checked: true }, { value: 'yes', label: '是', checked: false }
        ] },
        { name: 'ctn_elevated', label: 'cTn升高', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'st_change', label: '心电图ST段改变', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] }
    ],

    calculateFn: (params) => {
        const { age, heart_rate, hypertension, prior_mi, prior_stroke, renal, anemia, lvef_low, ctn_elevated, st_change } = params;
        let score = 0;

        if (age < 40) score += 0;
        else if (age <= 49) score += 9;
        else if (age <= 59) score += 29;
        else if (age <= 64) score += 41;
        else if (age <= 69) score += 50;
        else if (age <= 74) score += 58;
        else if (age <= 79) score += 65;
        else score += 71;

        if (heart_rate < 60) score += 0;
        else if (heart_rate <= 69) score += 14;
        else if (heart_rate <= 79) score += 18;
        else if (heart_rate <= 89) score += 21;
        else if (heart_rate <= 99) score += 24;
        else if (heart_rate <= 110) score += 30;
        else score += 36;

        if (hypertension === 'yes') score += 20;
        if (prior_mi === 'yes') score += 16;
        if (prior_stroke === 'yes') score += 16;
        if (renal === 'yes') score += 21;
        if (anemia === 'yes') score += 19;
        if (lvef_low === 'yes') score += 22;
        if (ctn_elevated === 'yes') score += 23;
        if (st_change === 'yes') score += 13;

        return score;
    },

    customWarning: (params) => {
        return 'ⓘ 0-90分:低危(~1.6%)，91-150分:中危(~5.5%)，≥151分:高危(~15.0%)。';
    },

    batchColumns: [
        { title: '年龄(岁)', field: 'age', type: 'number', default: 60, step: 1 },
        { title: '心率(bpm)', field: 'heart_rate', type: 'number', default: 75, step: 1 },
        { title: '高血压', field: 'hypertension', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '既往MI', field: 'prior_mi', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '卒中史', field: 'prior_stroke', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '肾功不全', field: 'renal', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '贫血', field: 'anemia', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: 'LVEF<50%', field: 'lvef_low', type: 'select', options: [{value:'no',label:'否'},{value:'yes',label:'是'}], default: 'no' },
        { title: 'cTn↑', field: 'ctn_elevated', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: 'ST段改变', field: 'st_change', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' }
    ],

    batchCalculateFn: (row) => {
        const { age, heart_rate, hypertension, prior_mi, prior_stroke, renal, anemia, lvef_low, ctn_elevated, st_change } = row;
        let score = 0;

        if (age < 40) score += 0;
        else if (age <= 49) score += 9;
        else if (age <= 59) score += 29;
        else if (age <= 64) score += 41;
        else if (age <= 69) score += 50;
        else if (age <= 74) score += 58;
        else if (age <= 79) score += 65;
        else score += 71;

        if (heart_rate < 60) score += 0;
        else if (heart_rate <= 69) score += 14;
        else if (heart_rate <= 79) score += 18;
        else if (heart_rate <= 89) score += 21;
        else if (heart_rate <= 99) score += 24;
        else if (heart_rate <= 110) score += 30;
        else score += 36;

        if (hypertension === 'yes') score += 20;
        if (prior_mi === 'yes') score += 16;
        if (prior_stroke === 'yes') score += 16;
        if (renal === 'yes') score += 21;
        if (anemia === 'yes') score += 19;
        if (lvef_low === 'yes') score += 22;
        if (ctn_elevated === 'yes') score += 23;
        if (st_change === 'yes') score += 13;

        return score;
    }
};
