window.__currentCalculatorConfig = {
    resultLabel: '❤️ GRACE 2.0 缺血风险评分',
    resultUnit: '分',
    defaultWarning: 'ⓘ 适用于ACS患者院内及远期死亡风险评估。',
    footnote: '📖 GRACE = 年龄+心率+收缩压+肌酐+Killip+心脏停搏+ST段偏移+心肌酶 &nbsp; ≤108低 109-140中 >140高危',
    batchWarning: '⚠️ 评分结果需结合临床判断，不能替代个体化治疗决策。',
    resultColumnTitle: 'GRACE(分)',

    fields: [
        { name: 'age', label: '年龄 (岁)', type: 'number', default: 60, step: 1, placeholder: '岁' },
        { name: 'heart_rate', label: '心率 (次/分)', type: 'number', default: 80, step: 1, placeholder: 'bpm' },
        { name: 'sbp', label: '收缩压 (mmHg)', type: 'number', default: 130, step: 1, placeholder: 'mmHg' },
        { name: 'creatinine', label: '血肌酐 (mg/dL)', type: 'number', default: 1.0, step: 0.1, placeholder: 'mg/dL' },
        { name: 'killip', label: 'Killip分级', type: 'radio', options: [
            { value: '1', label: 'Ⅰ级(无心衰体征)', checked: true },
            { value: '2', label: 'Ⅱ级(啰音<50%肺野/S3)', checked: false },
            { value: '3', label: 'Ⅲ级(急性肺水肿)', checked: false },
            { value: '4', label: 'Ⅳ级(心源性休克)', checked: false }
        ] },
        { name: 'cardiac_arrest', label: '入院时心脏停搏', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'st_deviation', label: '心电图ST段偏移（下移>0.5mm）', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'enzyme_elevation', label: '心肌标志物升高', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] }
    ],

    calculateFn: (params) => {
        const { age, heart_rate, sbp, creatinine, killip, cardiac_arrest, st_deviation, enzyme_elevation } = params;
        let score = 0;

        // Age score
        if (age <= 30) score += 0;
        else if (age <= 39) score += 8;
        else if (age <= 49) score += 25;
        else if (age <= 59) score += 41;
        else if (age <= 69) score += 58;
        else if (age <= 79) score += 75;
        else if (age <= 89) score += 91;
        else score += 100;

        // Heart rate score
        if (heart_rate <= 49) score += 0;
        else if (heart_rate <= 69) score += 3;
        else if (heart_rate <= 89) score += 9;
        else if (heart_rate <= 109) score += 15;
        else if (heart_rate <= 149) score += 24;
        else if (heart_rate <= 199) score += 38;
        else score += 46;

        // SBP score
        if (sbp <= 79) score += 58;
        else if (sbp <= 99) score += 53;
        else if (sbp <= 119) score += 43;
        else if (sbp <= 139) score += 34;
        else if (sbp <= 159) score += 24;
        else if (sbp <= 199) score += 10;
        else score += 0;

        // Creatinine score
        if (creatinine <= 0.39) score += 1;
        else if (creatinine <= 0.79) score += 4;
        else if (creatinine <= 1.19) score += 7;
        else if (creatinine <= 1.59) score += 10;
        else if (creatinine <= 1.99) score += 13;
        else if (creatinine <= 3.99) score += 21;
        else score += 28;

        // Killip class
        if (killip === '2') score += 20;
        else if (killip === '3') score += 39;
        else if (killip === '4') score += 59;

        // Cardiac arrest
        if (cardiac_arrest === 'yes') score += 39;

        // ST deviation
        if (st_deviation === 'yes') score += 28;

        // Enzyme elevation
        if (enzyme_elevation === 'yes') score += 14;

        return score;
    },

    customWarning: (params) => {
        const { age } = params;
        if (age < 18) return '⚠️ GRACE评分主要适用于ACS成人患者。';
        return 'ⓘ ≤108分:低危(<1%)，109-140分:中危(1-3%)，>140分:高危(>3%)。';
    },

    batchColumns: [
        { title: '年龄(岁)', field: 'age', type: 'number', default: 60, step: 1 },
        { title: '心率(bpm)', field: 'heart_rate', type: 'number', default: 80, step: 1 },
        { title: '收缩压(mmHg)', field: 'sbp', type: 'number', default: 130, step: 1 },
        { title: '肌酐(mg/dL)', field: 'creatinine', type: 'number', default: 1.0, step: 0.1 },
        { title: 'Killip', field: 'killip', type: 'select', options: [
            { value: '1', label: 'Ⅰ级' }, { value: '2', label: 'Ⅱ级' },
            { value: '3', label: 'Ⅲ级' }, { value: '4', label: 'Ⅳ级' }
        ], default: '1' },
        { title: '心脏停搏', field: 'cardiac_arrest', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: 'ST段偏移', field: 'st_deviation', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '心肌酶↑', field: 'enzyme_elevation', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' }
    ],

    batchCalculateFn: (row) => {
        const { age, heart_rate, sbp, creatinine, killip, cardiac_arrest, st_deviation, enzyme_elevation } = row;
        let score = 0;

        if (age <= 30) score += 0;
        else if (age <= 39) score += 8;
        else if (age <= 49) score += 25;
        else if (age <= 59) score += 41;
        else if (age <= 69) score += 58;
        else if (age <= 79) score += 75;
        else if (age <= 89) score += 91;
        else score += 100;

        if (heart_rate <= 49) score += 0;
        else if (heart_rate <= 69) score += 3;
        else if (heart_rate <= 89) score += 9;
        else if (heart_rate <= 109) score += 15;
        else if (heart_rate <= 149) score += 24;
        else if (heart_rate <= 199) score += 38;
        else score += 46;

        if (sbp <= 79) score += 58;
        else if (sbp <= 99) score += 53;
        else if (sbp <= 119) score += 43;
        else if (sbp <= 139) score += 34;
        else if (sbp <= 159) score += 24;
        else if (sbp <= 199) score += 10;
        else score += 0;

        if (creatinine <= 0.39) score += 1;
        else if (creatinine <= 0.79) score += 4;
        else if (creatinine <= 1.19) score += 7;
        else if (creatinine <= 1.59) score += 10;
        else if (creatinine <= 1.99) score += 13;
        else if (creatinine <= 3.99) score += 21;
        else score += 28;

        if (killip === '2') score += 20;
        else if (killip === '3') score += 39;
        else if (killip === '4') score += 59;

        if (cardiac_arrest === 'yes') score += 39;
        if (st_deviation === 'yes') score += 28;
        if (enzyme_elevation === 'yes') score += 14;
        return score;
    }
};
