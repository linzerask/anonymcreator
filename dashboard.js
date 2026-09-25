// Ensure user is logged in
auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = 'login.html';
    } else {
        document.getElementById('body-content').style.display = 'block';
        loadLeads();
    }
});

document.getElementById('logout-btn').addEventListener('click', () => {
    auth.signOut().then(() => {
        window.location.href = 'login.html';
    });
});

// UI Elements
const tableBody = document.getElementById('leads-table-body');
const modal = document.getElementById('lead-modal');
const closeModalBtn = document.getElementById('close-modal');
const leadForm = document.getElementById('lead-form');

// Load leads real-time with LocalStorage fallback
let allLeads = {};

function getLocalLeads() {
    try {
        return JSON.parse(localStorage.getItem('anonym_leads') || '[]');
    } catch(e) {
        return [];
    }
}

function saveLocalLeads(leads) {
    localStorage.setItem('anonym_leads', JSON.stringify(leads));
}

function renderTable() {
    tableBody.innerHTML = '';
    const keys = Object.keys(allLeads);
    if (keys.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Keine Leads vorhanden.</td></tr>';
        return;
    }

    // Sort by date desc
    const sortedKeys = keys.sort((a, b) => {
        const da = allLeads[a].rawDate ? new Date(allLeads[a].rawDate) : new Date(0);
        const dbTime = allLeads[b].rawDate ? new Date(allLeads[b].rawDate) : new Date(0);
        return dbTime - da;
    });

    sortedKeys.forEach(id => {
        const data = allLeads[id];
        
        let dateStr = "Unbekannt";
        if (data.createdAt && typeof data.createdAt.toDate === 'function') {
            dateStr = data.createdAt.toDate().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' });
        } else if (data.createdAt) {
            const d = new Date(data.createdAt);
            if (!isNaN(d.getTime())) {
                dateStr = d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' });
            }
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${dateStr}</td>
            <td><strong>${data.name || 'Ohne Name'}</strong><br><span style="font-size:0.85rem; color:#888;">${data.email || ''}</span></td>
            <td>${data.service || '-'}</td>
            <td><span style="background: rgba(0,240,255,0.1); color: var(--accent-color); padding: 4px 8px; border-radius: 4px; font-size: 0.85rem;">${data.status || 'Neu'}</span></td>
            <td>
                <button class="action-btn" onclick="editLead('${id}')">Bearbeiten</button>
                <button class="action-btn btn-delete" onclick="deleteLead('${id}')">Löschen</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function loadLeads() {
    // 1. Populate initial data from localStorage
    const local = getLocalLeads();
    local.forEach(item => {
        allLeads[item.id] = {
            ...item,
            rawDate: item.createdAt
        };
    });
    renderTable();

    // 2. Listen to Firestore real-time updates with robust fallback
    try {
        if (typeof db !== 'undefined') {
            db.collection('leads').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
                snapshot.forEach(doc => {
                    const data = doc.data();
                    allLeads[doc.id] = {
                        ...data,
                        rawDate: data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString()
                    };
                });
                renderTable();
            }, error => {
                console.warn("Fehler beim Laden. Firestore-Regeln überprüfen!", error);
                // Fallback automatically to displaying leads from localStorage
                renderTable();
            });
        }
    } catch(err) {
        console.warn("Firestore access error, relying on localStorage leads:", err);
        renderTable();
    }
}

// Edit lead (open modal)
window.editLead = function(id) {
    const data = allLeads[id];
    if(!data) return;

    document.getElementById('modal-title').innerText = "Lead bearbeiten";
    document.getElementById('lead-id').value = id;
    
    document.getElementById('m-name').value = data.name || '';
    document.getElementById('m-email').value = data.email || '';
    document.getElementById('m-phone').value = data.phone || '';
    document.getElementById('m-website').value = data.website || '';
    
    // Set selects safely
    const srv = document.getElementById('m-service');
    if([...srv.options].some(o => o.value === data.service)) srv.value = data.service;
    
    const sts = document.getElementById('m-status');
    if([...sts.options].some(o => o.value === data.status)) sts.value = data.status || 'Neu';

    const msgBox = document.getElementById('m-message');
    msgBox.value = data.message || '';
    msgBox.readOnly = true;

    document.getElementById('m-notes').value = data.notes || '';

    modal.style.display = 'flex';
};

// Add lead manually (open modal)
document.getElementById('add-lead-btn').addEventListener('click', () => {
    document.getElementById('modal-title').innerText = "Neuen Lead hinzufügen";
    document.getElementById('lead-id').value = "";
    leadForm.reset();
    
    const msgBox = document.getElementById('m-message');
    msgBox.value = "Manuell hinzugefügt";
    msgBox.readOnly = false; // allow editing if manual
    
    document.getElementById('m-status').value = "Neu";
    modal.style.display = 'flex';
});

// Close modal
closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target == modal) modal.style.display = 'none';
});

// Save Lead
leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('lead-id').value;
    
    const leadData = {
        name: document.getElementById('m-name').value,
        email: document.getElementById('m-email').value,
        phone: document.getElementById('m-phone').value,
        website: document.getElementById('m-website').value,
        service: document.getElementById('m-service').value,
        status: document.getElementById('m-status').value,
        notes: document.getElementById('m-notes').value,
    };

    try {
        if (id) {
            if (id.startsWith('lead_')) {
                // Update local storage lead
                const local = getLocalLeads();
                const index = local.findIndex(item => item.id === id);
                if (index !== -1) {
                    local[index] = { ...local[index], ...leadData };
                    saveLocalLeads(local);
                }
                allLeads[id] = { ...allLeads[id], ...leadData };
            } else if (typeof db !== 'undefined') {
                // Update Firestore
                await db.collection('leads').doc(id).update(leadData);
                allLeads[id] = { ...allLeads[id], ...leadData };
            }
        } else {
            // Create
            leadData.message = document.getElementById('m-message').value;
            leadData.createdAt = new Date().toISOString();
            leadData.id = 'lead_' + Date.now();
            
            const local = getLocalLeads();
            local.unshift(leadData);
            saveLocalLeads(local);
            allLeads[leadData.id] = leadData;

            if (typeof db !== 'undefined') {
                try {
                    await db.collection('leads').add({
                        ...leadData,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                } catch(fsErr) {
                    console.warn("Firestore save optional fallback:", fsErr);
                }
            }
        }
        renderTable();
        modal.style.display = 'none';
    } catch (error) {
        console.error("Fehler beim Speichern:", error);
        alert("Fehler beim Speichern: " + error.message);
    }
});

// Delete lead
window.deleteLead = async function(id) {
    if (confirm("Möchten Sie diesen Lead wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.")) {
        try {
            if (id.startsWith('lead_')) {
                let local = getLocalLeads();
                local = local.filter(item => item.id !== id);
                saveLocalLeads(local);
                delete allLeads[id];
            } else if (typeof db !== 'undefined') {
                await db.collection('leads').doc(id).delete();
                delete allLeads[id];
            }
            renderTable();
        } catch (error) {
            console.error("Fehler beim Löschen:", error);
            alert("Fehler beim Löschen: " + error.message);
        }
    }
};
