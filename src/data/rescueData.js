export const severityWeights = {
  critical: 4,
  high: 3,
  moderate: 2,
  low: 1
};

export const severityLabels = {
  critical: "Rất nghiêm trọng",
  high: "Nghiêm trọng",
  moderate: "Trung bình",
  low: "Giám sát"
};

export const initialIncidents = [
  {
    id: "INC-001",
    name: "Lũ quét Sa Pa",
    region: "Miền Bắc",
    province: "Lào Cai",
    district: "Sa Pa",
    severity: "critical",
    status: "Chưa xử lý",
    reportTime: "2024-04-18T08:30:00+07:00",
    lastUpdate: "2024-04-18T08:30:00+07:00",
    peopleAffected: 420,
    householdsEvacuated: 85,
    resourcesRequired: ["Thuyền cứu hộ", "Bác sĩ dã chiến"],
    infrastructure: ["QL4D", "Trường THPT Sa Pa"],
    description:
      "Lũ quét bất ngờ tại thung lũng Mường Hoa, nhiều hộ dân bị cô lập bởi nước lũ dâng cao.",
    coordinates: {
      top: 14,
      left: 36
    }
  },
  {
    id: "INC-002",
    name: "Sạt lở đất Đà Nẵng",
    region: "Miền Trung",
    province: "Đà Nẵng",
    district: "Hòa Vang",
    severity: "high",
    status: "Đang xử lý",
    reportTime: "2024-04-18T09:05:00+07:00",
    lastUpdate: "2024-04-18T09:45:00+07:00",
    peopleAffected: 180,
    householdsEvacuated: 60,
    resourcesRequired: ["Xe ủi", "Đội cứu hộ núi"],
    infrastructure: ["QL14G"],
    description:
      "Mưa lớn kéo dài gây sạt lở, lấp nhiều đoạn đường lên khu vực miền núi, một số trang trại bị chôn vùi.",
    coordinates: {
      top: 53,
      left: 50
    }
  },
  {
    id: "INC-003",
    name: "Ngập úng Cần Thơ",
    region: "Đồng bằng sông Cửu Long",
    province: "Cần Thơ",
    district: "Ninh Kiều",
    severity: "moderate",
    status: "Đã điều phối",
    reportTime: "2024-04-18T06:15:00+07:00",
    lastUpdate: "2024-04-18T10:10:00+07:00",
    peopleAffected: 320,
    householdsEvacuated: 40,
    resourcesRequired: ["Máy bơm", "Xuồng cao su"],
    infrastructure: ["QL1A", "Cầu Cần Thơ"],
    description:
      "Triều cường kết hợp mưa lớn khiến nhiều tuyến đường chính bị ngập sâu, ảnh hưởng đến giao thông và bệnh viện.",
    coordinates: {
      top: 74,
      left: 44
    }
  },
  {
    id: "INC-004",
    name: "Cháy rừng Nghệ An",
    region: "Miền Trung",
    province: "Nghệ An",
    district: "Nghĩa Đàn",
    severity: "high",
    status: "Đang xử lý",
    reportTime: "2024-04-18T02:25:00+07:00",
    lastUpdate: "2024-04-18T08:55:00+07:00",
    peopleAffected: 65,
    householdsEvacuated: 12,
    resourcesRequired: ["Máy bay chữa cháy", "Đội kiểm lâm"],
    infrastructure: ["Rừng phòng hộ Đông Hiếu"],
    description:
      "Đám cháy bùng phát tại khu vực rừng keo trên diện rộng, nguy cơ lan sang khu dân cư lân cận.",
    coordinates: {
      top: 43,
      left: 47
    }
  },
  {
    id: "INC-005",
    name: "Sạt lở bờ sông An Giang",
    region: "Đồng bằng sông Cửu Long",
    province: "An Giang",
    district: "Châu Phú",
    severity: "moderate",
    status: "Chờ nguồn lực",
    reportTime: "2024-04-17T21:40:00+07:00",
    lastUpdate: "2024-04-18T07:25:00+07:00",
    peopleAffected: 230,
    householdsEvacuated: 28,
    resourcesRequired: ["Rọ đá", "Đội khảo sát địa chất"],
    infrastructure: ["Bờ kè Vàm Nao"],
    description:
      "Sạt lở liên tiếp, uy hiếp 35 hộ dân ven sông; cần bổ sung vật tư gia cố khẩn cấp.",
    coordinates: {
      top: 72,
      left: 40
    }
  },
  {
    id: "INC-006",
    name: "Nhiễm mặn Bến Tre",
    region: "Đồng bằng sông Cửu Long",
    province: "Bến Tre",
    district: "Ba Tri",
    severity: "low",
    status: "Giám sát",
    reportTime: "2024-04-16T14:00:00+07:00",
    lastUpdate: "2024-04-18T08:00:00+07:00",
    peopleAffected: 140,
    householdsEvacuated: 0,
    resourcesRequired: ["Trạm cấp nước lưu động"],
    infrastructure: ["Kênh Ba Tri"],
    description:
      "Xâm nhập mặn tăng cao, ảnh hưởng nguồn nước sinh hoạt tại các xã ven biển.",
    coordinates: {
      top: 78,
      left: 47
    }
  },
  {
    id: "INC-007",
    name: "Mưa đá Hà Giang",
    region: "Miền Bắc",
    province: "Hà Giang",
    district: "Đồng Văn",
    severity: "moderate",
    status: "Đang đánh giá",
    reportTime: "2024-04-18T03:50:00+07:00",
    lastUpdate: "2024-04-18T09:20:00+07:00",
    peopleAffected: 95,
    householdsEvacuated: 5,
    resourcesRequired: ["Vật liệu lợp mái"],
    infrastructure: ["Chợ Đồng Văn"],
    description:
      "Mưa đá gây hư hại nhiều mái nhà và hoa màu, cần đánh giá thiệt hại và hỗ trợ khẩn.",
    coordinates: {
      top: 10,
      left: 39
    }
  },
  {
    id: "INC-008",
    name: "Áp thấp Quảng Ninh",
    region: "Miền Bắc",
    province: "Quảng Ninh",
    district: "Cẩm Phả",
    severity: "high",
    status: "Đang xử lý",
    reportTime: "2024-04-18T04:30:00+07:00",
    lastUpdate: "2024-04-18T10:00:00+07:00",
    peopleAffected: 260,
    householdsEvacuated: 35,
    resourcesRequired: ["Tàu kiểm ngư", "Thiết bị cảnh báo sớm"],
    infrastructure: ["Cảng Cẩm Phả"],
    description:
      "Áp thấp nhiệt đới gây gió mạnh và sóng lớn, cần sơ tán tàu thuyền và hỗ trợ hậu cần.",
    coordinates: {
      top: 14,
      left: 45
    }
  },
  {
    id: "INC-009",
    name: "Sập mỏ Quảng Nam",
    region: "Miền Trung",
    province: "Quảng Nam",
    district: "Phước Sơn",
    severity: "critical",
    status: "Chưa xử lý",
    reportTime: "2024-04-18T07:05:00+07:00",
    lastUpdate: "2024-04-18T07:05:00+07:00",
    peopleAffected: 58,
    householdsEvacuated: 0,
    resourcesRequired: ["Đội cứu hộ hầm lò", "Thiết bị dò tìm"],
    infrastructure: ["Mỏ vàng Bồng Miêu"],
    description:
      "Sập hầm mỏ khiến nhiều công nhân mắc kẹt dưới lòng đất, cần triển khai lực lượng chuyên dụng.",
    coordinates: {
      top: 56,
      left: 52
    }
  },
  {
    id: "INC-010",
    name: "Triều cường Hồ Chí Minh",
    region: "Đông Nam Bộ",
    province: "TP. Hồ Chí Minh",
    district: "Quận 7",
    severity: "high",
    status: "Đã điều phối",
    reportTime: "2024-04-17T19:30:00+07:00",
    lastUpdate: "2024-04-18T06:10:00+07:00",
    peopleAffected: 510,
    householdsEvacuated: 72,
    resourcesRequired: ["Đội ứng phó đô thị", "Máy bơm công suất lớn"],
    infrastructure: ["Đại lộ Nguyễn Văn Linh"],
    description:
      "Triều cường đạt đỉnh kỷ lục, ngập sâu tại nhiều phường vùng trũng cần điều tiết giao thông khẩn.",
    coordinates: {
      top: 70,
      left: 49
    }
  }
];

