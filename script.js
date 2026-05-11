$(document).ready(function () {



     tableau.extensions.initializeAsync().then(function () {
       renderTable();

    },function (err) {
      // Something went wrong in initialization.
      console.log('Error while Initializing: ' + err.toString());
    });

    const rows=[
  {name:"Annual Giving – Direct Response Overview",ds:"CRM",def:"Total dollars raised for MSD GAU 5140 in the fiscal year selected.",calc:"SUM of Amount on Opportunities where Stage = Received/Pledged, MSD GAU = 5140, within FY date range"},
  {name:"Total Digital Revenue",ds:"CRM",def:"Total dollars raised for the digital portion of the Direct Response program.",calc:"SUM of Amount on Opportunities where Stage = Received/Pledged, MSD GAU = 5140, FY date range — Campaign Names NOT beginning with 'A', 'R', 'Direct Mail', '1MA', or '1MR'"},
  {name:"Total Mail Revenue",ds:"CRM",def:"Total dollars raised for the direct mail portion of the Direct Response program.",calc:"SUM of Amount on Opportunities where Stage = Received/Pledged, MSD GAU = 5140, FY date range — Campaign Names beginning with 'A', 'R', 'Direct Mail', '1MA', or '1MR'"},
  {name:"Total Number of Digital Donors",ds:"CRM",def:"Total unique donors to the digital portion of the Direct Response program.",calc:"COUNT of Accounts with Opportunity Stage = Received/Pledged, MSD GAU = 5140, FY date range — Campaign Names NOT beginning with 'A', 'R', 'Direct Mail', '1MA', '1MR'"},
  {name:"Total Number of Digital Gifts",ds:"CRM",def:"Total number of gifts to the digital portion of the Direct Response program.",calc:"COUNT of Opportunities where Stage = Received/Pledged, MSD GAU = 5140, FY date range — Campaign Names NOT beginning with 'A', 'R', 'Direct Mail', '1MA', '1MR'"},
  {name:"Total Donors Giving to Direct Response",ds:"CRM",def:"Unique donor count for MSD GAU 5140 in the fiscal year selected.",calc:"COUNT of Opportunities where Stage = Received/Pledged, MSD GAU = 5140, FY date range — de-duplicated by Account ID"},
  {name:"Total Number of Mail Donors",ds:"CRM",def:"Total unique donors to the direct mail portion of the Direct Response program.",calc:"COUNT of Accounts with Opportunity Stage = Received/Pledged, MSD GAU = 5140, FY date range — Campaign Names beginning with 'A', 'R', 'Direct Mail', '1MA', '1MR'"},
  {name:"Total Number of Mail Gifts",ds:"CRM",def:"Total number of gifts for the direct mail portion of the Direct Response program.",calc:"COUNT of Opportunities where Stage = Received/Pledged, MSD GAU = 5140, FY date range — Campaign Names beginning with 'A', 'R', 'Direct Mail', '1MA', '1MR'"},
];

const dsBadgeClass={"CRM":"ds-CRM","LO":"ds-LO","WD":"ds-WD","Calculated Field":"ds-Calc","Static Goal data":"ds-Static"};
const dsLabel={"LO":"Luminate Online","WD":"Workday","Calculated Field":"Calculated","Static Goal data":"Static Goal","CRM":"CRM"};

let currentFilter='ALL', expandedRows=new Set();

function setFilter(f,el){
  currentFilter=f;
  document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  filterRows();
}

function filterRows(){
  const q=document.getElementById('metricSearch').value.toLowerCase();
  const tbody=document.getElementById('tableBody');
  let shown=0;
  tbody.querySelectorAll('tr[data-idx]').forEach(tr=>{
    const idx=parseInt(tr.dataset.idx);
    const row=rows[idx];
    const dsOk=currentFilter==='ALL'||row.ds===currentFilter;
    const qOk=!q||row.name.toLowerCase().includes(q)||row.def.toLowerCase().includes(q)||row.calc.toLowerCase().includes(q);
    const vis=dsOk&&qOk;
    tr.style.display=vis?'':'none';
    const dt=tbody.querySelector('tr[data-detail="'+idx+'"]');
    if(dt) dt.style.display=(vis&&expandedRows.has(idx))?'':'none';
    if(vis) shown++;
  });
  document.getElementById('shownCount').textContent=shown;
  document.getElementById('emptyState').style.display=shown===0?'block':'none';
  document.getElementById('glossaryTable').style.display=shown===0?'none':'';
}

function toggleRow(idx){
  const tbody=document.getElementById('tableBody');
  const btn=tbody.querySelector('.expand-btn[data-btn="'+idx+'"]');
  const dtr=tbody.querySelector('tr[data-detail="'+idx+'"]');
  const mtr=tbody.querySelector('tr[data-idx="'+idx+'"]');
  if(expandedRows.has(idx)){
    expandedRows.delete(idx);btn.classList.remove('open');mtr.classList.remove('expanded');dtr.style.display='none';
  } else {
    expandedRows.add(idx);btn.classList.add('open');mtr.classList.add('expanded');dtr.style.display='';
  }
}

function renderTable(){
  const tbody=document.getElementById('tableBody');
  tbody.innerHTML='';
  document.getElementById('totalCount').textContent=rows.length;
  document.getElementById('shownCount').textContent=rows.length;
  rows.forEach((row,i)=>{
    const cls=dsBadgeClass[row.ds]||'ds-Static';
    const lbl=dsLabel[row.ds]||row.ds;
    const tr=document.createElement('tr');
    tr.dataset.idx=i;
    tr.onclick=()=>toggleRow(i);
    tr.innerHTML=`<td style="padding:10px 10px 10px 14px"><div class="expand-btn" data-btn="${i}">+</div></td><td><div class="metric-name">${row.name}</div></td><td><span class="ds-badge ${cls}">${lbl}</span></td><td style="color:var(--dgray);line-height:1.5;font-size:12px">${row.def}</td>`;
    tbody.appendChild(tr);
    const dtr=document.createElement('tr');
    dtr.dataset.detail=i;
    dtr.className='detail-row';
    dtr.style.display='none';
    dtr.innerHTML=`<td colspan="4" style="padding:0"><div class="detail-panel"><div class="detail-box"><div class="d-label"><span class="d-dot" style="background:var(--blue)"></span>Calculation logic</div><div class="calc-block">${row.calc}</div></div><div class="detail-box"><div class="d-label"><span class="d-dot" style="background:#0B6E56"></span>Data source</div><div style="margin-bottom:10px"><span class="ds-badge ${cls}">${row.ds}</span></div><div class="d-label" style="margin-top:8px"><span class="d-dot" style="background:#6B0080"></span>Business definition</div><div class="d-text">${row.def}</div></div></div></td>`;
    tbody.appendChild(dtr);
  });
}



  });