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