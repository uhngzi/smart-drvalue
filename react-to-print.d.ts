// react-to-print.d.ts
declare module "react-to-print" {
  import * as React from "react";

  export interface ReactToPrintProps {
    trigger: () => React.ReactElement;
    content: () => React.ReactInstance | null;
    pageStyle?: string;
    onBeforeGetContent?: () => Promise<void> | void;
    onAfterPrint?: () => void;
    onBeforePrint?: () => void;
  }

  export default class ReactToPrint extends React.PureComponent<ReactToPrintProps> {}
}
