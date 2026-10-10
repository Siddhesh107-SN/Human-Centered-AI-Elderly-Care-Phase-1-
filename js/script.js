/**
 * Human-Centered AI for Elderly Care and Remote Health Monitoring
 * Frontend Prototype - Core Application Logic & State Management
 * 
 * Strict Vanilla JavaScript (No frameworks, pure standard DOM APIs)
 */

document.addEventListener('DOMContentLoaded', () => {
  // ========================================================================
  // 1. APPLICATION STATE (Mock In-Memory Store)
  // ========================================================================
  const appState = {
    currentRole: 'senior', // 'senior' (Meera) or 'caregiver' (Rahul)
    currentView: 'dashboard',
    fontScale: 1.0,
    highContrast: false,
    checkIn: {
      answered: false,
      feeling: null,
      time: null
    },
    vitals: {
      heartRate: 72,
      bloodPressure: '120/80',
      spO2: 98,
      temperature: 98.4,
      status: 'Good'
    },
    medications: [
      { id: 'med-1', name: 'Amlodipine (Blood Pressure)', dose: '5 mg', time: 'Morning 8:00 AM', taken: true, takenTime: '8:02 AM' },
      { id: 'med-2', name: 'Multivitamin & Calcium', dose: '1 Tablet', time: 'Afternoon 1:00 PM', taken: false, takenTime: null },
      { id: 'med-3', name: 'Metformin (Glucose Control)', dose: '500 mg', time: 'Evening 8:00 PM', taken: false, takenTime: null }
    ],
    notificationsCount: 3,
    activities: [
      { id: 1, text: 'Morning check-in completed', time: 'Today · 8:15 AM', type: 'checkin' },
      { id: 2, text: 'Morning medicine taken (Amlodipine 5mg)', time: 'Today · 8:02 AM', type: 'med' },
      { id: 3, text: 'Daily activity recorded (1,420 steps)', time: 'Today · 9:30 AM', type: 'walk' },
      { id: 4, text: 'Appointment scheduled with Dr. Sharma', time: 'Yesterday · 4:10 PM', type: 'calendar' }
    ]
  };

  // ========================================================================
  // 2. DOM REFERENCES
  // ========================================================================
  const navLinks = document.querySelectorAll('.nav-link');
  const viewSections = document.querySelectorAll('.view-section');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebarNav = document.getElementById('sidebarNav');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const roleToggleBtn = document.getElementById('roleToggleBtn');
  const currentRoleLabel = document.getElementById('currentRoleLabel');
  const greetingUserDisplay = document.getElementById('greetingUserDisplay');
  const notifBellBtn = document.getElementById('notifBellBtn');
  const notificationsPanel = document.getElementById('notificationsPanel');
  const notifBadgeCount = document.getElementById('notifBadgeCount');
  const clearNotifsBtn = document.getElementById('clearNotifsBtn');
  const emergencyModal = document.getElementById('emergencyModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const emergencyHelpTriggerBtn = document.getElementById('emergencyHelpTriggerBtn');
  const fullPageEmergencyTriggerBtn = document.getElementById('fullPageEmergencyTriggerBtn');
  const highContrastToggle = document.getElementById('highContrastToggle');
  const a11ySizeBtns = document.querySelectorAll('.a11y-size-btn[data-size]');

  // Check-In Elements
  const feelingBtns = document.querySelectorAll('.feeling-btn');
  const checkinFeedback = document.getElementById('checkinFeedback');
  const checkinFeedbackText = document.getElementById('checkinFeedbackText');
  const checkinStatusBadge = document.getElementById('checkinStatusBadge');

  // AI Assistant Elements
  const aiQuickChips = document.querySelectorAll('.ai-chip-btn[data-ai-query]');
  const dashboardAiResponse = document.getElementById('dashboardAiResponse');
  const aiChatFeed = document.getElementById('aiChatFeed');
  const aiChatForm = document.getElementById('aiChatForm');
  const aiChatInput = document.getElementById('aiChatInput');
  const aiQuickAskBtns = document.querySelectorAll('.ai-quick-ask');

  // ========================================================================
  // 3. NAVIGATION & VIEW ROUTING
  // ========================================================================
  function switchView(targetViewId) {
    // Normalise view ID
    let viewKey = targetViewId;
    if (viewKey.endsWith('-view')) {
      viewKey = viewKey.replace('-view', '');
    }

    // Do not navigate to disabled views
    if (viewKey === 'ai-assistant') {
      return;
    }

    // Hide all view sections
    viewSections.forEach(section => {
      section.classList.remove('active-view');
    });

    // Determine target element
    const targetSection = document.getElementById(`${viewKey}-view`);
    if (targetSection) {
      targetSection.classList.add('active-view');
      appState.currentView = viewKey;

      // Scroll smoothly to top of main wrapper
      const mainWrapper = document.getElementById('main-content');
      if (mainWrapper) mainWrapper.scrollTop = 0;
    }

    // Update active state in sidebar nav items
    navLinks.forEach(link => {
      if (link.getAttribute('data-view') === viewKey) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });

    // Close mobile drawer if open
    closeMobileSidebar();
  }

  // Sidebar link click listeners
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (link.disabled || link.classList.contains('disabled-link')) {
        return;
      }
      const view = link.getAttribute('data-view');
      if (view) {
        switchView(view);
      }
    });
  });

  // Buttons with data-view attributes (e.g. "Full Schedule ->" or "View appointment")
  document.querySelectorAll('button[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      if (view) switchView(view);
    });
  });

  // Mobile Drawer Toggle
  function openMobileSidebar() {
    sidebarNav.classList.add('mobile-open');
    sidebarBackdrop.classList.add('active');
  }

  function closeMobileSidebar() {
    sidebarNav.classList.remove('mobile-open');
    sidebarBackdrop.classList.remove('active');
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      if (sidebarNav.classList.contains('mobile-open')) {
        closeMobileSidebar();
      } else {
        openMobileSidebar();
      }
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeMobileSidebar);
  }

  // ========================================================================
  // 4. CAREGIVER / SENIOR ROLE TOGGLE
  // ========================================================================
  if (roleToggleBtn) {
    roleToggleBtn.addEventListener('click', () => {
      if (appState.currentRole === 'senior') {
        appState.currentRole = 'caregiver';
        currentRoleLabel.textContent = 'Active: Rahul (Caregiver)';
        roleToggleBtn.textContent = '⇄ Switch to Elderly View (Meera)';
        greetingUserDisplay.textContent = 'Good morning, Rahul 👋';
        switchView('caregiver');
      } else {
        appState.currentRole = 'senior';
        currentRoleLabel.textContent = 'Active: Meera (Senior)';
        roleToggleBtn.textContent = '⇄ Switch to Caregiver View';
        greetingUserDisplay.textContent = 'Good morning, Meera 👋';
        switchView('dashboard');
      }
    });
  }

  // ========================================================================
  // 5. ACCESSIBILITY: TEXT SIZE & HIGH CONTRAST
  // ========================================================================
  function applyFontScale(scale) {
    appState.fontScale = scale;
    document.documentElement.style.setProperty('--font-scale', scale);

    // Update active state across both header and settings buttons
    a11ySizeBtns.forEach(btn => {
      if (parseFloat(btn.getAttribute('data-size')) === scale) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  a11ySizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const scale = parseFloat(btn.getAttribute('data-size'));
      applyFontScale(scale);
    });
  });

  if (highContrastToggle) {
    highContrastToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        document.body.classList.add('high-contrast-mode');
        appState.highContrast = true;
      } else {
        document.body.classList.remove('high-contrast-mode');
        appState.highContrast = false;
      }
    });
  }

  // ========================================================================
  // 6. NOTIFICATION PANEL INTERACTIONS
  // ========================================================================
  if (notifBellBtn) {
    notifBellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = notifBellBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        notificationsPanel.classList.remove('active');
        notifBellBtn.setAttribute('aria-expanded', 'false');
      } else {
        notificationsPanel.classList.add('active');
        notifBellBtn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  // Close notifications when clicking outside
  document.addEventListener('click', (e) => {
    if (notificationsPanel && !notificationsPanel.contains(e.target) && e.target !== notifBellBtn) {
      notificationsPanel.classList.remove('active');
      if (notifBellBtn) notifBellBtn.setAttribute('aria-expanded', 'false');
    }
  });

  if (clearNotifsBtn) {
    clearNotifsBtn.addEventListener('click', () => {
      appState.notificationsCount = 0;
      if (notifBadgeCount) notifBadgeCount.style.display = 'none';
      const alertsList = notificationsPanel.querySelector('.alerts-list');
      if (alertsList) {
        alertsList.innerHTML = '<div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 0.95rem;">No new notifications.</div>';
      }
    });
  }

  // ========================================================================
  // 7. DAILY CHECK-IN INTERACTION
  // ========================================================================
  feelingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const feeling = btn.getAttribute('data-feeling');
      appState.checkIn.answered = true;
      appState.checkIn.feeling = feeling;
      appState.checkIn.time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Highlight selected button
      feelingBtns.forEach(b => {
        b.classList.remove('selected');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('selected');
      btn.setAttribute('aria-pressed', 'true');

      // Display friendly confirmation
      checkinFeedback.classList.add('active');
      if (feeling === 'good') {
        checkinFeedbackText.textContent = `Wonderful! Recorded that you are feeling good. Keep enjoying your day!`;
        checkinStatusBadge.className = 'status-badge good';
        checkinStatusBadge.innerHTML = '<span class="badge-dot"></span><span>Feeling good ✓</span>';
      } else if (feeling === 'okay') {
        checkinFeedbackText.textContent = `Noted. Remember to rest and stay hydrated today.`;
        checkinStatusBadge.className = 'status-badge info';
        checkinStatusBadge.innerHTML = '<span class="badge-dot"></span><span>Feeling okay</span>';
      } else {
        checkinFeedbackText.textContent = `We are here for you. Rahul has been gently notified so he can check in with you.`;
        checkinStatusBadge.className = 'status-badge alert';
        checkinStatusBadge.innerHTML = '<span class="badge-dot"></span><span>Needs gentle check-in</span>';
      }

      // Add to recent activity log
      addActivityItem(`Check-in recorded: ${btn.querySelector('span:last-child').textContent}`, 'Today · Just now', 'checkin');
    });
  });

  // ========================================================================
  // 8. MEDICATION TRACKER (Mark as Taken Toggle)
  // ========================================================================
  function setupMedicationButtons() {
    const medActionBtns = document.querySelectorAll('.med-action-btn');
    medActionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const medId = btn.getAttribute('data-med-id');
        const med = appState.medications.find(m => m.id === medId);
        if (!med) return;

        // Toggle status
        med.taken = !med.taken;
        if (med.taken) {
          med.takenTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
          med.takenTime = null;
        }

        // Synchronize all instances of this medication button across dashboard & medication pages
        document.querySelectorAll(`.med-action-btn[data-med-id="${medId}"]`).forEach(targetBtn => {
          if (med.taken) {
            targetBtn.classList.add('taken');
            targetBtn.textContent = 'Taken ✓';
            targetBtn.setAttribute('aria-label', `${med.name} taken at ${med.takenTime}`);
          } else {
            targetBtn.classList.remove('taken');
            targetBtn.textContent = 'Mark as taken';
            targetBtn.setAttribute('aria-label', `Mark ${med.name} as taken`);
          }
        });

        // Update adherence badge
        updateMedAdherence();

        // Add to activity if marked taken
        if (med.taken) {
          addActivityItem(`${med.name} marked as taken`, `Today · ${med.takenTime}`, 'med');
        }
      });
    });
  }

  function updateMedAdherence() {
    const total = appState.medications.length;
    const takenCount = appState.medications.filter(m => m.taken).length;

    const medAdherenceBadge = document.getElementById('medAdherenceBadge');
    if (medAdherenceBadge) {
      medAdherenceBadge.textContent = `${takenCount} of ${total} taken today`;
      medAdherenceBadge.className = takenCount === total ? 'status-badge good' : 'status-badge warning';
    }

    const cgPillAdherenceStatus = document.getElementById('cgPillAdherenceStatus');
    if (cgPillAdherenceStatus) {
      if (takenCount === total) {
        cgPillAdherenceStatus.textContent = 'All Doses Taken ✓';
        cgPillAdherenceStatus.className = 'status-badge good';
      } else {
        cgPillAdherenceStatus.textContent = `${total - takenCount} Dose(s) Pending`;
        cgPillAdherenceStatus.className = 'status-badge warning';
      }
    }
  }

  setupMedicationButtons();

  // Refill Button Simulator
  const requestRefillBtn = document.getElementById('requestRefillBtn');
  if (requestRefillBtn) {
    requestRefillBtn.addEventListener('click', () => {
      alert('Pharmacy refill request sent to MedPlus Care for Amlodipine 5mg and Metformin 500mg. Delivery expected tomorrow.');
    });
  }

  // ========================================================================
  // 9. RECENT ACTIVITY LIST DYNAMIC UPDATER
  // ========================================================================
  function addActivityItem(text, timeStr, type) {
    const list = document.getElementById('recentActivityList');
    if (!list) return;

    const item = document.createElement('div');
    item.className = 'timeline-item';
    let icon = '✓';
    let extraClass = '';
    if (type === 'walk') icon = '🚶';
    if (type === 'calendar') { icon = '📅'; extraClass = 'scheduled'; }
    if (type === 'checkin') icon = '🌻';

    item.innerHTML = `
      <div class="timeline-bullet ${extraClass}">${icon}</div>
      <div class="timeline-content">
        <span class="timeline-text">${text}</span>
        <span class="timeline-time">${timeStr}</span>
      </div>
    `;
    list.prepend(item);
  }

  // ========================================================================
  // 10. AI CARE ASSISTANT (Dashboard Card & Full Chat Interface)
  // ========================================================================
  const aiResponses = {
    medication: "You took your morning Amlodipine (5mg) at 8:02 AM. Your next scheduled medicine is your Multivitamin at 1:00 PM after lunch.",
    appointment: "Your next appointment is with Dr. Sharma tomorrow (Thursday) at 10:30 AM for your routine general wellness check-up.",
    feeling: "I am always here to listen. Sharing how you feel is important. If you feel tired or unwell, remember to rest, take a sip of water, and we can alert Rahul anytime.",
    caregiver: "Rahul is available today. His phone is (555) 019-2834, and he has messaged that he will come by at 5:00 PM today!",
    default: "Thank you for asking, Meera. I'm keeping track of your health schedule. Let me know if you would like me to check on your medicines or schedule."
  };

  // Dashboard quick topic chips
  aiQuickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const queryType = chip.getAttribute('data-ai-query');
      const response = aiResponses[queryType] || aiResponses.default;

      if (dashboardAiResponse) {
        dashboardAiResponse.textContent = response;
        dashboardAiResponse.classList.add('active');
      }
    });
  });

  // Full AI Conversational Page
  function appendChatMessage(sender, text) {
    if (!aiChatFeed) return;

    const messageRow = document.createElement('div');
    messageRow.style.display = 'flex';
    messageRow.style.gap = '12px';
    messageRow.style.alignItems = 'flex-start';
    messageRow.style.maxWidth = '85%';

    if (sender === 'user') {
      messageRow.style.alignSelf = 'flex-end';
      messageRow.style.flexDirection = 'row-reverse';
      messageRow.innerHTML = `
        <div class="profile-avatar" style="width: 36px; height: 36px; font-size: 1rem; flex-shrink: 0;">M</div>
        <div style="background: var(--primary); color: #FFF; padding: 14px 18px; border-radius: var(--radius-md); font-size: 1.05rem;">
          ${text}
        </div>
      `;
    } else {
      messageRow.style.alignSelf = 'flex-start';
      messageRow.innerHTML = `
        <div class="ai-avatar-box" style="width: 36px; height: 36px; font-size: 1.1rem; flex-shrink: 0;" aria-hidden="true">🤖</div>
        <div style="background: var(--primary-soft); padding: 14px 18px; border-radius: var(--radius-md); font-size: 1.05rem; color: var(--text-main); border: 1px solid rgba(15, 118, 110, 0.2);">
          ${text}
        </div>
      `;
    }

    aiChatFeed.appendChild(messageRow);
    aiChatFeed.scrollTop = aiChatFeed.scrollHeight;
  }

  function handleAiConversation(userQuestion) {
    appendChatMessage('user', userQuestion);

    // Simulated caring AI response delay
    setTimeout(() => {
      let botReply = "";
      const lower = userQuestion.toLowerCase();

      if (lower.includes('medicin') || lower.includes('pill')) {
        botReply = "Your morning blood pressure pill (Amlodipine) was taken at 8:02 AM. Your afternoon Multivitamin is due at 1:00 PM. Would you like me to sound a chime then?";
      } else if (lower.includes('appoint') || lower.includes('doctor')) {
        botReply = "Yes, you have an appointment with Dr. Sharma tomorrow at 10:30 AM at the Wellness Family Health Clinic. Rahul is planning to take you.";
      } else if (lower.includes('not feel') || lower.includes('unwell') || lower.includes('sick') || lower.includes('pain')) {
        botReply = "I'm sorry to hear you're not feeling well, Meera. Please sit back and rest comfortably. I have logged this and sent a gentle notification to Rahul so he is aware.";
      } else if (lower.includes('rahul') || lower.includes('son') || lower.includes('visit')) {
        botReply = "Rahul sent a message confirming he will visit you at 5:00 PM this evening after his work. He is about 10 minutes away.";
      } else {
        botReply = "I have noted that for you, Meera. Everything in your health summary is looking calm and stable today. How else can I assist you?";
      }

      appendChatMessage('assistant', botReply);
    }, 450);
  }

  if (aiChatForm) {
    aiChatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = aiChatInput.value.trim();
      if (!query) return;
      handleAiConversation(query);
      aiChatInput.value = '';
    });
  }

  aiQuickAskBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-query');
      if (q) handleAiConversation(q);
    });
  });

  // ========================================================================
  // 11. EMERGENCY ASSISTANCE TRIGGER & MODAL
  // ========================================================================
  function triggerEmergencyModal() {
    if (emergencyModal) {
      emergencyModal.classList.add('active');
    }
  }

  function closeEmergencyModal() {
    if (emergencyModal) {
      emergencyModal.classList.remove('active');
    }
  }

  if (emergencyHelpTriggerBtn) {
    emergencyHelpTriggerBtn.addEventListener('click', triggerEmergencyModal);
  }

  if (fullPageEmergencyTriggerBtn) {
    fullPageEmergencyTriggerBtn.addEventListener('click', triggerEmergencyModal);
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeEmergencyModal);
  }

  if (emergencyModal) {
    emergencyModal.addEventListener('click', (e) => {
      if (e.target === emergencyModal) closeEmergencyModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && emergencyModal && emergencyModal.classList.contains('active')) {
      closeEmergencyModal();
    }
  });

  // Action Buttons Feedback
  const callDoctorBtn = document.getElementById('callDoctorOfficeBtn');
  if (callDoctorBtn) {
    callDoctorBtn.addEventListener('click', () => {
      alert('Connecting call to Dr. Sharma\'s office at (555) 234-5678 (Simulated call).');
    });
  }

  const viewDirectionsBtn = document.getElementById('viewDirectionsBtn');
  if (viewDirectionsBtn) {
    viewDirectionsBtn.addEventListener('click', () => {
      alert('Wellness Family Health Clinic is located at 124 Medical Park Rd, Suite 204. Estimated transit time: 12 minutes.');
    });
  }

  const callRahulDirectBtn = document.getElementById('callRahulDirectBtn');
  if (callRahulDirectBtn) {
    callRahulDirectBtn.addEventListener('click', () => {
      alert('Calling Rahul Patel (Son) at (555) 019-2834 (Simulated direct call).');
    });
  }

  // ========================================================================
  // 12. BRUTALIST BENTO ANALYSIS INTERACTIONS
  // ========================================================================
  const donutSlices = document.querySelectorAll('.donut-slice');
  const donutCenterVal = document.getElementById('donutCenterVal');
  const donutCenterLbl = document.getElementById('donutCenterLbl');
  const donutLegendItems = document.querySelectorAll('.donut-legend-item');
  const radarStatItems = document.querySelectorAll('.radar-stat-item');

  function setDonutFocus(sliceName, sliceVal, index) {
    if (donutCenterVal && donutCenterLbl) {
      donutCenterVal.textContent = `${sliceVal}%`;
      donutCenterLbl.textContent = sliceName.toUpperCase();
    }
    donutSlices.forEach((s, idx) => {
      if (idx === index) {
        s.style.opacity = '1';
        s.style.transform = 'scale(1.04)';
      } else {
        s.style.opacity = '0.35';
        s.style.transform = 'scale(1)';
      }
    });
    donutLegendItems.forEach((item, idx) => {
      if (idx === index) item.classList.add('active');
      else item.classList.remove('active');
    });
  }

  function resetDonutFocus() {
    if (donutCenterVal && donutCenterLbl) {
      donutCenterVal.textContent = '100%';
      donutCenterLbl.textContent = 'TOTAL STABILITY';
    }
    donutSlices.forEach(s => {
      s.style.opacity = '1';
      s.style.transform = 'scale(1)';
    });
    donutLegendItems.forEach(item => item.classList.remove('active'));
  }

  donutSlices.forEach((slice, index) => {
    slice.addEventListener('mouseenter', () => {
      const name = slice.getAttribute('data-slice-name') || 'Metric';
      const val = slice.getAttribute('data-slice-val') || '0';
      setDonutFocus(name, val, index);
    });
    slice.addEventListener('mouseleave', resetDonutFocus);
  });

  donutLegendItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
      const targetSlice = donutSlices[index];
      if (targetSlice) {
        const name = targetSlice.getAttribute('data-slice-name') || 'Metric';
        const val = targetSlice.getAttribute('data-slice-val') || '0';
        setDonutFocus(name, val, index);
      }
    });
    item.addEventListener('mouseleave', resetDonutFocus);
  });

  radarStatItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.classList.add('active');
    });
    item.addEventListener('mouseleave', () => {
      item.classList.remove('active');
    });
  });

  console.log('CarePulse AI Frontend Prototype initialized successfully.');
});
