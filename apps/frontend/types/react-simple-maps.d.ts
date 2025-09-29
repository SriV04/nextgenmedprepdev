declare module 'react-simple-maps' {
  import { ComponentType, SVGProps, CSSProperties } from 'react';

  export interface Geography {
    type: string;
    rsmKey: string;
    svgPath: string;
    properties: {
      name?: string;
      [key: string]: any;
    };
    geometry: {
      type: string;
      coordinates: any;
    };
  }

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: {
      scale?: number;
      center?: [number, number];
      rotate?: [number, number, number];
    };
    width?: number;
    height?: number;
    className?: string;
    style?: CSSProperties;
    children?: React.ReactNode;
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (args: { geographies: Geography[]; projection: any }) => React.ReactNode;
  }

  export interface GeographyProps extends Omit<SVGProps<SVGPathElement>, 'style'> {
    geography: Geography;
    projection?: any;
    onMouseEnter?: (event: React.MouseEvent<SVGPathElement>) => void;
    onMouseLeave?: (event: React.MouseEvent<SVGPathElement>) => void;
    onClick?: (event: React.MouseEvent<SVGPathElement>) => void;
    style?: {
      default?: CSSProperties;
      hover?: CSSProperties;
      pressed?: CSSProperties;
    };
  }

  export interface MarkerProps extends SVGProps<SVGGElement> {
    coordinates: [number, number];
    children?: React.ReactNode;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
  export const Marker: ComponentType<MarkerProps>;
}