export const initialResources = [
  {
    id: "RS-01",
    name: "Trung tâm Điều phối Miền Bắc",
    region: "Miền Bắc",
    base: "Hà Nội",
    type: "Chỉ huy vùng",
    availableUnits: 3,
    totalUnits: 4,
    status: "Sẵn sàng",
    avgResponseMinutes: 45,
    specialties: ["Điều phối đa ngành", "Trinh sát đường không"],
    contact: "024-7300-115",
    supportingIncidents: [],
    equipment: ["Trực thăng", "Xe chỉ huy"],
    readiness: 0.9
  },
  {
    id: "RS-02",
    name: "Lữ đoàn Công binh 414",
    region: "Miền Trung",
    base: "Nghệ An",
    type: "Cứu hộ công trình",
    availableUnits: 2,
    totalUnits: 3,
    status: "Đang triển khai",
    avgResponseMinutes: 60,
    specialties: ["Xử lý sạt lở", "Gia cố cầu đường"],
    contact: "0238-383-2222",
    supportingIncidents: ["INC-004"],
    equipment: ["Xe xúc", "Máy khoan"],
    readiness: 0.7
  },
  {
    id: "RS-03",
    name: "Đội phản ứng nhanh Ứng phó Bão lũ",
    region: "Miền Trung",
    base: "Đà Nẵng",
    type: "Tìm kiếm cứu nạn",
    availableUnits: 1,
    totalUnits: 4,
    status: "Đang triển khai",
    avgResponseMinutes: 35,
    specialties: ["Cứu hộ núi", "Sơ cứu nâng cao"],
    contact: "0236-112-115",
    supportingIncidents: ["INC-002"],
    equipment: ["Máy phát điện", "Thiết bị dò tìm"],
    readiness: 0.6
  },
  {
    id: "RS-04",
    name: "Trung tâm cứu hộ Đồng bằng sông Cửu Long",
    region: "Đồng bằng sông Cửu Long",
    base: "Cần Thơ",
    type: "Ứng phó ngập lụt",
    availableUnits: 4,
    totalUnits: 5,
    status: "Sẵn sàng",
    avgResponseMinutes: 30,
    specialties: ["Ứng phó ngập", "Hậu cần"],
    contact: "0292-3838-999",
    supportingIncidents: ["INC-003", "INC-005"],
    equipment: ["Xuồng cao su", "Máy bơm"],
    readiness: 0.85
  },
  {
    id: "RS-05",
    name: "Trung tâm Điều hành Ứng phó TP.HCM",
    region: "Đông Nam Bộ",
    base: "TP. Hồ Chí Minh",
    type: "Điều phối đô thị",
    availableUnits: 2,
    totalUnits: 3,
    status: "Đang triển khai",
    avgResponseMinutes: 25,
    specialties: ["Điều tiết giao thông", "Cấp cứu đô thị"],
    contact: "028-3823-115",
    supportingIncidents: ["INC-010"],
    equipment: ["Máy bơm công suất lớn", "Xe ứng cứu"],
    readiness: 0.75
  },
  {
    id: "RS-06",
    name: "Đội cứu hộ Tây Nguyên",
    region: "Tây Nguyên",
    base: "Gia Lai",
    type: "Phản ứng nhanh",
    availableUnits: 3,
    totalUnits: 3,
    status: "Sẵn sàng",
    avgResponseMinutes: 55,
    specialties: ["Cứu hộ rừng", "Hậu cần dã chiến"],
    contact: "0269-383-8899",
    supportingIncidents: [],
    equipment: ["Xe địa hình", "Thiết bị cắt"],
    readiness: 0.8
  }
];

