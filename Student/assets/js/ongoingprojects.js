/* ============================================================
   STAGE DATA & STATE MANAGEMENT
   ============================================================ */
const stages = [
    { 
        id: 1, 
        name: 'Idea Generation', 
        status: 'completed', 
        description: 'Submit your approved project title.',
        startDate: '05 Jan 2025',
        endDate: '15 Jan 2025',
        daysRemaining: 'Completed',
        tasks: [
            'Formulate core project idea and scope',
            'Search for existing literature and patents',
            'Identify target users and problem statement',
            'Submit ideas to project coordinator'
        ]
    },
    { 
        id: 2, 
        name: 'Project Proposal', 
        status: 'completed', 
        description: 'Provide a concise abstract.',
        startDate: '20 Jan 2025',
        endDate: '10 Feb 2025',
        daysRemaining: 'Completed',
        tasks: [
            'Write project abstract and key milestones',
            'Define scope, objectives, and deliverables',
            'Detail initial hardware & software requirements',
            'Acquire guide/advisor approval and submit proposal'
        ]
    },
    { 
        id: 3, 
        name: 'Design & Analysis', 
        status: 'current', 
        description: 'Design the overall system architecture and analyze feasibility.',
        startDate: '28 May 2025',
        endDate: '15 Jun 2025',
        daysRemaining: '18 Days',
        tasks: [
            'Prepare system design documents',
            'Create diagrams and models (block diagrams, UML, schematics)',
            'Analyze feasibility and requirements',
            'Upload all required documents',
            'Submit for faculty review'
        ]
    },
    { 
        id: 4, 
        name: 'Prototype Development', 
        status: 'upcoming', 
        description: 'Build the first working prototype.',
        startDate: '20 Jun 2025',
        endDate: '15 Jul 2025',
        daysRemaining: 'Locked',
        tasks: [
            'Procure components from lab inventory',
            'Breadboard circuit connections and verify logic',
            'Write base code/firmware modules',
            'Assemble initial physical/digital prototype',
            'Test basic functionality of components'
        ]
    },
    { 
        id: 5, 
        name: 'Testing & Validation', 
        status: 'upcoming', 
        description: 'Validate the prototype and test functionality.',
        startDate: '20 Jul 2025',
        endDate: '05 Aug 2025',
        daysRemaining: 'Locked',
        tasks: [
            'Define test cases and target parameters',
            'Perform dry runs and record operation data',
            'Identify system bottlenecks and debug issues',
            'Validate performance against initial scope requirements'
        ]
    },
    { 
        id: 6, 
        name: 'Integration', 
        status: 'upcoming', 
        description: 'Integrate modules and subsystems.',
        startDate: '10 Aug 2025',
        endDate: '25 Aug 2025',
        daysRemaining: 'Locked',
        tasks: [
            'Connect all independent subsystems together',
            'Resolve physical, electrical, and signal interface issues',
            'Optimize power consumption and component placement',
            'Develop user interface / dashboard connection'
        ]
    },
    { 
        id: 7, 
        name: 'Final Testing', 
        status: 'upcoming', 
        description: 'Perform full system testing.',
        startDate: '01 Sep 2025',
        endDate: '15 Sep 2025',
        daysRemaining: 'Locked',
        tasks: [
            'Run complete system end-to-end simulation/tests',
            'Perform stress, load, and durability testing',
            'Obtain beta tester feedback if applicable',
            'Finalize safety mechanisms and physical enclosure parameters'
        ]
    },
    { 
        id: 8, 
        name: 'Documentation', 
        status: 'upcoming', 
        description: 'Prepare final documentation and reports.',
        startDate: '20 Sep 2025',
        endDate: '10 Oct 2025',
        daysRemaining: 'Locked',
        tasks: [
            'Draft comprehensive technical project report',
            'Create user manual and operating instructions guide',
            'Prepare final wiring diagrams and code repositories',
            'Submit documentation draft for guide review and comments'
        ]
    },
    { 
        id: 9, 
        name: 'Review & Approval', 
        status: 'upcoming', 
        description: 'Submit for final review and approval.',
        startDate: '15 Oct 2025',
        endDate: '30 Oct 2025',
        daysRemaining: 'Locked',
        tasks: [
            'Present working demonstration to the faculty panel',
            'Submit final project report files',
            'Address corrections and improvements recommended by panel',
            'Receive formal project sign-off from advisor'
        ]
    },
    { 
        id: 10, 
        name: 'Final Submission', 
        status: 'upcoming', 
        description: 'Deliver the final project submission.',
        startDate: '05 Nov 2025',
        endDate: '15 Nov 2025',
        daysRemaining: 'Locked',
        tasks: [
            'Upload finalized project bundle (code, report, manual)',
            'Submit project poster and abstract details',
            'Deliver physical hardware/prototype to laboratory',
            'Complete graduate project feedback survey'
        ]
    }
];


const stageTrackerState = {
    currentStageId: 3,
    currentStageName: 'Design & Analysis',
    currentStageStatus: 'In Progress',
    currentStageSummary: 'Create the system design, architecture and analyze feasibility for the proposed solution.',
    currentStageStartDate: '28 May 2025',
    currentStageEndDate: '15 Jun 2025',
    daysRemaining: '18 Days',
    versionHistory: [
        {
            label: 'Version 2 (Latest)',
            status: 'Approved',
            statusClass: 'approved',
            submittedOn: '02 Jun 2025, 04:30 PM',
            studentFiles: [
                ['Design_Document_v2.pdf', '2.4 MB'],
                ['System_Architecture_v2.pdf', '1.8 MB'],
                ['Analysis_Report_v2.docx', '1.2 MB']
            ],
            reviewNote: 'Good improvement in design. Proceed to next stage.',
            reviewer: 'Dr. R. Kumar on 04 Jun 2025, 10:15 AM',
            attachments: [
                ['Review_Comments.pdf', '512 KB'],
                ['Suggestions.docx', '256 KB']
            ]
        },
        {
            label: 'Version 1',
            status: 'Rejected',
            statusClass: 'rejected',
            submittedOn: '28 May 2025, 11:20 AM',
            studentFiles: [
                ['Design_Document_v1.pdf', '2.1 MB'],
                ['System_Architecture_v1.pdf', '1.6 MB'],
                ['Analysis_Report_v1.docx', '1.1 MB']
            ],
            reviewNote: 'Please improve the architecture diagram and add more analysis.',
            reviewer: 'Dr. R. Kumar on 29 May 2025, 09:40 AM',
            attachments: [
                ['Review_Comments.pdf', '450 KB']
            ]
        }
    ]
};

let selectedStageTrackerId = stageTrackerState.currentStageId;

// Component & Tool Data
const COMPONENTS_CATALOG = [
    { id: 1,  name: 'Arduino Uno R3',          category: 'Microcontroller', stock: 12, maxPerRequest: 3,
      image: './assets/images/equipment/adrinounor3.jpg',
      description: 'ATmega328P-based microcontroller board, 14 digital I/O pins, 6 PWM, USB connectivity.',
      specs: { Voltage: '5V', Flash: '32KB', SRAM: '2KB', Clock: '16 MHz', Interface: 'USB-B' } },
    { id: 2,  name: 'Raspberry Pi 4 (4GB)',     category: 'Microcontroller', stock: 5, maxPerRequest: 1,
      image: './assets/images/equipment/rasberrypi4.webp',
      description: 'Quad-core ARM Cortex-A72, 4GB LPDDR4, dual-band Wi-Fi, Bluetooth 5, two USB 3.0 ports.',
      specs: { Voltage: '5V DC', RAM: '4GB', CPU: 'ARM A72 1.5GHz', USB: '2x USB3 + 2x USB2', OS: 'Raspberry Pi OS' } },
    { id: 3,  name: 'ESP32 Dev Board',          category: 'Microcontroller', stock: 18, maxPerRequest: 4,
      image: './assets/images/equipment/esp32devboard.jpeg',
      description: 'Dual-core Xtensa LX6, integrated Wi-Fi & BT, 520KB SRAM, 4MB Flash, 38 GPIO pins.',
      specs: { Voltage: '3.3V / 5V', CPU: 'LX6 240MHz', 'Wi-Fi': '802.11 b/g/n', Bluetooth: 'v4.2 + BLE', GPIO: '38 pins' } },
    { id: 4,  name: 'Ultrasonic Sensor HC-SR04',category: 'Sensor',          stock: 30, maxPerRequest: 5,
      image: './assets/images/equipment/ultrasonicsensorhc-sr04.webp',
      description: 'Distance measurement sensor using ultrasonic sound. Range 2–400 cm with 3mm accuracy.',
      specs: { Voltage: '5V', Range: '2–400 cm', Accuracy: '3 mm', Frequency: '40 kHz', Angle: '15°' } },
    { id: 5,  name: 'DHT22 Temperature Sensor', category: 'Sensor',          stock: 20, maxPerRequest: 5,
      image: './assets/images/equipment/dht22tempraturesensor.jpeg',
      description: 'High-precision digital temperature and humidity sensor. Single-wire serial interface.',
      specs: { Voltage: '3.3–6V', Temp: '-40 to +80°C', Humidity: '0–100% RH', Accuracy: '±0.5°C', Protocol: 'Single-wire' } },
    { id: 6,  name: 'Servo Motor SG90',         category: 'Actuator',        stock: 25, maxPerRequest: 6,
      image: './assets/images/equipment/servomotorsg90.jpg',
      description: 'Micro servo motor, 180° rotation, PWM control. Lightweight at 9g. Ideal for robotics arms.',
      specs: { Voltage: '4.8–6V', Torque: '1.8 kg·cm', Speed: '0.1 s/60°', Angle: '180°', Weight: '9g' } },
    { id: 7,  name: 'DC Motor with Driver',     category: 'Actuator',        stock: 15, maxPerRequest: 4,
      image: './assets/images/equipment/dcmotorwithdriver.webp',
      description: 'TT gear motor with L298N dual H-bridge motor driver module. Forward/reverse/speed control.',
      specs: { Voltage: '5–12V', Driver: 'L298N H-Bridge', Current: '2A per channel', Speed: '200 RPM', Channels: '2' } },
    { id: 8,  name: 'Breadboard 830 Points',    category: 'Connectivity',    stock: 40, maxPerRequest: 4,
      image: './assets/images/equipment/breadboard830points.jpg',
      description: '830-point solderless breadboard with binding posts. Ideal for prototyping circuits quickly.',
      specs: { Points: '830', Rows: '63', Columns: '10', Tie: '5 holes', Binding: 'Yes' } },
    { id: 9,  name: 'Jumper Wires (40pcs)',     category: 'Connectivity',    stock: 50, maxPerRequest: 10,
      image: './assets/images/equipment/jumperwires.jpeg',
      description: '40-piece jumper wire kit: M-M, M-F, F-F combinations. 20cm length, 40 color-coded wires.',
      specs: { Count: '40 pcs', Length: '20 cm', Types: 'M-M, M-F, F-F', Material: 'Copper+PVC', Gauge: '28 AWG' } },
    { id: 10, name: 'LCD Display 16x2',         category: 'Display',         stock: 14, maxPerRequest: 3,
      image: './assets/images/equipment/lcddisplay16x2.jpeg',
      description: '16 characters × 2 lines character LCD with HD44780 controller. Works with I2C backpack.',
      specs: { Voltage: '5V', Columns: '16', Rows: '2', Backlight: 'Blue/Green', Interface: 'Parallel / I2C' } }
];

const TOOLS_CATALOG = [
    { id: 101, name: 'Soldering Iron',    category: 'Electronics', stock: 8,  maxPerRequest: 1,
      description: 'Temperature-controlled soldering iron 60W with fine tip. Adjustable from 200–480°C.',
      specs: { Power: '60W', Temp: '200–480°C', Tip: 'Fine Conical', Cord: '1.2m', Weight: '120g' } },
    { id: 102, name: 'Multimeter',        category: 'Electronics', stock: 10, maxPerRequest: 1,
      description: 'Digital multimeter for measuring AC/DC voltage, current, resistance, and continuity.',
      specs: { Voltage: 'AC/DC 1000V', Current: 'AC/DC 10A', Resistance: '40MΩ', Display: '4000 count', Safety: 'CAT III' } },
    { id: 103, name: 'Wire Cutter',       category: 'Electrical',  stock: 15, maxPerRequest: 2,
      description: 'High-leverage diagonal flush wire cutter. Cuts copper wire up to 4mm diameter cleanly.',
      specs: { Length: '15 cm', Material: 'Alloy Steel', Jaw: 'Flush Cut', Handle: 'Cushion-Grip', MaxWire: '4 mm' } },
    { id: 104, name: 'Cutter Knife',      category: 'General',     stock: 20, maxPerRequest: 2,
      description: 'Heavy-duty snap-off blade utility knife. Rubber anti-slip grip, auto-lock mechanism.',
      specs: { Blade: '18mm snap-off', Handle: 'Rubber grip', Lock: 'Auto-lock', Blades: '3 spare', Weight: '90g' } },
    { id: 105, name: 'Long Nose Pliers',  category: 'Mechanical',  stock: 12, maxPerRequest: 2,
      description: 'Needle-nose pliers with side cutter. For bending wire, holding small parts in tight spaces.',
      specs: { Length: '16 cm', Jaw: 'Needle-nose', Side: 'Wire Cutter', Material: 'Chrome-Vanadium', Grip: 'Non-slip' } },
    { id: 106, name: 'Screwdriver Set',   category: 'General',     stock: 10, maxPerRequest: 1,
      description: '10-piece precision screwdriver set. Phillips PH0/PH1, flat, Torx T5–T8 in a roll pouch.',
      specs: { Count: '10 pcs', Types: 'Phillips, Flat, Torx', Material: 'S2 Steel', Handle: 'Ergonomic', Case: 'Roll Pouch' } },
    { id: 107, name: 'Hot Glue Gun',      category: 'General',     stock: 7,  maxPerRequest: 1,
      description: 'Mini hot glue gun 20W with 8 glue sticks. Heats in 3 minutes, dual temperature mode.',
      specs: { Power: '20W', Stick: '7mm', HeatUp: '3 min', Temp: '165°C/140°C', Sticks: '8 included' } },
    { id: 108, name: 'Allen Key Set',     category: 'Mechanical',  stock: 18, maxPerRequest: 2,
      description: 'Metric hex key set, 9 sizes (1.5–10mm). Ball-end for angled access. Folding design.',
      specs: { Count: '9 keys', Sizes: '1.5–10 mm', Type: 'Ball-end', Material: 'Chrome-Vanadium', Style: 'Folding' } }
];

