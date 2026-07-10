window.__currentCalculatorConfig = {
    resultLabel: '体表面积 (BSA)',
    resultUnit: 'm²',
    defaultWarning: 'ⓘ 适用于身高120~200 cm、体重30~150 kg的成人（18岁及以上），仅供参考。',
    footnote: '📖 BSA(m²) = √(身高(cm) × 体重(kg) / 3600) &nbsp; (Mosteller公式)',
    batchWarning: '⚠️ 批量计算结果保留4位小数，基于Mosteller公式，仅需身高和体重。',
    resultColumnTitle: 'BSA(m²)',
    
    // 单例字段定义（无需性别和年龄，仅身高体重）
    fields: [
        { name: 'height', label: '身高 (cm)', type: 'number', default: 170, step: 0.5, placeholder: 'cm' },
        { name: 'weight', label: '体重 (kg)', type: 'number', default: 65, step: 0.1, placeholder: 'kg' }
    ],
    
    // 单例计算函数：BSA = sqrt(身高×体重/3600)
    calculateFn: (params) => {
        const { height, weight } = params;
        if (height <= 0 || weight <= 0) return null;
        return Math.sqrt(height * weight / 3600);
    },
    
    // 动态警告：检查适用范围、BMI极端情况
    customWarning: (params) => {
        const { height, weight } = params;
        if (height <= 0 || weight <= 0) {
            return '⚠️ 身高和体重必须为正数，无法计算。';
        }
        
        let warnings = [];
        const bmi = weight / ((height / 100) ** 2);
        
        if (height < 120 || height > 200) {
            warnings.push(`身高${height}cm超出推荐范围(120~200cm)`);
        }
        if (weight < 30 || weight > 150) {
            warnings.push(`体重${weight}kg超出推荐范围(30~150kg)`);
        }
        if (bmi < 15) {
            warnings.push(`BMI=${bmi.toFixed(1)} <15 (严重消瘦)，估算误差可能增大。`);
        } else if (bmi > 40) {
            warnings.push(`BMI=${bmi.toFixed(1)} >40 (重度肥胖)，估算误差可能增大。`);
        }
        
        if (warnings.length > 0) {
            return '⚠️ ' + warnings.join('；');
        }
        
        return 'ⓘ 适用于身高120~200 cm、体重30~150 kg的成人(18岁及以上)，仅供参考。';
    },
    
    // 批量表格列定义（与单例字段对应，无需性别）
    batchColumns: [
        { title: '身高(cm)', field: 'height', type: 'number', default: 170, step: 0.5 },
        { title: '体重(kg)', field: 'weight', type: 'number', default: 65, step: 0.1 }
    ],
    
    // 批量计算函数：每行数据计算BSA
    batchCalculateFn: (row) => {
        const { height, weight } = row;
        if (height <= 0 || weight <= 0) return null;
        return Math.sqrt(height * weight / 3600);
    }
};