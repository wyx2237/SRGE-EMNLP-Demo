window.__currentCalculatorConfig = {
    resultLabel: '📋 查尔森合并症指数 (CCI)',
    resultUnit: '分',
    defaultWarning: 'ⓘ 基于19种合并症及年龄评估患者共病严重程度及死亡风险。',
    footnote: '📖 CCI = Σ疾病权重(1/2/3/6分) + 年龄调整(≥50岁每10年+1) &nbsp; 分数越高预后越差',
    batchWarning: '⚠️ 请确保患者已被明确诊断所列合并症，需参考诊断证明。',
    resultColumnTitle: 'CCI(分)',

    fields: [
        { name: 'age', label: '年龄 (岁)', type: 'number', default: 60, step: 1, placeholder: '岁' },
        { name: 'mi', label: '心肌梗死', type: 'radio', options: [{value:'no',label:'无',checked:true},{value:'yes',label:'有',checked:false}] },
        { name: 'chf', label: '充血性心力衰竭', type: 'radio', options: [{value:'no',label:'无',checked:true},{value:'yes',label:'有',checked:false}] },
        { name: 'pvd', label: '外周血管疾病', type: 'radio', options: [{value:'no',label:'无',checked:true},{value:'yes',label:'有',checked:false}] },
        { name: 'cvd', label: '脑血管疾病', type: 'radio', options: [{value:'no',label:'无',checked:true},{value:'yes',label:'有',checked:false}] },
        { name: 'dementia', label: '痴呆', type: 'radio', options: [{value:'no',label:'无',checked:true},{value:'yes',label:'有',checked:false}] },
        { name: 'copd', label: 'COPD', type: 'radio', options: [{value:'no',label:'无',checked:true},{value:'yes',label:'有',checked:false}] },
        { name: 'ctd', label: '结缔组织病', type: 'radio', options: [{value:'no',label:'无',checked:true},{value:'yes',label:'有',checked:false}] },
        { name: 'pud', label: '消化性溃疡', type: 'radio', options: [{value:'no',label:'无',checked:true},{value:'yes',label:'有',checked:false}] },
        { name: 'mild_liver', label: '轻度肝脏疾病', type: 'radio', options: [{value:'no',label:'无',checked:true},{value:'yes',label:'有',checked:false}] },
        { name: 'dm_no_complication', label: '糖尿病（无器官损害）', type: 'radio', options: [{value:'no',label:'无',checked:true},{value:'yes',label:'有',checked:false}] },
        { name: 'dm_complication', label: '糖尿病（伴器官损害）', type: 'radio', options: [{value:'no',label:'无',checked:true},{value:'yes',label:'有',checked:false}] },
        { name: 'hemiplegia', label: '偏瘫', type: 'radio', options: [{value:'no',label:'无',checked:true},{value:'yes',label:'有',checked:false}] },
        { name: 'ckd', label: '中重度慢性肾脏病', type: 'radio', options: [{value:'no',label:'无',checked:true},{value:'yes',label:'有',checked:false}] },
        { name: 'leukemia', label: '白血病', type: 'radio', options: [{value:'no',label:'无',checked:true},{value:'yes',label:'有',checked:false}] },
        { name: 'lymphoma', label: '淋巴瘤', type: 'radio', options: [{value:'no',label:'无',checked:true},{value:'yes',label:'有',checked:false}] },
        { name: 'tumor', label: '实体瘤（局限性）', type: 'radio', options: [{value:'no',label:'无',checked:true},{value:'yes',label:'有',checked:false}] },
        { name: 'severe_liver', label: '中重度肝脏疾病', type: 'radio', options: [{value:'no',label:'无',checked:true},{value:'yes',label:'有',checked:false}] },
        { name: 'metastatic', label: '转移性实体瘤', type: 'radio', options: [{value:'no',label:'无',checked:true},{value:'yes',label:'有',checked:false}] },
        { name: 'aids', label: '艾滋病 (AIDS)', type: 'radio', options: [{value:'no',label:'无',checked:true},{value:'yes',label:'有',checked:false}] }
    ],

    calculateFn: (params) => {
        const { age, mi, chf, pvd, cvd, dementia, copd, ctd, pud, mild_liver,
                dm_no_complication, dm_complication, hemiplegia, ckd, leukemia, lymphoma,
                tumor, severe_liver, metastatic, aids } = params;
        let score = 0;

        // 1-point diseases
        if (mi === 'yes') score += 1;
        if (chf === 'yes') score += 1;
        if (pvd === 'yes') score += 1;
        if (cvd === 'yes') score += 1;
        if (dementia === 'yes') score += 1;
        if (copd === 'yes') score += 1;
        if (ctd === 'yes') score += 1;
        if (pud === 'yes') score += 1;
        if (mild_liver === 'yes') score += 1;
        if (dm_no_complication === 'yes') score += 1;

        // 2-point diseases
        if (dm_complication === 'yes') score += 2;
        if (hemiplegia === 'yes') score += 2;
        if (ckd === 'yes') score += 2;
        if (leukemia === 'yes') score += 2;
        if (lymphoma === 'yes') score += 2;
        if (tumor === 'yes') score += 2;

        // 3-point diseases
        if (severe_liver === 'yes') score += 3;

        // 6-point diseases
        if (metastatic === 'yes') score += 6;
        if (aids === 'yes') score += 6;

        // Age adjustment
        if (age >= 50) score += Math.floor((age - 40) / 10);

        return score;
    },

    customWarning: (params) => {
        return 'ⓘ 年龄调整：每超过40岁加1分（50-59岁+1，60-69岁+2，以此类推）。';
    },

    batchColumns: [
        { title: '年龄', field: 'age', type: 'number', default: 60, step: 1 },
        { title: '心肌梗死', field: 'mi', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '心衰', field: 'chf', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '外周血管病', field: 'pvd', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '脑血管病', field: 'cvd', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '痴呆', field: 'dementia', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: 'COPD', field: 'copd', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '结缔组织病', field: 'ctd', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '消化性溃疡', field: 'pud', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '轻度肝病', field: 'mild_liver', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '单纯DM', field: 'dm_no_complication', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: 'DM伴损害', field: 'dm_complication', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '偏瘫', field: 'hemiplegia', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '中重度CKD', field: 'ckd', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '白血病', field: 'leukemia', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '淋巴瘤', field: 'lymphoma', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '局限性实体瘤', field: 'tumor', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '中重度肝病', field: 'severe_liver', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '转移性肿瘤', field: 'metastatic', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: 'AIDS', field: 'aids', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' }
    ],

    batchCalculateFn: (row) => {
        const { age, mi, chf, pvd, cvd, dementia, copd, ctd, pud, mild_liver,
                dm_no_complication, dm_complication, hemiplegia, ckd, leukemia, lymphoma,
                tumor, severe_liver, metastatic, aids } = row;
        let score = 0;
        if (mi === 'yes') score += 1;
        if (chf === 'yes') score += 1;
        if (pvd === 'yes') score += 1;
        if (cvd === 'yes') score += 1;
        if (dementia === 'yes') score += 1;
        if (copd === 'yes') score += 1;
        if (ctd === 'yes') score += 1;
        if (pud === 'yes') score += 1;
        if (mild_liver === 'yes') score += 1;
        if (dm_no_complication === 'yes') score += 1;
        if (dm_complication === 'yes') score += 2;
        if (hemiplegia === 'yes') score += 2;
        if (ckd === 'yes') score += 2;
        if (leukemia === 'yes') score += 2;
        if (lymphoma === 'yes') score += 2;
        if (tumor === 'yes') score += 2;
        if (severe_liver === 'yes') score += 3;
        if (metastatic === 'yes') score += 6;
        if (aids === 'yes') score += 6;
        if (age >= 50) score += Math.floor((age - 40) / 10);
        return score;
    }
};
