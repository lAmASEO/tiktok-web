export function getGitIoURL(url) {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  return fetch("https://git-io-gen.vercel.app/api/gen/gen", {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({
      "url": url
    }),
    redirect: 'follow'
  })
}