// Global State
let componentCart = [];
let toolCart = [];

const MY_COMPONENT_REQUESTS = [
    { id: 'CR-104', cartItems: [{name:'Arduino Uno R3',qty:2},{name:'ESP32 Dev Board',qty:1},{name:'Breadboard 830 Points',qty:2},{name:'Jumper Wires (40pcs)',qty:3}], date: '28 May 2025 10:30 AM', status: 'Pending',  purpose: 'Main controller and connectivity for prototype.' },
    { id: 'CR-103', cartItems: [{name:'Servo Motor SG90',qty:2},{name:'DHT22 Temperature Sensor',qty:1},{name:'LCD Display 16x2',qty:1}],                              date: '27 May 2025 03:15 PM', status: 'Approved', purpose: 'Actuators and display for stage 3 demo.' },
    { id: 'CR-102', cartItems: [{name:'Arduino Uno R3',qty:1},{name:'Breadboard 830 Points',qty:1},{name:'Jumper Wires (40pcs)',qty:2},{name:'Ultrasonic Sensor HC-SR04',qty:2}], date: '25 May 2025 11:20 AM', status: 'Issued',   purpose: 'Initial sensor testing on breadboard.' },
    { id: 'CR-101', cartItems: [{name:'ESP32 Dev Board',qty:1},{name:'DHT22 Temperature Sensor',qty:2},{name:'LCD Display 16x2',qty:1},{name:'Jumper Wires (40pcs)',qty:1}], date: '22 May 2025 09:45 AM', status: 'Returned', purpose: 'Returned after proposal stage testing.' }
];

const MY_TOOL_REQUESTS = [
    { id: 'TB-024', cartItems: [{name:'Soldering Iron',qty:1},{name:'Multimeter',qty:1},{name:'Wire Cutter',qty:1}],               date: '28 May 2025 10:20 AM', status: 'Pending',  purpose: 'Soldering and testing components for stage 3.' },
    { id: 'TB-023', cartItems: [{name:'Hot Glue Gun',qty:1},{name:'Cutter Knife',qty:1}],                                            date: '27 May 2025 03:15 PM', status: 'Approved', purpose: 'Enclosure assembly and finishing work.' },
    { id: 'TB-022', cartItems: [{name:'Multimeter',qty:1},{name:'Screwdriver Set',qty:1},{name:'Long Nose Pliers',qty:1},{name:'Allen Key Set',qty:1}], date: '26 May 2025 11:40 AM', status: 'Borrowed', purpose: 'Maintenance and circuit diagnostics.' },
    { id: 'TB-021', cartItems: [{name:'Soldering Iron',qty:1},{name:'Wire Cutter',qty:1}],                                           date: '24 May 2025 04:10 PM', status: 'Returned', purpose: 'Returned after proposal review soldering.' }
];

// Mock data for component returns
const COMPONENT_RETURNS = [
    { id: 'RET-001', componentName: 'Arduino Uno R3', requestId: 'CR-102', returnDate: '22 May 2025', condition: 'Good', status: 'Completed' },
    { id: 'RET-002', componentName: 'Breadboard 830 Points', requestId: 'CR-102', returnDate: '22 May 2025', condition: 'Good', status: 'Completed' },
    { id: 'RET-003', componentName: 'Jumper Wires (40pcs)', requestId: 'CR-102', returnDate: '22 May 2025', condition: 'Fair', status: 'Completed' },
    { id: 'RET-004', componentName: 'ESP32 Dev Board', requestId: 'CR-101', returnDate: '20 May 2025', condition: 'Excellent', status: 'Completed' }
];

// Mock data for tool returns
const TOOL_RETURNS = [
    { id: 'TR-001', toolName: 'Soldering Iron', requestId: 'TB-021', returnDate: '18 May 2025', condition: 'Good', status: 'Completed' },
    { id: 'TR-002', toolName: 'Wire Cutter', requestId: 'TB-021', returnDate: '18 May 2025', condition: 'Good', status: 'Completed' },
    { id: 'TR-003', toolName: 'Multimeter', requestId: 'TB-022', returnDate: '19 May 2025', condition: 'Excellent', status: 'Completed' },
    { id: 'TR-004', toolName: 'Screwdriver Set', requestId: 'TB-022', returnDate: '19 May 2025', condition: 'Good', status: 'Completed' }
];

/* ============================================================
   SPA ROUTING LOGIC
   ============================================================ */
