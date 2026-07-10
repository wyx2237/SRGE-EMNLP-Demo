window.__currentCalculatorConfig = {
    resultLabel: '🩺 中国糖尿病无创风险评分 (NCDRS)',
    resultUnit: '分（≥25为高风险）',
    defaultWarning: 'ⓘ 适用于20~74岁中国成人，总分≥25分提示高风险，建议进一步检查。BMI由身高、体重自动计算。',
    footnote: '📖 NCDRS = 年龄分 + 性别分 + 腰围分 + BMI分 + 收缩压分 + 家族史分（总分0-51分）',
    batchWarning: '⚠️ 评分结果仅供参考，不能替代实验室检查。',
    resultColumnTitle: 'NCDRS(分)',

    fields: [
        { name: 'age', label: '年龄 (岁)', type: 'number', default: 45, step: 1, placeholder: '20-74' },
        { name: 'sex', label: '性别', type: 'radio', options: [
            { value: 'female', label: '女性', checked: true },
            { value: 'male', label: '男性', checked: false }
        ] },
        { name: 'waist', label: '腰围 (cm)', type: 'number', default: 80, step: 0.5, placeholder: 'cm' },
        { name: 'height', label: '身高 (cm)', type: 'number', default: 170, step: 0.5, placeholder: 'cm' },
        { name: 'weight', label: '体重 (kg)', type: 'number', default: 70, step: 0.1, placeholder: 'kg' },
        { name: 'sbp', label: '收缩压 (mmHg)', type: 'number', default: 120, step: 1, placeholder: 'mmHg' },
        { name: 'family_history', label: '糖尿病家族史（一级亲属）', type: 'radio', options: [
            { value: 'no', label: '无', checked: true },
            { value: 'yes', label: '有', checked: false }
        ] }
    ],

    calculateFn: (params) => {
        const { age, sex, waist, height, weight, sbp, family_history } = params;

        // 年龄为必需项，缺失则无法计算
        if (age == null || age <= 0) return null;

        let score = 0;

        // 年龄得分
        if (age >= 20 && age <= 24) score += 0;
        else if (age >= 25 && age <= 34) score += 4;
        else if (age >= 35 && age <= 44) score += 8;
        else if (age >= 45 && age <= 54) score += 11;
        else if (age >= 55 && age <= 64) score += 12;
        else if (age >= 65 && age <= 74) score += 13;

        // 性别得分（缺失时不加分，等同于女性）
        if (sex === 'male') score += 3;

        // 腰围得分（缺失时跳过）
        if (waist != null && waist > 0) {
            if (waist <= 64.9) score += 0;
            else if (waist <= 69.9) score += 3;
            else if (waist <= 74.9) score += 5;
            else if (waist <= 79.9) score += 7;
            else if (waist <= 84.9) score += 8;
            else if (waist <= 89.9) score += 10;
            else score += 11;
        }

        // BMI 计算与得分（身高或体重缺失时跳过）
        if (height != null && height > 0 && weight != null && weight > 0) {
            const bmi = weight / ((height / 100) ** 2);
            if (bmi < 23) score += 0;
            else if (bmi <= 24.9) score += 3;
            else if (bmi <= 29.9) score += 5;
            else score += 6;
        }

        // 收缩压得分（缺失时跳过）
        if (sbp != null && sbp > 0) {
            if (sbp < 110) score += 0;
            else if (sbp <= 119) score += 1;
            else if (sbp <= 129) score += 2;
            else if (sbp <= 139) score += 3;
            else if (sbp <= 149) score += 5;
            else if (sbp <= 159) score += 6;
            else if (sbp <= 169) score += 6;
            else score += 7;
        }

        // 家族史得分（缺失时不加分，等同于无）
        if (family_history === 'yes') score += 7;

        return score;
    },

    customWarning: (params) => {
        const { age, score } = params;
        if (age < 20 || age > 74) return '⚠️ 年龄超出推荐范围（20~74岁），结果仅供参考。';
        return 'ⓘ 适用于20~74岁中国成人，总分≥25分为高风险，建议进一步检查。';
    },

    batchColumns: [
        { title: '年龄(岁)', field: 'age', type: 'number', default: 45, step: 1 },
        { title: '性别', field: 'sex', type: 'select', options: [
            { value: 'female', label: '女' }, { value: 'male', label: '男' }
        ], default: 'female' },
        { title: '腰围(cm)', field: 'waist', type: 'number', default: 80, step: 0.5 },
        { title: '身高(cm)', field: 'height', type: 'number', default: 170, step: 0.5 },
        { title: '体重(kg)', field: 'weight', type: 'number', default: 70, step: 0.1 },
        { title: '收缩压(mmHg)', field: 'sbp', type: 'number', default: 120, step: 1 },
        { title: '家族史', field: 'family_history', type: 'select', options: [
            { value: 'no', label: '无' }, { value: 'yes', label: '有' }
        ], default: 'no' }
    ],

    batchCalculateFn: (row) => {
        const { age, sex, waist, height, weight, sbp, family_history } = row;

        // 年龄为必需项，缺失则无法计算
        if (age == null || age <= 0) return null;

        let score = 0;

        // 年龄得分
        if (age >= 20 && age <= 24) score += 0;
        else if (age >= 25 && age <= 34) score += 4;
        else if (age >= 35 && age <= 44) score += 8;
        else if (age >= 45 && age <= 54) score += 11;
        else if (age >= 55 && age <= 64) score += 12;
        else if (age >= 65 && age <= 74) score += 13;

        // 性别得分（缺失时不加分，等同于女性）
        if (sex === 'male') score += 3;

        // 腰围得分（缺失时跳过）
        if (waist != null && waist > 0) {
            if (waist <= 64.9) score += 0;
            else if (waist <= 69.9) score += 3;
            else if (waist <= 74.9) score += 5;
            else if (waist <= 79.9) score += 7;
            else if (waist <= 84.9) score += 8;
            else if (waist <= 89.9) score += 10;
            else score += 11;
        }

        // BMI 计算与得分（身高或体重缺失时跳过）
        if (height != null && height > 0 && weight != null && weight > 0) {
            const bmi = weight / ((height / 100) ** 2);
            if (bmi < 23) score += 0;
            else if (bmi <= 24.9) score += 3;
            else if (bmi <= 29.9) score += 5;
            else score += 6;
        }

        // 收缩压得分（缺失时跳过）
        if (sbp != null && sbp > 0) {
            if (sbp < 110) score += 0;
            else if (sbp <= 119) score += 1;
            else if (sbp <= 129) score += 2;
            else if (sbp <= 139) score += 3;
            else if (sbp <= 149) score += 5;
            else if (sbp <= 159) score += 6;
            else if (sbp <= 169) score += 6;
            else score += 7;
        }

        // 家族史得分（缺失时不加分，等同于无）
        if (family_history === 'yes') score += 7;

        return score;
    }
};