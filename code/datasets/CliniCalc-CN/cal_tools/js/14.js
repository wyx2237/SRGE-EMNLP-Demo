window.__currentCalculatorConfig = {
    resultLabel: '🧍 估算体脂率',
    resultUnit: '%',
    defaultWarning: 'ⓘ 适用于普通成年人群，不适用于运动员或儿童。',
    footnote: '📖 体脂率 = 1.20×BMI + 0.23×年龄 - 5.4 - 10.8×性别 &nbsp; (男性=1, 女性=0) ，BMI由身高、体重自动计算。',
    batchWarning: '⚠️ 估算值可能与实际体脂率存在偏差，尤其在肥胖人群和运动员中。',
    resultColumnTitle: '体脂率(%)',

    fields: [
        { name: 'height', label: '身高 (cm)', type: 'number', default: 170, step: 0.5, placeholder: 'cm' },
        { name: 'weight', label: '体重 (kg)', type: 'number', default: 70, step: 0.1, placeholder: 'kg' },
        { name: 'age', label: '年龄 (岁)', type: 'number', default: 40, step: 1, placeholder: '岁' },
        { name: 'sex', label: '性别', type: 'radio', options: [
            { value: 'female', label: '女性', checked: true },
            { value: 'male', label: '男性', checked: false }
        ] }
    ],

    calculateFn: (params) => {
        const { height, weight, age, sex } = params;
        if (height <= 0 || weight <= 0 || age <= 0) return null;
        const bmi = weight / ((height / 100) ** 2);
        const sexVal = sex === 'male' ? 1 : 0;
        return 1.20 * bmi + 0.23 * age - 5.4 - 10.8 * sexVal;
    },

    customWarning: (params) => {
        const { height, weight } = params;
        if (height > 0 && weight > 0) {
            const bmi = weight / ((height / 100) ** 2);
            if (bmi > 40) return '⚠️ BMI>40（重度肥胖），估算误差可能增大。';
        }
        return 'ⓘ 适用于普通成年人群，运动员或极度消瘦者误差较大。';
    },

    batchColumns: [
        { title: '身高(cm)', field: 'height', type: 'number', default: 170, step: 0.5 },
        { title: '体重(kg)', field: 'weight', type: 'number', default: 70, step: 0.1 },
        { title: '年龄(岁)', field: 'age', type: 'number', default: 40, step: 1 },
        { title: '性别', field: 'sex', type: 'select', options: [
            { value: 'female', label: '女' }, { value: 'male', label: '男' }
        ], default: 'female' }
    ],

    batchCalculateFn: (row) => {
        const { height, weight, age, sex } = row;
        if (height <= 0 || weight <= 0 || age <= 0) return null;
        const bmi = weight / ((height / 100) ** 2);
        const sexVal = sex === 'male' ? 1 : 0;
        return 1.20 * bmi + 0.23 * age - 5.4 - 10.8 * sexVal;
    }
};