window.spaNavigate = function(viewId) {
    document.querySelectorAll('.spa-view').forEach(view => {
        view.classList.remove('active');
    });
    const targetView = document.getElementById('view-' + viewId);
    if (targetView) {
        targetView.classList.add('active');
    }

    document.querySelectorAll('.project-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTab = document.querySelector(`[data-view="${viewId}"]`);
    if (activeTab) activeTab.classList.add('active');

    if (viewId === 'equipment-booking') {
        showSelectEquipmentPage();
    }

    if (viewId === 'stage-detail') {
        switchStageTab('timeline-info');
    }

    if (viewId === 'component-booking') {
        renderComponentCatalog();
    }

    if (viewId === 'daily-tools') {
        renderToolCatalog();
        renderToolRequests();
    }

    if (viewId === 'component-returning') {
        renderComponentReturns();
        renderToolReturns();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
};

/* ============================================================
   STAGE TRACKER FUNCTIONS
   ============================================================ */
function getStageStatusLabel(stage) {
    if (stage.id < stageTrackerState.currentStageId) return 'Completed';
    if (stage.id === stageTrackerState.currentStageId) return 'In Progress';
    return 'Locked';
}

window.openStageDetail = function(stageId) {
    selectedStageTrackerId = Number(stageId) || stageTrackerState.currentStageId;
    renderStageTrackerView(selectedStageTrackerId);
    spaNavigate('stage-detail');
};

// Global uploaded files holder
let stageUploadedFiles = [];

// Tab switching for Stage Tracker
window.switchStageTab = function(tabId) {
    // Remove active class from all tabs
    document.querySelectorAll('.stage-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Add active class to clicked tab
    const activeTab = document.querySelector(`.stage-tab[data-tab="${tabId}"]`);
    if (activeTab) activeTab.classList.add('active');
    
    // Hide all tab contents
    document.querySelectorAll('.stage-tab-content').forEach(content => {
        content.style.display = 'none';
        content.classList.remove('active-content');
    });
    
    // Show active tab content
    const activeContent = document.getElementById('tab-stage-' + tabId);
    if (activeContent) {
        activeContent.style.display = 'block';
        activeContent.classList.add('active-content');
    }
    
    // Refresh views if necessary
    if (tabId === 'timeline-info') {
        renderStageTrackerView(selectedStageTrackerId);
    } else if (tabId === 'submission') {
        updateSubmissionTabUI();
    } else if (tabId === 'history') {
        renderStageTrackerView(selectedStageTrackerId);
    }
};

window.handleFileUpload = function(input) {
    if (!input.files || input.files.length === 0) return;
    
    for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        stageUploadedFiles.push({
            name: file.name,
            size: `${sizeMB} MB`
        });
    }
    
    updateSubmissionTabUI();
    showToast(`${input.files.length} file(s) added for upload`, 'success');
    input.value = ''; // clear input
};

window.removeUploadedFile = function(index) {
    const file = stageUploadedFiles[index];
    stageUploadedFiles.splice(index, 1);
    updateSubmissionTabUI();
    if (file) {
        showToast(`Removed file: ${file.name}`, 'warning');
    }
};

window.resetSubmissionForm = function() {
    stageUploadedFiles = [];
    const remarks = document.getElementById('submission-remarks');
    if (remarks) remarks.value = '';
    updateSubmissionTabUI();
    showToast('Submission form reset', 'warning');
};

function updateSubmissionTabUI() {
    // Set Stage details
    const stage = stages.find(s => s.id === stageTrackerState.currentStageId) || stages[2];
    
    const subStageEl = document.getElementById('submission-stage');
    if (subStageEl) {
        subStageEl.textContent = `${stage.name} (Stage ${stage.id})`;
    }
    
    const subStatusEl = document.getElementById('submission-status');
    if (subStatusEl) {
        subStatusEl.textContent = 'In Progress';
    }
    
    const uploadStatusEl = document.getElementById('submission-upload-status');
    if (uploadStatusEl) {
        if (stageTrackerState.versionHistory.length > 0 && stageTrackerState.versionHistory[0].status === 'Pending Review') {
            uploadStatusEl.textContent = 'Pending Review';
            uploadStatusEl.style.color = '#d97706';
        } else {
            uploadStatusEl.textContent = stageUploadedFiles.length > 0 ? 'Ready to Submit' : 'Not Submitted';
            uploadStatusEl.style.color = stageUploadedFiles.length > 0 ? '#3b82f6' : '#d97706';
        }
    }
    
    // Render uploaded files list
    const listContainer = document.getElementById('uploaded-files-list');
    if (listContainer) {
        if (stageUploadedFiles.length === 0) {
            listContainer.innerHTML = `<div style="text-align:center; padding:20px; color:#94a3b8; font-size:13px; border:2px dashed #e2e8f0; border-radius:8px; background:#fafafa;">No files selected</div>`;
        } else {
            listContainer.innerHTML = stageUploadedFiles.map((file, idx) => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <i class="fa-solid fa-file-pdf" style="color:#ef4444; font-size:16px;"></i>
                        <span style="font-size:13px; font-weight:500; color:#0f172a;">${file.name}</span>
                        <span style="font-size:11px; color:#94a3b8;">(${file.size})</span>
                    </div>
                    <button onclick="removeUploadedFile(${idx})" class="btn-text" style="color:#ef4444; padding:2px 6px; font-size:12px; cursor:pointer;">
                        <i class="fa-solid fa-trash-can"></i> Remove
                    </button>
                </div>
            `).join('');
        }
    }
}

window.submitStageWork = function() {
    if (stageUploadedFiles.length === 0) {
        showToast('Please upload at least one document before submitting.', 'error');
        return;
    }
    
    const remarksVal = document.getElementById('submission-remarks').value.trim();
    
    // Create new version entry
    const newVerNum = stageTrackerState.versionHistory.length + 1;
    const formattedDate = new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).replace(',', '');
    
    const newVersion = {
        label: `Version ${newVerNum} (Latest)`,
        status: 'Pending Review',
        statusClass: 'pending',
        submittedOn: formattedDate,
        studentFiles: stageUploadedFiles.map(f => [f.name, f.size]),
        reviewNote: remarksVal ? `Remarks: "${remarksVal}"` : 'Awaiting faculty review and grading.',
        reviewer: 'Dr. R. Kumar (Assigned)',
        attachments: []
    };
    
    // Update labels of previous latest versions
    if (stageTrackerState.versionHistory.length > 0) {
        stageTrackerState.versionHistory[0].label = stageTrackerState.versionHistory[0].label.replace(' (Latest)', '');
    }
    
    // Add to state
    stageTrackerState.versionHistory.unshift(newVersion);
    
    // Clear current form
    stageUploadedFiles = [];
    const remarks = document.getElementById('submission-remarks');
    if (remarks) remarks.value = '';
    
    // Update UI
    updateSubmissionTabUI();
    renderStageTrackerView(selectedStageTrackerId);
    
    showToast('Work submitted successfully for review!', 'success');
    
    // Switch to Version History to see the submission
    setTimeout(() => {
        switchStageTab('history');
    }, 800);
};

function renderStageTrackerView(stageId) {
    const stage = stages.find(s => s.id === stageId) || stages[2];

    const stageTimelineList = document.getElementById('stage-timeline-list');
    const historyList = document.getElementById('version-history-list');

    if (stageTimelineList) {
        stageTimelineList.innerHTML = stages.map(item => {
            const isCompleted = item.id < stageTrackerState.currentStageId;
            const isCurrent = item.id === stageTrackerState.currentStageId;
            
            const statusClass = isCompleted ? 'completed' : isCurrent ? 'current' : 'locked';
            const statusText = isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Locked';
            const badgeInner = isCompleted
                ? '<i class="fa-solid fa-check"></i>'
                : isCurrent
                    ? String(item.id)
                    : '<i class="fa-solid fa-lock"></i>';

            return `<div class="timeline-row ${statusClass} ${item.id === stage.id ? 'active' : ''}" onclick="openStageDetail(${item.id})">
                <div class="timeline-badge">${badgeInner}</div>
                <div>
                    <div class="timeline-title">${item.id}. ${item.name}</div>
                    <div class="timeline-meta">${item.description}</div>
                </div>
                <div class="timeline-status">${statusText}</div>
            </div>`;
        }).join('');
    }

    // Update stage info
    const nameEl = document.getElementById('tracker-stage-name');
    if (nameEl) nameEl.textContent = stage.name;
    
    const countPillEl = document.getElementById('tracker-stage-count-pill');
    if (countPillEl) countPillEl.textContent = `Stage ${stage.id} of 10`;

    const statusPillEl = document.getElementById('tracker-stage-status-pill');
    if (statusPillEl) {
        const isCompleted = stage.id < stageTrackerState.currentStageId;
        const isCurrent = stage.id === stageTrackerState.currentStageId;
        const statusText = isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Locked';
        
        statusPillEl.textContent = statusText;
        statusPillEl.className = 'mini-pill status ' + (isCompleted ? 'completed' : isCurrent ? 'in-progress' : 'locked');
        
        if (isCompleted) {
            statusPillEl.style.background = '#d1fae5';
            statusPillEl.style.color = '#065f46';
        } else if (isCurrent) {
            statusPillEl.style.background = '#dbeafe';
            statusPillEl.style.color = '#1e40af';
        } else {
            statusPillEl.style.background = '#f1f5f9';
            statusPillEl.style.color = '#475569';
        }
    }

    const summaryEl = document.getElementById('tracker-stage-summary');
    if (summaryEl) summaryEl.textContent = stage.description;

    const numEl = document.getElementById('tracker-stage-number');
    if (numEl) numEl.textContent = stage.id;

    const nameLabelEl = document.getElementById('tracker-stage-name-label');
    if (nameLabelEl) nameLabelEl.textContent = stage.name;

    const statusLabelEl = document.getElementById('tracker-stage-status-label');
    if (statusLabelEl) {
        const isCompleted = stage.id < stageTrackerState.currentStageId;
        const isCurrent = stage.id === stageTrackerState.currentStageId;
        statusLabelEl.textContent = isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Locked';
        statusLabelEl.style.color = isCompleted ? '#059669' : isCurrent ? '#3b82f6' : '#64748b';
    }

    const startEl = document.getElementById('tracker-stage-start');
    if (startEl) startEl.textContent = stage.startDate;

    const endEl = document.getElementById('tracker-stage-end');
    if (endEl) endEl.textContent = stage.endDate;

    const daysEl = document.getElementById('tracker-days-remaining');
    if (daysEl) {
        daysEl.textContent = stage.daysRemaining;
        if (stage.daysRemaining === 'Completed') {
            daysEl.style.color = '#059669';
        } else if (stage.daysRemaining === 'Locked') {
            daysEl.style.color = '#64748b';
        } else {
            daysEl.style.color = '#3b82f6';
        }
    }

    const tasksList = document.getElementById('tracker-stage-tasks-list');
    if (tasksList && stage.tasks) {
        tasksList.innerHTML = stage.tasks.map(task => `<li>${task}</li>`).join('');
    }

    // Render version history
    if (historyList) {
        historyList.innerHTML = stageTrackerState.versionHistory.map((version, idx) => {
            const isApproved = version.statusClass === 'approved';
            const isPending = version.statusClass === 'pending';
            
            const statusBg = isApproved ? '#d1fae5' : isPending ? '#fef3c7' : '#fee2e2';
            const statusColor = isApproved ? '#059669' : isPending ? '#d97706' : '#dc2626';
            const noteBg = isApproved ? '#f0fdf4' : isPending ? '#fffbeb' : '#fef2f2';
            const noteBorder = isApproved ? '#22c55e' : isPending ? '#fbbf24' : '#ef4444';
            const noteTitleColor = isApproved ? '#15803d' : isPending ? '#b45309' : '#991b1b';
            const noteTextColor = isApproved ? '#166534' : isPending ? '#78350f' : '#7f1d1d';
            
            return `
            <div style="border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin-bottom:16px;background:#fff;box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                    <h3 style="font-size:16px;font-weight:700;margin:0;">${version.label}</h3>
                    <span style="background:${statusBg};color:${statusColor};padding:6px 12px;border-radius:6px;font-size:12px;font-weight:600;">${version.status}</span>
                </div>
                <p style="font-size:13px;color:#64748b;margin:0 0 12px 0;">Submitted on ${version.submittedOn}</p>
                
                <div style="background:#f8fafc;border-radius:8px;padding:12px;margin-bottom:16px;">
                    <h4 style="font-size:12px;font-weight:600;color:#475569;margin:0 0 8px 0;text-transform:uppercase;">Student Files</h4>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        ${version.studentFiles.map(file => {
                            const isPdf = file[0].endsWith('.pdf');
                            const color = isPdf ? '#ef4444' : '#2b579a';
                            const icon = isPdf ? 'fa-file-pdf' : 'fa-file-word';
                            return `
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:#fff;border-radius:6px;border:1px solid #e2e8f0;flex-wrap:wrap;gap:8px;">
                                <span style="font-size:13px;color:#0f172a;font-weight:500;display:flex;align-items:center;gap:8px;">
                                    <i class="fa-solid ${icon}" style="color:${color};"></i> ${file[0]}
                                </span>
                                <div style="display:flex;align-items:center;gap:12px;">
                                    <span style="font-size:12px;color:#94a3b8;">${file[1]}</span>
                                    <button onclick="viewMockFile('${file[0]}')" class="btn-text" style="color:#4f46e5;font-size:13px;font-weight:700;cursor:pointer;padding:2px 4px;"><i class="fa-solid fa-eye"></i> View</button>
                                    <button onclick="downloadMockFile('${file[0]}')" class="btn-text" style="color:#059669;font-size:13px;font-weight:700;cursor:pointer;padding:2px 4px;"><i class="fa-solid fa-download"></i> Download</button>
                                </div>
                            </div>`;
                        }).join('')}
                    </div>
                </div>

                <div style="background:${noteBg};border-left:4px solid ${noteBorder};padding:12px;border-radius:6px;margin-bottom:16px;">
                    <h4 style="font-size:12px;font-weight:600;color:${noteTitleColor};margin:0 0 4px 0;">Review Note</h4>
                    <p style="font-size:13px;color:${noteTextColor};margin:0;">${version.reviewNote}</p>
                </div>

                <p style="font-size:12px;color:#64748b;margin:0 0 12px 0;"><strong>Reviewed by:</strong> ${version.reviewer}</p>

                ${version.attachments && version.attachments.length > 0 ? `
                <div style="background:#f8fafc;border-radius:8px;padding:12px;">
                    <h4 style="font-size:12px;font-weight:600;color:#475569;margin:0 0 8px 0;text-transform:uppercase;">Reviewer Attachments</h4>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        ${version.attachments.map(file => {
                            const isPdf = file[0].endsWith('.pdf');
                            const color = isPdf ? '#ef4444' : '#2b579a';
                            const icon = isPdf ? 'fa-file-pdf' : 'fa-file-word';
                            return `
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:#fff;border-radius:6px;border:1px solid #e2e8f0;flex-wrap:wrap;gap:8px;">
                                <span style="font-size:13px;color:#0f172a;font-weight:500;display:flex;align-items:center;gap:8px;">
                                    <i class="fa-solid ${icon}" style="color:${color};"></i> ${file[0]}
                                </span>
                                <div style="display:flex;align-items:center;gap:12px;">
                                    <span style="font-size:12px;color:#94a3b8;">${file[1]}</span>
                                    <button onclick="viewMockFile('${file[0]}')" class="btn-text" style="color:#4f46e5;font-size:13px;font-weight:700;cursor:pointer;padding:2px 4px;"><i class="fa-solid fa-eye"></i> View</button>
                                    <button onclick="downloadMockFile('${file[0]}')" class="btn-text" style="color:#059669;font-size:13px;font-weight:700;cursor:pointer;padding:2px 4px;"><i class="fa-solid fa-download"></i> Download</button>
                                </div>
                            </div>`;
                        }).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
            `;
        }).join('');
    }
}

/* ============================================================
   COMPONENT BOOKING FUNCTIONS
   ============================================================ */
window.switchComponentTab = function(tab) {
    document.querySelectorAll('.component-tab').forEach(btn => {
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
            btn.style.borderBottomColor = '#4f46e5';
            btn.style.color = '#4f46e5';
        } else {
            btn.classList.remove('active');
            btn.style.borderBottomColor = 'transparent';
            btn.style.color = '#64748b';
        }
    });

    document.querySelectorAll('.component-tab-content').forEach(c => c.style.display = 'none');

    if (tab === 'browse') {
        document.getElementById('tab-browse-components').style.display = 'block';
        renderComponentCatalog();
    } else if (tab === 'cart') {
        document.getElementById('tab-cart-components').style.display = 'block';
        renderComponentCart();
    } else if (tab === 'requests') {
        document.getElementById('tab-requests-components').style.display = 'block';
        renderComponentRequests();
    }
};

window.renderComponentCatalog = function() {
    const container = document.getElementById('component-catalog');
    if (!container) return;

    const searchTerm = (document.getElementById('component-search')?.value || '').toLowerCase();
    const filtered = COMPONENTS_CATALOG.filter(c =>
        c.name.toLowerCase().includes(searchTerm) || c.category.toLowerCase().includes(searchTerm)
    );

    container.innerHTML = filtered.map(component => {
        const isSelected = document.querySelector(`.component-select-chk[data-id="${component.id}"]`)?.checked ? 'checked' : '';
        return `
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px;display:flex;flex-direction:column;align-items:center;text-align:center;transition:all 0.3s ease;position:relative;box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <!-- Selection Checkbox -->
            <label style="position:absolute;top:10px;right:10px;cursor:pointer;">
                <input type="checkbox" class="component-select-chk" data-id="${component.id}" ${isSelected} onchange="updateBulkActionBar('component')" style="width:18px;height:18px;accent-color:#4f46e5;cursor:pointer;">
            </label>

            <!-- Card Image -->
            <div style="width:100%;height:120px;background:#f8fafc;border-radius:8px;overflow:hidden;margin-bottom:12px;border:1px solid #f1f5f9;">
                <img src="${component.image || './assets/images/component_placeholder.png'}" alt="${component.name}" style="width:100%;height:100%;object-fit:cover;">
            </div>

            <h3 style="font-size:15px;font-weight:700;color:#0f172a;margin:0 0 4px 0;">${component.name}</h3>
            <div style="display:flex;gap:6px;align-items:center;margin-bottom:12px;">
                <span class="mini-pill" style="font-size:10px;padding:2px 6px;background:#f1f5f9;color:#64748b;">${component.category}</span>
            </div>

            <!-- Quantity Stepper -->
            <div style="display:flex;gap:8px;width:100%;margin-bottom:12px;align-items:center;justify-content:center;">
                <div style="display:flex;align-items:center;border:1px solid #cbd5e1;border-radius:6px;overflow:hidden;width:100px;background:#fff;">
                    <button onclick="adjustQty(${component.id}, -1, 'component')" style="border:none;background:#f8fafc;width:30px;height:32px;font-size:16px;cursor:pointer;color:#475569;font-weight:bold;outline:none;">−</button>
                    <input type="text" id="comp-qty-${component.id}" value="1" readonly style="border:none;width:40px;height:32px;text-align:center;font-size:13.5px;font-weight:600;color:#0f172a;background:#fff;pointer-events:none;">
                    <button onclick="adjustQty(${component.id}, 1, 'component')" style="border:none;background:#f8fafc;width:30px;height:32px;font-size:16px;cursor:pointer;color:#475569;font-weight:bold;outline:none;">+</button>
                </div>
                <button onclick="addComponentToCart(${component.id})" class="btn btn-primary" style="padding:0;width:38px;height:34px;display:flex;align-items:center;justify-content:center;font-size:14px;"><i class="fa-solid fa-cart-plus"></i></button>
            </div>

            <button onclick="showComponentDetails(${component.id})" class="btn-text" style="color:#4f46e5;font-size:12.5px;font-weight:600;width:100%;">View Details</button>
        </div>`;
    }).join('');
};

window.adjustQty = function(id, delta, type) {
    const isComp = type === 'component';
    const catalog = isComp ? COMPONENTS_CATALOG : TOOLS_CATALOG;
    const item = catalog.find(i => i.id === id);
    if (!item) return;

    const inputId = isComp ? `comp-qty-${id}` : `tool-qty-${id}`;
    const input = document.getElementById(inputId);
    if (!input) return;

    let currentVal = parseInt(input.value) || 1;
    let newVal = currentVal + delta;

    if (newVal < 1) newVal = 1;
    if (newVal > item.maxPerRequest) {
        newVal = item.maxPerRequest;
        showToast(`Maximum limit of ${item.maxPerRequest} reached for ${item.name}`, 'warning');
    }
    input.value = newVal;
};

window.showComponentDetails = function(componentId) {
    const component = COMPONENTS_CATALOG.find(c => c.id === componentId);
    if (!component) return;
    showDetailsModal(component, 'component');
};

window.addComponentToCart = function(id) {
    const component = COMPONENTS_CATALOG.find(c => c.id === id);
    if (!component) return;

    const qtyInput = document.getElementById(`comp-qty-${id}`);
    const qty = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;
    
    const existing = componentCart.find(item => item.id === id);
    if (existing) {
        if (existing.quantity + qty > component.maxPerRequest) {
            existing.quantity = component.maxPerRequest;
            showToast(`Adjusted quantity to max limit of ${component.maxPerRequest} for ${component.name}`, 'warning');
        } else {
            existing.quantity += qty;
        }
    } else {
        componentCart.push({
            id: component.id,
            name: component.name,
            category: component.category,
            image: component.image || './assets/images/component_placeholder.png',
            quantity: qty
        });
    }

    if (qtyInput) qtyInput.value = 1;
    updateComponentCartUI();
    showToast(`${component.name} (${qty}x) added to cart`, 'success');
};

function updateComponentCartUI() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const total = componentCart.reduce((sum, c) => sum + c.quantity, 0);
        badge.textContent = total;
        badge.style.display = total > 0 ? 'inline-block' : 'none';
    }
}

