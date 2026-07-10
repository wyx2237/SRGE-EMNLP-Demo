window.__currentCalculatorConfig = {
    resultLabel: '🩸 VTE-BLEED 出血风险评分',
    resultUnit: '分（≥2分为高风险）',
    defaultWarning: 'ⓘ 适用于VTE患者稳定抗凝治疗≥30天后的大出血风险评估。',
    footnote: '📖 活动性癌症2分 + 男性高血压1分 + 贫血1.5分 + 出血史1.5分 + ≥60岁1.5分 + 肾功不全1.5分 &nbsp; <2低 ≥2高',
    batchWarning: '⚠️ 评分侧重于识别低出血风险患者，辅助延长抗凝治疗决策。',
    resultColumnTitle: 'VTE-BLEED(分)',

    fields: [
        { name: 'active_cancer', label: '活动性癌症', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'male_htn', label: '男性伴未控制高血压（收缩压≥140 mmHg）', type: 'radio', options: [
            { value: 'no', label: '否', checked: true }, { value: 'yes', label: '是', checked: false }
        ] },
        { name: 'anemia', label: '贫血（男Hb<13, 女Hb<12 g/dL）', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'bleeding_history', label: '既往出血史', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'age', label: '年龄（岁）', type: 'number', min: 0, max: 120, step: 1, default: 50, placeholder: '输入年龄' },
        { name: 'renal', label: '肾功能不全（eGFR<60 mL/min）', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] }
    ],

    calculateFn: (params) => {
        const { active_cancer, male_htn, anemia, bleeding_history, age, renal } = params;
        let score = 0;
        if (active_cancer === 'yes') score += 2;
        if (male_htn === 'yes') score += 1;
        if (anemia === 'yes') score += 1.5;
        if (bleeding_history === 'yes') score += 1.5;
        // 年龄判断：若输入有效数值且 ≥60 则加 1.5 分
        let ageValue = parseFloat(age);
        if (!isNaN(ageValue) && ageValue >= 60) score += 1.5;
        if (renal === 'yes') score += 1.5;
        return score;
    },

    customWarning: (params) => {
        return 'ⓘ 总分<2分为低出血风险，≥2分为高出血风险。';
    },

    batchColumns: [
        { title: '活动性癌症', field: 'active_cancer', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '男+高血压', field: 'male_htn', type: 'select', options: [{value:'no',label:'否'},{value:'yes',label:'是'}], default: 'no' },
        { title: '贫血', field: 'anemia', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '出血史', field: 'bleeding_history', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '年龄（岁）', field: 'age', type: 'number', min: 0, max: 120, step: 1, default: 50 },
        { title: '肾功不全', field: 'renal', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' }
    ],

    batchCalculateFn: (row) => {
        const { active_cancer, male_htn, anemia, bleeding_history, age, renal } = row;
        let score = 0;
        if (active_cancer === 'yes') score += 2;
        if (male_htn === 'yes') score += 1;
        if (anemia === 'yes') score += 1.5;
        if (bleeding_history === 'yes') score += 1.5;
        let ageValue = parseFloat(age);
        if (!isNaN(ageValue) && ageValue >= 60) score += 1.5;
        if (renal === 'yes') score += 1.5;
        return score;
    }
};