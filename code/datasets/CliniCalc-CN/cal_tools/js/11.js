window.__currentCalculatorConfig = {
    resultLabel: '🧠 格拉斯哥昏迷评分 (GCS)',
    resultUnit: '分（3-15分）',
    defaultWarning: 'ⓘ 用于评估急性脑损伤及意识障碍患者神经功能状态。',
    footnote: '📖 GCS = 睁眼反应(E) + 语言反应(V) + 肢体运动反应(M) &nbsp; 3-8:重度 9-12:中度 13-14:轻度 15:清醒',
    batchWarning: '⚠️ 单次评分不能完全代表病情发展全貌，应动态监测。',
    resultColumnTitle: 'GCS(分)',

    fields: [
        { name: 'eye', label: '睁眼反应 (E)', type: 'radio', options: [
            { value: '4', label: '自然睁眼(4分)', checked: true },
            { value: '3', label: '呼唤睁眼(3分)', checked: false },
            { value: '2', label: '疼痛刺激睁眼(2分)', checked: false },
            { value: '1', label: '无睁眼(1分)', checked: false },
            { value: 'c', label: '无法评估(C)', checked: false }
        ] },
        { name: 'verbal', label: '语言反应 (V)', type: 'radio', options: [
            { value: '5', label: '定向正确(5分)', checked: true },
            { value: '4', label: '回答混乱(4分)', checked: false },
            { value: '3', label: '语无伦次(3分)', checked: false },
            { value: '2', label: '只能发音(2分)', checked: false },
            { value: '1', label: '无语言反应(1分)', checked: false },
            { value: 't', label: '无法评估(T/E/A)', checked: false }
        ] },
        { name: 'motor', label: '肢体运动反应 (M)', type: 'radio', options: [
            { value: '6', label: '遵嘱动作(6分)', checked: true },
            { value: '5', label: '疼痛定位(5分)', checked: false },
            { value: '4', label: '疼痛回避(4分)', checked: false },
            { value: '3', label: '异常屈曲(3分)', checked: false },
            { value: '2', label: '异常伸展(2分)', checked: false },
            { value: '1', label: '无反应(1分)', checked: false }
        ] }
    ],

    // 计算结果：仅累加数字项，返回数字（避免计算错误）
    calculateFn: (params) => {
        const { eye, verbal, motor } = params;
        let sum = 0;
        if (/^\d+$/.test(eye)) sum += parseInt(eye, 10);
        if (/^\d+$/.test(verbal)) sum += parseInt(verbal, 10);
        if (/^\d+$/.test(motor)) sum += parseInt(motor, 10);
        return sum;   // 始终返回数字，无标记字符串
    },

    // 自定义警告：展示有效总分 + 无法评估的标记（如 5+t、8+c）
    customWarning: (params) => {
        const { eye, verbal, motor } = params;
        let sum = 0;
        const markers = [];

        if (/^\d+$/.test(eye)) {
            sum += parseInt(eye, 10);
        } else if (eye === 'c') {
            markers.push('c');
        }

        if (/^\d+$/.test(verbal)) {
            sum += parseInt(verbal, 10);
        } else if (verbal === 't') {
            markers.push('t');
        }

        if (/^\d+$/.test(motor)) {
            sum += parseInt(motor, 10);
        }

        // 构建标记字符串
        let markerStr = '';
        if (markers.length > 0) {
            markerStr = `（无法评估：${markers.join('、')}，有效总分 = ${sum}）`;
        }

        // 特殊情况：所有维度均无法评估
        if (markers.length === 3) {
            return `⚠️ 所有维度均无法评估（c+t），请结合临床判断。`;
        }

        // 根据有效总分给出临床提示
        if (sum >= 3 && sum <= 8) {
            return `⚠️ 重度昏迷（3-8分），需立即干预！ ${markerStr}`;
        }
        if (sum >= 9 && sum <= 12) {
            return `⚠️ 中度意识障碍（9-12分），建议住院观察。 ${markerStr}`;
        }
        if (sum >= 13 && sum <= 14) {
            return `ⓘ 轻度意识障碍（13-14分），密切观察。 ${markerStr}`;
        }
        if (sum === 15) {
            return `ⓘ GCS 15分，意识清醒。 ${markerStr}`;
        }
        // 兜底（例如 sum=0 但并非全标记，理论上不会发生）
        return `📊 有效总分：${sum} ${markerStr}`;
    },

    // 批量评分列配置
    batchColumns: [
        { title: '睁眼反应', field: 'eye', type: 'select', options: [
            { value: '4', label: '自然睁眼' }, { value: '3', label: '呼唤睁眼' },
            { value: '2', label: '疼痛睁眼' }, { value: '1', label: '无睁眼' },
            { value: 'c', label: '无法评估' }
        ], default: '4' },
        { title: '语言反应', field: 'verbal', type: 'select', options: [
            { value: '5', label: '定向正确' }, { value: '4', label: '回答混乱' },
            { value: '3', label: '语无伦次' }, { value: '2', label: '只能发音' },
            { value: '1', label: '无反应' }, { value: 't', label: '无法评估' }
        ], default: '5' },
        { title: '运动反应', field: 'motor', type: 'select', options: [
            { value: '6', label: '遵嘱动作' }, { value: '5', label: '疼痛定位' },
            { value: '4', label: '疼痛回避' }, { value: '3', label: '异常屈曲' },
            { value: '2', label: '异常伸展' }, { value: '1', label: '无反应' }
        ], default: '6' }
    ],

    // 批量计算：同样只返回数字
    batchCalculateFn: (row) => {
        const { eye, verbal, motor } = row;
        let sum = 0;
        if (/^\d+$/.test(eye)) sum += parseInt(eye, 10);
        if (/^\d+$/.test(verbal)) sum += parseInt(verbal, 10);
        if (/^\d+$/.test(motor)) sum += parseInt(motor, 10);
        return sum;
    }
};