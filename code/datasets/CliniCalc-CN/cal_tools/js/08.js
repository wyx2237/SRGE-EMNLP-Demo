window.__currentCalculatorConfig = {
    resultLabel: '🩸 HAS-BLED 出血风险评分',
    resultUnit: '分（≥3分为高风险）',
    defaultWarning: 'ⓘ 适用于房颤患者口服抗凝治疗出血风险评估，≥3分提示出血高风险。',
    footnote: '📖 HAS-BLED: H(高血压)+A(肾/肝功)+S(卒中)+B(出血)+L(INR不稳)+E(≥65岁)+D(药物/饮酒) &nbsp; 0-9分',
    batchWarning: '⚠️ 评分≥3分提示出血高危，但不应作为停用抗凝的唯一依据。',
    resultColumnTitle: 'HAS-BLED(分)',

    fields: [
        { name: 'hypertension', label: '未控制的高血压（收缩压>160 mmHg）', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'renal', label: '肾功能异常（透析/肾移植/肌酐≥200μmol/L）', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'liver', label: '肝功能异常（慢性肝病/胆红素↑/酶↑）', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'stroke', label: '卒中史', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'bleeding', label: '出血史或出血倾向', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'inr_unstable', label: 'INR不稳定（华法林TTR<60%）', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'age', label: '年龄（岁）', type: 'number', min: 0, max: 120, step: 1, default: 60, placeholder: '输入年龄' },
        { name: 'drugs', label: '使用抗板药物或NSAID', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'alcohol', label: '饮酒过量（每周>8个酒精单位）', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] }
    ],

    calculateFn: (params) => {
        const { hypertension, renal, liver, stroke, bleeding, inr_unstable, age, drugs, alcohol } = params;
        let score = 0;
        if (hypertension === 'yes') score += 1;
        if (renal === 'yes') score += 1;
        if (liver === 'yes') score += 1;
        if (stroke === 'yes') score += 1;
        if (bleeding === 'yes') score += 1;
        if (inr_unstable === 'yes') score += 1;
        // 年龄判断：若输入有效数值且 ≥65 则加 1 分
        let ageValue = parseFloat(age);
        if (!isNaN(ageValue) && ageValue >= 65) score += 1;
        if (drugs === 'yes') score += 1;
        if (alcohol === 'yes') score += 1;
        return score;
    },

    customWarning: (params) => {
        return 'ⓘ 评分≥3分提示出血高风险，需纠正可控危险因素并加强随访。';
    },

    batchColumns: [
        { title: '高血压', field: 'hypertension', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '肾功异常', field: 'renal', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '肝功异常', field: 'liver', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '卒中史', field: 'stroke', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '出血史', field: 'bleeding', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: 'INR不稳', field: 'inr_unstable', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '年龄（岁）', field: 'age', type: 'number', min: 0, max: 120, step: 1, default: 60 },
        { title: '抗板药/NSAID', field: 'drugs', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '饮酒过量', field: 'alcohol', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' }
    ],

    batchCalculateFn: (row) => {
        const { hypertension, renal, liver, stroke, bleeding, inr_unstable, age, drugs, alcohol } = row;
        let score = 0;
        if (hypertension === 'yes') score += 1;
        if (renal === 'yes') score += 1;
        if (liver === 'yes') score += 1;
        if (stroke === 'yes') score += 1;
        if (bleeding === 'yes') score += 1;
        if (inr_unstable === 'yes') score += 1;
        let ageValue = parseFloat(age);
        if (!isNaN(ageValue) && ageValue >= 65) score += 1;
        if (drugs === 'yes') score += 1;
        if (alcohol === 'yes') score += 1;
        return score;
    }
};