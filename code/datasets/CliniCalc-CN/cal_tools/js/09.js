window.__currentCalculatorConfig = {
    resultLabel: '🧓 Shireman 出血风险评分',
    resultUnit: '分',
    defaultWarning: 'ⓘ 适用于>65岁房颤患者服用华法林90天内出血风险评估。',
    footnote: '📖 贫血86+药酒滥用71+近期出血62+远期出血58+≥70岁49+女性32+抗板药32+糖尿病27 &nbsp; 低<108 中108-218 高>218',
    batchWarning: '⚠️ 评分工具为出血风险评估，不应替代全面的临床判断。',
    resultColumnTitle: 'Shireman(分)',

    fields: [
        { name: 'anemia', label: '贫血', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'alcohol_drug', label: '酒精或药物滥用', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'recent_bleeding', label: '近期出血（入院前30天内）', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'remote_bleeding', label: '远期出血（入院前30天-1年）', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'age', label: '年龄（岁）', type: 'number', min: 0, max: 120, step: 1, default: 65, placeholder: '输入年龄' },
        { name: 'female', label: '女性', type: 'radio', options: [
            { value: 'no', label: '否', checked: true }, { value: 'yes', label: '是', checked: false }
        ] },
        { name: 'antiplatelet', label: '使用抗血小板药物', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'diabetes', label: '糖尿病', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] }
    ],

    calculateFn: (params) => {
        const { anemia, alcohol_drug, recent_bleeding, remote_bleeding, age, female, antiplatelet, diabetes } = params;
        let score = 0;
        if (anemia === 'yes') score += 86;
        if (alcohol_drug === 'yes') score += 71;
        if (recent_bleeding === 'yes') score += 62;
        if (remote_bleeding === 'yes') score += 58;
        // 年龄判断：若输入有效数值且 ≥70 则加 49 分
        let ageValue = parseFloat(age);
        if (!isNaN(ageValue) && ageValue >= 70) score += 49;
        if (female === 'yes') score += 32;
        if (antiplatelet === 'yes') score += 32;
        if (diabetes === 'yes') score += 27;
        return score;
    },

    customWarning: (params) => {
        return 'ⓘ 低<108分(出血风险~0.9%)，108-218分(中~2.0%)，>218分(高~5.4%)。';
    },

    batchColumns: [
        { title: '贫血', field: 'anemia', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '药酒滥用', field: 'alcohol_drug', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '近期出血', field: 'recent_bleeding', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '远期出血', field: 'remote_bleeding', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '年龄（岁）', field: 'age', type: 'number', min: 0, max: 120, step: 1, default: 65 },
        { title: '女性', field: 'female', type: 'select', options: [{value:'no',label:'否'},{value:'yes',label:'是'}], default: 'no' },
        { title: '抗板药', field: 'antiplatelet', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '糖尿病', field: 'diabetes', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' }
    ],

    batchCalculateFn: (row) => {
        const { anemia, alcohol_drug, recent_bleeding, remote_bleeding, age, female, antiplatelet, diabetes } = row;
        let score = 0;
        if (anemia === 'yes') score += 86;
        if (alcohol_drug === 'yes') score += 71;
        if (recent_bleeding === 'yes') score += 62;
        if (remote_bleeding === 'yes') score += 58;
        let ageValue = parseFloat(age);
        if (!isNaN(ageValue) && ageValue >= 70) score += 49;
        if (female === 'yes') score += 32;
        if (antiplatelet === 'yes') score += 32;
        if (diabetes === 'yes') score += 27;
        return score;
    }
};