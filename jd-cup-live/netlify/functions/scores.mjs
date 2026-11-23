const BASE='https://fantasy.premierleague.com/api';
let cache={key:'',until:0,value:null};
const normalize=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
async function get(path){const r=await fetch(BASE+path,{headers:{'accept':'application/json','user-agent':'JD-Cup-Live/1.0'},signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error(`FPL API returned ${r.status} for ${path}`);return r.json()}
async function pool(items,fn,limit=8){let cursor=0;const out=new Array(items.length);await Promise.all(Array.from({length:Math.min(limit,items.length)},async()=>{while(cursor<items.length){const i=cursor++;try{out[i]=await fn(items[i],i)}catch(e){out[i]={error:e.message}}}}));return out}
export default async(req)=>{
 const headers={'content-type':'application/json; charset=utf-8','cache-control':'public, max-age=30, s-maxage=45'};
 try{
  const u=new URL(req.url),leagueId=Number(u.searchParams.get('league')||397375),gw=Number(u.searchParams.get('gw'));
  if(!Number.isInteger(leagueId)||leagueId<1||!Number.isInteger(gw)||gw<1||gw>60)return new Response(JSON.stringify({error:'Invalid league or gameweek'}),{status:400,headers});
  const key=`${leagueId}:${gw}`;if(cache.key===key&&Date.now()<cache.until)return new Response(JSON.stringify(cache.value),{headers});
  let page=1,standings=[];do{const d=await get(`/leagues-classic/${leagueId}/standings/?page_standings=${page}`);standings.push(...(d.standings?.results||[]));if(!d.standings?.has_next)break;page++;}while(page<=10);
  const entries=standings.map(x=>({id:x.entry,name:x.player_name,team:x.entry_name}));
  const live=await get(`/event/${gw}/live/`);
  const points=new Map((live.elements||[]).map(x=>[x.id,x.stats?.total_points??0]));
  const results=await pool(entries,async e=>{
    const [p,h]=await Promise.all([get(`/entry/${e.id}/event/${gw}/picks/`),get(`/entry/${e.id}/history/`)]);
    const picks=p.picks||[];
    // The official picks API supplies the effective multiplier, including captaincy;
    // autosub adjustments may not be finalized until FPL processes them.
    const gross=picks.reduce((sum,x)=>sum+(points.get(x.element)||0)*(x.multiplier||0),0);
    const event=h.current?.find(x=>x.event===gw);
    const hit=p.entry_history?.event_transfers_cost??event?.event_transfers_cost??0;
    return {...e,gross,hit,net:gross-hit,official:event?.points??null,activeChip:p.active_chip??null};
  });
  const value={leagueId,gameweek:gw,updatedAt:new Date().toISOString(),managers:results,notes:'Live provisional player points. Autosubs, bonus and corrections may change. Official final scores may differ.'};
  cache={key,until:Date.now()+45000,value};return new Response(JSON.stringify(value),{headers});
 }catch(e){return new Response(JSON.stringify({error:e.message}),{status:502,headers:{...headers,'cache-control':'no-store'}})}
};
