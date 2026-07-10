window.__currentCalculatorConfig = {
    resultLabel: '📊 China-PAR 10年ASCVD风险',
    resultUnit: '%',
    defaultWarning: 'ⓘ 适用于20岁及以上无ASCVD病史的中国成人。',
    footnote: '📖 基于年龄、收缩压、血脂、腰围、吸烟、糖尿病、地域、城乡、家族史等综合评估',
    batchWarning: '⚠️ 结果为理论预测风险，不能替代临床综合决策。',
    resultColumnTitle: '10年风险(%)',

    fields: [
        { name: 'sex', label: '性别', type: 'radio', options: [
            { value: 'female', label: '女性', checked: true },
            { value: 'male', label: '男性', checked: false }
        ] },
        { name: 'age', label: '年龄 (岁)', type: 'number', default: 55, step: 1, placeholder: '≥20岁' },
        { name: 'sbp', label: '收缩压 (mmHg)', type: 'number', default: 135, step: 1, placeholder: 'mmHg' },
        { name: 'on_treatment', label: '是否服用降压药', type: 'radio', options: [
            { value: 'no', label: '否', checked: true }, { value: 'yes', label: '是', checked: false }
        ] },
        { name: 'tc', label: '总胆固醇 (mg/dL)', type: 'number', default: 200, step: 1, placeholder: 'mg/dL' },
        { name: 'hdl', label: 'HDL-C (mg/dL)', type: 'number', default: 40, step: 1, placeholder: 'mg/dL' },
        { name: 'waist', label: '腰围 (cm)', type: 'number', default: 85, step: 0.5, placeholder: 'cm' },
        { name: 'smoking', label: '吸烟', type: 'radio', options: [
            { value: 'no', label: '否', checked: true }, { value: 'yes', label: '是', checked: false }
        ] },
        { name: 'diabetes', label: '糖尿病', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'region', label: '地域', type: 'radio', options: [
            { value: 'south', label: '南方', checked: true }, { value: 'north', label: '北方', checked: false }
        ] },
        { name: 'urban', label: '城乡', type: 'radio', options: [
            { value: 'rural', label: '农村', checked: true }, { value: 'urban', label: '城市', checked: false }
        ] },
        { name: 'family_history', label: '心血管病家族史', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] }
    ],

    calculateFn: (params) => {
        const { sex, age, sbp, on_treatment, tc, hdl, waist, smoking, diabetes, region, urban, family_history } = params;
        if (age <= 0 || sbp <= 0 || tc <= 0 || hdl <= 0 || waist <= 0) return null;

        const lnAge = Math.log(age);
        const lnSbp = Math.log(sbp);
        const lnTc = Math.log(tc);
        const lnHdl = Math.log(hdl);
        const lnWaist = Math.log(waist);
        const smoke = smoking === 'yes' ? 1 : 0;
        const dm = diabetes === 'yes' ? 1 : 0;
        const reg = region === 'north' ? 1 : 0;
        const urb = urban === 'urban' ? 1 : 0;
        const fh = family_history === 'yes' ? 1 : 0;

        let X, baselineRisk, surv;

        if (sex === 'male') {
            // 收缩压系数及交互项系数按是否服药选择
            const betaSbp = on_treatment === 'yes' ? 27.388 : 26.148;
            const betaAgeSbp = on_treatment === 'yes' ? -6.018 : -5.731;
            X = 31.967 * lnAge +
                betaSbp * lnSbp +
                0.621 * lnTc +
                (-0.695) * lnHdl +
                (-0.712) * lnWaist +
                3.955 * smoke +
                0.357 * dm +
                0.475 * reg +
                (-0.164) * urb +
                6.221 * fh +
                betaAgeSbp * lnAge * lnSbp +
                (-0.939) * lnAge * smoke +
                (-1.534) * lnAge * fh;
            baselineRisk = 140.68;
            surv = 0.9707;
        } else {
            // 女性模型：无城乡、家族史主效应，也无年龄×吸烟、年龄×家族史交互项
            const betaSbp = on_treatment === 'yes' ? 20.709 : 19.982;
            const betaAgeSbp = on_treatment === 'yes' ? -4.528 : -4.360;
            X = 24.874 * lnAge +
                betaSbp * lnSbp +
                0.058 * lnTc +
                (-0.217) * lnHdl +
                1.475 * lnWaist +
                0.495 * smoke +
                0.567 * dm +
                0.544 * reg +
                betaAgeSbp * lnAge * lnSbp;
            baselineRisk = 117.26;
            surv = 0.9851;
        }

        const Y = Math.exp(X - baselineRisk);
        let risk = (1 - Math.pow(surv, Y)) * 100;

        // 限制合理范围
        if (risk < 0.1) risk = 0.1;
        if (risk > 99) risk = 99;

        return risk;
    },

    customWarning: (params) => {
        const { age } = params;
        if (age < 20) return '⚠️ 适用于20岁及以上成人，年龄过低结果不准确。';
        if (age > 75) return '⚠️ 高龄(>75岁)个体预测值可能有误差，需结合临床评估。';
        return 'ⓘ <5.0%低危，5.0-9.9%中危，≥10.0%高危。';
    },

    batchColumns: [
        { title: '性别', field: 'sex', type: 'select', options: [{value:'female',label:'女'},{value:'male',label:'男'}], default: 'female' },
        { title: '年龄(岁)', field: 'age', type: 'number', default: 55, step: 1 },
        { title: 'SBP(mmHg)', field: 'sbp', type: 'number', default: 135, step: 1 },
        { title: '服降压药', field: 'on_treatment', type: 'select', options: [{value:'no',label:'否'},{value:'yes',label:'是'}], default: 'no' },
        { title: 'TC(mg/dL)', field: 'tc', type: 'number', default: 200, step: 1 },
        { title: 'HDL-C(mg/dL)', field: 'hdl', type: 'number', default: 40, step: 1 },
        { title: '腰围(cm)', field: 'waist', type: 'number', default: 85, step: 0.5 },
        { title: '吸烟', field: 'smoking', type: 'select', options: [{value:'no',label:'否'},{value:'yes',label:'是'}], default: 'no' },
        { title: '糖尿病', field: 'diabetes', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '地域', field: 'region', type: 'select', options: [{value:'south',label:'南方'},{value:'north',label:'北方'}], default: 'south' },
        { title: '城乡', field: 'urban', type: 'select', options: [{value:'rural',label:'农村'},{value:'urban',label:'城市'}], default: 'rural' },
        { title: '家族史', field: 'family_history', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' }
    ],

    batchCalculateFn: (row) => {
        const { sex, age, sbp, on_treatment, tc, hdl, waist, smoking, diabetes, region, urban, family_history } = row;
        if (age <= 0 || sbp <= 0 || tc <= 0 || hdl <= 0 || waist <= 0) return null;

        const lnAge = Math.log(age);
        const lnSbp = Math.log(sbp);
        const lnTc = Math.log(tc);
        const lnHdl = Math.log(hdl);
        const lnWaist = Math.log(waist);
        const smoke = smoking === 'yes' ? 1 : 0;
        const dm = diabetes === 'yes' ? 1 : 0;
        const reg = region === 'north' ? 1 : 0;
        const urb = urban === 'urban' ? 1 : 0;
        const fh = family_history === 'yes' ? 1 : 0;

        let X, baselineRisk, surv;

        if (sex === 'male') {
            const betaSbp = on_treatment === 'yes' ? 27.388 : 26.148;
            const betaAgeSbp = on_treatment === 'yes' ? -6.018 : -5.731;
            X = 31.967 * lnAge +
                betaSbp * lnSbp +
                0.621 * lnTc +
                (-0.695) * lnHdl +
                (-0.712) * lnWaist +
                3.955 * smoke +
                0.357 * dm +
                0.475 * reg +
                (-0.164) * urb +
                6.221 * fh +
                betaAgeSbp * lnAge * lnSbp +
                (-0.939) * lnAge * smoke +
                (-1.534) * lnAge * fh;
            baselineRisk = 140.68;
            surv = 0.9707;
        } else {
            const betaSbp = on_treatment === 'yes' ? 20.709 : 19.982;
            const betaAgeSbp = on_treatment === 'yes' ? -4.528 : -4.360;
            X = 24.874 * lnAge +
                betaSbp * lnSbp +
                0.058 * lnTc +
                (-0.217) * lnHdl +
                1.475 * lnWaist +
                0.495 * smoke +
                0.567 * dm +
                0.544 * reg +
                betaAgeSbp * lnAge * lnSbp;
            baselineRisk = 117.26;
            surv = 0.9851;
        }

        const Y = Math.exp(X - baselineRisk);
        let risk = (1 - Math.pow(surv, Y)) * 100;
        if (risk < 0.1) risk = 0.1;
        if (risk > 99) risk = 99;
        return risk;
    }
};