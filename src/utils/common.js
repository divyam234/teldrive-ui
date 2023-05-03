export const getFiles = data => {
  let files = data.map(item => {
    if (item.mime_type === 'teledrive/folder')
      return {
        id: item.file_id,
        name: item.name,
        size: item.size ? Number(item.size) : 0,
        modDate: item.updated_at,
        path: `/my-drive${item.path}`,
        isDir: true,
        color: "#FAD165"
      }

    return {
      id: item.file_id,
      name: item.name,
      size: Number(item.size),
      path: item.path,
      modDate: item.updated_at
    }
  })

  return files
}

export const navigateToExternalUrl = (url, shouldOpenNewTab = true) =>
  shouldOpenNewTab ? window.open(url, '_blank') : (window.location.href = url)

export const isMobileDevice = () => {
  const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];
  return toMatch.some(function (toMatchItem) {
    return navigator.userAgent.match(toMatchItem);
  });
};

export const chainLinks = (paths) => {
  let obj = {};
  let pathsoFar = "/";
  for (let path of paths) {
    let decodedPath = decodeURIComponent(path);
    obj[decodedPath === 'my-drive' ? 'My drive' : decodedPath] = pathsoFar + decodedPath;
    pathsoFar = pathsoFar + decodedPath + "/";
  }
  return obj;
};

export const realPath = path => path && path.length > 1 ? path.slice(1).reduce((acc, val) => `${acc}/${val}`, '') : '/'

export function getRawExtension(fileName) {
  return fileName.slice(((fileName.lastIndexOf('.') - 1) >>> 0) + 2)
}
export function getExtension(fileName) {
  return getRawExtension(fileName).toLowerCase()
}

export const allowedPaths = ["/[[...path]]", "/view/[id]/[name]"];

export function getServerAddress(dcId, downloadDC = false) {
  switch (dcId) {
    case 1:
      return {
        id: 1,
        ipAddress: `pluto${downloadDC ? "-1" : ""
          }.web.telegram.org`,
        port: 443,
      };
    case 2:
      return {
        id: 2,
        ipAddress: `venus${downloadDC ? "-1" : ""
          }.web.telegram.org`,
        port: 443,
      };
    case 3:
      return {
        id: 3,
        ipAddress: `aurora${downloadDC ? "-1" : ""
          }.web.telegram.org`,
        port: 443,
      };
    case 4:
      return {
        id: 4,
        ipAddress: `vesta${downloadDC ? "-1" : ""
          }.web.telegram.org`,
        port: 443,
      };
    case 5:
      return {
        id: 5,
        ipAddress: `flora${downloadDC ? "-1" : ""
          }.web.telegram.org`,
        port: 443,
      };
    default:
      throw new Error(
        `Cannot find the DC with the ID of ${dcId}`
      );
  }
}

export default function textToSvgURL(text) {
  const blob = new Blob([text], { type: 'image/svg+xml;charset=utf-8' });
  return new Promise ((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.readAsDataURL(blob);
  });
}