export const provinceCoordinates = {
  "Lào Cai": { top: 14, left: 36 },
  "Hà Giang": { top: 10, left: 39 },
  "Quảng Ninh": { top: 14, left: 45 },
  "Nghệ An": { top: 43, left: 47 },
  "Đà Nẵng": { top: 53, left: 50 },
  "Quảng Nam": { top: 56, left: 52 },
  "Cần Thơ": { top: 74, left: 44 },
  "An Giang": { top: 72, left: 40 },
  "Bến Tre": { top: 78, left: 47 },
  "TP. Hồ Chí Minh": { top: 70, left: 49 }
};

export const weatherAdvisories = [
  {
    region: "Miền Bắc",
    riskLevel: "Cảnh báo cao",
    summary: "Áp thấp nhiệt đới và mưa đá tiếp diễn tại vùng núi phía Bắc.",
    recommendations: [
      "Duy trì hệ thống cảnh báo sớm tại Quảng Ninh và Hà Giang",
      "Chuẩn bị kế hoạch sơ tán khoảng 2.000 hộ dân ven biển",
      "Kiểm tra tuyến giao thông huyết mạch khu vực biên giới"
    ]
  },
  {
    region: "Miền Trung",
    riskLevel: "Cảnh báo rất cao",
    summary: "Mưa lớn kéo dài, nguy cơ sạt lở tại các huyện miền núi và cháy rừng tại khu vực khô hạn.",
    recommendations: [
      "Huy động bổ sung xe cơ giới xử lý sạt lở",
      "Tăng cường lực lượng kiểm lâm trực 24/7",
      "Thiết lập điểm sơ tán tạm thời cho 1.200 người dân"
    ]
  },
  {
    region: "Nam Bộ",
    riskLevel: "Theo dõi",
    summary: "Triều cường và xâm nhập mặn tiếp tục ảnh hưởng sản xuất nông nghiệp.",
    recommendations: [
      "Vận hành tối đa trạm bơm dã chiến tại Cần Thơ",
      "Bố trí xe bồn cung cấp nước ngọt cho Bến Tre",
      "Cảnh báo khu vực ven sông có nguy cơ sạt lở mới"
    ]
  }
];
