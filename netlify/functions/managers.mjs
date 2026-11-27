const BASE='https://fantasy.premierleague.com/api';
let cache={until:0,data:null};
export default async function(req){
 const headers={'content-type':'application/json; charset=utf-8','cache-control':'public, max-age=300, s-maxage=300'};
 try{
  const url=new URL(req.url);const league=Number(url.searchParams.get('league')||397375);
  if(!Number.isSafeInteger(league)||league<1)return new Response(JSON.stringify({error:'Invalid league'}),{status:400,headers});
  if(cache.data?.league===league&&Date.now()<cache.until)return new Response(JSON.stringify(cache.data),{headers});
  let page=1,managers=[];
  while(page<=10){
   const response=await fetch(`${BASE}/leagues-classic/${league}/standings/?page_standings=${page}`,{signal:AbortSignal.timeout(12000)});
   if(!response.ok)throw Error(`FPL standings returned ${response.status}`);
   const data=await response.json();
   managers.push(...(data.standings?.results||[]).map(x=>({id:x.entry,name:x.player_name})));
   if(!data.standings?.has_next)break;
   page++;
  }
  const result={league,managers};cache={until:Date.now()+300000,data:result};
  return new Response(JSON.stringify(result),{headers});
 }catch(e){return new Response(JSON.stringify({error:'FPL manager list unavailable'}),{status:502,headers:{...headers,'cache-control':'no-store'}})}
}
