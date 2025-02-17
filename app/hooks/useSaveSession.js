export default function useSaveSession({data}){
    localStorage.setItem('tk',data.token.plainTextToken);
    localStorage.setItem('cc',data.user.contributor_id);
    localStorage.setItem('cname',data.user.name);
    localStorage.setItem('tmail',data.user.email);
    localStorage.setItem('ui',data.user.id);
    localStorage.setItem('ur',(data.user.role===1) ? "AP-UA1" : "AP-UM2")
}