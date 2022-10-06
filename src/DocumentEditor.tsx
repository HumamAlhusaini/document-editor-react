import React, { useEffect } from "react";
import loadScript from "./utils/loadScript";

import Config from "./types/Config";

declare global {
  interface Window {
    DocsAPI?: any;
    DocEditor?: any;
  }
}

type DocumentEditorProps = {
  id: string;

  documentserverUrl: string;

  config: Config;

  document_fileType?: string;
  document_title?: string;
  documentType?: string;
  editorConfig_lang?: string,
  height?: string,
  type?: string;
  width?: string;

  events_onAppReady?: (event: object) => void;
  events_onDocumentStateChange?: (event: object) => void;
  events_onMetaChange?: (event: object) => void;
  events_onDocumentReady?: (event: object) => void;
  events_onInfo?: (event: object) => void;
  events_onWarning?: (event: object) => void;
  events_onError?: (event: object) => void;
  events_onRequestSharingSettings?: (event: object) => void;
  events_onRequestRename?: (event: object) => void;
  events_onMakeActionLink?: (event: object) => void;
  events_onRequestInsertImage?: (event: object) => void;
  events_onRequestSaveAs?: (event: object) => void;
  events_onRequestMailMergeRecipients?: (event: object) => void;
  events_onRequestCompareFile?: (event: object) => void;
  events_onRequestEditRights?: (event: object) => void;
  events_onRequestHistory?: (event: object) => void;
  events_onRequestHistoryClose?: (event: object) => void;
  events_onRequestHistoryData?: (event: object) => void;
  events_onRequestRestore?: (event: object) => void;
};

const DocumentEditor = (props: DocumentEditorProps) => {
  const {
    id,

    documentserverUrl,

    config,

    document_fileType,
    document_title,
    documentType,
    editorConfig_lang,
    height,
    type,
    width,

    events_onAppReady,
    events_onDocumentStateChange,
    events_onMetaChange,
    events_onDocumentReady,
    events_onInfo,
    events_onWarning,
    events_onError,
    events_onRequestSharingSettings,
    events_onRequestRename,
    events_onMakeActionLink,
    events_onRequestInsertImage,
    events_onRequestSaveAs,
    events_onRequestMailMergeRecipients,
    events_onRequestCompareFile,
    events_onRequestEditRights,
    events_onRequestHistory,
    events_onRequestHistoryClose,
    events_onRequestHistoryData,
    events_onRequestRestore
  } = props;

  useEffect(() => {
    if (window?.DocEditor?.instances[id]) {
      window.DocEditor.instances[id].destroyEditor();
      window.DocEditor.instances[id] = undefined;

      console.log("Important props have been changed. Load new Editor.");
      onLoad();
    }
  }, [
    documentserverUrl,

    JSON.stringify(config),

    document_fileType,
    document_title,
    documentType,
    editorConfig_lang,
    height,
    type,
    width,
  ]);

  useEffect(() => {
    let url = documentserverUrl;
    if (!url.endsWith("/")) url += "/";

    const docApiUrl = `${url}web-apps/apps/api/documents/api.js`;
    loadScript(docApiUrl, "onlyoffice-api-script")
      .then(() => onLoad())
      .catch((err) => console.error(err));

    return () => {
      if (window?.DocEditor?.instances[id]) {
        window.DocEditor.instances[id].destroyEditor();
        window.DocEditor.instances[id] = undefined;
      }
    };
  }, []);

  const onLoad = () => {
    try {
      if (!window.DocsAPI) throw new Error("DocsAPI is not defined");
      if (window?.DocEditor?.instances[id]) {
        console.log("Skip loading. Instance already exists", id);
        return;
      }

      if (!window?.DocEditor?.instances) {
        window.DocEditor = { instances: {} };
      }

      let initConfig = Object.assign({
        document: {
          fileType: document_fileType,
          title: document_title,
        },
        documentType,
        editorConfig: {
          lang: editorConfig_lang,
        },
        events: {
          onAppReady: events_onAppReady,
          onDocumentStateChange: events_onDocumentStateChange,
          onMetaChange: events_onMetaChange,
          onDocumentReady: events_onDocumentReady,
          onInfo: events_onInfo,
          onWarning: events_onWarning,
          onError: events_onError,
          onRequestSharingSettings: events_onRequestSharingSettings,
          onRequestRename: events_onRequestRename,
          onMakeActionLink: events_onMakeActionLink,
          onRequestInsertImage: events_onRequestInsertImage,
          onRequestSaveAs: events_onRequestSaveAs,
          onRequestMailMergeRecipients: events_onRequestMailMergeRecipients,
          onRequestCompareFile: events_onRequestCompareFile,
          onRequestEditRights: events_onRequestEditRights,
          onRequestHistory: events_onRequestHistory,
          onRequestHistoryClose: events_onRequestHistoryClose,
          onRequestHistoryData: events_onRequestHistoryData,
          onRequestRestore: events_onRequestRestore
        },
        height,
        type,
        width,
      }, config || {});

      const editor = window.DocsAPI.DocEditor(id, initConfig);
      window.DocEditor.instances[id] = editor;
    } catch (err: any) {
      console.error(err);
      events_onError!(err);
    }
  };

  return <div id={id}></div>;
};

DocumentEditor.defaultProps = {
  height: "100%",
  width: "100%",
};

export default DocumentEditor;
