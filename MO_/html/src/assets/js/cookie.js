// 쿠키설정
function setCookie(cName, cValue, cDay) {
  const expire = new Date();
  let cookies;

  expire.setDate(expire.getDate() + cDay);
  cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
  if (typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
  document.cookie = cookies;
}

function getCookie(cName) {
  cName = cName + '=';
  const cookieData = document.cookie;
  let start = cookieData.indexOf(cName);
  let cValue = '';
  if (start != -1) {
    start += cName.length;
    let end = cookieData.indexOf(';', start);
    if (end == -1) end = cookieData.length;
    cValue = cookieData.substring(start, end);
  }
  return unescape(cValue);
}
