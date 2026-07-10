window.__currentCalculatorConfig = {
    resultLabel: '👶 儿童体表面积 (BSA) · Haycock公式',
    resultUnit: '平方米 (m²)',
    defaultWarning: 'ⓘ 适用于体重3~70kg、身高50~180cm的儿童及青少年。',
    footnote: '📖 BSA = 0.024265 × 体重(kg)^0.5378 × 身高(cm)^0.3964',
    batchWarning: '⚠️ 计算结果保留4位小数，基于Haycock公式，适用于儿童及青少年。',
    resultColumnTitle: 'BSA(m²)',
    
    fields: [
        { name: 'weight', label: '体重 (kg)', type: 'number', default: 15, step: 0.1, placeholder: 'kg' },
        { name: 'height', label: '身高 (cm)', type: 'number', default: 100, step: 0.5, placeholder: 'cm' }
    ],
    
    calculateFn: (params) => {
        const { weight, height } = params;
        if (weight <= 0 || height <= 0) return null;
        return 0.024265 * Math.pow(weight, 0.5378) * Math.pow(height, 0.3964);
    },
    
    customWarning: (params) => {
        const { weight, height } = params;
        if (weight < 3 || weight > 70 || height < 50 || height > 180) {
            return '⚠️ 输入超出推荐范围（体重3~70kg，身高50~180cm），结果仅供参考。';
        }
        return 'ⓘ 适用于体重3~70kg、身高50~180cm的儿童及青少年。';
    },
    
    batchColumns: [
        { title: '体重(kg)', field: 'weight', type: 'number', default: 15, step: 0.1 },
        { title: '身高(cm)', field: 'height', type: 'number', default: 100, step: 0.5 }
    ],
    
    batchCalculateFn: (row) => {
        const { weight, height } = row;
        if (weight <= 0 || height <= 0) return null;
        return 0.024265 * Math.pow(weight, 0.5378) * Math.pow(height, 0.3964);
    }
};