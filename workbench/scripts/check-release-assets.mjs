import fs from 'node:fs/promises';
import path from 'node:path';
import {build} from 'esbuild';

export async function checkReleaseContract(assetRoot,contract){
 for(const name of contract.requiredAssets)await fs.access(path.join(assetRoot,name));
 for(const [name,references] of Object.entries(contract.requiredReferences)){
  const body=await fs.readFile(path.join(assetRoot,name),'utf8');
  for(const reference of references)if(!body.includes(reference))throw Error('Release would remove a required feature reference: '+name+' → '+reference);
 }
 return checkReleaseAssets(assetRoot);
}

// Parse every shipped module, including routes reached only through dynamic imports.
export async function checkReleaseAssets(assetRoot){
 const root=path.resolve(assetRoot),entries=[];
 async function walk(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())await walk(full);else if(/\.m?js$/.test(entry.name))entries.push(full);}}
 await walk(root);
 if(!entries.length)throw Error('Release contains no page modules.');
 await build({entryPoints:entries,bundle:true,write:false,format:'esm',outdir:path.join(root,'.validation'),platform:'browser',logLevel:'silent',plugins:[{
  name:'website-paths',setup(builder){
   builder.onResolve({filter:/^(?:https?:|data:|blob:)/},()=>({external:true}));
   builder.onResolve({filter:/^\//},async args=>{
    if(args.kind==='entry-point')return;
    const file=path.resolve(root,'.'+args.path.split(/[?#]/)[0]);
    if(!file.startsWith(root+path.sep))return {errors:[{text:'Asset path escapes release: '+args.path}]};
    try{await fs.access(file);return {path:file};}catch{return {errors:[{text:'Missing page dependency: '+args.path+' (from '+path.relative(root,args.importer)+')'}]};}
   });
  }
 }]});
 return {modules:entries.length};
}