window.renderComponentCart = function() {
    const empty = document.getElementById('cart-empty');
    const items = document.getElementById('cart-items');
    const list = document.getElementById('cart-list');

    if (!empty || !items || !list) return;

    if (componentCart.length === 0) {
        empty.style.display = 'block';
        items.style.display = 'none';
        return;
    }

    empty.style.display = 'none';
    items.style.display = 'grid';

    const totalItems = componentCart.reduce((sum, c) => sum + c.quantity, 0);
    document.getElementById('cart-total-types').textContent = componentCart.length;
    document.getElementById('cart-total-items').textContent = totalItems;

    list.innerHTML = componentCart.map((item, i) => `
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px;display:flex;align-items:center;gap:16px;box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <div style="width:64px;height:64px;background:#f8fafc;border-radius:8px;overflow:hidden;border:1px solid #f1f5f9;flex-shrink:0;">
                <img src="${item.image || './assets/images/component_placeholder.png'}" alt="Component" style="width:100%;height:100%;object-fit:cover;">
            </div>
            <div style="flex:1;">
                <h4 style="font-size:15px;font-weight:700;margin:0 0 4px 0;color:#0f172a;">${item.name}</h4>
                <p style="font-size:12.5px;color:#64748b;margin:0;">Quantity: <strong>${item.quantity}</strong> | ${item.category}</p>
            </div>
            <button onclick="removeComponentFromCart(${i})" class="btn-text" style="color:#ef4444;padding:8px;cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
        </div>
    `).join('');
};

window.removeComponentFromCart = function(idx) {
    componentCart.splice(idx, 1);
    updateComponentCartUI();
    renderComponentCart();
};

window.clearCart = function() {
    componentCart = [];
    updateComponentCartUI();
    renderComponentCart();
};

window.requestAllComponents = function() {
    if (componentCart.length === 0) return;
    
    const remarks = document.querySelector('#tab-cart-components textarea')?.value.trim() || '';
    
    const newReqId = `CR-${100 + MY_COMPONENT_REQUESTS.length + 1}`;
    const cartItemsList = componentCart.map(c => ({
        name: c.name,
        qty: c.quantity
    }));
    
    const formattedDate = new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).replace(',', '');
    
    MY_COMPONENT_REQUESTS.unshift({
        id: newReqId,
        cartItems: cartItemsList,
        date: formattedDate,
        status: 'Pending',
        purpose: remarks || 'No custom purpose specified.'
    });
    
    showToast('Component checkout requested successfully!', 'success');
    
    // reset cart
    componentCart = [];
    updateComponentCartUI();
    
    // clear textarea
    const tx = document.querySelector('#tab-cart-components textarea');
    if (tx) tx.value = '';
    
    switchComponentTab('requests');
};

window.filterComponents = function() {
    renderComponentCatalog();
};

