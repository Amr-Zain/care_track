

const specializations = [
    { "id": 1, "label": "Cardiology", "value": "Cardiology" },
    { "id": 2, "label": "Dermatology", "value": "Dermatology" },
    { "id": 3, "label": "Pediatrics", "value": "Pediatrics" },
    { "id": 4, "label": "Orthopedics", "value": "Orthopedics" },
    { "id": 5, "label": "Neurology", "value": "Neurology" },
    { "id": 6, "label": "Ophthalmology", "value": "Ophthalmology" },
    { "id": 7, "label": "Obstetrics and Gynecology", "value": "Obstetrics and Gynecology" },
    { "id": 8, "label": "Psychiatry", "value": "Psychiatry" },
    { "id": 9, "label": "General Surgery", "value": "General Surgery" },
    { "id": 10, "label": "Internal Medicine", "value": "Internal Medicine" },
    { "id": 11, "label": "Anesthesiology", "value": "Anesthesiology" },
    { "id": 12, "label": "Radiology", "value": "Radiology" },
    { "id": 13, "label": "Urology", "value": "Urology" },
    { "id": 14, "label": "Oncology", "value": "Oncology" },
    { "id": 15, "label": "Pulmonology", "value": "Pulmonology" },
    { "id": 16, "label": "Gastroenterology", "value": "Gastroenterology" },
    { "id": 17, "label": "Endocrinology", "value": "Endocrinology" },
    { "id": 18, "label": "Nephrology", "value": "Nephrology" },
    { "id": 19, "label": "Otolaryngology (ENT)", "value": "Otolaryngology (ENT)" },
    { "id": 20, "label": "Rheumatology", "value": "Rheumatology" },
    { "id": 21, "label": "Hematology", "value": "Hematology" },
    { "id": 22, "label": "Allergy and Immunology", "value": "Allergy and Immunology" },
    { "id": 23, "label": "Infectious Disease", "value": "Infectious Disease" },
    { "id": 24, "label": "Physical Medicine and Rehabilitation", "value": "Physical Medicine and Rehabilitation" },
    { "id": 25, "label": "Emergency Medicine", "value": "Emergency Medicine" },
    { "id": 26, "label": "Pathology", "value": "Pathology" },
    { "id": 27, "label": "Plastic Surgery", "value": "Plastic Surgery" },
    { "id": 28, "label": "Thoracic Surgery", "value": "Thoracic Surgery" },
    { "id": 29, "label": "Vascular Surgery", "value": "Vascular Surgery" },
    { "id": 30, "label": "Dentistry", "value": "Dentistry" }
  ]
const userTypeOptions = [
    { label: 'Patient', value: 'patient' },
    { label: 'Doctor', value: 'doctor' },
    { label: 'Nurse', value: 'nurse' },
];
const bloodTypes = [
    {id:1,value:'A+',label:'A+'},
    {id:2,value:'A-',label:'A-'},
    {id:3,value:'B+',label:'B+'},
    {id:4,value:'B-',label:'B-'},
    {id:5,value:'O+',label:'O+'},
    {id:6,value:'O-',label:'O-'},
    {id:7,value:'AB+',label:'AB+'},
    {id:8,value:'AB-',label:'AB-'},
    
]
const searchTypes = [
    {id:1,value:'doctor',label:'Doctor'},
    {id:2,value:'nurse',label:'Nurse'},
    {id:3,value:'donator',label:'Blood Donator'},
    {id:4,value:'donation_request',label:'Blood Request'},
]


const cities = [
    { "id": 0, "label": "All", "value": "All" },
    { "id": 1, "label": "Cairo", "value": "Cairo" },
    { "id": 2, "label": "Alexandria", "value": "Alexandria" },
    { "id": 3, "label": "Giza", "value": "Giza" },
    { "id": 4, "label": "6th of October City", "value": "6th of October City" },
    { "id": 5, "label": "Port Said", "value": "Port Said" },
    { "id": 6, "label": "Suez", "value": "Suez" },
    { "id": 7, "label": "Luxor", "value": "Luxor" },
    { "id": 8, "label": "Asyut", "value": "Asyut" },
    { "id": 9, "label": "Mansoura", "value": "Mansoura" },
    { "id": 10, "label": "Tanta", "value": "Tanta" },
    { "id": 11, "label": "Zagazig", "value": "Zagazig" },
    { "id": 12, "label": "Faiyum", "value": "Faiyum" },
    { "id": 13, "label": "Ismailia", "value": "Ismailia" },
    { "id": 14, "label": "Aswan", "value": "Aswan" },
    { "id": 15, "label": "Minya", "value": "Minya" },
    { "id": 16, "label": "Hurghada", "value": "Hurghada" },
    { "id": 17, "label": "Shubra El-Kheima", "value": "Shubra El-Kheima" },
    { "id": 18, "label": "Qena", "value": "Qena" },
    { "id": 19, "label": "Sohag", "value": "Sohag" },
    { "id": 20, "label": "Banha", "value": "Banha" }
  ]

const days = [
    { label: "Sunday", value: 0 },
    { label: "Monday", value: 1 },
    { label: "Tuesday", value: 2 },
    { label: "Wednesday", value: 3 },
    { label: "Thursday", value: 4 },
    { label: "Friday", value: 5 },
    { label: "Saturday", value: 6 }
];



export { specializations, bloodTypes, cities, searchTypes, userTypeOptions,days }