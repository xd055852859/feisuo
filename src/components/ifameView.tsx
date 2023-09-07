import React, { useState, useRef } from "react";
interface IframeViewProps {
  url: string;
  title: string;
}
const IframeView: React.FC<IframeViewProps> = (props) => {
  const { url, title } = props;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <iframe
        ref={iframeRef}
        name="iframe-container"
        className="web-view"
        title={title}
        src={url}
        frameBorder="0"
        width="100%"
        height="100%"
        allow="clipboard-read; clipboard-write"
      ></iframe>
    </div>
  );
};

export default IframeView;
