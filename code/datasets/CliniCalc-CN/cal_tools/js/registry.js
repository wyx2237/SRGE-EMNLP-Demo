// 计算器注册表
// 每个计算器需要提供 id、名称、图标（可选）、配置文件的路径
window.__calculatorRegistry = [
    {
        id: "c01",
        name: "儿童体表面积 (Haycock公式)",
        icon: "👶",
        description: "适用于3~70kg、50~180cm的儿童及青少年",
        configUrl: "js/01.js"
    },
    {
        id: "c02",
        name: "成人体表面积 (Mosteller公式)",
        icon: "🧍",
        description: "适用于身高120~200cm、体重30~150kg的成人",
        configUrl: "js/02.js"
    },
    {
        id: "c03",
        name: "中国糖尿病无创风险评分 (NCDRS)",
        icon: "🩺",
        description: "适用于20~74岁中国成人，评估2型糖尿病风险",
        configUrl: "js/03.js"
    },
    {
        id: "c04",
        name: "WHO糖尿病诊断标准 (2024)",
        icon: "🩸",
        description: "基于WHO 2024标准判断是否患有糖尿病",
        configUrl: "js/04.js"
    },
    {
        id: "c05",
        name: "GRACE 2.0 缺血风险评分",
        icon: "❤️",
        description: "评估ACS患者院内及远期死亡风险",
        configUrl: "js/05.js"
    },
    {
        id: "c06",
        name: "低钾血症补钾计算 (10%氯化钾)",
        icon: "💉",
        description: "估算成人低钾血症所需10%氯化钾溶液量",
        configUrl: "js/06.js"
    },
    {
        id: "c07",
        name: "内生肌酐清除率 (24小时留尿法)",
        icon: "🧪",
        description: "通过24小时尿液收集计算肌酐清除率",
        configUrl: "js/07.js"
    },
    {
        id: "c08",
        name: "HAS-BLED 出血风险评分",
        icon: "🩸",
        description: "房颤患者口服抗凝治疗的1年大出血风险评估",
        configUrl: "js/08.js"
    },
    {
        id: "c09",
        name: "Shireman 出血风险评分",
        icon: "🧓",
        description: "老年房颤患者华法林90天出血风险评估",
        configUrl: "js/09.js"
    },
    {
        id: "c10",
        name: "VTE-BLEED 出血风险评分",
        icon: "🩸",
        description: "VTE患者稳定抗凝期大出血风险评估",
        configUrl: "js/10.js"
    },
    {
        id: "c11",
        name: "格拉斯哥昏迷评分 (GCS)",
        icon: "🧠",
        description: "评估急性脑损伤及意识障碍的神经功能状态",
        configUrl: "js/11.js"
    },
    {
        id: "c12",
        name: "OPT-CAD 评分",
        icon: "❤️",
        description: "中国冠心病患者最佳抗血小板治疗评分",
        configUrl: "js/12.js"
    },
    {
        id: "c13",
        name: "血脂单位换算",
        icon: "🔄",
        description: "TC/TG/HDL-C/LDL-C在mmol/L与mg/dL之间转换",
        configUrl: "js/13.js"
    },
    {
        id: "c14",
        name: "体脂率估算 (Deurenberg公式)",
        icon: "🧍",
        description: "通过BMI、年龄和性别估算体脂率",
        configUrl: "js/14.js"
    },
    {
        id: "c15",
        name: "查尔森合并症指数 (CCI)",
        icon: "📋",
        description: "19项合并症加权评分，预测10年死亡风险",
        configUrl: "js/15.js"
    },
    {
        id: "c16",
        name: "维持液体计算 (Holliday-Segar)",
        icon: "💧",
        description: "基于体重的儿童每日维持液体需求量估算",
        configUrl: "js/16.js"
    },
    {
        id: "c17",
        name: "ANCA肾脏风险评分 (ARRS)",
        icon: "🔬",
        description: "预测AAGN患者进展至ESRD的风险",
        configUrl: "js/17.js"
    },
    {
        id: "c18",
        name: "血清渗透压估算 (OSMc)",
        icon: "🧪",
        description: "通过血钠、血糖和BUN计算血清渗透压",
        configUrl: "js/18.js"
    },
    {
        id: "c19",
        name: "心瓣膜面积 (Gorlin公式)",
        icon: "🫀",
        description: "通过心导管数据计算狭窄瓣膜开口面积",
        configUrl: "js/19.js"
    },
    {
        id: "c20",
        name: "China-PAR ASCVD风险预测",
        icon: "📊",
        description: "中国人群10年动脉粥样硬化性心血管病风险",
        configUrl: "js/20.js"
    },
    {
        id: "c21",
        name: "CRUSADE 出血风险评分",
        icon: "🩸",
        description: "ACS患者院内大出血风险评估",
        configUrl: "js/21.js"
    },
    {
        id: "c22",
        name: "蛋白质摄入估算 (Maroni公式)",
        icon: "🥩",
        description: "通过尿尿素氮估算每日蛋白质摄入量",
        configUrl: "js/22.js"
    },
    {
        id: "c23",
        name: "Burch-Wartofsky 甲状腺危象评分 (BWPS)",
        icon: "🌡️",
        description: "评估甲状腺毒症患者甲状腺危象严重程度",
        configUrl: "js/23.js"
    },
    {
        id: "c24",
        name: "基础代谢率 (Mifflin-St Jeor公式)",
        icon: "🔥",
        description: "18岁以上健康成人BMR估算",
        configUrl: "js/24.js"
    },
    {
        id: "c25",
        name: "静息能量消耗 (Harris-Benedict公式)",
        icon: "⚡",
        description: "18~60岁健康成年人REE估算",
        configUrl: "js/25.js"
    }
    // 添加新的计算器时，只需在此数组中增加对象即可，无需修改 index.html
];
