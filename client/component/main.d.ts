type ScaleType = 'linear' | 'log' | 'symlog' | 'sqrt' | 'gamma';

type StatusType = 'ready' | 'busy';

type TableDisplayType = 'scientific' | 'standard';

type NdArray = import('ndarray').NdArray;
type TypedArray = import('ndarray').TypedArray;
type NdArrayMinMax = [NdArray<TypedArray>, [number, number]];

interface MP_NDArray {
  // see fast_utils.py
  nd: boolean;
  dtype: string;
  shape: number[];
  data: ArrayBuffer;
}

interface TableDisplayParams {
  displayType?: TableDisplayType;
  numberDigits?: number;
}

interface PlotMessage {
  plot_id: string;
  type: MsgType;
  params: unknown;
  plot_config: unknown;
}

interface AxesParameters {
  x_label?: string;
  y_label?: string;
  x_scale?: ScaleType;
  y_scale?: ScaleType;
  x_values?: MP_NDArray;
  y_values?: MP_NDArray;
  title?: string;
}

interface LineData {
  key: string;
  color?: string;
  x: MP_NDArray;
  y: MP_NDArray;
  line_on: boolean;
  point_size?: number;
}

interface ImageData {
  key: string;
  values: MP_NDArray;
}

type Domain = import('@h5web/lib').Domain;

interface HeatmapData extends ImageData {
  domain: Domain;
  heatmap_scale: string;
}

interface ScatterData {
  key: string;
  xData: MP_NDArray;
  yData: MP_NDArray;
  dataArray: MP_NDArray;
  domain: Domain;
}

interface TableData {
  key: string;
  dataArray: MP_NDArray;
  cellWidth: number;
  displayParams?: TableDisplayParams;
}

interface DataMessage {
  axes_parameters: AxesParameters;
}

interface MultiLineDataMessage extends DataMessage {
  ml_data: LineData[];
}

interface AppendLineDataMessage extends DataMessage {
  al_data: LineData[];
}

interface ImageDataMessage extends DataMessage {
  im_data: ImageData;
}

interface ScatterDataMessage extends DataMessage {
  sc_data: ScatterData;
}

interface TableDataMessage extends DataMessage {
  ta_data: TableData;
}

interface LinePlotProps {
  data: DLineData[];
  xDomain: Domain;
  yDomain: Domain;
  axesParameters: DAxesParameters;
}

interface ImagePlotProps {
  values: NdArray<TypedArray>;
  axesParameters: DAxesParameters;
}

interface HeatmapPlotProps extends ImagePlotProps {
  domain: Domain;
  heatmapScale: ScaleType;
}

interface ScatterPlotProps {
  xData: NdArray<TypedArray>;
  yData: NdArray<TypedArray>;
  dataArray: NdArray<TypedArray>;
  domain: Domain;
  axesParameters: DAxesParameters;
}

interface TableDisplayProps {
  cellWidth: number;
  dataArray: NdArray<TypedArray>;
  displayParams?: TableDisplayParams;
}

interface DLineData {
  key: string;
  color?: string;
  x: NdArray<TypedArray>;
  dx: [number, number];
  y: NdArray<TypedArray>;
  dy: [number, number];
  line_on: boolean;
  point_size?: number;
  default_indices?: boolean = false;
}

interface DImageData {
  key: string;
  values: NdArray<TypedArray>;
}

interface DHeatmapData extends DImageData {
  domain: [number, number];
  heatmap_scale: string;
}

interface DScatterData {
  key: string;
  xData: NdArray<TypedArray>;
  yData: NdArray<TypedArray>;
  dataArray: NdArray<TypedArray>;
  domain: [number, number];
}

interface DTableData {
  key: string;
  dataArray: NdArray<TypedArray>;
  cellWidth: number;
  displayParams?: TableDisplayParams;
}

interface DAxesParameters {
  xLabel?: string;
  yLabel?: string;
  xScale?: ScaleType;
  yScale?: ScaleType;
  xValues?: NdArray<TypedArray>;
  yValues?: NdArray<TypedArray>;
  title?: string;
}

interface ClearPlotsMessage {
  plot_id: string;
}
