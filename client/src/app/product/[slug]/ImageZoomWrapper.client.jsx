// "use client";
// import dynamic from "next/dynamic";

// // The .then(mod => mod.default) is crucial for default export!
// const ImageZoom = dynamic(
//   () => import("./ImageZoom.client").then((mod) => mod.default),
//   { ssr: false }
// );

// export default function ImageZoomWrapper(props) {
//   return <ImageZoom {...props} />;
// }


"use client";
import dynamic from "next/dynamic";

const ImageZoom = dynamic(
  () => import("./ImageZoom.client").then((mod) => mod.default),
  { ssr: false }
);

export default function ImageZoomWrapper(props) {
  return <ImageZoom {...props} />;
}