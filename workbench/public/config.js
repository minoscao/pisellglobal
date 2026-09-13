export const WORKSTREAMS={readiness:'Marketing Readiness',brand_awareness:'Brand Awareness',market_access:'Market Access',partnerships:'Partnerships',target_customers:'Target Customers'};
export const FOOTPRINT_LEVELS=[{max:1,label:'1',color:'#FDE6DC'},{max:5,label:'2–5',color:'#FBC5AF'},{max:10,label:'6–10',color:'#F89A76'},{max:50,label:'11–50',color:'#F36B43'},{max:Infinity,label:'51+',color:'#DE3C18'}];
export const footprintLevel=count=>count>0?FOOTPRINT_LEVELS.find(level=>count<=level.max):null;
export const PROJECT_STATUS=['draft','active','on_hold','completed','cancelled'];
export const TASK_STATUS=['open','in_progress','blocked','done','cancelled'];
export const STATUS_LABELS={draft:'Draft',active:'Active',on_hold:'On hold',completed:'Completed',cancelled:'Cancelled',open:'To do',in_progress:'In progress',blocked:'Blocked',done:'Done'};

export const NAVIGATION=[
 {label:'Workspace',items:[{id:'overview',label:'Overview',icon:'home'},{id:'projects',label:'Projects',icon:'folder'}]},
 {label:'Acquisition',items:[{id:'alerts',label:'Global Alerts',icon:'globe'},{id:'discovery',label:'Venue Search',icon:'search'},{id:'exhibitions',label:'Exhibitions',icon:'calendar'}]},
 {label:'Relationships',items:[{id:'partners',label:'Partners',icon:'users'},{id:'opportunities',label:'Opportunities',icon:'flag'},{id:'customers',label:'Customers',icon:'users'}]},
 {label:'Resources & results',items:[{id:'library',label:'Marketing Readiness',icon:'file'},{id:'performance',label:'Performance',icon:'chart'}]}
];
