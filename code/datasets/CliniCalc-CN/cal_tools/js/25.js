window.__currentCalculatorConfig = {
    resultLabel: '⚡ 静息能量消耗 (REE)',
    resultUnit: '千卡 / 天',
    defaultWarning: 'ⓘ 适用于18~60岁健康人群，仅供参考。',
    footnote: '📖 REE = BEE × 1.1 &nbsp; 男BEE=66+13.7W+5H-6.8A &nbsp; 女BEE=655+9.6W+1.7H-4.7A',
    batchWarning: '⚠️ 计算结果保留4位小数，基于Harris-Benedict公式×1.1。',
    resultColumnTitle: 'REE(千卡/天)',
    
    // 单例字段定义
    fields: [
        { name: 'gender', label: '性别', type: 'radio', options: [
            { value: 'male', label: '男性', checked: true },
            { value: 'female', label: '女性', checked: false }
        ] },
        { name: 'weight', label: '体重 (kg)', type: 'number', default: 70, step: 0.1, placeholder: 'kg' },
        { name: 'height', label: '身高 (cm)', type: 'number', default: 175, step: 0.5, placeholder: 'cm' },
        { name: 'age', label: '年龄 (岁)', type: 'number', default: 30, step: 1, placeholder: '岁' }
    ],
    
    // 单例计算函数
    calculateFn: (params) => {
        const { gender, weight, height, age } = params;
        if (weight <= 0 || height <= 0 || age <= 0) return null;
        let BEE = gender === 'male' 
            ? 66 + 13.7 * weight + 5 * height - 6.8 * age
            : 655 + 9.6 * weight + 1.7 * height - 4.7 * age;
        return BEE * 1.1;
    },
    
    // 自定义警告（可选）
    customWarning: (params) => {
        const { weight, height, age } = params;
        let bmi = weight / ((height/100)**2);
        let warn = '';
        if (age < 18) warn = '⚠️ 适用18岁以上人群，结果可能不准确。';
        else if (age > 80) warn = '⚠️ 高龄人群代谢变化，误差增大。';
        else warn = 'ⓘ 适用于18~60岁健康人群，仅供参考。';
        if (bmi > 40) warn = '⚠️ 严重肥胖(BMI>40)时公式准确性下降。';
        return warn;
    },
    
    // 批量表格列定义（与单例字段对应）
    batchColumns: [
        { title: '性别', field: 'gender', type: 'select', options: [
            { value: 'male', label: '男' },
            { value: 'female', label: '女' }
        ], default: 'male' },
        { title: '体重(kg)', field: 'weight', type: 'number', default: 70, step: 0.1 },
        { title: '身高(cm)', field: 'height', type: 'number', default: 170, step: 0.5 },
        { title: '年龄(岁)', field: 'age', type: 'number', default: 40, step: 1 }
    ],
    
    // 批量计算函数（参数为行对象，返回数值）
    batchCalculateFn: (row) => {
        const { gender, weight, height, age } = row;
        if (weight <= 0 || height <= 0 || age <= 0) return null;
        let BEE = gender === 'male' 
            ? 66 + 13.7 * weight + 5 * height - 6.8 * age
            : 655 + 9.6 * weight + 1.7 * height - 4.7 * age;
        return BEE * 1.1;
    }
};