function renderComponentRequests() {
    const list = document.getElementById('my-component-requests-list');
    if (!list) return;

    const statusColors = {
        'Pending': { bg: '#fff7ed', text: '#ea580c' },
        'Approved': { bg: '#f0fdf4', text: '#16a34a' },
        'Issued': { bg: '#eff6ff', text: '#2563eb' },
        'Returned': { bg: '#fdf4ff', text: '#c026d3' }
    };

    list.innerHTML = MY_COMPONENT_REQUESTS.map(r => {
        const c = statusColors[r.status] || { bg: '#f1f5f9', text: '#64748b' };
        const itemsStr = r.cartItems.map(item => `${item.name} (${item.qty}x)`).join(', ');
        return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding:16px;font-weight:700;color:#0f172a;">${r.id}</td>
            <td style="padding:16px;color:#475569;max-width:350px;">
                <div style="font-weight:600;margin-bottom:4px;color:#0f172a;">${r.cartItems.length} distinct item(s)</div>
                <div style="font-size:12px;color:#64748b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${itemsStr}">${itemsStr}</div>
            </td>
            <td style="padding:16px;color:#475569;">${r.date}</td>
            <td style="padding:16px;"><span style="background:${c.bg};color:${c.text};padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;">${r.status}</span></td>
            <td style="padding:16px;text-align:right;"><button onclick="viewComponentRequestDetails('${r.id}')" class="btn-text" style="color:#4f46e5;font-size:13.5px;font-weight:700;cursor:pointer;">View Details</button></td>
        </tr>`;
    }).join('');
}

window.viewComponentRequestDetails = function(requestId) {
    const request = MY_COMPONENT_REQUESTS.find(r => r.id === requestId);
    if (!request) return;
    
    let modal = document.getElementById('details-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'details-modal';
        modal.className = 'modal-container';
        document.body.appendChild(modal);
    }

    const itemsHTML = request.cartItems.map(item => {
        const catalogEntry = COMPONENTS_CATALOG.find(c => c.name === item.name);
        const itemImg = (catalogEntry && catalogEntry.image) ? catalogEntry.image : './assets/images/component_placeholder.png';
        return `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:8px;">
            <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:40px;height:40px;border-radius:6px;overflow:hidden;border:1px solid #cbd5e1;flex-shrink:0;">
                    <img src="${itemImg}" style="width:100%;height:100%;object-fit:cover;">
                </div>
                <div>
                    <strong style="font-size:14px;color:#0f172a;display:block;">${item.name}</strong>
                </div>
            </div>
            <span style="background:#e0e7ff;color:#3730a3;font-weight:700;font-size:12.5px;padding:4px 12px;border-radius:12px;">Qty: ${item.qty}</span>
        </div>
        `;
    }).join('');

    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeDetailsModal()" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.6);z-index:9999;backdrop-filter:blur(4px);animation:fadeIn 0.2s ease;"></div>
        <div class="modal-content" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:95%;max-width:520px;background:#fff;border-radius:16px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);z-index:10000;padding:24px;animation:slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;border-bottom:1px solid #e2e8f0;padding-bottom:12px;">
                <div>
                    <h3 style="font-size:18px;font-weight:700;color:#0f172a;margin:0;">Request Details: ${request.id}</h3>
                    <span style="font-size:12px;color:#64748b;">Requested on ${request.date}</span>
                </div>
                <button onclick="closeDetailsModal()" style="border:none;background:none;font-size:22px;color:#94a3b8;cursor:pointer;line-height:1;"><i class="fa-solid fa-xmark"></i></button>
            </div>
            
            <div style="margin-bottom:16px;">
                <span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;display:block;margin-bottom:6px;letter-spacing:0.5px;">Status</span>
                <span style="background:${request.status === 'Pending' ? '#fff7ed' : request.status === 'Approved' ? '#f0fdf4' : request.status === 'Issued' ? '#eff6ff' : '#fdf4ff'};color:${request.status === 'Pending' ? '#ea580c' : request.status === 'Approved' ? '#16a34a' : request.status === 'Issued' ? '#2563eb' : '#c026d3'};padding:4px 12px;border-radius:20px;font-size:12.5px;font-weight:700;display:inline-block;">
                    ${request.status}
                </span>
            </div>

            <div style="margin-bottom:18px;">
                <span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;display:block;margin-bottom:6px;letter-spacing:0.5px;">Purpose / Description</span>
                <p style="font-size:13.5px;color:#475569;margin:0;background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;line-height:1.5;">${request.purpose || 'No custom purpose specified.'}</p>
            </div>

            <div style="margin-bottom:20px;max-height:220px;overflow-y:auto;padding-right:4px;">
                <span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;display:block;margin-bottom:8px;letter-spacing:0.5px;">Items Requested (${request.cartItems.length})</span>
                <div>${itemsHTML}</div>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid #e2e8f0;padding-top:16px;flex-wrap:wrap;gap:12px;">
                <span style="font-size:12.5px;color:#4f46e5;font-weight:600;background:#eef2ff;padding:6px 12px;border-radius:6px;display:flex;align-items:center;gap:6px;">
                    <i class="fa-solid fa-circle-info"></i> Project hand-over item
                </span>
                <button onclick="closeDetailsModal()" class="btn btn-primary" style="padding:10px 24px;font-weight:600;cursor:pointer;">Close</button>
            </div>
        </div>
    `;
    modal.style.display = 'block';
};

// Selection Action Bars & Stepper handlers
window.toggleSelectAll = function(type, chk) {
    const isComp = type === 'component';
    const checkboxes = document.querySelectorAll(isComp ? '.component-select-chk' : '.tool-select-chk');
    checkboxes.forEach(c => {
        c.checked = chk.checked;
    });
    updateBulkActionBar(type);
};

window.updateBulkActionBar = function(type) {
    const isComp = type === 'component';
    const checkboxes = document.querySelectorAll(isComp ? '.component-select-chk' : '.tool-select-chk');
    const checked = Array.from(checkboxes).filter(c => c.checked);
    
    const bar = document.getElementById(isComp ? 'component-bulk-bar' : 'tool-bulk-bar');
    const countSpan = document.getElementById(isComp ? 'component-selected-count' : 'tool-selected-count');
    const allChk = document.getElementById(isComp ? 'component-select-all' : 'tool-select-all');

    if (countSpan) countSpan.textContent = checked.length;
    
    if (allChk) {
        allChk.checked = checked.length === checkboxes.length && checkboxes.length > 0;
    }

    if (bar) {
        bar.style.display = checked.length > 0 ? 'flex' : 'none';
    }
};

window.clearComponentSelection = function() {
    const checkboxes = document.querySelectorAll('.component-select-chk');
    checkboxes.forEach(c => c.checked = false);
    updateBulkActionBar('component');
};

window.clearToolSelection = function() {
    const checkboxes = document.querySelectorAll('.tool-select-chk');
    checkboxes.forEach(c => c.checked = false);
    updateBulkActionBar('tool');
};

window.addSelectedComponentsToCart = function() {
    const checkboxes = document.querySelectorAll('.component-select-chk:checked');
    if (checkboxes.length === 0) return;

    let addedCount = 0;
    checkboxes.forEach(chk => {
        const id = parseInt(chk.dataset.id);
        const component = COMPONENTS_CATALOG.find(c => c.id === id);
        if (!component) return;

        const qtyInput = document.getElementById(`comp-qty-${id}`);
        const qty = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;

        const existing = componentCart.find(item => item.id === id);
        if (existing) {
            if (existing.quantity + qty > component.maxPerRequest) {
                existing.quantity = component.maxPerRequest;
            } else {
                existing.quantity += qty;
            }
        } else {
            componentCart.push({
                id: component.id,
                name: component.name,
                category: component.category,
                image: component.image || './assets/images/component_placeholder.png',
                quantity: qty
            });
        }
        addedCount++;
        chk.checked = false; // Uncheck
        if (qtyInput) qtyInput.value = 1;
    });

    updateComponentCartUI();
    updateBulkActionBar('component');
    showToast(`Bulk added ${addedCount} component types to cart`, 'success');
};

window.addSelectedToolsToCart = function() {
    const checkboxes = document.querySelectorAll('.tool-select-chk:checked');
    if (checkboxes.length === 0) return;

    let addedCount = 0;
    checkboxes.forEach(chk => {
        const id = parseInt(chk.dataset.id);
        const tool = TOOLS_CATALOG.find(t => t.id === id);
        if (!tool) return;

        const qtyInput = document.getElementById(`tool-qty-${id}`);
        const qty = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;

        const existing = toolCart.find(item => item.id === id);
        if (existing) {
            if (existing.quantity + qty > tool.maxPerRequest) {
                existing.quantity = tool.maxPerRequest;
            } else {
                existing.quantity += qty;
            }
        } else {
            toolCart.push({
                id: tool.id,
                name: tool.name,
                category: tool.category,
                quantity: qty
            });
        }
        addedCount++;
        chk.checked = false; // Uncheck
        if (qtyInput) qtyInput.value = 1;
    });

    updateToolCartUI();
    updateBulkActionBar('tool');
    showToast(`Bulk added ${addedCount} tool types to borrow list`, 'success');
};

function showDetailsModal(item, type) {
    let modal = document.getElementById('details-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'details-modal';
        modal.className = 'modal-container';
        document.body.appendChild(modal);
    }
    
    const isComponent = type === 'component';
    const imgSrc = isComponent ? (item.image || './assets/images/component_placeholder.png') : './assets/images/tool_placeholder.png';
    const policyText = isComponent 
        ? 'Project Hand-over: Permanently handed over after project completion.'
        : 'Daily Use: Must be returned by the end of each working day.';
    const policyColor = isComponent ? '#4f46e5' : '#d97706';
    const policyBg = isComponent ? '#eef2ff' : '#fffbeb';
    const specsHTML = Object.entries(item.specs).map(([k, v]) => `
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;font-size:13.5px;">
            <span style="color:#64748b;font-weight:500;">${k}</span>
            <strong style="color:#0f172a;">${v}</strong>
        </div>
    `).join('');

    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeDetailsModal()" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.6);z-index:9999;backdrop-filter:blur(4px);animation:fadeIn 0.2s ease;"></div>
        <div class="modal-content" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:90%;max-width:500px;background:#fff;border-radius:16px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);z-index:10000;padding:24px;animation:slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">
                <h3 style="font-size:20px;font-weight:700;color:#0f172a;margin:0;">${item.name}</h3>
                <button onclick="closeDetailsModal()" style="border:none;background:none;font-size:20px;color:#94a3b8;cursor:pointer;line-height:1;"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div style="width:100%;height:200px;border-radius:12px;overflow:hidden;margin-bottom:16px;border:1px solid #e2e8f0;">
                <img src="${imgSrc}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;">
            </div>
            <div style="background:${policyBg};color:${policyColor};padding:10px 14px;border-radius:8px;font-size:12.5px;font-weight:600;margin-bottom:16px;display:flex;align-items:center;gap:8px;">
                <i class="fa-solid ${isComponent ? 'fa-circle-info' : 'fa-clock'}"></i>
                <span>${policyText}</span>
            </div>
            <p style="font-size:14px;color:#475569;line-height:1.6;margin:0 0 16px 0;">${item.description}</p>
            <div style="margin-bottom:20px;">
                <h4 style="font-size:14px;font-weight:700;color:#0f172a;margin:0 0 8px 0;border-bottom:2px solid #f1f5f9;padding-bottom:8px;">Technical Specifications</h4>
                <div style="margin-top:8px;">${specsHTML}</div>
            </div>
            <div style="display:flex;justify-content:flex-end;">
                <button onclick="closeDetailsModal()" class="btn btn-primary" style="padding:10px 24px;font-weight:600;cursor:pointer;">Close</button>
            </div>
        </div>
    `;
    modal.style.display = 'block';
}

window.closeDetailsModal = function() {
    const modal = document.getElementById('details-modal');
    if (modal) modal.style.display = 'none';
}

/* ============================================================
   EQUIPMENT BOOKING FUNCTIONS (INTEGRATED)
   ============================================================ */

/* ============================================================
   TOOL BORROWING FUNCTIONS
   ============================================================ */
window.renderToolCatalog = function() {
    const container = document.getElementById('tool-catalog');
    if (!container) return;

    const searchTerm = (document.getElementById('tool-search')?.value || '').toLowerCase();
    const filtered = TOOLS_CATALOG.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm) || tool.category.toLowerCase().includes(searchTerm)
    );

    container.innerHTML = filtered.map(tool => {
        const isSelected = document.querySelector(`.tool-select-chk[data-id="${tool.id}"]`)?.checked ? 'checked' : '';
        return `
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px;display:flex;flex-direction:column;align-items:center;text-align:center;position:relative;box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <!-- Selection Checkbox -->
            <label style="position:absolute;top:10px;right:10px;cursor:pointer;">
                <input type="checkbox" class="tool-select-chk" data-id="${tool.id}" ${isSelected} onchange="updateBulkActionBar('tool')" style="width:18px;height:18px;accent-color:#4f46e5;cursor:pointer;">
            </label>

            <!-- Card Image -->
            <div style="width:100%;height:120px;background:#f8fafc;border-radius:8px;overflow:hidden;margin-bottom:12px;border:1px solid #f1f5f9;">
                <img src="./assets/images/tool_placeholder.png" alt="${tool.name}" style="width:100%;height:100%;object-fit:cover;">
            </div>

            <h3 style="font-size:15px;font-weight:700;color:#0f172a;margin:0 0 4px 0;">${tool.name}</h3>
            <div style="display:flex;gap:6px;align-items:center;margin-bottom:12px;">
                <span class="mini-pill" style="font-size:10px;padding:2px 6px;background:#f1f5f9;color:#64748b;">${tool.category}</span>
            </div>

            <!-- Quantity Stepper -->
            <div style="display:flex;gap:8px;width:100%;margin-bottom:12px;align-items:center;justify-content:center;">
                <div style="display:flex;align-items:center;border:1px solid #cbd5e1;border-radius:6px;overflow:hidden;width:100px;background:#fff;">
                    <button onclick="adjustQty(${tool.id}, -1, 'tool')" style="border:none;background:#f8fafc;width:30px;height:32px;font-size:16px;cursor:pointer;color:#475569;font-weight:bold;outline:none;">−</button>
                    <input type="text" id="tool-qty-${tool.id}" value="1" readonly style="border:none;width:40px;height:32px;text-align:center;font-size:13.5px;font-weight:600;color:#0f172a;background:#fff;pointer-events:none;">
                    <button onclick="adjustQty(${tool.id}, 1, 'tool')" style="border:none;background:#f8fafc;width:30px;height:32px;font-size:16px;cursor:pointer;color:#475569;font-weight:bold;outline:none;">+</button>
                </div>
                <button onclick="addToolToCart(${tool.id})" class="btn btn-primary" style="padding:0;width:38px;height:34px;display:flex;align-items:center;justify-content:center;font-size:14px;"><i class="fa-solid fa-cart-plus"></i></button>
            </div>

            <button onclick="showToolDetails(${tool.id})" class="btn-text" style="color:#4f46e5;font-size:12.5px;font-weight:600;width:100%;">View Details</button>
        </div>`;
    }).join('');
};

window.showToolDetails = function(toolId) {
    const tool = TOOLS_CATALOG.find(t => t.id === toolId);
    if (!tool) return;
    showDetailsModal(tool, 'tool');
};

window.filterTools = function() {
    renderToolCatalog();
};

window.addToolToCart = function(id) {
    const tool = TOOLS_CATALOG.find(t => t.id === id);
    if (!tool) return;

    const qtyInput = document.getElementById(`tool-qty-${id}`);
    const qty = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;

    const existing = toolCart.find(item => item.id === id);
    if (existing) {
        if (existing.quantity + qty > tool.maxPerRequest) {
            existing.quantity = tool.maxPerRequest;
            showToast(`Adjusted quantity to max limit of ${tool.maxPerRequest} for ${tool.name}`, 'warning');
        } else {
            existing.quantity += qty;
        }
    } else {
        toolCart.push({
            id: tool.id,
            name: tool.name,
            category: tool.category,
            quantity: qty
        });
    }

    if (qtyInput) qtyInput.value = 1;
    updateToolCartUI();
    showToast(`${tool.name} (${qty}x) added to borrow list`, 'success');
};

function updateToolCartUI() {
    const badge = document.getElementById('tool-cart-badge');
    if (badge) {
        const total = toolCart.reduce((sum, t) => sum + t.quantity, 0);
        badge.textContent = total;
        badge.style.display = total > 0 ? 'inline-block' : 'none';
    }
}

window.switchToolTab = function(tab) {
    document.querySelectorAll('.tool-tab').forEach(btn => {
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
            btn.style.borderBottomColor = '#4f46e5';
            btn.style.color = '#4f46e5';
        } else {
            btn.classList.remove('active');
            btn.style.borderBottomColor = 'transparent';
            btn.style.color = '#64748b';
        }
    });

    document.querySelectorAll('.tool-tab-content').forEach(c => c.style.display = 'none');

    if (tab === 'browse') {
        document.getElementById('tab-browse-tools').style.display = 'block';
        renderToolCatalog();
    } else if (tab === 'cart') {
        document.getElementById('tab-cart-tools').style.display = 'block';
        renderToolCart();
    } else if (tab === 'requests') {
        document.getElementById('tab-requests-tools').style.display = 'block';
        renderToolRequests();
    }
};

function renderToolCart() {
    const empty = document.getElementById('tool-cart-empty');
    const items = document.getElementById('tool-cart-items');
    const list = document.getElementById('tool-cart-list');

    if (!empty || !items || !list) return;

    if (toolCart.length === 0) {
        empty.style.display = 'block';
        items.style.display = 'none';
        return;
    }

    empty.style.display = 'none';
    items.style.display = 'grid';

    const totalItems = toolCart.reduce((sum, t) => sum + t.quantity, 0);
    document.getElementById('tool-cart-total-types').textContent = toolCart.length;
    document.getElementById('tool-cart-total-items').textContent = totalItems;

    list.innerHTML = toolCart.map((item, i) => `
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px;display:flex;align-items:center;gap:16px;box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <div style="width:64px;height:64px;background:#f8fafc;border-radius:8px;overflow:hidden;border:1px solid #f1f5f9;flex-shrink:0;">
                <img src="./assets/images/tool_placeholder.png" alt="Tool" style="width:100%;height:100%;object-fit:cover;">
            </div>
            <div style="flex:1;">
                <h4 style="font-size:15px;font-weight:700;margin:0 0 4px 0;color:#0f172a;">${item.name}</h4>
                <p style="font-size:12.5px;color:#64748b;margin:0;">Quantity: <strong>${item.quantity}</strong> | ${item.category}</p>
            </div>
            <button onclick="removeToolFromCart(${i})" class="btn-text" style="color:#ef4444;padding:8px;cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
        </div>
    `).join('');
}

window.removeToolFromCart = function(idx) {
    toolCart.splice(idx, 1);
    updateToolCartUI();
    renderToolCart();
};

window.clearToolCart = function() {
    toolCart = [];
    updateToolCartUI();
    renderToolCart();
};

window.requestAllTools = function() {
    if (toolCart.length === 0) return;
    
    const remarks = document.querySelector('#tab-cart-tools textarea')?.value.trim() || '';
    
    const newReqId = `TB-${100 + MY_TOOL_REQUESTS.length + 1}`;
    const cartItemsList = toolCart.map(t => ({
        name: t.name,
        qty: t.quantity
    }));
    
    const formattedDate = new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).replace(',', '');
    
    MY_TOOL_REQUESTS.unshift({
        id: newReqId,
        cartItems: cartItemsList,
        date: formattedDate,
        status: 'Pending',
        purpose: remarks || 'No custom purpose specified.'
    });
    
    showToast('Tool borrow request submitted successfully!', 'success');
    
    // reset cart
    toolCart = [];
    updateToolCartUI();
    
    // clear textarea
    const tx = document.querySelector('#tab-cart-tools textarea');
    if (tx) tx.value = '';
    
    switchToolTab('requests');
};

function renderToolRequests() {
    const list = document.getElementById('my-tool-requests-list');
    if (!list) return;

    const statusColors = {
        'Pending': { bg: '#fff7ed', text: '#ea580c' },
        'Approved': { bg: '#f0fdf4', text: '#16a34a' },
        'Borrowed': { bg: '#eff6ff', text: '#2563eb' },
        'Returned': { bg: '#fdf4ff', text: '#c026d3' }
    };

    list.innerHTML = MY_TOOL_REQUESTS.map(r => {
        const c = statusColors[r.status] || { bg: '#f1f5f9', text: '#64748b' };
        const itemsStr = r.cartItems.map(item => `${item.name} (${item.qty}x)`).join(', ');
        return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding:16px;font-weight:700;color:#0f172a;">${r.id}</td>
            <td style="padding:16px;color:#475569;max-width:350px;">
                <div style="font-weight:600;margin-bottom:4px;color:#0f172a;">${r.cartItems.length} distinct item(s)</div>
                <div style="font-size:12px;color:#64748b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${itemsStr}">${itemsStr}</div>
            </td>
            <td style="padding:16px;color:#475569;">${r.date}</td>
            <td style="padding:16px;"><span style="background:${c.bg};color:${c.text};padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;">${r.status}</span></td>
            <td style="padding:16px;text-align:right;"><button onclick="viewToolRequestDetails('${r.id}')" class="btn-text" style="color:#4f46e5;font-size:13.5px;font-weight:700;cursor:pointer;">View Details</button></td>
        </tr>`;
    }).join('');
}

