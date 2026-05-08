const ROLE_CARDS = [
  {
    name: "고정 소득 가구",
    description: "월급이나 연금처럼 소득이 크게 변하지 않는 가구입니다.",
    trait: "물가가 오르면 같은 소득으로 살 수 있는 물건이 줄어들어 생활 부담이 커집니다.",
    advantage: "소득이 안정적이어서 갑작스러운 실직 위험은 비교적 낮습니다.",
    disadvantage: "물가가 오를 때 소득이 바로 오르지 않으면 실질 구매력이 낮아집니다.",
    initialMoney: 100,
    initialStability: 45,
    initialRisk: 5
  },
  {
    name: "자영업자",
    description: "가게를 운영하며 재료비, 임대료, 손님 수 변화에 민감한 경제 주체입니다.",
    trait: "가격을 올릴 수 있지만 손님이 줄면 수입이 불안정해질 수 있습니다.",
    advantage: "상황에 맞추어 가격, 메뉴, 운영 방식을 빠르게 바꿀 수 있습니다.",
    disadvantage: "원가와 임대료가 오르면 부담이 바로 커집니다.",
    initialMoney: 110,
    initialStability: 38,
    initialRisk: 18
  },
  {
    name: "대출자",
    description: "집이나 사업을 위해 돈을 빌려 매달 이자를 갚아야 하는 사람입니다.",
    trait: "물가가 오르면 빚의 실질 부담은 줄 수 있지만 금리 상승에는 취약합니다.",
    advantage: "소득이나 자산 가격이 오르면 빚 부담이 상대적으로 가벼워질 수 있습니다.",
    disadvantage: "금리가 오르면 이자 부담이 커져 예산이 빠르게 줄어듭니다.",
    initialMoney: 95,
    initialStability: 36,
    initialRisk: 25
  },
  {
    name: "예금자",
    description: "은행 예금과 현금을 많이 보유한 사람입니다.",
    trait: "물가가 오르면 돈의 구매력이 낮아질 수 있지만 금리 상승은 도움이 됩니다.",
    advantage: "금리가 오르면 이자 수입을 더 받을 수 있습니다.",
    disadvantage: "물가 상승률이 예금 이자율보다 높으면 실질 자산 가치가 줄어듭니다.",
    initialMoney: 125,
    initialStability: 48,
    initialRisk: 8
  },
  {
    name: "건물 소유자",
    description: "건물이나 토지 같은 실물 자산을 가진 사람입니다.",
    trait: "인플레이션 때 실물 자산 가격이나 임대 수입이 오를 수 있습니다.",
    advantage: "실물 자산은 물가 상승기에 가치가 함께 오르는 경우가 있습니다.",
    disadvantage: "관리비, 세금, 공실 위험이 함께 커질 수 있습니다.",
    initialMoney: 130,
    initialStability: 52,
    initialRisk: 12
  },
  {
    name: "청년 구직자",
    description: "일자리를 찾고 있어 소득이 일정하지 않은 사람입니다.",
    trait: "물가가 오르면 기본 생활비 부담이 커지고 취업 시장 변화에도 영향을 받습니다.",
    advantage: "생활 방식을 유연하게 조정하고 새 기회를 찾을 수 있습니다.",
    disadvantage: "소득이 불안정하면 물가 상승을 버티기 어렵습니다.",
    initialMoney: 80,
    initialStability: 30,
    initialRisk: 28
  },
  {
    name: "중소기업 사장",
    description: "직원을 고용하고 원자재와 임금, 금리 변화에 대응해야 하는 기업가입니다.",
    trait: "비용 상승을 가격에 반영할 수 있지만 판매 감소와 자금 부담이 생길 수 있습니다.",
    advantage: "사업 전략을 잘 바꾸면 매출 기회를 만들 수 있습니다.",
    disadvantage: "금리, 원자재값, 임금이 함께 오르면 위험이 커집니다.",
    initialMoney: 115,
    initialStability: 34,
    initialRisk: 24
  },
  {
    name: "맞벌이 가구",
    description: "두 사람이 소득을 벌지만 돌봄, 교통, 식비 지출도 큰 가구입니다.",
    trait: "소득원이 두 개라 비교적 안정적이지만 생활비 상승을 크게 체감합니다.",
    advantage: "소득원이 분산되어 한쪽 변화에 대한 충격이 작습니다.",
    disadvantage: "교통비, 외식비, 돌봄비가 오르면 지출 압박이 커집니다.",
    initialMoney: 120,
    initialStability: 50,
    initialRisk: 10
  }
];

