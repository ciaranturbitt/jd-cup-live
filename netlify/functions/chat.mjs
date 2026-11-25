import { timingSafeEqual } from 'node:crypto';
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const sid=s=>Number.isSafeInteger(Number(s))&&Number(s)>0&&String(Number(s))===String(s);
function env(){const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)throw Error('Chat database is not configured');return {url:url.replace(/\/$/,''),key}}
async function db(path,options={}){const {url,key}=env();const r=await fetch(`${url}/rest/v1/${path}`,{...options,headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',...(options.headers||{})},signal:AbortSignal.timeout(10000)});const body=await r.text();if(!r.ok)throw Error(`Database request failed (${r.status}): ${body.slice(0,150)}`);return body?JSON.parse(body):null}
async function userFrom(req){const token=(req.headers.get('authorization')||'').match(/^Bearer (.+)$/i)?.[1];if(!token)return null;const {url}=env(),anon=process.env.SUPABASE_ANON_KEY;if(!anon)throw Error('Auth not configured');const r=await fetch(`${url}/auth/v1/user`,{headers:{apikey:anon,Authorization:`Bearer ${token}`},signal:AbortSignal.timeout(10000)});if(!r.ok)return null;const u=await r.json();if(!u.id||u.is_anonymous||u.app_metadata?.provider!=='google'&&!u.app_metadata?.providers?.includes('google'))return null;return {id:u.id,name:String(u.user_metadata?.full_name||u.user_metadata?.name||u.email?.split('@')[0]||'Google user').slice(0,100)}}
function adminOK(token){const expected=process.env.CHAT_ADMIN_TOKEN||'';if(!expected||typeof token!=='string')return false;const a=Buffer.from(token),b=Buffer.from(expected);return a.length===b.length&&timingSafeEqual(a,b)}
export default async(req)=>{try{const u=new URL(req.url),method=req.method;
 if(method==='GET'){
  const user=await userFrom(req);
  const [comments,likes]=await Promise.all([db('cup_comments?select=id,manager_name,body,parent_id,created_at&order=created_at.desc&limit=150'),db('cup_likes?select=comment_id,user_id&limit=5000')]);
  const counts={};for(const l of likes||[])counts[l.comment_id]=(counts[l.comment_id]||0)+1;
  return json({comments:(comments||[]).map(c=>({...c,likes:counts[c.id]||0})),myLikes:user?(likes||[]).filter(l=>l.user_id===user.id).map(l=>l.comment_id):[]});
 }
 if(method!=='POST')return json({error:'Method not allowed'},405);
 if(Number(req.headers.get('content-length')||0)>5000)return json({error:'Request too large'},413);
 let data;try{data=await req.json()}catch{return json({error:'Invalid JSON'},400)}
 if(data.action==='delete'){if(!adminOK(req.headers.get('x-chat-admin-token')))return json({error:'Not authorised'},403);if(!sid(data.commentId))return json({error:'Invalid comment'},400);await db(`cup_comments?id=eq.${Number(data.commentId)}`,{method:'DELETE'});return json({ok:true})}
 const user=await userFrom(req);if(!user)return json({error:'Sign in with Google to participate'},401);
 if(data.action==='like'){
  if(!sid(data.commentId))return json({error:'Invalid comment'},400);const id=Number(data.commentId);
  const existing=await db(`cup_likes?select=comment_id&comment_id=eq.${id}&user_id=eq.${user.id}&limit=1`);
  if(existing?.length)await db(`cup_likes?comment_id=eq.${id}&user_id=eq.${user.id}`,{method:'DELETE'});
  else await db('cup_likes',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({comment_id:id,user_id:user.id})});return json({ok:true});
 }
 if(data.action!=='post')return json({error:'Invalid action'},400);
 const body=String(data.body||'').trim();if(body.length<1||body.length>500)return json({error:'Comments must be 1 to 500 characters'},400);
 let parent=null;if(data.parentId!=null){if(!sid(data.parentId))return json({error:'Invalid reply'},400);parent=Number(data.parentId);const p=await db(`cup_comments?select=id,parent_id&id=eq.${parent}&limit=1`);if(!p?.length)return json({error:'Original comment not found'},400);if(p[0].parent_id!=null)return json({error:'Reply to the main comment instead'},400)}
 const recent=await db(`cup_comments?select=id&user_id=eq.${user.id}&created_at=gte.${encodeURIComponent(new Date(Date.now()-60000).toISOString())}&limit=5`);if(recent?.length>=4)return json({error:'Please wait a minute before posting again'},429);
 await db('cup_comments',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({manager_id:null,manager_name:user.name,visitor_id:null,user_id:user.id,body,parent_id:parent})});return json({ok:true});
 }catch(e){console.error('Chat error',e);return json({error:'Chat temporarily unavailable. Please try again.'},503)}};