window.viewToolRequestDetails = function(requestId) {
    const request = MY_TOOL_REQUESTS.find(r => r.id === requestId);
    if (!request) return;
    
    let modal = document.getElementById('details-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'details-modal';
        modal.className = 'modal-container';
        document.body.appendChild(modal);
    }

    const itemsHTML = request.cartItems.map(item => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:8px;">
            <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:40px;height:40px;border-radius:6px;overflow:hidden;border:1px solid #cbd5e1;flex-shrink:0;">
                    <img src="./assets/images/tool_placeholder.png" style="width:100%;height:100%;object-fit:cover;">
                </div>
                <div>
                    <strong style="font-size:14px;color:#0f172a;display:block;">${item.name}</strong>
                </div>
            </div>
            <span style="background:#fef3c7;color:#d97706;font-weight:700;font-size:12.5px;padding:4px 12px;border-radius:12px;">Qty: ${item.qty}</span>
        </div>
    `).join('');

    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeDetailsModal()" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.6);z-index:9999;backdrop-filter:blur(4px);animation:fadeIn 0.2s ease;"></div>
        <div class="modal-content" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:95%;max-width:520px;background:#fff;border-radius:16px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);z-index:10000;padding:24px;animation:slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;border-bottom:1px solid #e2e8f0;padding-bottom:12px;">
                <div>
                    <h3 style="font-size:18px;font-weight:700;color:#0f172a;margin:0;">Request Details: ${request.id}</h3>
                    <span style="font-size:12px;color:#64748b;">Requested on ${request.date}</span>
                </div>
                <button onclick="closeDetailsModal()" style="border:none;background:none;font-size:22px;color:#94a3b8;cursor:pointer;line-height:1;"><i class="fa-solid fa-xmark"></i></button>
            </div>
            
            <div style="margin-bottom:16px;">
                <span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;display:block;margin-bottom:6px;letter-spacing:0.5px;">Status</span>
                <span style="background:${request.status === 'Pending' ? '#fff7ed' : request.status === 'Approved' ? '#f0fdf4' : request.status === 'Borrowed' ? '#eff6ff' : '#fdf4ff'};color:${request.status === 'Pending' ? '#ea580c' : request.status === 'Approved' ? '#16a34a' : request.status === 'Borrowed' ? '#2563eb' : '#c026d3'};padding:4px 12px;border-radius:20px;font-size:12.5px;font-weight:700;display:inline-block;">
                    ${request.status}
                </span>
            </div>

            <div style="margin-bottom:18px;">
                <span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;display:block;margin-bottom:6px;letter-spacing:0.5px;">Purpose / Description</span>
                <p style="font-size:13.5px;color:#475569;margin:0;background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;line-height:1.5;">${request.purpose || 'No custom purpose specified.'}</p>
            </div>

            <div style="margin-bottom:20px;max-height:220px;overflow-y:auto;padding-right:4px;">
                <span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;display:block;margin-bottom:8px;letter-spacing:0.5px;">Tools Requested (${request.cartItems.length})</span>
                <div>${itemsHTML}</div>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid #e2e8f0;padding-top:16px;flex-wrap:wrap;gap:12px;">
                <span style="font-size:12.5px;color:#d97706;font-weight:600;background:#fffbeb;padding:6px 12px;border-radius:6px;display:flex;align-items:center;gap:6px;">
                    <i class="fa-solid fa-clock"></i> Daily borrow item
                </span>
                <button onclick="closeDetailsModal()" class="btn btn-primary" style="padding:10px 24px;font-weight:600;cursor:pointer;">Close</button>
            </div>
        </div>
    `;
    modal.style.display = 'block';
};

/* ============================================================
   RETURNS SYSTEM
   ============================================================ */
window.switchReturnTab = function(tab) {
    document.querySelectorAll('.return-tab').forEach(btn => {
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
            btn.style.borderBottomColor = '#4f46e5';
            btn.style.color = '#4f46e5';
        } else {
            btn.classList.remove('active');
            btn.style.borderBottomColor = 'transparent';
            btn.style.color = '#64748b';
        }
    });

    document.querySelectorAll('.return-tab-content').forEach(c => c.style.display = 'none');

    if (tab === 'components') {
        document.getElementById('tab-return-components').style.display = 'block';
        renderComponentReturns();
    } else if (tab === 'tools') {
        document.getElementById('tab-return-tools').style.display = 'block';
        renderToolReturns();
    }
};

function renderComponentReturns() {
    const activeList = document.getElementById('active-component-issues-list');
    const returnLogList = document.getElementById('component-returns-list');
    
    if (activeList) {
        // Find component requests in possession (status 'Issued')
        const activeIssues = MY_COMPONENT_REQUESTS.filter(r => r.status === 'Issued');
        if (activeIssues.length === 0) {
            activeList.innerHTML = `<tr><td colspan="4" style="padding:24px;text-align:center;color:#94a3b8;font-style:italic;">No active component issues currently in your possession.</td></tr>`;
        } else {
            activeList.innerHTML = activeIssues.map(r => {
                const itemsStr = r.cartItems.map(item => `${item.name} (${item.qty}x)`).join(', ');
                return `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding:16px;font-weight:700;color:#0f172a;">${r.id}</td>
                    <td style="padding:16px;color:#475569;max-width:350px;">
                        <div style="font-weight:600;color:#0f172a;margin-bottom:4px;">${r.cartItems.length} items</div>
                        <div style="font-size:12px;color:#64748b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${itemsStr}">${itemsStr}</div>
                    </td>
                    <td style="padding:16px;color:#475569;">${r.date}</td>
                    <td style="padding:16px;text-align:right;">
                        <button onclick="viewActiveReturnDetails('${r.id}', 'component')" class="btn" style="padding:6px 14px;font-size:13px;background:#f0f4ff;border:1px solid #cbd5e1;color:#4f46e5;font-weight:600;cursor:pointer;">View & Return All</button>
                    </td>
                </tr>`;
            }).join('');
        }
    }

    if (returnLogList) {
        const statusColors = {
            'Completed': { bg: '#d1fae5', text: '#059669' },
            'Pending': { bg: '#fff7ed', text: '#ea580c' },
            'Processing': { bg: '#eff6ff', text: '#2563eb' }
        };

        if (COMPONENT_RETURNS.length === 0) {
            returnLogList.innerHTML = `<tr><td colspan="7" style="padding:24px;text-align:center;color:#94a3b8;font-style:italic;">No components returned yet.</td></tr>`;
        } else {
            returnLogList.innerHTML = COMPONENT_RETURNS.map(r => {
                const c = statusColors[r.status] || { bg: '#f1f5f9', text: '#64748b' };
                return `
                <tr style="border-bottom:1px solid #e2e8f0;">
                    <td style="padding:16px;font-weight:700;color:#0f172a;">${r.id}</td>
                    <td style="padding:16px;color:#0f172a;font-weight:600;">${r.componentName}</td>
                    <td style="padding:16px;color:#475569;">${r.requestId}</td>
                    <td style="padding:16px;color:#475569;">${r.returnDate}</td>
                    <td style="padding:16px;"><span style="background:#f1f5f9;color:#475569;padding:4px 10px;border-radius:6px;font-size:12.5px;font-weight:500;">${r.condition}</span></td>
                    <td style="padding:16px;"><span style="background:${c.bg};color:${c.text};padding:4px 10px;border-radius:20px;font-size:12px;font-weight:600;">${r.status}</span></td>
                    <td style="padding:16px;text-align:right;"><button onclick="viewComponentReturnDetails('${r.id}')" class="btn-text" style="color:#4f46e5;font-size:13.5px;font-weight:700;cursor:pointer;">View Details</button></td>
                </tr>`;
            }).join('');
        }
    }
}

function renderToolReturns() {
    const activeList = document.getElementById('active-tool-borrows-list');
    const returnLogList = document.getElementById('tool-returns-list');
    
    if (activeList) {
        // Find tool requests in possession (status 'Borrowed')
        const activeBorrows = MY_TOOL_REQUESTS.filter(r => r.status === 'Borrowed');
        if (activeBorrows.length === 0) {
            activeList.innerHTML = `<tr><td colspan="4" style="padding:24px;text-align:center;color:#94a3b8;font-style:italic;">No active tools borrowed currently in your possession.</td></tr>`;
        } else {
            activeList.innerHTML = activeBorrows.map(r => {
                const itemsStr = r.cartItems.map(item => `${item.name} (${item.qty}x)`).join(', ');
                return `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding:16px;font-weight:700;color:#0f172a;">${r.id}</td>
                    <td style="padding:16px;color:#475569;max-width:350px;">
                        <div style="font-weight:600;color:#0f172a;margin-bottom:4px;">${r.cartItems.length} tools</div>
                        <div style="font-size:12px;color:#64748b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${itemsStr}">${itemsStr}</div>
                    </td>
                    <td style="padding:16px;color:#475569;">${r.date}</td>
                    <td style="padding:16px;text-align:right;">
                        <button onclick="viewActiveReturnDetails('${r.id}', 'tool')" class="btn" style="padding:6px 14px;font-size:13px;background:#fffbeb;border:1px solid #cbd5e1;color:#d97706;font-weight:600;cursor:pointer;">View & Return All</button>
                    </td>
                </tr>`;
            }).join('');
        }
    }

    if (returnLogList) {
        const statusColors = {
            'Completed': { bg: '#d1fae5', text: '#059669' },
            'Pending': { bg: '#fff7ed', text: '#ea580c' },
            'Processing': { bg: '#eff6ff', text: '#2563eb' }
        };

        if (TOOL_RETURNS.length === 0) {
            returnLogList.innerHTML = `<tr><td colspan="7" style="padding:24px;text-align:center;color:#94a3b8;font-style:italic;">No tools returned yet.</td></tr>`;
        } else {
            returnLogList.innerHTML = TOOL_RETURNS.map(r => {
                const c = statusColors[r.status] || { bg: '#f1f5f9', text: '#64748b' };
                return `
                <tr style="border-bottom:1px solid #e2e8f0;">
                    <td style="padding:16px;font-weight:700;color:#0f172a;">${r.id}</td>
                    <td style="padding:16px;color:#0f172a;font-weight:600;">${r.toolName}</td>
                    <td style="padding:16px;color:#475569;">${r.requestId}</td>
                    <td style="padding:16px;color:#475569;">${r.returnDate}</td>
                    <td style="padding:16px;"><span style="background:#f1f5f9;color:#475569;padding:4px 10px;border-radius:6px;font-size:12.5px;font-weight:500;">${r.condition}</span></td>
                    <td style="padding:16px;"><span style="background:${c.bg};color:${c.text};padding:4px 10px;border-radius:20px;font-size:12px;font-weight:600;">${r.status}</span></td>
                    <td style="padding:16px;text-align:right;"><button onclick="viewToolReturnDetails('${r.id}')" class="btn-text" style="color:#4f46e5;font-size:13.5px;font-weight:700;cursor:pointer;">View Details</button></td>
                </tr>`;
            }).join('');
        }
    }
}

window.viewActiveReturnDetails = function(requestId, type) {
    const isComp = type === 'component';
    const request = isComp 
        ? MY_COMPONENT_REQUESTS.find(r => r.id === requestId)
        : MY_TOOL_REQUESTS.find(r => r.id === requestId);
    if (!request) return;

    let modal = document.getElementById('details-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'details-modal';
        modal.className = 'modal-container';
        document.body.appendChild(modal);
    }

    const compPlaceholder = './assets/images/component_placeholder.png';
    const toolPlaceholder = './assets/images/tool_placeholder.png';

    const itemsHTML = request.cartItems.map(item => {
        let itemImg;
        if (isComp) {
            const catalogEntry = COMPONENTS_CATALOG.find(c => c.name === item.name);
            itemImg = (catalogEntry && catalogEntry.image) ? catalogEntry.image : compPlaceholder;
        } else {
            itemImg = toolPlaceholder;
        }
        return `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:8px;">
            <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:40px;height:40px;border-radius:6px;overflow:hidden;border:1px solid #cbd5e1;flex-shrink:0;">
                    <img src="${itemImg}" style="width:100%;height:100%;object-fit:cover;">
                </div>
                <div>
                    <strong style="font-size:14px;color:#0f172a;display:block;">${item.name}</strong>
                </div>
            </div>
            <span style="background:${isComp ? '#e0e7ff' : '#fef3c7'};color:${isComp ? '#3730a3' : '#d97706'};font-weight:700;font-size:12.5px;padding:4px 12px;border-radius:12px;">Qty: ${item.qty}</span>
        </div>
        `;
    }).join('');

    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeDetailsModal()" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.6);z-index:9999;backdrop-filter:blur(4px);animation:fadeIn 0.2s ease;"></div>
        <div class="modal-content" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:95%;max-width:520px;background:#fff;border-radius:16px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);z-index:10000;padding:24px;animation:slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;border-bottom:1px solid #e2e8f0;padding-bottom:12px;">
                <div>
                    <h3 style="font-size:18px;font-weight:700;color:#0f172a;margin:0;">Active Issue Details: ${request.id}</h3>
                    <span style="font-size:12px;color:#64748b;">Issued on ${request.date}</span>
                </div>
                <button onclick="closeDetailsModal()" style="border:none;background:none;font-size:22px;color:#94a3b8;cursor:pointer;line-height:1;"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <div style="margin-bottom:18px;max-height:240px;overflow-y:auto;padding-right:4px;">
                <span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;display:block;margin-bottom:8px;letter-spacing:0.5px;">Possessed Items to Return</span>
                <div>${itemsHTML}</div>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid #e2e8f0;padding-top:16px;">
                <button onclick="closeDetailsModal()" class="btn-text" style="color:#64748b;font-weight:600;font-size:14px;cursor:pointer;">Cancel</button>
                <button onclick="submitPossessionReturn('${request.id}', '${type}')" class="btn btn-primary" style="padding:10px 24px;font-weight:600;cursor:pointer;background:${isComp ? '#4f46e5' : '#d97706'};border-color:${isComp ? '#4f46e5' : '#d97706'};">Submit Return Request</button>
            </div>
        </div>
    `;
    modal.style.display = 'block';
};

window.submitPossessionReturn = function(requestId, type) {
    const isComp = type === 'component';
    const request = isComp 
        ? MY_COMPONENT_REQUESTS.find(r => r.id === requestId)
        : MY_TOOL_REQUESTS.find(r => r.id === requestId);
    if (!request) return;

    // Change request status to Returned
    request.status = 'Returned';

    const formattedDate = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

    // Append to returns lists
    request.cartItems.forEach(item => {
        if (isComp) {
            const retId = `RET-${String(100 + COMPONENT_RETURNS.length + 1).slice(-3)}`;
            COMPONENT_RETURNS.unshift({
                id: retId,
                componentName: item.name,
                requestId: requestId,
                returnDate: formattedDate,
                condition: 'Good',
                status: 'Completed'
            });
        } else {
            const retId = `TR-${String(100 + TOOL_RETURNS.length + 1).slice(-3)}`;
            TOOL_RETURNS.unshift({
                id: retId,
                toolName: item.name,
                requestId: requestId,
                returnDate: formattedDate,
                condition: 'Good',
                status: 'Completed'
            });
        }
    });

    closeDetailsModal();
    showToast('Return request processed successfully. Items marked as returned.', 'success');

    // Re-render return views
    if (isComp) {
        renderComponentReturns();
    } else {
        renderToolReturns();
    }
};

window.viewComponentReturnDetails = function(returnId) {
    const ret = COMPONENT_RETURNS.find(r => r.id === returnId);
    if (!ret) return;
    
    let modal = document.getElementById('details-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'details-modal';
        modal.className = 'modal-container';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeDetailsModal()" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.6);z-index:9999;backdrop-filter:blur(4px);animation:fadeIn 0.2s ease;"></div>
        <div class="modal-content" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:90%;max-width:450px;background:#fff;border-radius:16px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);z-index:10000;padding:24px;animation:slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;border-bottom:1px solid #e2e8f0;padding-bottom:12px;">
                <h3 style="font-size:18px;font-weight:700;color:#0f172a;margin:0;">Return Log: ${ret.id}</h3>
                <button onclick="closeDetailsModal()" style="border:none;background:none;font-size:20px;color:#94a3b8;cursor:pointer;line-height:1;"><i class="fa-solid fa-xmark"></i></button>
            </div>
            
            <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px;">
                <div style="display:flex;justify-content:space-between;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">
                    <span style="color:#64748b;font-size:13.5px;">Component Name</span>
                    <strong style="color:#0f172a;font-size:13.5px;">${ret.componentName}</strong>
                </div>
                <div style="display:flex;justify-content:space-between;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">
                    <span style="color:#64748b;font-size:13.5px;">Reference Request ID</span>
                    <strong style="color:#0f172a;font-size:13.5px;">${ret.requestId}</strong>
                </div>
                <div style="display:flex;justify-content:space-between;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">
                    <span style="color:#64748b;font-size:13.5px;">Date Returned</span>
                    <strong style="color:#0f172a;font-size:13.5px;">${ret.returnDate}</strong>
                </div>
                <div style="display:flex;justify-content:space-between;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">
                    <span style="color:#64748b;font-size:13.5px;">Physical Condition</span>
                    <strong style="color:#3b82f6;font-size:13.5px;">${ret.condition}</strong>
                </div>
                <div style="display:flex;justify-content:space-between;padding-bottom:8px;">
                    <span style="color:#64748b;font-size:13.5px;">Return Status</span>
                    <strong style="color:#10b981;font-size:13.5px;">${ret.status}</strong>
                </div>
            </div>

            <div style="display:flex;justify-content:flex-end;">
                <button onclick="closeDetailsModal()" class="btn btn-primary" style="padding:10px 24px;font-weight:600;cursor:pointer;">Close</button>
            </div>
        </div>
    `;
    modal.style.display = 'block';
};