const ROUNDS = [
  {
    title: "식비 상승",
    rate: "+18%",
    situation: "쌀, 채소, 외식비가 크게 올랐습니다. 한 달 식비 예산을 다시 조정해야 합니다.",
    question: "필수 지출이 오르면 우리 역할은 무엇을 가장 먼저 줄이거나 바꿔야 할까요?",
    teacherNote: "식비는 줄이기 어려운 필수 지출이라는 점을 먼저 짚어 주세요. 고정 소득 가구와 청년 구직자는 같은 가격 상승을 더 크게 체감할 수 있습니다.",
    worksheetPoint: "학습지 4번 표의 1라운드 칸에 선택과 이유를 적고, 5번 표에 예산 변화를 기록하게 하세요.",
    quickDebrief: "핵심 정리: 필수 지출 가격이 오르면 소득이 바로 늘지 않는 사람의 실질 구매력이 먼저 줄어듭니다.",
    explanation: "물가가 상승하면 같은 돈으로 살 수 있는 상품의 양이 줄어듭니다. 특히 식비처럼 꼭 필요한 지출이 오르면 소득이 바로 늘지 않는 가구의 생활 부담이 커집니다.",
    choices: [
      { id: "essential", label: "필수 지출만 남기고 소비 줄이기", hint: "예산 방어에 유리하지만 생활 만족도는 내려갈 수 있습니다.", effect: { scoreChange: 6, moneyChange: 8, stabilityChange: -4, riskChange: -5 } },
      { id: "bulk", label: "공동 구매와 집밥 늘리기", hint: "협력으로 지출을 낮추고 안정도도 지킵니다.", effect: { scoreChange: 8, moneyChange: 5, stabilityChange: 3, riskChange: -4 } },
      { id: "income", label: "부업·추가 소득 찾기", hint: "예산은 늘지만 피로와 불확실성도 커집니다.", effect: { scoreChange: 7, moneyChange: 12, stabilityChange: -2, riskChange: 5 } },
      { id: "maintain", label: "기존 소비 유지하기", hint: "만족도는 유지되지만 예산 압박이 커집니다.", effect: { scoreChange: -2, moneyChange: -15, stabilityChange: 2, riskChange: 8 } }
    ],
    roleAdjustments: {
      "고정 소득 가구": { essential: { scoreChange: 2, riskChange: -2 }, maintain: { moneyChange: -5, riskChange: 4 } },
      "맞벌이 가구": { bulk: { stabilityChange: 2 }, income: { riskChange: -2 } },
      "청년 구직자": { income: { scoreChange: 3, moneyChange: 4, riskChange: 2 } },
      "자영업자": { maintain: { moneyChange: -3 }, bulk: { scoreChange: 2 } }
    }
  },
  {
    title: "교통비·에너지 비용 상승",
    rate: "+12%",
    situation: "전기요금, 난방비, 대중교통 요금이 인상되었습니다. 생활비 부담이 커졌습니다.",
    question: "전기·난방·교통처럼 매달 나가는 비용이 오르면 어떤 선택이 가장 현실적일까요?",
    teacherNote: "가계뿐 아니라 기업도 에너지와 교통 비용의 영향을 받는다는 점을 연결해 주세요. 절약, 가격 인상, 소비 연기는 모두 장단점이 있습니다.",
    worksheetPoint: "학습지 4번 표의 2라운드 칸에 비용 상승이 누구에게 더 부담인지 한 문장으로 쓰게 하세요.",
    quickDebrief: "핵심 정리: 매달 반복되는 비용이 오르면 소비 여력이 줄고, 가계와 기업 모두 지출 우선순위를 다시 정해야 합니다.",
    explanation: "에너지와 교통비는 많은 가구와 기업이 매달 지출하는 기본 비용입니다. 이런 비용이 오르면 가처분 소득이 줄고 소비 선택을 조정해야 합니다.",
    choices: [
      { id: "saveEnergy", label: "에너지 절약 계획 세우기", hint: "생활은 조금 불편하지만 위험을 낮춥니다.", effect: { scoreChange: 8, moneyChange: 7, stabilityChange: -2, riskChange: -6 } },
      { id: "delay", label: "큰 소비를 다음 달로 미루기", hint: "예산을 확보하고 급한 지출을 줄입니다.", effect: { scoreChange: 6, moneyChange: 10, stabilityChange: -3, riskChange: -3 } },
      { id: "raisePrice", label: "가격이나 임금을 올리려고 시도하기", hint: "성공하면 좋지만 상대방의 반응이 변수입니다.", effect: { scoreChange: 5, moneyChange: 11, stabilityChange: -1, riskChange: 7 } },
      { id: "reserve", label: "예비비를 유지하고 지출 점검하기", hint: "큰 변화는 없지만 안정성을 지킵니다.", effect: { scoreChange: 7, moneyChange: 2, stabilityChange: 5, riskChange: -4 } }
    ],
    roleAdjustments: {
      "자영업자": { raisePrice: { scoreChange: 3, riskChange: 2 }, saveEnergy: { moneyChange: 3 } },
      "중소기업 사장": { saveEnergy: { scoreChange: 3, moneyChange: 5 }, raisePrice: { moneyChange: 4, riskChange: 3 } },
      "맞벌이 가구": { delay: { scoreChange: 2, stabilityChange: 1 } },
      "청년 구직자": { reserve: { stabilityChange: 2 }, raisePrice: { scoreChange: -2, moneyChange: -4 } }
    }
  },
  {
    title: "금리 상승",
    rate: "+1.5%p",
    situation: "물가를 잡기 위해 금리가 올랐습니다. 대출 이자와 예금 이자가 함께 변했습니다.",
    question: "금리가 오를 때 대출자와 예금자는 왜 서로 다른 영향을 받을까요?",
    teacherNote: "금리 상승은 물가를 잡기 위한 정책 수단이지만, 대출자에게는 비용 증가, 예금자에게는 이자 수입 증가로 작용할 수 있음을 비교해 주세요.",
    worksheetPoint: "학습지 생각해 보기 3번과 연결해 대출자와 예금자의 차이를 정리하게 하세요.",
    quickDebrief: "핵심 정리: 금리 상승은 대출자에게 부담, 예금자에게 기회가 될 수 있어 같은 정책도 효과가 다르게 나타납니다.",
    explanation: "금리가 오르면 대출 이자를 내는 사람은 부담이 커질 수 있지만, 예금을 가진 사람은 이자를 더 받을 수 있습니다. 물가 대책은 경제 주체마다 다른 효과를 냅니다.",
    choices: [
      { id: "repay", label: "대출 조기 상환하기", hint: "당장 예산은 줄지만 앞으로의 위험을 낮춥니다.", effect: { scoreChange: 7, moneyChange: -8, stabilityChange: 4, riskChange: -10 } },
      { id: "deposit", label: "저축 또는 예비비 유지하기", hint: "높아진 이자를 활용하고 안정감을 얻습니다.", effect: { scoreChange: 8, moneyChange: 5, stabilityChange: 5, riskChange: -4 } },
      { id: "invest", label: "투자 확대하기", hint: "수익 기회가 있지만 변동성이 큽니다.", effect: { scoreChange: 2, moneyChange: 10, stabilityChange: -6, riskChange: 12 } },
      { id: "consumeNow", label: "가격이 더 오르기 전 미리 사기", hint: "필요한 물건은 확보하지만 현금이 줄어듭니다.", effect: { scoreChange: 3, moneyChange: -10, stabilityChange: 1, riskChange: 5 } }
    ],
    roleAdjustments: {
      "대출자": { repay: { scoreChange: 6, stabilityChange: 3, riskChange: -6 }, deposit: { moneyChange: -4 }, invest: { riskChange: 5 } },
      "예금자": { deposit: { scoreChange: 7, moneyChange: 8, stabilityChange: 3 }, invest: { scoreChange: -2 } },
      "건물 소유자": { invest: { scoreChange: 3, riskChange: -2 }, repay: { moneyChange: -3 } },
      "중소기업 사장": { repay: { scoreChange: 2, riskChange: -4 }, invest: { riskChange: 6 } }
    }
  },
  {
    title: "임대료 상승",
    rate: "+15%",
    situation: "상가와 주거 임대료가 올랐습니다. 자영업자와 세입자의 부담이 커졌습니다.",
    question: "임대료 상승은 누구에게 부담이고 누구에게 기회가 될 수 있을까요?",
    teacherNote: "임대료 상승은 세입자와 자영업자에게 비용 상승이지만 건물 소유자에게는 수입 증가일 수 있습니다. 분배 효과를 강조하기 좋은 라운드입니다.",
    worksheetPoint: "학습지 6번 4번 문항과 연결해 같은 물가 상승이 왜 다르게 작용하는지 쓰게 하세요.",
    quickDebrief: "핵심 정리: 임대료 상승은 세입자와 자영업자에게 비용이지만, 건물 소유자에게는 수입 증가가 될 수 있습니다.",
    explanation: "임대료 상승은 주거비와 영업 비용을 높입니다. 건물 소유자는 임대 수입이 늘 수 있지만, 세입자나 가게를 운영하는 사람은 부담이 커질 수 있습니다.",
    choices: [
      { id: "negotiate", label: "임대료 조정 협상하기", hint: "성공하면 부담을 줄이지만 시간이 걸립니다.", effect: { scoreChange: 7, moneyChange: 4, stabilityChange: 2, riskChange: -3 } },
      { id: "move", label: "더 저렴한 곳으로 옮기기", hint: "장기 비용은 줄지만 당장은 불안정합니다.", effect: { scoreChange: 5, moneyChange: 8, stabilityChange: -8, riskChange: -2 } },
      { id: "share", label: "공간·비용을 나누어 쓰기", hint: "협력으로 지출을 낮추고 위험을 분산합니다.", effect: { scoreChange: 9, moneyChange: 6, stabilityChange: 2, riskChange: -6 } },
      { id: "raiseRent", label: "임대 수입이나 판매 가격 올리기", hint: "수입은 늘 수 있지만 갈등과 수요 감소 위험이 있습니다.", effect: { scoreChange: 4, moneyChange: 13, stabilityChange: -3, riskChange: 8 } }
    ],
    roleAdjustments: {
      "건물 소유자": { raiseRent: { scoreChange: 6, moneyChange: 8, riskChange: 2 }, negotiate: { scoreChange: -1 } },
      "자영업자": { negotiate: { scoreChange: 4, riskChange: -3 }, share: { scoreChange: 3 }, raiseRent: { riskChange: 5 } },
      "청년 구직자": { move: { moneyChange: 4, stabilityChange: -2 }, share: { stabilityChange: 3 } },
      "고정 소득 가구": { share: { scoreChange: 2, riskChange: -2 }, raiseRent: { scoreChange: -3, moneyChange: -6 } }
    }
  },
  {
    title: "생활 물가 장기 상승",
    rate: "+9%",
    situation: "물가 상승이 장기화되어 소비 심리가 위축되고, 가계와 기업 모두 신중해졌습니다.",
    question: "물가 상승이 길어질수록 단기 절약과 미래 준비 중 무엇이 더 중요할까요?",
    teacherNote: "마지막 라운드에서는 단순히 돈을 많이 남기는 것보다 안정도와 위험도를 함께 보게 해 주세요. 장기 인플레이션은 생활 수준과 미래 선택까지 바꿉니다.",
    worksheetPoint: "학습지 7번 수업 정리 문장을 완성하고, 오늘 알게 된 점을 한 문장으로 쓰게 하세요.",
    quickDebrief: "핵심 정리: 장기 인플레이션에서는 예산뿐 아니라 안정도, 위험도, 미래 준비까지 함께 고려해야 합니다.",
    explanation: "물가 상승은 모든 사람에게 똑같이 작용하지 않습니다. 소득 구조, 자산 형태, 빚의 유무에 따라 유리함과 불리함이 달라지고 소비, 저축, 투자 선택도 달라집니다.",
    choices: [
      { id: "budgetPlan", label: "한 달 예산표를 다시 짜기", hint: "지출 우선순위를 정해 안정적으로 대응합니다.", effect: { scoreChange: 10, moneyChange: 6, stabilityChange: 7, riskChange: -7 } },
      { id: "skill", label: "새 기술·일자리 기회 찾기", hint: "미래 소득을 키우지만 준비 비용이 듭니다.", effect: { scoreChange: 8, moneyChange: -3, stabilityChange: 2, riskChange: -2 } },
      { id: "cutTooMuch", label: "모든 소비를 과하게 줄이기", hint: "돈은 남지만 생활 만족과 경기에는 부담입니다.", effect: { scoreChange: 1, moneyChange: 14, stabilityChange: -10, riskChange: 2 } },
      { id: "asset", label: "실물 자산 중심으로 대응하기", hint: "인플레이션 방어를 노리지만 자금과 위험이 큽니다.", effect: { scoreChange: 5, moneyChange: -6, stabilityChange: -2, riskChange: 9 } }
    ],
    roleAdjustments: {
      "고정 소득 가구": { budgetPlan: { scoreChange: 4, stabilityChange: 3 }, cutTooMuch: { stabilityChange: -4 } },
      "청년 구직자": { skill: { scoreChange: 7, moneyChange: 4, stabilityChange: 3 }, asset: { scoreChange: -2, riskChange: 4 } },
      "건물 소유자": { asset: { scoreChange: 6, moneyChange: 6, riskChange: -2 } },
      "예금자": { budgetPlan: { scoreChange: 2 }, asset: { scoreChange: 2, riskChange: 3 } },
      "중소기업 사장": { skill: { scoreChange: 4, stabilityChange: 2 }, cutTooMuch: { moneyChange: -4 } }
    }
  }
];
