/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'react-window' {
  import * as React from 'react';
  export interface ListChildComponentProps {
    index: number;
    style: React.CSSProperties;
  }
  export interface VariableSizeListProps {
    height: number;
    width: number | string;
    itemCount: number;
    itemSize: number | ((index: number) => number);
    children: React.ComponentType<ListChildComponentProps>;
    ref?: React.Ref<any>;
  }
  export class VariableSizeList extends React.Component<VariableSizeListProps> {}
}
