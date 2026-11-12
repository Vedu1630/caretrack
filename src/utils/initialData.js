export const FEVER_THRESHOLD = 38.0; // Celsius
export const TOTAL_FACILITY_CAPACITY = 74;

export const DEMO_USERS = [
  {
    id: "USR-001",
    name: "Sarah Jenkins, MHA",
    email: "admin@caretrack.com",
    role: "admin",
    roleTitle: "Facility Administrator",
    department: "Operations & Compliance",
    phone: "+1 (555) 019-2831",
    avatar: "SJ"
  },
  {
    id: "USR-002",
    name: "Elena Rostova, RN",
    email: "nurse@caretrack.com",
    role: "nurse",
    roleTitle: "Senior Triage Nurse",
    department: "Quarantine Monitoring Wing",
    phone: "+1 (555) 014-9921",
    avatar: "ER"
  },
  {
    id: "USR-003",
    name: "Dr. Marcus Vance, MD",
    email: "doctor@caretrack.com",
    role: "doctor",
    roleTitle: "Lead Pulmonologist & ID Specialist",
    department: "Clinical Treatment Unit",
    phone: "+1 (555) 018-7742",
    avatar: "MV"
  }
];

// 74 available rooms across 3 dedicated wings
export const ALL_ROOMS = [
  ...Array.from({ length: 25 }, (_, i) => `A-${101 + i}`),
  ...Array.from({ length: 25 }, (_, i) => `B-${201 + i}`),
  ...Array.from({ length: 24 }, (_, i) => `C-${301 + i}`)
];

// Helper to generate past dates
const getDateDaysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
};

export const TODAY_STR = new Date().toISOString().split('T')[0];
export const YESTERDAY_STR = getDateDaysAgo(1);
export const ONE_DAY_AGO = getDateDaysAgo(1);
export const TWO_DAYS_AGO = getDateDaysAgo(2);
export const THREE_DAYS_AGO = getDateDaysAgo(3);
export const FOUR_DAYS_AGO = getDateDaysAgo(4);
export const FIVE_DAYS_AGO = getDateDaysAgo(5);