window.viewToolReturnDetails = function(returnId) {
    const ret = TOOL_RETURNS.find(r => r.id === returnId);
    if (!ret) return;
    
    let modal = document.getElementById('details-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'details-modal';
        modal.className = 'modal-container';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeDetailsModal()" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.6);z-index:9999;backdrop-filter:blur(4px);animation:fadeIn 0.2s ease;"></div>
        <div class="modal-content" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:90%;max-width:450px;background:#fff;border-radius:16px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);z-index:10000;padding:24px;animation:slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;border-bottom:1px solid #e2e8f0;padding-bottom:12px;">
                <h3 style="font-size:18px;font-weight:700;color:#0f172a;margin:0;">Return Log: ${ret.id}</h3>
                <button onclick="closeDetailsModal()" style="border:none;background:none;font-size:20px;color:#94a3b8;cursor:pointer;line-height:1;"><i class="fa-solid fa-xmark"></i></button>
            </div>
            
            <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px;">
                <div style="display:flex;justify-content:space-between;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">
                    <span style="color:#64748b;font-size:13.5px;">Tool Name</span>
                    <strong style="color:#0f172a;font-size:13.5px;">${ret.toolName}</strong>
                </div>
                <div style="display:flex;justify-content:space-between;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">
                    <span style="color:#64748b;font-size:13.5px;">Reference Borrow ID</span>
                    <strong style="color:#0f172a;font-size:13.5px;">${ret.requestId}</strong>
                </div>
                <div style="display:flex;justify-content:space-between;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">
                    <span style="color:#64748b;font-size:13.5px;">Date Returned</span>
                    <strong style="color:#0f172a;font-size:13.5px;">${ret.returnDate}</strong>
                </div>
                <div style="display:flex;justify-content:space-between;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">
                    <span style="color:#64748b;font-size:13.5px;">Physical Condition</span>
                    <strong style="color:#3b82f6;font-size:13.5px;">${ret.condition}</strong>
                </div>
                <div style="display:flex;justify-content:space-between;padding-bottom:8px;">
                    <span style="color:#64748b;font-size:13.5px;">Return Status</span>
                    <strong style="color:#10b981;font-size:13.5px;">${ret.status}</strong>
                </div>
            </div>

            <div style="display:flex;justify-content:flex-end;">
                <button onclick="closeDetailsModal()" class="btn btn-primary" style="padding:10px 24px;font-weight:600;cursor:pointer;">Close</button>
            </div>
        </div>
    `;
    modal.style.display = 'block';
};

/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */
function showToast(message, type) {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // You can implement a proper toast notification here
    // For now, using console and optional alert
    if (type === 'error') alert(message);
}

/* ============================================================
   INITIALIZATION
   ============================================================ */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize first view
    spaNavigate('dashboard');

    // Setup submenu toggles
    document.querySelectorAll('.submenu-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.closest('.menu-item');
            parent.classList.toggle('active');
        });
    });

    // Render initial views
    renderStageTrackerView(3);
    renderComponentCatalog();
    renderToolCatalog();
});

/* ============================================================
   MOCK DOCUMENT VIEW & DOWNLOAD HUB
   ============================================================ */
window.viewMockFile = function(filename) {
    let modal = document.getElementById('details-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'details-modal';
        modal.className = 'modal-container';
        document.body.appendChild(modal);
    }

    const isPdf = filename.endsWith('.pdf');
    const docTitle = filename;
    
    let bodyContent = '';
    if (filename.includes('Design_Document')) {
        bodyContent = `
            <h4 style="margin:0 0 10px 0;color:#0f172a;font-size:16px;font-weight:700;">Smart Agriculture Robot - Design Document</h4>
            <p style="font-size:13px;color:#64748b;margin-bottom:16px;">Document ID: DOC-2025-DD | Status: Approved</p>
            <div style="font-size:13.5px;color:#334155;line-height:1.6;">
                <p><strong>1. Executive Summary</strong><br>This document outlines the detailed system design, hardware configurations, and electrical specifications for the Smart Agriculture Robot (PRJ-2025-07). The robot aims to automate weed detection and soil moisture level sensing in micro-farms.</p>
                <p><strong>2. Hardware Architecture</strong><br>The system leverages an Arduino Uno R3 for low-level sensor reading and actuator driving, while an ESP32 acts as the communication gate to publish telemetry to the cloud dashboard.</p>
                <p><strong>3. Electrical Diagram</strong><br>Connections include TT motors, ultrasonic sensor, soil moisture probes, and DHT22 temperature sensor on a central breadboard powered by a rechargeable Li-Ion pack.</p>
            </div>
        `;
    } else if (filename.includes('System_Architecture')) {
        bodyContent = `
            <h4 style="margin:0 0 10px 0;color:#0f172a;font-size:16px;font-weight:700;">Smart Agriculture Robot - System Architecture</h4>
            <p style="font-size:13px;color:#64748b;margin-bottom:16px;">Document ID: DOC-2025-SA | Status: Approved</p>
            <div style="font-size:13.5px;color:#334155;line-height:1.6;text-align:center;">
                <div style="background:#f1f5f9;border:1px dashed #cbd5e1;padding:20px;border-radius:8px;margin-bottom:16px;">
                    <div style="font-weight:700;color:#0f172a;margin-bottom:8px;">[Cloud IoT Dashboard]</div>
                    <div style="margin-bottom:8px;"><i class="fa-solid fa-arrow-up-down"></i> MQTT over Wi-Fi</div>
                    <div style="font-weight:700;color:#3b82f6;margin-bottom:8px;">[ESP32 Gateway]</div>
                    <div style="margin-bottom:8px;"><i class="fa-solid fa-arrow-up-down"></i> I2C Serial</div>
                    <div style="font-weight:700;color:#10b981;">[Arduino Uno MCU]</div>
                    <div style="font-size:11px;color:#64748b;margin-top:4px;">(Sensors, Motors, Actuators)</div>
                </div>
                <p style="text-align:left;font-size:13px;color:#475569;">The structural model provides decoupled roles: the ESP32 acts as the connectivity broker while the Arduino handles real-time actuator loops, preventing communication delays from slowing mechanical steps.</p>
            </div>
        `;
    } else if (filename.includes('Review_Comments')) {
        bodyContent = `
            <h4 style="margin:0 0 10px 0;color:#991b1b;font-size:16px;font-weight:700;"><i class="fa-solid fa-circle-exclamation"></i> Faculty Review Comments</h4>
            <p style="font-size:13px;color:#64748b;margin-bottom:16px;">Reviewer: Dr. R. Kumar | Date: 04 Jun 2025</p>
            <div style="font-size:13.5px;color:#334155;line-height:1.6;background:#fef2f2;border-left:4px solid #ef4444;padding:12px;border-radius:6px;">
                <p style="margin:0 0 8px 0;"><strong>Comments on Design Document:</strong></p>
                <ul style="margin:0;padding-left:20px;color:#7f1d1d;">
                    <li>Ensure power supply lines are regulated properly. The ESP32 is sensitive to voltage drops when TT DC motors startup. Add a bypass capacitor.</li>
                    <li>Add clear labels to your serial port connection pins. Use hardware serial if possible instead of SoftwareSerial on Arduino Uno.</li>
                    <li>Include a failure recovery state in the software state chart.</li>
                </ul>
            </div>
        `;
    } else if (filename.includes('Suggestions')) {
        bodyContent = `
            <h4 style="margin:0 0 10px 0;color:#1e3a8a;font-size:16px;font-weight:700;"><i class="fa-solid fa-lightbulb"></i> Recommended Improvements</h4>
            <p style="font-size:13px;color:#64748b;margin-bottom:16px;">Reviewer: Dr. R. Kumar | Date: 04 Jun 2025</p>
            <div style="font-size:13.5px;color:#334155;line-height:1.6;background:#eff6ff;border-left:4px solid #3b82f6;padding:12px;border-radius:6px;">
                <p style="margin:0 0 8px 0;"><strong>Dr. Kumar's Recommendations:</strong></p>
                <p style="margin:0;color:#1e40af;">"Consider replacing the standard DHT22 sensor with an industrial-grade waterproof SHT30 sensor for field soil-level moisture protection. I've approved this stage, but please integrate these safety suggestions in your final prototyping stage."</p>
            </div>
        `;
    } else {
        bodyContent = `
            <h4 style="margin:0 0 10px 0;color:#0f172a;font-size:16px;font-weight:700;">Document: ${filename}</h4>
            <p style="font-size:13px;color:#64748b;margin-bottom:16px;">File Preview</p>
            <div style="font-size:13.5px;color:#334155;line-height:1.6;text-align:center;padding:24px;background:#f8fafc;border-radius:8px;border:1px dashed #cbd5e1;">
                <i class="fa-regular fa-file" style="font-size:48px;color:#94a3b8;margin-bottom:12px;display:block;"></i>
                <span>Simulated preview for <strong>${filename}</strong></span>
            </div>
        `;
    }

    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeDetailsModal()" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.6);z-index:9999;backdrop-filter:blur(4px);animation:fadeIn 0.2s ease;"></div>
        <div class="modal-content" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:95%;max-width:600px;background:#fff;border-radius:16px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);z-index:10000;padding:24px;animation:slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;border-bottom:1px solid #e2e8f0;padding-bottom:12px;">
                <div style="display:flex;align-items:center;gap:8px;">
                    <i class="fa-solid ${isPdf ? 'fa-file-pdf' : 'fa-file-word'}" style="color:${isPdf ? '#ef4444' : '#2b579a'};font-size:20px;"></i>
                    <h3 style="font-size:17px;font-weight:700;color:#0f172a;margin:0;">Document Preview: ${docTitle}</h3>
                </div>
                <button onclick="closeDetailsModal()" style="border:none;background:none;font-size:22px;color:#94a3b8;cursor:pointer;line-height:1;"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <div style="margin-bottom:20px;background:#fff;border:1px solid #cbd5e1;border-radius:8px;padding:20px;max-height:400px;overflow-y:auto;box-shadow:inset 0 1px 3px rgba(0,0,0,0.02);">
                ${bodyContent}
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid #e2e8f0;padding-top:16px;">
                <button onclick="closeDetailsModal()" class="btn-text" style="color:#64748b;font-weight:600;font-size:14px;cursor:pointer;">Close</button>
                <button onclick="downloadMockFile('${filename}')" class="btn btn-primary" style="padding:10px 24px;font-weight:600;cursor:pointer;background:#059669;border-color:#059669;"><i class="fa-solid fa-download"></i> Download File</button>
            </div>
        </div>
    `;
    modal.style.display = 'block';
};

window.downloadMockFile = function(filename) {
    showToast(`Downloading file: ${filename}...`, 'success');
    
    const blob = new Blob([`Simulated download contents for ${filename}`], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
};

/* ==========================================================
   EQUIPMENT BOOKING LOGIC
   ========================================================== */

const selectEquipmentTab = document.getElementById("selectEquipmentTab");
const myBookingsTab = document.getElementById("myBookingsTab");

const selectEquipmentPage = document.getElementById("selectEquipmentPage");
const myBookingsPage = document.getElementById("myBookingsPage");
const selectEquipmentUnitPage = document.getElementById("selectEquipmentUnitPage");
const equipmentBookingFormPage = document.getElementById("equipmentBookingFormPage");
const bookingDetailsPage = document.getElementById("bookingDetailsPage");
const fromTime = document.getElementById("fromTime");
const toTime = document.getElementById("toTime");

console.log("Equipment Booking JS Loaded");

/* ===========================================
   HIDE ALL PAGES
   =========================================== */

function hideAllPages() {
    if (selectEquipmentPage) selectEquipmentPage.style.display = "none";
    if (selectEquipmentUnitPage) selectEquipmentUnitPage.style.display = "none";
    if (equipmentBookingFormPage) equipmentBookingFormPage.style.display = "none";
    if (myBookingsPage) myBookingsPage.style.display = "none";
    if (bookingDetailsPage) bookingDetailsPage.style.display = "none";
}

/* ===========================================
   DEFAULT PAGE
   =========================================== */

window.showSelectEquipmentPage = function() {
    hideAllPages();
    if (selectEquipmentPage) selectEquipmentPage.style.display = "block";
    if (selectEquipmentTab) selectEquipmentTab.classList.add("active");
    if (myBookingsTab) myBookingsTab.classList.remove("active");
}

/* ===========================================
   TAB SWITCHING
   =========================================== */

if (selectEquipmentTab) {
    selectEquipmentTab.addEventListener("click", function () {
        showSelectEquipmentPage();
    });
}

if (myBookingsTab) {
    myBookingsTab.addEventListener("click", function () {
        hideAllPages();
        if (myBookingsPage) myBookingsPage.style.display = "block";
        if (myBookingsTab) myBookingsTab.classList.add("active");
        if (selectEquipmentTab) selectEquipmentTab.classList.remove("active");
    });
}

/* ===========================================
   SELECTED EQUIPMENT
   =========================================== */

let selectedEquipment = {
    name: "",
    units: 0,
    selectedUnit: ""
};

let availableTimeSlots = [];

/* ===========================================
   OPEN EQUIPMENT SELECTION
   =========================================== */

window.openEquipmentSelection = function(name, units, imagePath) {
    selectedEquipment.name = name;
    selectedEquipment.units = units;
    selectedEquipment.imagePath = imagePath;
    loadSelectedEquipment();
    loadEquipmentUnits();
    hideAllPages();
    if (selectEquipmentUnitPage) selectEquipmentUnitPage.style.display = "block";
}

/* ===========================================
   UPDATE EQUIPMENT DETAILS
   =========================================== */

   function loadSelectedEquipment() {
    // 1. Update the text
    const nameEl = document.getElementById("selectedEquipmentName");
    if (nameEl) nameEl.innerText = selectedEquipment.name;

    const unitsEl = document.getElementById("selectedEquipmentUnits");
    if (unitsEl) unitsEl.innerText = selectedEquipment.units;

    // 2. Update the image
    const imgElement = document.getElementById("selectedEquipmentImg");
    if (imgElement && selectedEquipment.imagePath) {
        imgElement.src = selectedEquipment.imagePath;
    }
}

/* ============================================
   LOAD EQUIPMENT UNITS
   ============================================ */

function loadEquipmentUnits() {
    const unitList = document.getElementById("equipmentUnitList");
    if (!unitList) return;
    unitList.innerHTML = "";

    for (let i = 1; i <= selectedEquipment.units; i++) {
        unitList.innerHTML += `
            <label class="equipment-unit">
                <input
                    type="radio"
                    name="equipmentUnit"
                    value="${selectedEquipment.name}-${String(i).padStart(2, "0")}">
                ${selectedEquipment.name}-${String(i).padStart(2, "0")}
            </label>
        `;
    }
}

/* ===========================================
   CONTINUE TO BOOKING FORM
   =========================================== */

window.continueBooking = function() {
    const selected = document.querySelector('input[name="equipmentUnit"]:checked');
    if (!selected) {
        alert("Please select an equipment unit.");
        return;
    }

    selectedEquipment.selectedUnit = selected.value;

    const bookingEquip = document.getElementById("bookingEquipment");
    if (bookingEquip) bookingEquip.value = selectedEquipment.name;

    const bookingUnit = document.getElementById("bookingEquipmentUnit");
    if (bookingUnit) bookingUnit.value = selectedEquipment.selectedUnit;

    openBookingForm();
}

/* ===========================================
   OPEN BOOKING FORM
   =========================================== */

function openBookingForm() {
    hideAllPages();
    if (equipmentBookingFormPage) equipmentBookingFormPage.style.display = "block";
    loadTimeSlots();
}

/* ===========================================
   SUBMIT BOOKING
   =========================================== */

window.submitBooking = function() {
    const date = document.getElementById("bookingDate") ? document.getElementById("bookingDate").value : "";
    const from = document.getElementById("fromTime") ? document.getElementById("fromTime").value : "";
    const to = document.getElementById("toTime") ? document.getElementById("toTime").value : "";
    const purposeEl = document.getElementById("bookingPurpose");
    const purpose = purposeEl ? purposeEl.value.trim() : "";

    if (date === "") {
        alert("Please select a booking date.");
        return;
    }

    

    if (purpose === "") {
        alert("Please enter the purpose of booking.");
        return;
    }

    
alert(
    "✅ Booking will be confirmed if the slot is available."
);

    resetBookingForm();
    hideAllPages();

    if (myBookingsPage) myBookingsPage.style.display = "block";
    if (myBookingsTab) myBookingsTab.classList.add("active");
    if (selectEquipmentTab) selectEquipmentTab.classList.remove("active");
}

/* ===========================================
   RESET BOOKING FORM
   =========================================== */

function resetBookingForm() {
    const dateEl = document.getElementById("bookingDate");
    if (dateEl) dateEl.value = "";

    const fromEl = document.getElementById("fromTime");
    if (fromEl) fromEl.innerHTML = '<option value="">Select Time</option>';

    const toEl = document.getElementById("toTime");
    if (toEl) toEl.innerHTML = '<option value="">Select Time</option>';

    const purposeEl = document.getElementById("bookingPurpose");
    if (purposeEl) purposeEl.value = "";

    const slotAvailability = document.getElementById("slotAvailability");
    if (slotAvailability) slotAvailability.innerHTML = "<p>Select a booking date to view equipment availability.</p>";

    availableTimeSlots = [];
}

/* ===========================================
   VIEW BOOKING DETAILS
   =========================================== */

window.viewBookingDetails = function() {
    hideAllPages();
    if (bookingDetailsPage) bookingDetailsPage.style.display = "block";
}

/* ===========================================
   BACK TO SELECT EQUIPMENT
   =========================================== */

window.backToSelectEquipment = function() {
    hideAllPages();
    if (selectEquipmentPage) selectEquipmentPage.style.display = "block";
    if (selectEquipmentTab) selectEquipmentTab.classList.add("active");
    if (myBookingsTab) myBookingsTab.classList.remove("active");
}

/* ===========================================
   BACK TO EQUIPMENT UNIT
   =========================================== */

window.backToEquipmentUnit = function() {
    hideAllPages();
    if (selectEquipmentUnitPage) selectEquipmentUnitPage.style.display = "block";
}

/* ===========================================
   BACK TO MY BOOKINGS
   =========================================== */

window.backToMyBookings = function() {
    hideAllPages();
    if (myBookingsPage) myBookingsPage.style.display = "block";
    if (myBookingsTab) myBookingsTab.classList.add("active");
    if (selectEquipmentTab) selectEquipmentTab.classList.remove("active");
}

/* ===========================================
   BOOKING DATE CHANGE
   =========================================== */

const bookingDate = document.getElementById("bookingDate");
if (bookingDate) {
    bookingDate.addEventListener("change", function () {
        loadSlotAvailability();
    });
}

/* ===========================================
   LOAD SLOT AVAILABILITY
   =========================================== */

function loadSlotAvailability() {
    const slotContainer = document.getElementById("slotAvailability");
    const bookingDateEl = document.getElementById("bookingDate");
    const bookingDateVal = bookingDateEl ? bookingDateEl.value : "";

    if (!slotContainer) return;

    if (!bookingDateVal) {
        slotContainer.innerHTML = "<p>Select a booking date to view availability.</p>";
        return;
    }

    
const slots = [
    "09:00 - 10:30",
    "11.05 - 11:30",
    "12:10 - 12:20",
    "14:00 - 15:00"
];


    const statusList = ["available", "booked", "maintenance"];
    slotContainer.innerHTML = "";
    availableTimeSlots = [];

    slots.forEach(slot => {
        const status = statusList[Math.floor(Math.random() * statusList.length)];
        let statusText = "";

        if (status === "available") {
            statusText = "Available";
            availableTimeSlots.push(slot);
        } else if (status === "booked") {
            statusText = "Booked";
        } else {
            statusText = "Maintenance";
        }

        slotContainer.innerHTML += `
            <div class="slot-item ${status}">
                <span class="slot-time">${slot}</span>
                <span class="slot-status">${statusText}</span>
            </div>
        `;
    });
    loadTimeSlots();
}

/* ===========================================
   LOAD AVAILABLE TIME SLOTS
   =========================================== */

function loadTimeSlots() {
    const fromTimeEl = document.getElementById("fromTime");
    const toTimeEl = document.getElementById("toTime");

    if (!fromTimeEl || !toTimeEl) return;

    fromTimeEl.innerHTML = '<option value="">Select Time</option>';
    toTimeEl.innerHTML = '<option value="">Select Time</option>';

    availableTimeSlots.forEach(slot => {
        const startTime = slot.split(" - ")[0];
        fromTimeEl.innerHTML += `<option value="${startTime}">${startTime}</option>`;
        toTimeEl.innerHTML += `<option value="${startTime}">${startTime}</option>`;
    });
}

/* ===========================================
   UPDATE TO TIME
   =========================================== */

if (fromTime) {
    fromTime.addEventListener("change", function () {
        if (!toTime) return;
        toTime.innerHTML = '<option value="">Select Time</option>';
        const selectedTime = fromTime.value;
        let startAdding = false;

        availableTimeSlots.forEach(slot => {
            const times = slot.split(" - ");
            const startTime = times[0];
            const endTime = times[1];

            if (startTime === selectedTime) {
                startAdding = true;
            }

            if (startAdding) {
                toTime.innerHTML += `<option value="${endTime}">${endTime}</option>`;
            }
        });
    });
}

/* ===========================================
   MY BOOKINGS FILTER
   =========================================== */

const bookingSearch = document.getElementById("bookingSearch");
const equipmentFilter = document.getElementById("equipmentFilter");
const statusFilter = document.getElementById("statusFilter");
const resetBookingFilter = document.getElementById("resetBookingFilter");

function filterBookings() {
    if (!bookingSearch || !equipmentFilter || !statusFilter) return;

    const search = bookingSearch.value.toLowerCase();
    const equipment = equipmentFilter.value.toLowerCase();
    const status = statusFilter.value.toLowerCase();
    const rows = document.querySelectorAll("#bookingTable tbody tr");

    rows.forEach(row => {
        const bookingId = row.cells[0].innerText.toLowerCase();
        const equipmentName = row.cells[1].innerText.toLowerCase();
        const bookingStatus = row.cells[5].innerText.toLowerCase();
        let show = true;

        if (search && !bookingId.includes(search) && !equipmentName.includes(search)) {
            show = false;
        }

        if (equipment !== "all equipment" && equipment !== equipmentName) {
            show = false;
        }

        if (status !== "all status" && status !== bookingStatus) {
            show = false;
        }

        row.style.display = show ? "" : "none";
    });
}

if (bookingSearch) bookingSearch.addEventListener("keyup", filterBookings);
if (equipmentFilter) equipmentFilter.addEventListener("change", filterBookings);
if (statusFilter) statusFilter.addEventListener("change", filterBookings);

if (resetBookingFilter) {
    resetBookingFilter.addEventListener("click", function () {
        if (bookingSearch) bookingSearch.value = "";
        if (equipmentFilter) equipmentFilter.selectedIndex = 0;
        if (statusFilter) statusFilter.selectedIndex = 0;
        filterBookings();
    });
}

/* ===========================================
   EQUIPMENT SEARCH & FILTER
   =========================================== */

const equipmentSearch = document.getElementById("equipmentSearch");
const equipmentCategory = document.getElementById("equipmentCategory");

function filterEquipment() {
    if (!equipmentSearch || !equipmentCategory) return;

    const search = equipmentSearch.value.toLowerCase();
    const category = equipmentCategory.value.toLowerCase();
    const cards = document.querySelectorAll(".equipment-card");

    cards.forEach(card => {
        const title = card.querySelector(".equipment-card-title").innerText.toLowerCase();
        const cardCategory = card.dataset.category.toLowerCase();
        let show = true;

        if (search && !title.includes(search)) {
            show = false;
        }

        if (category !== "all categories" && category !== cardCategory) {
            show = false;
        }

        card.style.display = show ? "block" : "none";
    });
}

if (equipmentSearch) equipmentSearch.addEventListener("keyup", filterEquipment);
if (equipmentCategory) equipmentCategory.addEventListener("change", filterEquipment);