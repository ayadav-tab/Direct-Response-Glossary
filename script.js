$(document).ready(function () {



     tableau.extensions.initializeAsync().then(function () {
       renderTable();

    },function (err) {
      // Something went wrong in initialization.
      console.log('Error while Initializing: ' + err.toString());
    });

    const dashboards = {
  dr:{title:"Direct Response Fundraising",meta:"Owner: Fundraising Team · Source: CRM · Refresh: Daily 5:30 PM ET",s1:8,s2:1,s3:"Daily 5:30 PM",s4:"Yearly",rows:[
    {name:"Annual Giving – Direct Response Overview",ds:"CRM",def:"Total dollars raised for MSD GAU 5140 in the fiscal year selected.",calc:"SUM of Amount on Opportunities where Stage = Received/Pledged, MSD GAU = 5140, within FY date range"},
    {name:"Total Digital Revenue",ds:"CRM",def:"Total dollars raised for the digital portion of the Direct Response program.",calc:"SUM of Amount on Opportunities where Stage = Received/Pledged, MSD GAU = 5140, FY date range — Campaign Names NOT beginning with 'A', 'R', 'Direct Mail', '1MA', or '1MR'"},
    {name:"Total Mail Revenue",ds:"CRM",def:"Total dollars raised for the direct mail portion of the Direct Response program.",calc:"SUM of Amount on Opportunities where Stage = Received/Pledged, MSD GAU = 5140, FY date range — Campaign Names beginning with 'A', 'R', 'Direct Mail', '1MA', or '1MR'"},
    {name:"Total Number of Digital Donors",ds:"CRM",def:"Total unique donors to the digital portion of the Direct Response program.",calc:"COUNT of Accounts with Opportunity Stage = Received/Pledged, MSD GAU = 5140, FY date range — Campaign Names NOT beginning with 'A', 'R', 'Direct Mail', '1MA', '1MR'"},
    {name:"Total Number of Digital Gifts",ds:"CRM",def:"Total number of gifts to the digital portion of the Direct Response program.",calc:"COUNT of Opportunities where Stage = Received/Pledged, MSD GAU = 5140, FY date range — Campaign Names NOT beginning with 'A', 'R', 'Direct Mail', '1MA', '1MR'"},
    {name:"Total Donors Giving to Direct Response",ds:"CRM",def:"Unique donor count for MSD GAU 5140 in the fiscal year selected.",calc:"COUNT of Opportunities where Stage = Received/Pledged, MSD GAU = 5140, FY date range — de-duplicated by Account ID"},
    {name:"Total Number of Mail Donors",ds:"CRM",def:"Total unique donors to the direct mail portion of the Direct Response program.",calc:"COUNT of Accounts with Opportunity Stage = Received/Pledged, MSD GAU = 5140, FY date range — Campaign Names beginning with 'A', 'R', 'Direct Mail', '1MA', '1MR'"},
    {name:"Total Number of Mail Gifts",ds:"CRM",def:"Total number of gifts for the direct mail portion of the Direct Response program.",calc:"COUNT of Opportunities where Stage = Received/Pledged, MSD GAU = 5140, FY date range — Campaign Names beginning with 'A', 'R', 'Direct Mail', '1MA', '1MR'"},
  ]},
  ev:{title:"Events Dashboard",meta:"Owner: Tori Freeman (Business) / BI Reporting Team (Tech) · Refresh: Daily 5:30 PM ET",s1:14,s2:3,s3:"Daily 5:30 PM",s4:"Yearly",rows:[
    {name:"Event Name",ds:"LO",def:"The name of the event extracted from the internal event name field.",calc:"Event Name field from Luminate Online"},
    {name:"Chapter",ds:"LO",def:"Chapter name displayed; virtual/national events show 'Unassigned Chapter'.",calc:"Chapter Name field from Luminate Online"},
    {name:"Date",ds:"LO",def:"The calendar date on which the event is scheduled to take place.",calc:"Event Date field from Luminate Online"},
    {name:"Old / Event Code",ds:"LO",def:"Previous event codes displayed until end of FY25. Beginning FY26, new event codes shown.",calc:"Event Code field — legacy values through FY25, new format from FY26"},
    {name:"Event Code",ds:"LO",def:"A unique number assigned to each event to identify and track it.",calc:"Event Code field from Luminate Online"},
    {name:"Days Until",ds:"LO",def:"How many days are left before the event happens.",calc:"Event Date minus Current Date"},
    {name:"Budget",ds:"WD",def:"The budget for the selected fiscal year.",calc:"Revenue from Workday where transactional type = Budget, filtered to selected FY"},
    {name:"Revenue Goal",ds:"Static Goal data",def:"The static goal for the selected fiscal year.",calc:"Static goal data provided externally"},
    {name:"Forecast",ds:"WD",def:"The forecast for the selected fiscal year.",calc:"Revenue from Workday where transactional type = Forecast, filtered to selected FY"},
    {name:"YTD Actual",ds:"WD",def:"Total amount of money actually raised from start of year until today.",calc:"Revenue from Workday where transactional type = Actuals, filtered to selected FY"},
    {name:"YTD Revenue",ds:"LO",def:"Total revenue generated so far this year based on recorded revenue data.",calc:"Revenue received in the selected fiscal year from Luminate Online"},
    {name:"% to Budget",ds:"Calculated Field",def:"How much of the planned budget has been achieved so far, as a percentage.",calc:"YTD Revenue ÷ Budget for the fiscal year"},
    {name:"% to Revenue Goal",ds:"Calculated Field",def:"The percentage of the overall revenue target reached so far.",calc:"YTD Revenue ÷ Revenue Goal"},
    {name:"PYTD Revenue",ds:"LO",def:"Total revenue earned during the same time period last year.",calc:"Revenue from Luminate Online for prior year date range (same YTD period as current year)"},
  ]},
  mg:{title:"Major Gifts Dashboard",meta:"Owner: Major Gifts Team · Refresh: Weekly",s1:5,s2:2,s3:"Weekly",s4:"Yearly",rows:[
    {name:"Sample Metric A",ds:"CRM",def:"Example definition for Major Gifts.",calc:"Example calculation — to be populated"},
  ]},
  pg:{title:"Planned Giving Dashboard",meta:"Owner: Planned Giving Team · Refresh: Monthly",s1:7,s2:2,s3:"Monthly",s4:"Yearly",rows:[
    {name:"Sample Metric B",ds:"CRM",def:"Example definition for Planned Giving.",calc:"Example calculation — to be populated"},
  ]}
};

const dsBadgeClass = {"CRM":"ds-CRM","LO":"ds-LO","WD":"ds-WD","Calculated Field":"ds-Calc","Static Goal data":"ds-Static"};
const dsLabel = {"LO":"Luminate Online","WD":"Workday","Calculated Field":"Calculated","Static Goal data":"Static Goal","CRM":"CRM"};

let currentDash='dr', currentFilter='ALL', expandedRows=new Set();

function switchDash(id,el){
  document.querySelectorAll('.dash-tab').forEach(x=>x.classList.remove('active'));
  el.classList.add('active');
  currentDash=id; expandedRows.clear(); currentFilter='ALL';
  document.querySelectorAll('.chip').forEach((c,i)=>{if(i===0)c.classList.add('active');else c.classList.remove('active');});
  document.getElementById('metricSearch').value='';
  const d=dashboards[id];
  document.getElementById('dashTitle').textContent=d.title;
  document.getElementById('dashMeta').textContent=d.meta;
  document.getElementById('s1').textContent=d.s1;
  document.getElementById('s2').textContent=d.s2;
  document.getElementById('s3').textContent=d.s3;
  document.getElementById('s4').textContent=d.s4;
  renderTable();
}

function setFilter(f,el){
  currentFilter=f;
  document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  filterRows();
}

function filterRows(){
  const q=document.getElementById('metricSearch').value.toLowerCase();
  const rows=dashboards[currentDash].rows;
  let shown=0;
  const tbody=document.getElementById('tableBody');
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
    expandedRows.delete(idx);
    btn.classList.remove('open');
    mtr.classList.remove('expanded');
    dtr.style.display='none';
  } else {
    expandedRows.add(idx);
    btn.classList.add('open');
    mtr.classList.add('expanded');
    dtr.style.display='';
  }
}

function renderTable(){
  const d=dashboards[currentDash];
  const tbody=document.getElementById('tableBody');
  tbody.innerHTML='';
  document.getElementById('totalCount').textContent=d.rows.length;
  document.getElementById('shownCount').textContent=d.rows.length;
  document.getElementById('emptyState').style.display='none';
  document.getElementById('glossaryTable').style.display='';
  d.rows.forEach((row,i)=>{
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