export const INITIAL_PATIENTS = [
  {
    id: "PT-1001",
    name: "Liam Alexander Chen",
    age: 42,
    gender: "Male",
    phone: "+1 (555) 234-5678",
    roomNumber: "A-101",
    admissionDate: FOUR_DAYS_AGO,
    status: "Admitted", // Admitted, Isolated, Critical, Recovered, Discharged
    severity: "Mild",
    assignedNurse: "Elena Rostova, RN",
    assignedDoctor: "Dr. Marcus Vance, MD",
    feverFreeConsecutiveDays: 3, // Eligible!
    doctorRecommendation: "Recommended", // "Pending" or "Recommended"
    dischargeStatus: "Pending Admin Approval", // "Not Eligible", "Eligible", "Pending Admin Approval", "Discharged"
    notes: "Patient shows sustained clinical recovery; oxygen saturation 99%.",
    temperatureHistory: [
      { id: "th-1001-4", date: FOUR_DAYS_AGO, time: "08:30 AM", temperature: 38.6, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "Mild chills reported upon intake." },
      { id: "th-1001-3", date: THREE_DAYS_AGO, time: "09:00 AM", temperature: 36.8, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Afebrile, appetite returning." },
      { id: "th-1001-2", date: TWO_DAYS_AGO, time: "08:45 AM", temperature: 36.7, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Afebrile, resting well." },
      { id: "th-1001-1", date: YESTERDAY_STR, time: "09:15 AM", temperature: 36.6, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Afebrile, chest clear." },
      { id: "th-1001-0", date: TODAY_STR, time: "08:15 AM", temperature: 36.5, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Day 4 afebrile. Ready for final evaluation." }
    ],
    doctorVisits: [
      { id: "dv-1001-0", date: TODAY_STR, time: "10:30 AM", doctorName: "Dr. Marcus Vance, MD", observation: "Lungs clear bilaterally, vitals stable, afebrile x 4 days.", treatmentNotes: "Discontinue antiviral protocol. Approved clinical discharge recommendation.", status: "Completed" }
    ]
  },
  {
    id: "PT-1002",
    name: "Sophia Maria Rodriguez",
    age: 29,
    gender: "Female",
    phone: "+1 (555) 345-6789",
    roomNumber: "A-102",
    admissionDate: THREE_DAYS_AGO,
    status: "Isolated",
    severity: "Moderate",
    assignedNurse: "Elena Rostova, RN",
    assignedDoctor: "Dr. Marcus Vance, MD",
    feverFreeConsecutiveDays: 0,
    doctorRecommendation: "Pending",
    dischargeStatus: "Not Eligible",
    notes: "Persistent coughing, requires nebulizer support.",
    temperatureHistory: [
      { id: "th-1002-3", date: THREE_DAYS_AGO, time: "09:40 AM", temperature: 38.8, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "High grade fever, administered antipyretic." },
      { id: "th-1002-2", date: TWO_DAYS_AGO, time: "09:10 AM", temperature: 38.3, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "Fever persisting, cough worsens." },
      { id: "th-1002-1", date: YESTERDAY_STR, time: "08:50 AM", temperature: 38.1, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "Fever above threshold." },
      { id: "th-1002-0", date: TODAY_STR, time: "08:30 AM", temperature: 38.4, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "Febrile at 38.4C. Monitoring hourly." }
    ],
    doctorVisits: [
      { id: "dv-1002-0", date: TODAY_STR, time: "11:00 AM", doctorName: "Dr. Marcus Vance, MD", observation: "Coarse rhonchi in lower right lobe. High fever confirmed.", treatmentNotes: "Continue IV hydration, adjust bronchodilator frequency.", status: "Completed" }
    ]
  },
  {
    id: "PT-1003",
    name: "James Arthur Wilson",
    age: 63,
    gender: "Male",
    phone: "+1 (555) 456-7890",
    roomNumber: "A-103",
    admissionDate: FOUR_DAYS_AGO,
    status: "Critical",
    severity: "Severe",
    assignedNurse: "Elena Rostova, RN",
    assignedDoctor: "Dr. Marcus Vance, MD",
    feverFreeConsecutiveDays: 0,
    doctorRecommendation: "Pending",
    dischargeStatus: "Not Eligible",
    notes: "High risk diabetic with pulmonary infiltration.",
    temperatureHistory: [
      { id: "th-1003-3", date: THREE_DAYS_AGO, time: "08:00 AM", temperature: 39.2, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "Spike to 39.2C." },
      { id: "th-1003-2", date: TWO_DAYS_AGO, time: "08:00 AM", temperature: 38.7, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "Administered paracetamol IV." },
      { id: "th-1003-1", date: YESTERDAY_STR, time: "08:10 AM", temperature: 38.5, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "Fever persistent." }
      // Today pending!
    ],
    doctorVisits: [] // Today pending
  },
  {
    id: "PT-1004",
    name: "Amara Grace Okafor",
    age: 34,
    gender: "Female",
    phone: "+1 (555) 567-8901",
    roomNumber: "A-104",
    admissionDate: FOUR_DAYS_AGO,
    status: "Admitted",
    severity: "Mild",
    assignedNurse: "Elena Rostova, RN",
    assignedDoctor: "Dr. Marcus Vance, MD",
    feverFreeConsecutiveDays: 3, // Eligible!
    doctorRecommendation: "Recommended",
    dischargeStatus: "Pending Admin Approval",
    notes: "Completely asymptomatic for past 72 hours.",
    temperatureHistory: [
      { id: "th-1004-3", date: THREE_DAYS_AGO, time: "09:10 AM", temperature: 36.9, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Afebrile." },
      { id: "th-1004-2", date: TWO_DAYS_AGO, time: "08:40 AM", temperature: 36.6, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Afebrile, excellent vitals." },
      { id: "th-1004-1", date: YESTERDAY_STR, time: "09:00 AM", temperature: 36.5, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Afebrile, fully ambulatory." },
      { id: "th-1004-0", date: TODAY_STR, time: "08:20 AM", temperature: 36.4, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Day 3 afebrile confirmed." }
    ],
    doctorVisits: [
      { id: "dv-1004-0", date: TODAY_STR, time: "10:00 AM", doctorName: "Dr. Marcus Vance, MD", observation: "Full recovery evident. Laboratory blood counts normalized.", treatmentNotes: "Recommended for discharge clearance.", status: "Completed" }
    ]
  },
  {
    id: "PT-1005",
    name: "Devon Tyler Miller",
    age: 51,
    gender: "Male",
    phone: "+1 (555) 678-9012",
    roomNumber: "A-105",
    admissionDate: TWO_DAYS_AGO,
    status: "Admitted",
    severity: "Moderate",
    assignedNurse: "Elena Rostova, RN",
    assignedDoctor: "Dr. Marcus Vance, MD",
    feverFreeConsecutiveDays: 1,
    doctorRecommendation: "Pending",
    dischargeStatus: "Not Eligible",
    notes: "Improving steadily, fatigue subsiding.",
    temperatureHistory: [
      { id: "th-1005-2", date: TWO_DAYS_AGO, time: "10:15 AM", temperature: 38.3, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "Initial fever on arrival." },
      { id: "th-1005-1", date: YESTERDAY_STR, time: "09:30 AM", temperature: 37.2, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Temperature subsided." },
      { id: "th-1005-0", date: TODAY_STR, time: "08:45 AM", temperature: 36.9, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Normal reading recorded." }
    ],
    doctorVisits: [] // Awaiting doctor visit today!
  },
  {
    id: "PT-1006",
    name: "Chloe Isabella Nguyen",
    age: 22,
    gender: "Female",
    phone: "+1 (555) 789-0123",
    roomNumber: "B-201",
    admissionDate: THREE_DAYS_AGO,
    status: "Isolated",
    severity: "Moderate",
    assignedNurse: "Elena Rostova, RN",
    assignedDoctor: "Dr. Marcus Vance, MD",
    feverFreeConsecutiveDays: 2,
    doctorRecommendation: "Pending",
    dischargeStatus: "Not Eligible",
    notes: "Needs one more fever-free day to reach eligibility threshold.",
    temperatureHistory: [
      { id: "th-1006-3", date: THREE_DAYS_AGO, time: "11:00 AM", temperature: 38.4, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "Fever on intake." },
      { id: "th-1006-2", date: TWO_DAYS_AGO, time: "09:00 AM", temperature: 37.1, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Fever broke (Day 1 afebrile)." },
      { id: "th-1006-1", date: YESTERDAY_STR, time: "08:50 AM", temperature: 36.8, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Normal reading (Day 2 afebrile)." },
      { id: "th-1006-0", date: TODAY_STR, time: "09:10 AM", temperature: 36.7, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Day 2 afebrile completed." }
    ],
    doctorVisits: [
      { id: "dv-1006-0", date: TODAY_STR, time: "11:45 AM", doctorName: "Dr. Marcus Vance, MD", observation: "Good recovery trajectory. 2 days fever free.", treatmentNotes: "Maintain quarantine. Re-evaluate tomorrow for discharge eligibility.", status: "Completed" }
    ]
  },
  {
    id: "PT-1007",
    name: "Robert Anthony Thorne",
    age: 71,
    gender: "Male",
    phone: "+1 (555) 890-1234",
    roomNumber: "B-202",
    admissionDate: TWO_DAYS_AGO,
    status: "Critical",
    severity: "Severe",
    assignedNurse: "Elena Rostova, RN",
    assignedDoctor: "Dr. Marcus Vance, MD",
    feverFreeConsecutiveDays: 0,
    doctorRecommendation: "Pending",
    dischargeStatus: "Not Eligible",
    notes: "Requires continuous cardiac and pulse oximeter monitoring.",
    temperatureHistory: [
      { id: "th-1007-2", date: TWO_DAYS_AGO, time: "08:00 AM", temperature: 38.9, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "High fever, elevated respiratory rate." },
      { id: "th-1007-1", date: YESTERDAY_STR, time: "08:15 AM", temperature: 38.5, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "Persistent fever." }
      // Today pending!
    ],
    doctorVisits: []
  },
  {
    id: "PT-1008",
    name: "Fatima Zahra Al-Mansoor",
    age: 38,
    gender: "Female",
    phone: "+1 (555) 901-2345",
    roomNumber: "B-203",
    admissionDate: FOUR_DAYS_AGO,
    status: "Admitted",
    severity: "Mild",
    assignedNurse: "Elena Rostova, RN",
    assignedDoctor: "Dr. Marcus Vance, MD",
    feverFreeConsecutiveDays: 2,
    doctorRecommendation: "Pending",
    dischargeStatus: "Not Eligible",
    notes: "Mild intermittent headache; no respiratory distress.",
    temperatureHistory: [
      { id: "th-1008-3", date: THREE_DAYS_AGO, time: "09:00 AM", temperature: 38.2, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "Mild fever." },
      { id: "th-1008-2", date: TWO_DAYS_AGO, time: "08:30 AM", temperature: 36.9, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Afebrile Day 1." },
      { id: "th-1008-1", date: YESTERDAY_STR, time: "08:45 AM", temperature: 36.6, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Afebrile Day 2." }
      // Today pending temp check!
    ],
    doctorVisits: []
  },
  {
    id: "PT-1009",
    name: "Marcus Aurelius Sterling",
    age: 47,
    gender: "Male",
    phone: "+1 (555) 012-3456",
    roomNumber: "B-204",
    admissionDate: FIVE_DAYS_AGO || FOUR_DAYS_AGO,
    status: "Admitted",
    severity: "Mild",
    assignedNurse: "Elena Rostova, RN",
    assignedDoctor: "Dr. Marcus Vance, MD",
    feverFreeConsecutiveDays: 3, // Eligible!
    doctorRecommendation: "Recommended",
    dischargeStatus: "Pending Admin Approval",
    notes: "Viral load undetectable in morning swab.",
    temperatureHistory: [
      { id: "th-1009-3", date: THREE_DAYS_AGO, time: "08:45 AM", temperature: 36.8, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Afebrile Day 1." },
      { id: "th-1009-2", date: TWO_DAYS_AGO, time: "09:15 AM", temperature: 36.7, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Afebrile Day 2." },
      { id: "th-1009-1", date: YESTERDAY_STR, time: "08:50 AM", temperature: 36.5, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Afebrile Day 3." },
      { id: "th-1009-0", date: TODAY_STR, time: "08:05 AM", temperature: 36.6, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Normal reading confirmed." }
    ],
    doctorVisits: [
      { id: "dv-1009-0", date: TODAY_STR, time: "09:30 AM", doctorName: "Dr. Marcus Vance, MD", observation: "All systemic metrics clear. Clinical discharge recommended.", treatmentNotes: "Prepare discharge summary documentation.", status: "Completed" }
    ]
  },
  {
    id: "PT-1010",
    name: "Ananya Priya Patel",
    age: 31,
    gender: "Female",
    phone: "+1 (555) 123-9876",
    roomNumber: "B-205",
    admissionDate: TWO_DAYS_AGO,
    status: "Isolated",
    severity: "Moderate",
    assignedNurse: "Elena Rostova, RN",
    assignedDoctor: "Dr. Marcus Vance, MD",
    feverFreeConsecutiveDays: 0,
    doctorRecommendation: "Pending",
    dischargeStatus: "Not Eligible",
    notes: "Temperature spike yesterday evening.",
    temperatureHistory: [
      { id: "th-1010-2", date: TWO_DAYS_AGO, time: "09:30 AM", temperature: 38.6, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "High temp on admission." },
      { id: "th-1010-1", date: YESTERDAY_STR, time: "09:10 AM", temperature: 38.2, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "Fever continuing." }
      // Today pending!
    ],
    doctorVisits: []
  },
  {
    id: "PT-1011",
    name: "Gabriel Luca Rossi",
    age: 55,
    gender: "Male",
    phone: "+1 (555) 234-8765",
    roomNumber: "C-301",
    admissionDate: THREE_DAYS_AGO,
    status: "Admitted",
    severity: "Mild",
    assignedNurse: "Elena Rostova, RN",
    assignedDoctor: "Dr. Marcus Vance, MD",
    feverFreeConsecutiveDays: 1,
    doctorRecommendation: "Pending",
    dischargeStatus: "Not Eligible",
    notes: "Experiencing mild throat irritation.",
    temperatureHistory: [
      { id: "th-1011-3", date: THREE_DAYS_AGO, time: "10:00 AM", temperature: 38.2, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "Admitted with fever." },
      { id: "th-1011-2", date: TWO_DAYS_AGO, time: "09:30 AM", temperature: 37.9, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Borderline, below fever threshold." },
      { id: "th-1011-1", date: YESTERDAY_STR, time: "09:00 AM", temperature: 38.1, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "Fever recurred, streak reset to 0." },
      { id: "th-1011-0", date: TODAY_STR, time: "09:05 AM", temperature: 37.0, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Afebrile Day 1 after reset." }
    ],
    doctorVisits: [] // Awaiting doctor visit today!
  },
  {
    id: "PT-1012",
    name: "Kavita Sunita Rao",
    age: 49,
    gender: "Female",
    phone: "+1 (555) 345-7654",
    roomNumber: "C-302",
    admissionDate: ONE_DAY_AGO || YESTERDAY_STR,
    status: "Isolated",
    severity: "Moderate",
    assignedNurse: "Elena Rostova, RN",
    assignedDoctor: "Dr. Marcus Vance, MD",
    feverFreeConsecutiveDays: 0,
    doctorRecommendation: "Pending",
    dischargeStatus: "Not Eligible",
    notes: "Recently quarantined from cluster contact.",
    temperatureHistory: [
      { id: "th-1012-1", date: YESTERDAY_STR, time: "02:15 PM", temperature: 38.5, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "Intake reading febrile." }
      // Today pending!
    ],
    doctorVisits: []
  },
  {
    id: "PT-1013",
    name: "Oliver Benjamin Hayes",
    age: 36,
    gender: "Male",
    phone: "+1 (555) 456-6543",
    roomNumber: "C-303",
    admissionDate: FOUR_DAYS_AGO,
    status: "Admitted",
    severity: "Mild",
    assignedNurse: "Elena Rostova, RN",
    assignedDoctor: "Dr. Marcus Vance, MD",
    feverFreeConsecutiveDays: 2,
    doctorRecommendation: "Pending",
    dischargeStatus: "Not Eligible",
    notes: "Awaiting final confirmation lab result.",
    temperatureHistory: [
      { id: "th-1013-3", date: THREE_DAYS_AGO, time: "08:15 AM", temperature: 38.3, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "Fever recorded." },
      { id: "th-1013-2", date: TWO_DAYS_AGO, time: "08:10 AM", temperature: 36.9, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Day 1 afebrile." },
      { id: "th-1013-1", date: YESTERDAY_STR, time: "08:20 AM", temperature: 36.8, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Day 2 afebrile." }
      // Today pending!
    ],
    doctorVisits: []
  },
  {
    id: "PT-1014",
    name: "Hannah Elizabeth Scott",
    age: 27,
    gender: "Female",
    phone: "+1 (555) 567-5432",
    roomNumber: "C-304",
    admissionDate: FOUR_DAYS_AGO,
    status: "Admitted",
    severity: "Mild",
    assignedNurse: "Elena Rostova, RN",
    assignedDoctor: "Dr. Marcus Vance, MD",
    feverFreeConsecutiveDays: 3, // Eligible!
    doctorRecommendation: "Recommended",
    dischargeStatus: "Pending Admin Approval",
    notes: "Patient energetic and asymptomatic. Ready for discharge.",
    temperatureHistory: [
      { id: "th-1014-3", date: THREE_DAYS_AGO, time: "09:10 AM", temperature: 36.8, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Afebrile Day 1." },
      { id: "th-1014-2", date: TWO_DAYS_AGO, time: "09:05 AM", temperature: 36.7, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Afebrile Day 2." },
      { id: "th-1014-1", date: YESTERDAY_STR, time: "08:55 AM", temperature: 36.6, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Afebrile Day 3." },
      { id: "th-1014-0", date: TODAY_STR, time: "08:10 AM", temperature: 36.5, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Sustained normal temp." }
    ],
    doctorVisits: [
      { id: "dv-1014-0", date: TODAY_STR, time: "10:15 AM", doctorName: "Dr. Marcus Vance, MD", observation: "Complete resolution of symptoms. 3+ consecutive fever-free days verified.", treatmentNotes: "Clearance approved. Forwarded to Admin for release processing.", status: "Completed" }
    ]
  },
  {
    id: "PT-1015",
    name: "Tariq Mansoor Evans",
    age: 58,
    gender: "Male",
    phone: "+1 (555) 678-4321",
    roomNumber: "C-305",
    admissionDate: THREE_DAYS_AGO,
    status: "Isolated",
    severity: "Moderate",
    assignedNurse: "Elena Rostova, RN",
    assignedDoctor: "Dr. Marcus Vance, MD",
    feverFreeConsecutiveDays: 0,
    doctorRecommendation: "Pending",
    dischargeStatus: "Not Eligible",
    notes: "Asthmatic, monitoring respiratory wheezing.",
    temperatureHistory: [
      { id: "th-1015-3", date: THREE_DAYS_AGO, time: "08:40 AM", temperature: 38.7, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "Febrile intake." },
      { id: "th-1015-2", date: TWO_DAYS_AGO, time: "08:20 AM", temperature: 38.4, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "Fever." },
      { id: "th-1015-1", date: YESTERDAY_STR, time: "08:30 AM", temperature: 38.2, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "Fever persisting." }
      // Today pending!
    ],
    doctorVisits: []
  },
  {
    id: "PT-1016",
    name: "Zoe Madeleine Dupont",
    age: 33,
    gender: "Female",
    phone: "+1 (555) 789-3210",
    roomNumber: "A-106",
    admissionDate: TWO_DAYS_AGO,
    status: "Admitted",
    severity: "Mild",
    assignedNurse: "Elena Rostova, RN",
    assignedDoctor: "Dr. Marcus Vance, MD",
    feverFreeConsecutiveDays: 1,
    doctorRecommendation: "Pending",
    dischargeStatus: "Not Eligible",
    notes: "Responded well to antiviral medication.",
    temperatureHistory: [
      { id: "th-1016-2", date: TWO_DAYS_AGO, time: "11:20 AM", temperature: 38.3, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "Moderate fever." },
      { id: "th-1016-1", date: YESTERDAY_STR, time: "09:40 AM", temperature: 37.1, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Day 1 afebrile." }
      // Today pending!
    ],
    doctorVisits: []
  },
  {
    id: "PT-1017",
    name: "Ethan Christopher Wright",
    age: 45,
    gender: "Male",
    phone: "+1 (555) 890-2109",
    roomNumber: "A-107",
    admissionDate: FOUR_DAYS_AGO,
    status: "Admitted",
    severity: "Mild",
    assignedNurse: "Elena Rostova, RN",
    assignedDoctor: "Dr. Marcus Vance, MD",
    feverFreeConsecutiveDays: 3, // Eligible!
    doctorRecommendation: "Pending", // 3 days fever free, but doctor hasn't recommended yet! Perfect for Doctor workflow demo
    dischargeStatus: "Eligible",
    notes: "3 consecutive fever-free days recorded; ready for doctor visit review.",
    temperatureHistory: [
      { id: "th-1017-3", date: THREE_DAYS_AGO, time: "09:00 AM", temperature: 36.8, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Afebrile Day 1." },
      { id: "th-1017-2", date: TWO_DAYS_AGO, time: "09:10 AM", temperature: 36.7, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Afebrile Day 2." },
      { id: "th-1017-1", date: YESTERDAY_STR, time: "08:50 AM", temperature: 36.6, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Afebrile Day 3." },
      { id: "th-1017-0", date: TODAY_STR, time: "08:30 AM", temperature: 36.5, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Afebrile Day 4. Nurse verified." }
    ],
    doctorVisits: [] // Awaiting doctor visit & recommendation!
  },
  {
    id: "PT-1018",
    name: "Mei-Ling Zhou",
    age: 52,
    gender: "Female",
    phone: "+1 (555) 901-1098",
    roomNumber: "A-108",
    admissionDate: THREE_DAYS_AGO,
    status: "Isolated",
    severity: "Moderate",
    assignedNurse: "Elena Rostova, RN",
    assignedDoctor: "Dr. Marcus Vance, MD",
    feverFreeConsecutiveDays: 0,
    doctorRecommendation: "Pending",
    dischargeStatus: "Not Eligible",
    notes: "Experiencing loss of taste and moderate fever.",
    temperatureHistory: [
      { id: "th-1018-2", date: TWO_DAYS_AGO, time: "10:00 AM", temperature: 38.5, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "Fever on arrival." },
      { id: "th-1018-1", date: YESTERDAY_STR, time: "09:15 AM", temperature: 38.2, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "Fever persistent." }
      // Today pending!
    ],
    doctorVisits: []
  },
  {
    id: "PT-1019",
    name: "Samuel David Jenkins",
    age: 60,
    gender: "Male",
    phone: "+1 (555) 012-0987",
    roomNumber: "B-206",
    admissionDate: ONE_DAY_AGO || YESTERDAY_STR,
    status: "Isolated",
    severity: "Moderate",
    assignedNurse: "Elena Rostova, RN",
    assignedDoctor: "Dr. Marcus Vance, MD",
    feverFreeConsecutiveDays: 0,
    doctorRecommendation: "Pending",
    dischargeStatus: "Not Eligible",
    notes: "Admitted yesterday. Baseline tests completed.",
    temperatureHistory: [
      { id: "th-1019-1", date: YESTERDAY_STR, time: "04:30 PM", temperature: 38.6, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "Admitted febrile." }
      // Today pending!
    ],
    doctorVisits: []
  },
  {
    id: "PT-1020",
    name: "Nadia Nour Farouk",
    age: 41,
    gender: "Female",
    phone: "+1 (555) 123-8901",
    roomNumber: "B-207",
    admissionDate: THREE_DAYS_AGO,
    status: "Admitted",
    severity: "Mild",
    assignedNurse: "Elena Rostova, RN",
    assignedDoctor: "Dr. Marcus Vance, MD",
    feverFreeConsecutiveDays: 1,
    doctorRecommendation: "Pending",
    dischargeStatus: "Not Eligible",
    notes: "Condition stabilizing nicely.",
    temperatureHistory: [
      { id: "th-1020-3", date: THREE_DAYS_AGO, time: "10:30 AM", temperature: 38.3, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "Fever." },
      { id: "th-1020-2", date: TWO_DAYS_AGO, time: "09:15 AM", temperature: 38.0, status: "Fever", recordedBy: "Elena Rostova, RN", notes: "At threshold (38.0C counts as fever)." },
      { id: "th-1020-1", date: YESTERDAY_STR, time: "08:45 AM", temperature: 37.0, status: "Normal", recordedBy: "Elena Rostova, RN", notes: "Day 1 afebrile." }
      // Today pending!
    ],
    doctorVisits: []
  }
];

// Historical metrics & audit records
export const INITIAL_AUDIT_LOGS = [
  {
    id: "log-1",
    timestamp: `${TODAY_STR} 08:05 AM`,
    action: "TEMPERATURE_RECORDED",
    user: "Elena Rostova, RN",
    role: "nurse",
    details: "Recorded normal temperature 36.6°C for PT-1009 (Room B-204). Consecutive fever-free days: 3."
  },
  {
    id: "log-2",
    timestamp: `${TODAY_STR} 08:15 AM`,
    action: "TEMPERATURE_RECORDED",
    user: "Elena Rostova, RN",
    role: "nurse",
    details: "Recorded normal temperature 36.5°C for PT-1001 (Room A-101)."
  },
  {
    id: "log-3",
    timestamp: `${TODAY_STR} 08:30 AM`,
    action: "FEVER_ALERT",
    user: "Elena Rostova, RN",
    role: "nurse",
    details: "CRITICAL ALERT: High temperature 38.4°C recorded for PT-1002 (Room A-102). Fever streak reset to 0."
  },
  {
    id: "log-4",
    timestamp: `${TODAY_STR} 09:30 AM`,
    action: "DOCTOR_VISIT_COMPLETED",
    user: "Dr. Marcus Vance, MD",
    role: "doctor",
    details: "Completed daily clinical assessment for PT-1009. Recommended patient for discharge."
  },
  {
    id: "log-5",
    timestamp: `${TODAY_STR} 10:00 AM`,
    action: "DISCHARGE_RECOMMENDED",
    user: "Dr. Marcus Vance, MD",
    role: "doctor",
    details: "Formally submitted clinical discharge recommendation for PT-1004 (Room A-104)."
  },
  {
    id: "log-6",
    timestamp: `${TODAY_STR} 10:30 AM`,
    action: "DOCTOR_VISIT_COMPLETED",
    user: "Dr. Marcus Vance, MD",
    role: "doctor",
    details: "Completed visit for PT-1001. Discharge recommendation filed."
  }
];

// Historical statistics for cumulative calculations
// Total admissions = Admitted (active) + Total Recovered + Total Deaths
// If Total Recovered = 48, Total Deaths = 10, Admitted = 20 -> Total Admissions = 78.
// Mortality Rate = (10 / 78) * 100 = 12.8% (below 15% threshold).
// User can simulate / test > 15% easily via analytics toggle or actions.
export const HISTORICAL_STATS = {
  totalHistoricalRecovered: 48,
  totalHistoricalDeaths: 10,
  expectedMortalityRate: 15.0, // 15%
  expectedSuccessRate: 85.0,  // 85%
  benchmarkAdmissionsTarget: 74,
  historicalTrendData: [
    { date: "Oct 28", admissions: 12, recoveries: 8, deaths: 1, occupancy: 62 },
    { date: "Oct 30", admissions: 14, recoveries: 10, deaths: 2, occupancy: 64 },
    { date: "Nov 01", admissions: 16, recoveries: 12, deaths: 1, occupancy: 67 },
    { date: "Nov 03", admissions: 15, recoveries: 14, deaths: 2, occupancy: 66 },
    { date: "Nov 05", admissions: 18, recoveries: 15, deaths: 1, occupancy: 68 },
    { date: "Nov 07", admissions: 14, recoveries: 16, deaths: 1, occupancy: 65 },
    { date: "Nov 09", admissions: 19, recoveries: 18, deaths: 2, occupancy: 71 },
    { date: "Nov 11", admissions: 15, recoveries: 17, deaths: 0, occupancy: 74 },
    { date: "Nov 12 (Today)", admissions: 4, recoveries: 5, deaths: 0, occupancy: 74 }
  ]
};
