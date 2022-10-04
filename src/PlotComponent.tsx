import '@h5web/lib/dist/styles.css';
import { CurveType } from '@h5web/lib';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { decode } from "messagepack";
import Plot from "./Plot"


interface LinePlotParameters {
  data: LineData[];
  xDomain: [number, number];
  yDomain: [number, number];
  curveType: CurveType;
}

type PlotProps = {plot_id: string};
type PlotStates = {
  multilineData: LineData[]};
class PlotComponent extends React.Component<PlotProps, PlotStates> {
  constructor(props: PlotProps) {
    super(props)
    this.state = {multilineData: []}
    this.onSubmitForm = this.onSubmitForm.bind(this);
  }
  socket: WebSocket = new WebSocket('ws://127.0.0.1:8000/plot/' + this.props.plot_id);
  lineID = 3;
  multilineXDomain: any = [0, 0];
  multilineYDomain: any = [0, 0];

  onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('preventing default behaviour when pressing Enter key');
  }

  waitForOpenSocket = async (socket: WebSocket) => {
    return new Promise<void>((resolve) => {
      if (socket.readyState !== socket.OPEN) {
        socket.addEventListener("open", (_) => {
          resolve();
        })
      } else {
        resolve();
      }
    });
  }

  componentDidMount() {
    this.socket.binaryType = "arraybuffer"
    this.socket.onopen = () => {
        console.log('WebSocket Client Connected');
        let initStatus: PlotMessage = {'plot_id': this.props.plot_id, 'type': 0, "params": {"status":"ready"}};
        this.socket.send(JSON.stringify(initStatus));
      };
      this.socket.onmessage = (event: MessageEvent) => {
        const decoded_message: LineDataMessage | MultiDataMessage | ClearPlotsMessage = decode(event.data);
        console.log('decoded_message: ', decoded_message)
        switch (decoded_message["type"]) {
          case "multiline data":
            console.log('data type is multiline data')
            const multiMessage = decoded_message as MultiDataMessage;
            this.plot_multiline_data(multiMessage);
            let multiStatus: PlotMessage = {'plot_id': this.props.plot_id, 'type': 0, "params": {"status":"ready"}};
            this.socket.send(JSON.stringify(multiStatus));
            break;
          case "new line data":
            console.log('data type is new line data')
            const newLineMessage = decoded_message as LineDataMessage;
            this.plot_new_line_data(newLineMessage);
            let lineStatus: PlotMessage = {'plot_id': this.props.plot_id, 'type': 0, "params": {"status":"ready"}};
            this.socket.send(JSON.stringify(lineStatus));
            break;
          case "clear plots":
            console.log('clearing data')
            this.clear_all_line_data();
            let clearStatus: PlotMessage = {'plot_id': this.props.plot_id, 'type': 0, "params": {"status":"ready"}};
            this.socket.send(JSON.stringify(clearStatus));
            break;
          default:
            console.log('data type is: ', decoded_message["type"])
          }
      };
  }

  plot_multiline_data = (message: MultiDataMessage) => {
    console.log(message);
    let multilineData = message.data;
    this.multilineXDomain = this.calculateMultiXDomain(multilineData);
    this.multilineYDomain = this.calculateMultiYDomain(multilineData);
    multilineData = message.data;
    this.setState({ multilineData: multilineData })
  }

  plot_new_line_data = (message: LineDataMessage) => {
    console.log(message);
    const newLineData = message.data;
    console.log("new line for plot 0");
    const multilineData = this.state.multilineData;
    multilineData.push(newLineData);
    this.multilineXDomain = this.calculateMultiXDomain(multilineData);
    this.multilineYDomain = this.calculateMultiYDomain(multilineData);
    this.setState({ multilineData: multilineData })
    console.log("adding new line to plot: ", newLineData);
  }

  sendNewLineRequest = async (nextLineID: number) => {
    await this.waitForOpenSocket(this.socket)
    let message_params: NewLineParams = {'line_id': String(nextLineID)};
    let message: PlotMessage = {'plot_id': this.props.plot_id, 'type': 1, 'params': message_params};
    this.socket.send(JSON.stringify(message));
  }

  calculateMultiXDomain = (multilineData: LineData[]) => {
    console.log('calculating multi x domain ', multilineData)
    let minimum: number = multilineData[0].x[0];
    let maximum: number = multilineData[0].x[0];
    for (let i = 0; i < multilineData.length; i++) {
      minimum = Math.min(...multilineData[i].x, minimum)
      maximum = Math.max(...multilineData[i].x, maximum)
    }
    return [minimum, maximum]
  }

  calculateMultiYDomain = (multilineData: LineData[]) => {
    console.log('calculating multi y domain ', multilineData)
    let minimum: number = multilineData[0].y[0];
    let maximum: number = multilineData[0].y[0];
    for (let i = 0; i < multilineData.length; i++) {
      minimum = Math.min(...multilineData[i].y, minimum)
      maximum = Math.max(...multilineData[i].y, maximum)
    }
    return [minimum, maximum]
  }

  clear_all_line_data = () => {
    this.multilineXDomain = [0, 1]
    this.multilineYDomain = [0, 1]
    this.setState({ multilineData: [] })
    console.log("data cleared: ", this.state.multilineData, this.multilineXDomain, this.multilineYDomain);
  }

  handleAddLine = () => {
    console.log('Requesting new line')
    this.lineID++;
    this.sendNewLineRequest(this.lineID);
  }

  render() {
    let plotParams: LinePlotParameters = { data:this.state.multilineData, xDomain:this.multilineXDomain, yDomain:this.multilineYDomain, curveType:CurveType.LineOnly }

    return (
      <>
      <button onClick={() => this.handleAddLine()}>Add line</button>
      <Plot plotParameters={plotParams}/>
      </>
    );
  }
}

export default PlotComponent;