window.__currentCalculatorConfig = {
    resultLabel: '🩸 CRUSADE 出血风险评分',
    resultUnit: '分（1-100分）',
    defaultWarning: 'ⓘ 适用于ACS患者住院期间大出血风险评估。',
    footnote: '📖 CRUSADE = CrCl+血细胞比容+心率+收缩压+性别+心衰+糖尿病+血管疾病史 &nbsp; ≤20极低~≥51极高',
    batchWarning: '⚠️ CrCl需通过Cockcroft-Gault公式计算，使用实际体重。',
    resultColumnTitle: 'CRUSADE(分)',

    fields: [
        { name: 'crcl', label: '肌酐清除率 CrCl (mL/min)', type: 'number', default: 80, step: 1, placeholder: 'mL/min' },
        { name: 'hct', label: '基线血细胞比容 (%)', type: 'number', default: 38, step: 0.5, placeholder: '%' },
        { name: 'heart_rate', label: '心率 (次/分)', type: 'number', default: 80, step: 1, placeholder: 'bpm' },
        { name: 'sbp', label: '收缩压 (mmHg)', type: 'number', default: 130, step: 1, placeholder: 'mmHg' },
        { name: 'sex', label: '性别', type: 'radio', options: [
            { value: 'male', label: '男性', checked: true },
            { value: 'female', label: '女性', checked: false }
        ] },
        { name: 'chf_signs', label: '充血性心力衰竭体征', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'diabetes', label: '糖尿病', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] },
        { name: 'vascular_disease', label: '既往血管疾病或卒中史', type: 'radio', options: [
            { value: 'no', label: '无', checked: true }, { value: 'yes', label: '有', checked: false }
        ] }
    ],

    calculateFn: (params) => {
        const { crcl, hct, heart_rate, sbp, sex, chf_signs, diabetes, vascular_disease } = params;
        let score = 0;

        // CrCl score
        if (crcl <= 15) score += 39;
        else if (crcl <= 30) score += 35;
        else if (crcl <= 60) score += 28;
        else if (crcl <= 90) score += 17;
        else if (crcl <= 120) score += 7;
        else score += 0;

        // Hematocrit score
        if (hct < 31.0) score += 9;
        else if (hct < 34.0) score += 7;
        else if (hct < 37.0) score += 3;
        else if (hct < 40.0) score += 2;
        else score += 0;

        // Heart rate score
        if (heart_rate <= 70) score += 0;
        else if (heart_rate <= 80) score += 1;
        else if (heart_rate <= 90) score += 3;
        else if (heart_rate <= 100) score += 6;
        else if (heart_rate <= 110) score += 8;
        else if (heart_rate <= 120) score += 10;
        else score += 11;

        // SBP score
        if (sbp <= 90) score += 10;
        else if (sbp <= 100) score += 8;
        else if (sbp <= 120) score += 5;
        else if (sbp <= 180) score += 1;
        else if (sbp <= 200) score += 3;
        else score += 5;

        // Sex
        if (sex === 'female') score += 8;

        // CHF signs
        if (chf_signs === 'yes') score += 7;

        // Diabetes
        if (diabetes === 'yes') score += 6;

        // Vascular disease history
        if (vascular_disease === 'yes') score += 6;

        return score;
    },

    customWarning: (params) => {
        return 'ⓘ ≤20极低危(~3.1%)，21-30低危(~5.5%)，31-40中危(~8.6%)，41-50高危(~11.9%)，≥51极高危(~19.5%)。';
    },

    batchColumns: [
        { title: 'CrCl(mL/min)', field: 'crcl', type: 'number', default: 80, step: 1 },
        { title: 'Hct(%)', field: 'hct', type: 'number', default: 38, step: 0.5 },
        { title: '心率(bpm)', field: 'heart_rate', type: 'number', default: 80, step: 1 },
        { title: 'SBP(mmHg)', field: 'sbp', type: 'number', default: 130, step: 1 },
        { title: '性别', field: 'sex', type: 'select', options: [{value:'male',label:'男'},{value:'female',label:'女'}], default: 'male' },
        { title: '心衰体征', field: 'chf_signs', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '糖尿病', field: 'diabetes', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' },
        { title: '血管疾病史', field: 'vascular_disease', type: 'select', options: [{value:'no',label:'无'},{value:'yes',label:'有'}], default: 'no' }
    ],

    batchCalculateFn: (row) => {
        const { crcl, hct, heart_rate, sbp, sex, chf_signs, diabetes, vascular_disease } = row;
        let score = 0;
        if (crcl <= 15) score += 39;
        else if (crcl <= 30) score += 35;
        else if (crcl <= 60) score += 28;
        else if (crcl <= 90) score += 17;
        else if (crcl <= 120) score += 7;
        else score += 0;
        if (hct < 31.0) score += 9;
        else if (hct < 34.0) score += 7;
        else if (hct < 37.0) score += 3;
        else if (hct < 40.0) score += 2;
        else score += 0;
        if (heart_rate <= 70) score += 0;
        else if (heart_rate <= 80) score += 1;
        else if (heart_rate <= 90) score += 3;
        else if (heart_rate <= 100) score += 6;
        else if (heart_rate <= 110) score += 8;
        else if (heart_rate <= 120) score += 10;
        else score += 11;
        if (sbp <= 90) score += 10;
        else if (sbp <= 100) score += 8;
        else if (sbp <= 120) score += 5;
        else if (sbp <= 180) score += 1;
        else if (sbp <= 200) score += 3;
        else score += 5;
        if (sex === 'female') score += 8;
        if (chf_signs === 'yes') score += 7;
        if (diabetes === 'yes') score += 6;
        if (vascular_disease === 'yes') score += 6;
        return score;
    }
};
