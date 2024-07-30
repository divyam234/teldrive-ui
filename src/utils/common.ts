import type { BrowseView, Session } from "@/types";
import { partial } from "filesize";

export const navigateToExternalUrl = (url: string, shouldOpenNewTab = true) => {
  if (shouldOpenNewTab) {
    window.open(url, "_blank");
  } else {
    window.location.href = url;
  }
};

export const chainLinks = (path: string) => {
  const paths = path?.split("/").slice(1);
  const chains = [["My Drive", "/"]] as Array<[string, string]>;

  let pathsoFar = "/";
  for (const path of paths) {
    const decodedPath = decodeURIComponent(path);
    chains.push([decodedPath, pathsoFar + decodedPath]);
    pathsoFar = `${pathsoFar + decodedPath}/`;
  }
  return chains;
};

export const realPath = (parts: string[]) =>
  parts.length > 1 ? parts.slice(1).reduce((acc: any, val: any) => `${acc}/${val}`, "") : "/";

export function getRawExtension(fileName: string | string[]) {
  return fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2);
}
export function getExtension(fileName: string) {
  return (getRawExtension(fileName) as string).toLowerCase();
}

export const zeroPad = (num: number | string, places: number) => String(num).padStart(places, "0");

export const copyDataToClipboard = (data: string[]) => {
  return new Promise((resolve, reject) => {
    const textToCopy = data.join("\n");

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        resolve("copy success");
      })
      .catch((err) => {
        const errorMessage = `Unable to copy array to clipboard: ${err}`;
        console.error(errorMessage);
        reject(errorMessage);
      });
  });
};

export function formatDuration(value: number) {
  const minute = Math.floor(value / 60);
  const secondLeft = Math.floor(value - minute * 60);
  return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
}

export function formatTime(epochTime: number): string {
  const milliseconds = epochTime * 1000;

  const date = new Date(milliseconds);

  const formattedDate = date.toISOString();

  return formattedDate;
}

export function encode(str: string) {
  const charMap = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\x00",
  } as const;
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match as keyof typeof charMap];
  });
}

export function extractPathParts(path: string): {
  type: BrowseView;
  path: string;
} {
  const parts = decodeURIComponent(path).split("/");

  const firstPart = parts.shift() || "";

  const restOfPath = parts.join("/");

  return {
    type: firstPart as BrowseView,
    path: restOfPath ? `/${restOfPath}` : "",
  };
}

export const mediaUrl = (id: string, name: string, download = false) => {
  const mediaPath = `${id}/${encodeURIComponent(name)}${download ? "?d=1" : ""}`;
  return `${window.location.origin}/api/files/stream/${mediaPath}`;
};

export const profileUrl = (session: Session) => session.user?.image || "";

export const profileName = (session: Session) => session.user?.name || "";

export function bytesToGB(bytes: number) {
  const gb = bytes / 1024 ** 3;
  return Math.round(gb * 10) / 10;
}

export const filesize = partial({ standard: "jedec" });

export const splitFileSizes = [
  { value: 100 * 1024 * 1024, label: "100MB" },
  { value: 500 * 1024 * 1024, label: "500MB" },
  { value: 1000 * 1024 * 1024, label: "1GB" },
  { value: 2 * 1000 * 1024 * 1024, label: "2GB" },
];

const isMobileDevice = () => {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];
  return toMatch.some((toMatchItem) => navigator.userAgent.match(toMatchItem));
};

export const isMobile = isMobileDevice();

export const chunkArray = <T>(arr: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, index) =>
    arr.slice(index * size, index * size + size),
  );
};
