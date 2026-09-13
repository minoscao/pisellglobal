// Shared non-modal detail behavior. Interacting inside a detail keeps it open.
export function bindDismissibleDetails({dialog,root=document,close,signal}){
 const outside=e=>{if(dialog.open&&!e.composedPath().includes(dialog))close(false);};
 root.addEventListener('pointerdown',outside,{capture:true,signal});
 root.addEventListener('wheel',outside,{capture:true,passive:true,signal});
 root.addEventListener('keydown',e=>{if(e.key==='Escape'&&dialog.open){e.preventDefault();close(true);}},{signal});
}
