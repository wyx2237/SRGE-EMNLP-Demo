window.__currentCalculatorConfig = {
    resultLabel: '🔥 基础代谢率 (Mifflin-St Jeor)',
    resultUnit: '千卡/天',
    defaultWarning: 'ⓘ 适用于18岁以上健康成年人，为BMR值，非总能量消耗。',
    footnote: '📖 男: BMR=10W+6.25H-5A+5 &nbsp; 女: BMR=10W+6.25H-5A-161 &nbsp; 再乘活动系数得总消耗',
    batchWarning: '⚠️ 适用于健康成年人，不适用于儿童、孕妇或危重症患者。',
    resultColumnTitle: 'BMR(千卡/天)',

    fields: [
        { name: 'sex', label: '性别', type: 'radio', options: [
            { value: 'female', label: '女性', checked: true },
            { value: 'male', label: '男性', checked: false }
        ] },
        { name: 'weight', label: '体重 (kg)', type: 'number', default: 60, step: 0.1, placeholder: 'kg' },
        { name: 'height', label: '身高 (cm)', type: 'number', default: 165, step: 0.5, placeholder: 'cm' },
        { name: 'age', label: '年龄 (岁)', type: 'number', default: 30, step: 1, placeholder: '岁' }
    ],

    calculateFn: (params) => {
        const { sex, weight, height, age } = params;
        if (weight <= 0 || height <= 0 || age <= 0) return null;
        const base = 10 * weight + 6.25 * height - 5 * age;
        return sex === 'male' ? base + 5 : base - 161;
    },

    customWarning: (params) => {
        const { bmi } = params;
        return 'ⓘ BMR为基础代谢率，实际总消耗需×活动系数（久坐1.2~重度1.725）。';
    },

    batchColumns: [
        { title: '性别', field: 'sex', type: 'select', options: [
            { value: 'female', label: '女' }, { value: 'male', label: '男' }
        ], default: 'female' },
        { title: '体重(kg)', field: 'weight', type: 'number', default: 60, step: 0.1 },
        { title: '身高(cm)', field: 'height', type: 'number', default: 165, step: 0.5 },
        { title: '年龄(岁)', field: 'age', type: 'number', default: 30, step: 1 }
    ],

    batchCalculateFn: (row) => {
        const { sex, weight, height, age } = row;
        if (weight <= 0 || height <= 0 || age <= 0) return null;
        const base = 10 * weight + 6.25 * height - 5 * age;
        return sex === 'male' ? base + 5 : base - 161;
    }
};
